import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  let userDetails = null;
  try {
    const result =
      userId &&
      (await db
        .select()
        .from(Users)
        .where(eq(Users.ClerkID, userId))
        .execute());

    userDetails = result && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching user details:", error);
  }

  const slackToken = userDetails?.SlackAccessToken;

  if (!slackToken) {
    return NextResponse.json(
      { error: "Slack token is not set" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://slack.com/api/users.conversations?types=public_channel,private_channel&exclude_archived=true",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${slackToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ channels: data.channels });
  } catch (error) {
    console.error("Error fetching Slack channels:", error);
    return NextResponse.json(
      { error: "Failed to fetch Slack channels" },
      { status: 500 }
    );
  }
}
