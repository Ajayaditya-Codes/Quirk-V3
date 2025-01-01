import { Octokit } from "octokit";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request) {
  const { repo, hookId, id } = await req.json();
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

  if (!repo || !hookId) {
    return NextResponse.json(
      { message: "Repository name and webhook ID are required" },
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
    await octokit.request("DELETE /repos/{owner}/{repo}/hooks/{hook_id}", {
      owner: owner || "",
      repo: slug,
      hook_id: parseInt(hookId),
    });

    return NextResponse.json({
      message: "Webhook deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting webhook:", error);
    return NextResponse.json({
      message: "Webhook delete request completed (silent error ignored)",
    });
  }
}
