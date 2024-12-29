import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

function validateEnvVariables(...vars: string[]): void {
  vars.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  });
}

async function fetchFromAsana(url: string, accessToken: string): Promise<any> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(
      `Asana API request failed with status ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
}

async function fetchUserFromDatabase(userId: string) {
  return await db
    .select()
    .from(Users)
    .where(eq(Users.KindeID, userId))
    .execute();
}

export async function GET(req: NextRequest): Promise<NextResponse> {
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

    validateEnvVariables(
      "ASANA_CLIENT_ID",
      "ASANA_CLIENT_SECRET",
      "ASANA_REDIRECT_URI"
    );
    const { ASANA_CLIENT_ID, ASANA_CLIENT_SECRET, ASANA_REDIRECT_URI } =
      process.env;

    const user = await fetchUserFromDatabase(userId);

    if (!user.length || !user[0].AsanaRefreshToken) {
      return NextResponse.json(
        { error: "No Asana refresh token found. Please connect Asana first." },
        { status: 404 }
      );
    }

    const asanaRefreshToken = user[0].AsanaRefreshToken;

    const tokenResponse = await fetch("https://app.asana.com/-/oauth_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: ASANA_CLIENT_ID!,
        client_secret: ASANA_CLIENT_SECRET!,
        refresh_token: asanaRefreshToken,
        redirect_uri: ASANA_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(
        `Failed to retrieve Asana access token: ${tokenResponse.statusText}`
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Failed to retrieve access token from Asana." },
        { status: 400 }
      );
    }

    const userEndpoint = "https://app.asana.com/api/1.0/users/me";
    const userData = await fetchFromAsana(userEndpoint, accessToken);

    if (!userData?.data?.workspaces) {
      return NextResponse.json(
        { error: "Failed to fetch user workspaces from Asana." },
        { status: 400 }
      );
    }

    const workspaces = userData.data.workspaces;

    const workspaceProjectsPromises = workspaces.map(async (workspace: any) => {
      const projectsUrl = `https://app.asana.com/api/1.0/workspaces/${workspace.gid}/projects`;
      const projectsData = await fetchFromAsana(projectsUrl, accessToken);

      return {
        workspace: {
          id: workspace.gid,
          name: workspace.name,
        },
        projects: projectsData.data,
      };
    });

    const workspaceProjects = await Promise.all(workspaceProjectsPromises);

    return NextResponse.json({
      message: "Successfully retrieved workspaces and projects.",
      data: workspaceProjects,
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred while fetching Asana data.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
