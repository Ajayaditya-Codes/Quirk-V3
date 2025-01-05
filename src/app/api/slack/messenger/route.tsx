import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { channel, text } = await req.json();

    if (!channel || !text) {
      return NextResponse.json(
        { error: "Channel and text are required" },
        { status: 400 }
      );
    }

    const { getUser } = getKindeServerSession();
    const userSession = await getUser();

    if (!userSession?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const [userRecord] = await db
      .select({ SlackAccessToken: Users.SlackAccessToken })
      .from(Users)
      .where(eq(Users.KindeID, userSession.id))
      .execute();

    const slackToken = userRecord?.SlackAccessToken;

    if (!slackToken) {
      return NextResponse.json(
        { error: "Slack token is not set" },
        { status: 404 }
      );
    }

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${slackToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel, text }),
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
};
