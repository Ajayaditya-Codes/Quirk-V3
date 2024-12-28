import { db } from "@/db/drizzle";
import { Logs, Users, Workflows } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const { id } = await getUser();

  const { workflow, newWorkflow } = await req.json();

  if (!workflow || !newWorkflow) {
    return NextResponse.json(
      { error: "New workflow name or Original Workflow name not provided" },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.KindeID, id))
    .execute();

  if (user.length === 0) {
    return NextResponse.json({ error: "No User found" }, { status: 404 });
  }

  const currentWorkflows = user[0].Workflows || [];

  if (currentWorkflows.includes(newWorkflow)) {
    return NextResponse.json(
      { error: "Workflow name already exists" },
      { status: 400 }
    );
  }

  const updatedWorkflows = [...currentWorkflows, newWorkflow];

  if (updatedWorkflows.length > 3) {
    return NextResponse.json(
      { error: "Maximum number of workflows reached" },
      { status: 400 }
    );
  }

  const existingWorkflow = await db
    .select()
    .from(Workflows)
    .where(eq(Workflows.WorkflowName, workflow))
    .execute();

  if (existingWorkflow.length === 0) {
    return NextResponse.json({ error: "Workflow Not Found" }, { status: 404 });
  }

  try {
    await db
      .update(Users)
      .set({ Workflows: updatedWorkflows })
      .where(eq(Users.KindeID, id))
      .execute();

    await db
      .insert(Workflows)
      .values({
        WorkflowName: newWorkflow,
        Nodes: existingWorkflow[0].Nodes,
        Edges: existingWorkflow[0].Edges,
        GitHubNode: existingWorkflow[0].GitHubNode,
      })
      .execute();

    await db.insert(Logs).values({
      LogMessage: `Workflow ${newWorkflow} duplicated from ${workflow}`,
      WorkflowName: newWorkflow,
      Success: true,
    });

    return NextResponse.json(
      { message: `Workflow ${newWorkflow} duplicated from ${workflow}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to duplicate Workflow:", error);
    return NextResponse.json(
      { error: `Failed to duplicate Workflow ${workflow}` },
      { status: 400 }
    );
  }
}
