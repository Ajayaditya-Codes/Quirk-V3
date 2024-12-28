import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users, Workflows } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function DELETE(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const { id } = await getUser();

  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.KindeID, id))
    .execute();

  if (user.length === 0) {
    return NextResponse.json({ error: "No User found" }, { status: 404 });
  }

  const { workflowName } = await req.json();

  if (!workflowName) {
    return NextResponse.json(
      { error: "Workflow name not provided" },
      { status: 400 }
    );
  }

  const currentWorkflows = user[0].Workflows || [];

  if (!currentWorkflows.includes(workflowName)) {
    return NextResponse.json(
      { error: "Workflow name does not exist" },
      { status: 400 }
    );
  }

  const updatedWorkflows = currentWorkflows.filter(
    (name) => name !== workflowName
  );

  try {
    const existingWorkflow = await db
      .select()
      .from(Workflows)
      .where(eq(Workflows.WorkflowName, workflowName))
      .execute();

    type GithubData = { repoName: string; listenerType: string };

    const GithubData: GithubData = existingWorkflow[0].GitHubNode as GithubData;

    if (existingWorkflow.length === 0) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    await db
      .update(Users)
      .set({ Workflows: updatedWorkflows })
      .where(eq(Users.KindeID, id))
      .execute();

    await db
      .delete(Workflows)
      .where(eq(Workflows.WorkflowName, workflowName))
      .execute();

  } catch (error) {
    console.error("Failed to delete workflow:", error);
    return NextResponse.json(
      { error: "Failed to delete workflow" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Workflow deleted successfully" });
}
