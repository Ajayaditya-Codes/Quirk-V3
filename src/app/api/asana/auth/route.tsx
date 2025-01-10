import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  error?: string;
}

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 }
    );
  }

  const tokenUrl = "https://app.asana.com/-/oauth_token";
  const clientId = process.env.ASANA_CLIENT_ID;
  const clientSecret = process.env.ASANA_CLIENT_SECRET;
  const redirectUri = process.env.ASANA_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Missing environment variables" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    const data: TokenResponse = await response.json();

    if (response.status !== 200 || !data.access_token) {
      return NextResponse.json(
        { error: data.error || "Failed to retrieve access token" },
        { status: 400 }
      );
    }

    await updateAsanaAccessToken(data.refresh_token);
    return NextResponse.redirect("https://quirk-v2.vercel.app/connections");
  } catch {
    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 500 }
    );
  }
};

const updateAsanaAccessToken = async (
  asanaRefreshToken: string
): Promise<void> => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userId = user?.id;

  if (!userId) {
    throw new Error("User ID is missing");
  }

  try {
    await db
      .update(Users)
      .set({ AsanaRefreshToken: asanaRefreshToken })
      .where(eq(Users.KindeID, userId))
      .execute();
  } catch {
    throw new Error("Failed to update Asana access token");
  }
};
