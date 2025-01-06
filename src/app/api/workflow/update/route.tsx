import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Logs, Workflows, Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { workflowName, nodes, edges, githubData, publish } = await req.json();

  if (!workflowName || !nodes || !edges || !githubData) {
    return NextResponse.json(
      { error: "Workflow name, nodes, edges, and GitHub data are required" },
      { status: 400 }
    );
  }

  try {
    const { getUser } = getKindeServerSession();
    const userSession = await getUser();

    if (!userSession?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.KindeID, userSession.id))
      .execute();

    if (!user.length) {
      return NextResponse.json(
        { error: "User not found in the database" },
        { status: 404 }
      );
    }

    const githubSessionToken = user[0].GitHubAccessToken;

    if (!githubSessionToken) {
      return NextResponse.json(
        { error: "GitHub session token not found for the user" },
        { status: 401 }
      );
    }

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

    const oldGitHubData = existingWorkflow[0].GitHubNode as {
      repoName: string;
      listenerType: string;
    };

    const githubDataChanged =
      oldGitHubData.repoName !== githubData.repoName ||
      oldGitHubData.listenerType !== githubData.listenerType;

    if (githubDataChanged && existingWorkflow[0].HookID) {
      try {
        const response = await fetch(
          "https://localhost:3000/api/github/webhooks/delete",
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${githubSessionToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              repo: oldGitHubData.repoName,
              hookId: existingWorkflow[0].HookID,
              id: userSession.id,
            }),
          }
        );

        if (!response.ok) {
          await db.insert(Logs).values({
            LogMessage: `Failed to delete old webhook ${existingWorkflow[0].HookID}`,
            WorkflowName: workflowName,
            Success: false,
          });
        } else {
          await db.insert(Logs).values({
            LogMessage: `Deleted old webhook ${existingWorkflow[0].HookID}`,
            WorkflowName: workflowName,
            Success: true,
          });
        }
      } catch {
        await db.insert(Logs).values({
          LogMessage: `Failed to delete old webhook ${existingWorkflow[0].HookID}`,
          WorkflowName: workflowName,
          Success: false,
        });
      }
    }

    if (
      (githubDataChanged || existingWorkflow[0].HookID === null) &&
      githubData.listenerType
    ) {
      try {
        const webhookEndpoint =
          githubData.listenerType === "issues"
            ? "https://localhost:3000/api/github/webhooks/issues"
            : "https://localhost:3000/api/github/webhooks/push";

        const response = await fetch(webhookEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubSessionToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repo: githubData.repoName,
            workflow: workflowName,
            id: userSession.id,
          }),
        });

        const { hook_id } = await response.json();

        if (!response.ok) {
          await db.insert(Logs).values({
            LogMessage: `Failed to create webhook on ${githubData.repoName}`,
            WorkflowName: workflowName,
            Success: false,
          });
        } else {
          await db.insert(Logs).values({
            LogMessage: `Created webhook on ${githubData.repoName}`,
            WorkflowName: workflowName,
            Success: true,
          });

          await db
            .update(Workflows)
            .set({ HookID: hook_id })
            .where(eq(Workflows.WorkflowName, workflowName))
            .execute();
        }
      } catch {
        await db.insert(Logs).values({
          LogMessage: `Failed to create webhook on ${githubData.repoName}`,
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
        ...(publish === true && { Published: true }),
      })
      .where(eq(Workflows.WorkflowName, workflowName))
      .execute();

    await db.insert(Logs).values({
      LogMessage: `Workflow ${workflowName} updated by user ${
        user[0].Username
      }${publish ? " and published" : ""}`,
      WorkflowName: workflowName,
      Success: true,
    });

    return NextResponse.json({ message: "Workflow updated successfully" });
  } catch (error) {
    await db.insert(Logs).values({
      LogMessage: `Failed to update workflow ${workflowName}`,
      WorkflowName: workflowName,
      Success: false,
    });

    return NextResponse.json(
      { error: "Failed to update workflow" },
      { status: 500 }
    );
  }
};
