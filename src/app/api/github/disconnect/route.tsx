import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(): Promise<NextResponse> {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  if (!userSession?.id) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const userId = userSession.id;
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.KindeID, userId))
    .execute();

  if (!user.length) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  try {
    await db
      .update(Users)
      .set({ GitHubAccessToken: null })
      .where(eq(Users.KindeID, userId))
      .execute();

    return NextResponse.json({ message: "GitHub disconnected successfully." });
  } catch (error) {
    console.error("Error disconnecting GitHub:", error);

    return NextResponse.json(
      {
        error:
          "An error occurred while revoking the GitHub access token. Please try again later.",
      },
      { status: 500 }
    );
  }
}
