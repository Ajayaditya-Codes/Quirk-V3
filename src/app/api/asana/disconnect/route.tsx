import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface AsanaRevokeResponse {
  ok: boolean;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Fetch user session
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  if (!userSession || !userSession.id) {
    return NextResponse.json(
      { error: "User not authenticated. Please log in to continue." },
      { status: 401 }
    );
  }

  const userId = userSession.id;

  // Fetch user from the database to get Asana refresh token
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.KindeID, userId))
    .execute();

  if (!user.length || !user[0].AsanaRefreshToken) {
    return NextResponse.json(
      { error: "No Asana refresh token found for the user. Please connect Asana first." },
      { status: 404 }
    );
  }

  const asanaRefreshToken: string = user[0].AsanaRefreshToken;
  const asanaRevokeURL = "https://app.asana.com/-/oauth_revoke";

  try {
    // Revoke the Asana token
    const response = await fetch(asanaRevokeURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.ASANA_CLIENT_ID as string,
        client_secret: process.env.ASANA_CLIENT_SECRET as string,
        token: asanaRefreshToken, // Use the token directly
      }),
    });

    // Ensure the response is valid
    if (!response.ok) {
      const errorData: AsanaRevokeResponse = await response.json();
      console.error("Asana API error:", errorData.error || "Unknown error");
      return NextResponse.json(
        { error: `Failed to revoke Asana token: ${errorData.error || "Unknown error"}` },
        { status: 400 }
      );
    }

    const data: AsanaRevokeResponse = await response.json();

    if (!data.ok) {
      console.error("Asana API error:", data.error || "Unknown error");
      return NextResponse.json(
        { error: `Failed to revoke Asana token: ${data.error || "Unknown error"}` },
        { status: 400 }
      );
    }

    // Update the database to remove the Asana token
    await db
      .update(Users)
      .set({ AsanaRefreshToken: null })
      .where(eq(Users.KindeID, userId))
      .execute();

    return NextResponse.json({ message: "Asana access revoked successfully." });
  } catch (error: unknown) {
    console.error("Error revoking Asana access token:", error);

    if (error instanceof Error && error.message.includes("network")) {
      return NextResponse.json(
        { error: "Network error while communicating with Asana. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while revoking the Asana access token." },
      { status: 500 }
    );
  }
}
