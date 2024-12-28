import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Logs, Workflows } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth, getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { workflowName, nodes, edges, githubData, publish } = await req.json();

  if (!workflowName || !nodes || !edges || !githubData) {
    return NextResponse.json(
      { error: "Workflow name, nodes, edges, and GitHub data are required" },
      { status: 400 }
    );
  }

  try {
    // Check if the workflow exists and is associated with this user
    const existingWorkflow = await db
      .select()
      .from(Workflows)
      .where(eq(Workflows.WorkflowName, workflowName))
      .execute();

    if (existingWorkflow.length === 0) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    type GithubData = { repoName: string; listenerType: string };

    const oldGitHubData: GithubData = existingWorkflow[0]
      .GitHubNode as GithubData;

    // Check if GitHub data has been modified
    const githubDataChanged =
      oldGitHubData.repoName !== githubData.repoName ||
      oldGitHubData.listenerType !== githubData.listenerType;
    const { userId, getToken } = await getAuth(req); // Automatically retrieves session context

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const sessionToken = await getToken(); // This will fetch the session token

    if (!sessionToken) {
      return NextResponse.json(
        { message: "Session token not found" },
        { status: 401 }
      );
    }
    if (githubDataChanged && existingWorkflow[0].HookID) {
      try {
        const response = await fetch(
          "https://quirk-v1.vercel.app/api/github/webhooks/delete",
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${sessionToken}`, // send Clerk token here
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              repo: oldGitHubData.repoName,
              hookId: existingWorkflow[0].HookID,
            }),
          }
        );
        if (!response.ok) {
          await db.insert(Logs).values({
            LogMessage: `Failed to Delete Old Webhook ${existingWorkflow[0].HookID}`,
            WorkflowName: workflowName,
            Success: false,
          });
        }

        await db.insert(Logs).values({
          LogMessage: `Deleted Old Webhook ${existingWorkflow[0].HookID}`,
          WorkflowName: workflowName,
          Success: true,
        });
      } catch (error) {
        await db.insert(Logs).values({
          LogMessage: `Failed to Delete Old Webhook ${existingWorkflow[0].HookID}`,
          WorkflowName: workflowName,
          Success: false,
        });
      }
    }
    if (
      (githubDataChanged || existingWorkflow[0].HookID === null) &&
      githubData.listenerType === "issues"
    ) {
      try {
        const response = await fetch(
          "https://quirk-v1.vercel.app/api/github/webhooks/issues",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sessionToken}`, // send Clerk token here
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              repo: githubData.repoName,
              workflow: workflowName,
            }),
          }
        );
        const { hook_id } = await response.json();

        if (!response.ok) {
          await db.insert(Logs).values({
            LogMessage: `Failed to Create Webhook on ${githubData.repoName}`,
            WorkflowName: workflowName,
            Success: false,
          });
        }

        await db.insert(Logs).values({
          LogMessage: `Created Webhook on ${githubData.repoName}`,
          WorkflowName: workflowName,
          Success: true,
        });
        await db
          .update(Workflows)
          .set({
            HookID: hook_id,
          })
          .where(eq(Workflows.WorkflowName, workflowName))
          .execute();
      } catch (error) {
        await db.insert(Logs).values({
          LogMessage: `Failed to Create Webhook on ${githubData.repoName}`,
          WorkflowName: workflowName,
          Success: false,
        });
      }
    }
    if (
      (githubDataChanged || existingWorkflow[0].HookID === null) &&
      githubData.listenerType === "push"
    ) {
      try {
        const response = await fetch(
          "https://quirk-v1.vercel.app/api/github/webhooks/push",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sessionToken}`, // send Clerk token here
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              repo: githubData.repoName,
              workflow: workflowName,
            }),
          }
        );
        const { hook_id } = await response.json();
        if (!response.ok) {
          await db.insert(Logs).values({
            LogMessage: `Failed to Create Webhook on ${githubData.repoName}`,
            WorkflowName: workflowName,
            Success: false,
          });
        }

        await db.insert(Logs).values({
          LogMessage: `Created Webhook on ${githubData.repoName}`,
          WorkflowName: workflowName,
          Success: true,
        });
        await db
          .update(Workflows)
          .set({
            HookID: hook_id,
          })
          .where(eq(Workflows.WorkflowName, workflowName))
          .execute();
      } catch (error) {
        await db.insert(Logs).values({
          LogMessage: `Failed to Create Webhook on ${githubData.repoName}`,
          WorkflowName: workflowName,
          Success: false,
        });
      }
    }
    await db
      .update(Workflows)
      .set({
        Nodes: nodes,
        Edges: edges,
        GitHubNode: githubData,
        ...(publish === true && { Published: true }), // Conditionally set Published to true if publish is true
      })
      .where(eq(Workflows.WorkflowName, workflowName))
      .execute();

    // Log the action
    await db.insert(Logs).values({
      LogMessage: `Workflow ${workflowName} updated by user ${userId}${
        publish === true ? " and published" : ""
      }`,
      WorkflowName: workflowName,
      Success: true,
    });

    return NextResponse.json({ message: "Workflow updated successfully" });
  } catch (error) {
    console.error("Failed to update workflow:", error);

    // Log the failure
    await db.insert(Logs).values({
      LogMessage: `Failed to update Workflow ${workflowName}`,
      WorkflowName: workflowName,
      Success: false,
    });

    return NextResponse.json(
      { error: "Failed to update workflow" },
      { status: 500 }
    );
  }
}
