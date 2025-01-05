import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const fetchGitHubAccessToken = async (code: string): Promise<string> => {
  const githubTokenURL = "https://github.com/login/oauth/access_token";
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("GitHub client credentials are not set");
  }

  const response = await fetch(githubTokenURL, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub token API error: ${response.status}`);
  }

  const { access_token } = await response.json();

  if (!access_token) {
    throw new Error("Failed to retrieve GitHub access token");
  }

  return access_token;
};

const updateGitHubAccessToken = async (
  githubAccessToken: string
): Promise<void> => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const userId = user.id;

  await db
    .update(Users)
    .set({ GitHubAccessToken: githubAccessToken })
    .where(eq(Users.KindeID, userId))
    .execute();
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code missing" },
        { status: 400 }
      );
    }

    const accessToken = await fetchGitHubAccessToken(code);
    await updateGitHubAccessToken(accessToken);

    return NextResponse.redirect("https://localhost:3000/connections");
  } catch (error) {
    console.error("Error during GitHub authentication flow:", error);
    return NextResponse.json(
      {
        error: "Failed to complete GitHub authentication flow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
