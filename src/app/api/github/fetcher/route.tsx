import { Octokit } from "octokit";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  if (!userSession?.id) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  const userRecord = await db
    .select()
    .from(Users)
    .where(eq(Users.KindeID, userSession.id))
    .execute();

  if (!userRecord.length || !userRecord[0].GitHubAccessToken) {
    return NextResponse.json(
      { error: "No GitHub token found" },
      { status: 404 }
    );
  }

  const githubAccessToken = userRecord[0].GitHubAccessToken;

  if (!githubAccessToken) {
    return NextResponse.json(
      { message: "Access token not found" },
      { status: 401 }
    );
  }

  const octokit = new Octokit({ auth: githubAccessToken });
  const repos = await octokit.request("GET /user/repos", {});

  return NextResponse.json(repos.data);
}
