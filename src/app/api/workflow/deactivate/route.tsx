import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Logs, Workflows } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const {id} = await getUser();

  if (!id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { workflowName } = await req.json();

  if (!workflowName) {
    return NextResponse.json(
      { error: "Workflow name is required" },
      { status: 400 }
    );
  }

  try {
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

    await db
      .update(Workflows)
      .set({ Published: false })
      .where(eq(Workflows.WorkflowName, workflowName))
      .execute();

    await db.insert(Logs).values({
      LogMessage: `Workflow ${workflowName} deactivated`,
      WorkflowName: workflowName,
      Success: true,
    });

    return NextResponse.json({ message: "Workflow deactivated successfully" });
  } catch (error) {
    console.error("Failed to deactivate workflow:", error);

    await db.insert(Logs).values({
      LogMessage: `Failed to deactivate Workflow ${workflowName}`,
      WorkflowName: workflowName,
      Success: false,
    });

    return NextResponse.json(
      { error: "Failed to deactivate workflow" },
      { status: 500 }
    );
  }
}
