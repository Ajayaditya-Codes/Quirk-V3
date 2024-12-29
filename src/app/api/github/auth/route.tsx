import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code missing" },
      { status: 400 }
    );
  }

  const githubTokenURL = "https://github.com/login/oauth/access_token";
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return NextResponse.json(
      { error: "GitHub client credentials are not set" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(githubTokenURL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub token API error: ${response.status}`);
    }

    const { access_token } = await response.json();

    if (!access_token) {
      return NextResponse.json(
        { error: "Failed to retrieve GitHub access token" },
        { status: 400 }
      );
    }

    await updateGithubAccessToken(access_token);

    return NextResponse.redirect("https://localhost:3000/connections");
  } catch (error) {
    console.error("Error fetching GitHub access token:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub access token" },
      { status: 500 }
    );
  }
}

async function updateGithubAccessToken(githubAccessToken: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const userId = user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    await db
      .update(Users)
      .set({ GitHubAccessToken: githubAccessToken })
      .where(eq(Users.KindeID, userId))
      .execute();
  } catch (error) {
    console.error("Error updating GitHub access token:", error);
    throw new Error("Failed to update GitHub access token");
  }
}
