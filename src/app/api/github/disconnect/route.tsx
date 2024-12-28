import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";


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
    .select()
    .from(Users)
    .where(eq(Users.KindeID, userId))
    .execute();

  if (!user.length) {
    return NextResponse.json(
      { error: "User not found in the database. Please contact support." },
      { status: 404 }
    );
  }

  try {
    await db
      .update(Users)
      .set({ GitHubAccessToken: null })
      .where(eq(Users.KindeID, userId))
      .execute();

    return NextResponse.json({ message: "GitHub Disconnected successfully." });
  } catch (error: unknown) {
    // Handle network or unexpected errors
    console.error("Error disconnecting GitHub:", error);

    if (error instanceof Error && error.message.includes("network")) {
      return NextResponse.json(
        { error: "Network error while communicating with GitHub. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while revoking the GitHub access token. Please try again later." },
      { status: 500 }
    );
  }
}
