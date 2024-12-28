import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Users, Workflows } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Fetch the user session
    const { getUser } = getKindeServerSession();
    const userSession = await getUser();

    if (!userSession?.id) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to continue." },
        { status: 401 }
      );
    }

    const userId = userSession.id;

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const workflowName = searchParams.get("workflowName");

    if (!workflowName) {
      return NextResponse.json(
        { error: "Invalid request. A workflow name is required to proceed." },
        { status: 400 }
      );
    }

    // Fetch user data from the database
    const user = await db
      .select({ Workflows: Users.Workflows }) // Fetch only the Workflows field
      .from(Users)
      .where(eq(Users.KindeID, userId))
      .execute();

    if (!user.length) {
      return NextResponse.json(
        { error: "User not found in the database. Please ensure your account is valid." },
        { status: 404 }
      );
    }

    const userWorkflows = user[0]?.Workflows || [];

    // Check if the user has access to the requested workflow
    if (!userWorkflows.includes(workflowName)) {
      return NextResponse.json(
        { error: "Access denied. You are not authorized to view this workflow." },
        { status: 403 }
      );
    }

    // Fetch workflow data from the database
    const workflowData = await db
      .select()
      .from(Workflows)
      .where(eq(Workflows.WorkflowName, workflowName))
      .execute();

    if (!workflowData.length) {
      return NextResponse.json(
        { error: `Workflow "${workflowName}" not found. Please verify the name and try again.` },
        { status: 404 }
      );
    }

    // Return the workflow details
    return NextResponse.json(workflowData[0], { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching workflow data:", error);

    // Provide a user-friendly error message for unexpected issues
    return NextResponse.json(
      { error: "An unexpected error occurred while retrieving the workflow data. Please try again later." },
      { status: 500 }
    );
  }
}
