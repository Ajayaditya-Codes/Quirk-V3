import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Logs, Users, Workflows } from "@/db/schema";
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
      { error: "New workflow name not provided" },
      { status: 400 }
    );
  }

  const currentWorkflows = user[0].Workflows || [];

  if (currentWorkflows.includes(workflowName)) {
    return NextResponse.json(
      { error: "Workflow name already exists" },
      { status: 400 }
    );
  }

  const updatedWorkflows = [...currentWorkflows, workflowName];

  if (updatedWorkflows.length > 3) {
    return NextResponse.json(
      { error: "Maximum number of workflows reached" },
      { status: 400 }
    );
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
        WorkflowName: workflowName,
        GitHubNode: {
          repoName: "",
          listenerType: "issues",
        },
        Nodes: [
          {
            id: "github-1",
            type: "github",
            data: {
              repoName: "",
              listenerType: "issues",
            },
            position: { x: 0, y: 0 },
          },
        ],
        Edges: [],
        Published: false,
      })
      .execute();

    await db.insert(Logs).values({
      LogMessage: `Workflow ${workflowName} created by ${user[0].Username}`,
      WorkflowName: workflowName,
      Success: true,
    });
  } catch (error) {
    console.error("Failed to Add Workflow:", error);


    return NextResponse.json(
      { error: "Failed to add workflow" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Workflow name added successfully" });
}
