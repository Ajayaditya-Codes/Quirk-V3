import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users, Workflows } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { getUser } = getKindeServerSession();
    const userSession = await getUser();

    if (!userSession?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = userSession.id;
    const { searchParams } = new URL(req.url);
    const workflowName = searchParams.get("workflowName");

    if (!workflowName) {
      return NextResponse.json(
        { error: "A workflow name is required" },
        { status: 400 }
      );
    }

    const user = await db
      .select({ Workflows: Users.Workflows })
      .from(Users)
      .where(eq(Users.KindeID, userId))
      .execute();

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userWorkflows = user[0]?.Workflows || [];
    if (!userWorkflows.includes(workflowName)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const workflowData = await db
      .select()
      .from(Workflows)
      .where(eq(Workflows.WorkflowName, workflowName))
      .execute();

    if (!workflowData.length) {
      return NextResponse.json(
        { error: `Workflow \"${workflowName}\" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(workflowData[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching workflow data:", error);
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while retrieving the workflow data",
      },
      { status: 500 }
    );
  }
}
