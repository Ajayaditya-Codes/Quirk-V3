import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface AsanaRevokeResponse {
  ok: boolean;
  error?: string;
}

function validateEnvVariables(...vars: string[]): void {
  vars.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  });
}

async function fetchUserById(userId: string) {
  return await db
    .select()
    .from(Users)
    .where(eq(Users.KindeID, userId))
    .execute();
}

async function revokeAsanaToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<AsanaRevokeResponse> {
  const asanaRevokeURL = "https://app.asana.com/-/oauth_revoke";

  const response = await fetch(asanaRevokeURL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to revoke Asana token: ${response.statusText}`);
  }

  return await response.json();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { getUser } = getKindeServerSession();
    const userSession = await getUser();

    if (!userSession?.id) {
      return NextResponse.json(
        { error: "User not authenticated. Please log in to continue." },
        { status: 401 }
      );
    }

    const userId = userSession.id;

    validateEnvVariables("ASANA_CLIENT_ID", "ASANA_CLIENT_SECRET");
    const { ASANA_CLIENT_ID, ASANA_CLIENT_SECRET } = process.env;

    const user = await fetchUserById(userId);

    if (!user.length || !user[0].AsanaRefreshToken) {
      return NextResponse.json(
        {
          error:
            "No Asana refresh token found for the user. Please connect Asana first.",
        },
        { status: 404 }
      );
    }

    const asanaRefreshToken = user[0].AsanaRefreshToken;

    const revokeResponse = await revokeAsanaToken(
      asanaRefreshToken,
      ASANA_CLIENT_ID!,
      ASANA_CLIENT_SECRET!
    );

    if (!revokeResponse.ok) {
      return NextResponse.json(
        {
          error: `Failed to revoke Asana token: ${
            revokeResponse.error || "Unknown error"
          }`,
        },
        { status: 400 }
      );
    }

    await db
      .update(Users)
      .set({ AsanaRefreshToken: null })
      .where(eq(Users.KindeID, userId))
      .execute();

    return NextResponse.json({ message: "Asana access revoked successfully." });
  } catch (error) {
    console.error("Error revoking Asana access token:", error);

    if (error instanceof Error && error.message.includes("network")) {
      return NextResponse.json(
        {
          error:
            "Network error while communicating with Asana. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while revoking the Asana access token.",
      },
      { status: 500 }
    );
  }
}
