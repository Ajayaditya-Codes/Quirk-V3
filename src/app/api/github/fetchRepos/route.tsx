import { Octokit } from "octokit";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  if (!userSession?.id) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  const githubAccessToken = userSession?.accessToken?.github;

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
