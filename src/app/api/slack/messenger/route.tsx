import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { channel, text, token } = await req.json();
    let slackToken = token;

    if (!channel || !text) {
      return NextResponse.json(
        { error: "Channel and text are required" },
        { status: 400 }
      );
    }

    if (slackToken === null) {
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

      slackToken = userDetails?.SlackAccessToken;

      if (!slackToken) {
        return NextResponse.json(
          { error: "Slack token is not set" },
          { status: 500 }
        );
      }
    }

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${slackToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: channel,
        text: text,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "Message sent successfully",
      data,
    });
  } catch (error) {
    console.error("Error sending message to Slack:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
