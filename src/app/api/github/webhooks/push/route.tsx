import { Octokit } from "octokit";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { repo, workflow, id } = await req.json();
  if (!id) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  const userRecord = await db
    .select()
    .from(Users)
    .where(eq(Users.KindeID, id))
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

  if (!repo || !workflow) {
    return NextResponse.json(
      { message: "Repository name and Workflow name are required" },
      { status: 400 }
    );
  }

  const octokit = new Octokit({
    auth: githubAccessToken,
  });
  const user = await octokit.request("GET /user", {});
  const owner = user.data.login;

  const slug = repo?.split("/").pop();

  try {
    const response = await octokit.request("POST /repos/{owner}/{repo}/hooks", {
      owner: owner || "",
      repo: slug,
      name: "web",
      active: true,
      events: ["push"],
      config: {
        url: "https://patient-husky-uniquely.ngrok-free.app/api/github/handler",
        content_type: "json",
        insecure_ssl: "0",
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    return NextResponse.json({
      message: "Webhook created successfully",
      data: response.data,
      hook_id: response.data.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating webhook", error: error },
      { status: 500 }
    );
  }
}
