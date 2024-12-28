import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface SlackRevokeResponse {
  ok: boolean;
  error?: string;
}

export async function POST(): Promise<NextResponse> {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  // Check for valid session
  if (!userSession || !userSession.id) {
    return NextResponse.json(
      { error: "Authentication required. Please log in to continue." },
      { status: 401 }
    );
  }

  const userId = userSession.id;

  // Fetch only necessary fields from the database (SlackAccessToken)
  const user = await db
    .select({ SlackAccessToken: Users.SlackAccessToken })
    .from(Users)
    .where(eq(Users.KindeID, userId))
    .execute();

  if (!user.length) {
    return NextResponse.json(
      { error: "User not found in the database. Please contact support." },
      { status: 404 }
    );
  }

  const slackAccessToken: string | null = user[0].SlackAccessToken;

  if (!slackAccessToken) {
    return NextResponse.json(
      { error: "Slack access token not found. Please connect your Slack account to proceed." },
      { status: 404 }
    );
  }

  const slackRevokeURL = "https://slack.com/api/auth.revoke";

  try {
    // Revoke the Slack access token by calling Slack's API
    const response = await fetch(slackRevokeURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${slackAccessToken}`,
      },
    });

    const data: SlackRevokeResponse = await response.json();

    if (!data.ok) {
      // Log specific error from Slack response
      console.error("Slack API response error:", data.error);
      return NextResponse.json(
        { error: `Slack API error: ${data.error || "Unknown error"}` },
        { status: 400 }
      );
    }

    // Update user in the database by setting SlackAccessToken to null
    await db
      .update(Users)
      .set({ SlackAccessToken: null })
      .where(eq(Users.KindeID, userId))
      .execute();

    return NextResponse.json({ message: "Slack access revoked successfully." });
  } catch (error: unknown) {
    // Handle network or unexpected errors
    console.error("Error revoking Slack access token:", error);

    if (error instanceof Error && error.message.includes("network")) {
      return NextResponse.json(
        { error: "Network error while communicating with Slack. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while revoking the Slack access token. Please try again later." },
      { status: 500 }
    );
  }
}
