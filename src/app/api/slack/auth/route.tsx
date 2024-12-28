import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
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

  const slackOAuthURL = "https://slack.com/api/oauth.v2.access";
  const client_id = process.env.SLACK_CLIENT_ID;
  const client_secret = process.env.SLACK_CLIENT_SECRET;
  const redirect_uri = process.env.SLACK_REDIRECT_URI;

  if (!client_id || !client_secret || !redirect_uri) {
    return NextResponse.json(
      { error: "Slack credentials are missing in environment variables" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(slackOAuthURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code,
        client_id: client_id as string,
        client_secret: client_secret as string,
        redirect_uri: redirect_uri as string,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("Slack OAuth Error:", data.error);
      return NextResponse.json({ error: `Slack OAuth Error: ${data.error}` }, { status: 400 });
    }

    await updateSlackAccessToken(data.authed_user.access_token);

    // Redirect to the connections page after successful token update
    return NextResponse.redirect("https://localhost:3000/connections");
  } catch (error) {
    console.error("Error fetching Slack access token:", error);
    return NextResponse.json(
      { error: "Failed to fetch access token from Slack" },
      { status: 500 }
    );
  }
}

async function updateSlackAccessToken(slackAccessToken: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  if (!user || !user.id) {
    throw new Error("User session not found");
  }

  const userId = user.id;

  try {
    // Update the user's Slack access token in the database
    await db
      .update(Users)
      .set({
        SlackAccessToken: slackAccessToken,
      })
      .where(eq(Users.KindeID, userId))
      .execute();
  } catch (error) {
    console.error("Error updating Slack access token:", error);
    throw new Error("Failed to update Slack access token in the database");
  }
}
