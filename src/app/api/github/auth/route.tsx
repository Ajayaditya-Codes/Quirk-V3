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

  try {
    const response = await fetch(githubTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code: code,
        client_id: client_id as string,
        client_secret: client_secret as string,
      }),
    });

    const data = await response.json();

    await updateGithubAccessToken(data.access_token);
    return NextResponse.redirect("https://localhost:3000/connections");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch access token" },
      { status: 500 }
    );
  }
}

async function updateGithubAccessToken(githubAccessToken: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userId = user?.id;

  try {
    userId &&
      (await db
        .update(Users)
        .set({
          GitHubAccessToken: githubAccessToken,
        })
        .where(eq(Users.KindeID, userId))
        .execute());
  } catch (error) {
    throw new Error("Failed to update GitHub access token");
  }
}
