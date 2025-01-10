import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = async (): Promise<NextResponse> => {
  try {
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
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};
