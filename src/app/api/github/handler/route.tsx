import { db } from "@/db/drizzle";
import { Logs, Users, Workflows } from "@/db/schema";
import { eq, arrayContains } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.json();
  const GitHubData = {
    repoName: body.repository.full_name,
    listenerType: "issues",
  };

  if (!body.issue && body.pusher) {
    GitHubData.listenerType = "push";
  }

  try {
    const workflow = await db
      .select()
      .from(Workflows)
      .where(eq(Workflows.GitHubNode, GitHubData))
      .execute();

    if (workflow.length === 0) {
      await db.insert(Logs).values({
        LogMessage: "No Workflow Found for Webhook Received",
        WorkflowName: "No Workflow Found",
        Success: false,
      });
      return NextResponse.json(
        { message: "No Workflow Found" },
        { status: 404 }
      );
    }

    if (!workflow[0].Published) {
      return NextResponse.json(
        { message: "Workflow Not Published" },
        { status: 403 }
      );
    }

    await db.insert(Logs).values({
      LogMessage: `GitHub Webhook Received for Workflow ${workflow[0].WorkflowName}`,
      WorkflowName: workflow[0].WorkflowName,
      Success: true,
    });

    const user = await db
      .select()
      .from(Users)
      .where(arrayContains(Users.Workflows, [workflow[0].WorkflowName]))
      .execute();

    if (user.length === 0) {
      await db.insert(Logs).values({
        LogMessage: `No User Found for Workflow ${workflow[0].WorkflowName}`,
        WorkflowName: "No User Found",
        Success: false,
      });
      return NextResponse.json({ message: "No User Found" }, { status: 404 });
    }

    if (!body?.hook) {
      if (user[0].Credits < 1) {
        await db.insert(Logs).values({
          LogMessage: `User ${user[0].Username} has Insufficient Credits`,
          WorkflowName: workflow[0].WorkflowName,
          Success: false,
        });

        return NextResponse.json(
          { message: "Insufficient Credits" },
          { status: 402 }
        );
      }

      await db
        .update(Users)
        .set({
          Credits: user[0].Credits - 1,
        })
        .execute();
    }

    const slackAccessToken = user[0].SlackAccessToken;
    const asanaRefreshToken = user[0].AsanaRefreshToken;

    type Edge = {
      source: string;
      target: string;
    };

    type GitHubData = {
      repoName: string;
      listenerType: string;
    };

    type AsanaData = {
      project: { id: string; name: string };
      taskName: string;
      taskNotes: string;
    };

    type SlackData = {
      channel: string;
      message: string;
    };

    type ConditionData = {
      value: string;
      condition: string;
      variable: string;
    };

    type Node = {
      id: string;
      data: SlackData | AsanaData | GitHubData | ConditionData;
    };

    const edges: Edge[] = workflow[0].Edges as Edge[];
    const nodes: Node[] = workflow[0].Nodes as Node[];

    for (const edge of edges.filter((edge) => edge.source === "github-1")) {
      let childNode = nodes.filter((node) => node.id === edge.target)[0];
      let skip = false;

      if (edge.target.startsWith("condition")) {
        let trace = edge;
        while (trace.target.startsWith("condition")) {
          childNode = nodes.filter((node) => node.id === trace.target)[0];
          const data = childNode.data as ConditionData;
          if (checker(body, data.variable, data.condition, data.value)) {
            trace = edges.filter((edge) => edge.source === trace.target)[0];
          } else {
            skip = true;
            break;
          }
        }
        childNode = nodes.filter((node) => node.id === trace.target)[0];
      }

      if (skip) continue;

      if (childNode.id.startsWith("gpt")) {
        const trace = edges.filter((edg) => edg.source === childNode.id)[0];
        childNode = nodes.filter((node) => node.id === trace.target)[0];
      }

      if (childNode.id.startsWith("asana")) {
        AsanaHandler(
          asanaRefreshToken,
          childNode.data,
          workflow[0].WorkflowName,
          body
        );
      } else if (childNode.id.startsWith("slack")) {
        SlackHandler(
          slackAccessToken,
          childNode.data,
          workflow[0].WorkflowName,
          body
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "There was some error" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Webhook Triggered Successfully" },
    { status: 200 }
  );
};

const SlackHandler = async (
  SlackAccessToken: string | null,
  data: any,
  WorkflowName: string,
  payload: any
): Promise<void> => {
  if (!SlackAccessToken || !data?.channel || !data?.message) {
    await db
      .insert(Logs)
      .values({
        LogMessage: "Webhook Trigger Failed for Slack due to Missing Headers",
        Success: false,
        WorkflowName: WorkflowName,
      })
      .execute();
    return;
  }

  const text =
    (await data?.message) === "c7awKoAvbe"
      ? await geminiHandler(payload)
      : preprocessMessage(data?.message as string, payload);
  try {
    const response = await fetch(
      "https://quirk-v2.vercel.app/api/slack/messenger",
      {
        method: "POST",
        body: JSON.stringify({
          channel: data?.channel,
          text: text,
          token: SlackAccessToken,
        }),
      }
    );
    const result = await response.json();

    if (response.ok) {
      await db
        .insert(Logs)
        .values({
          LogMessage: "Webhook Triggered Slack Messenger",
          Success: true,
          WorkflowName: WorkflowName,
        })
        .execute();
    } else {
      await db
        .insert(Logs)
        .values({
          LogMessage: "Webhook Trigger Failed for Slack due to Errors",
          Success: false,
          WorkflowName: WorkflowName,
        })
        .execute();
    }
  } catch (error) {
    await db
      .insert(Logs)
      .values({
        LogMessage: "There was Some Error in Slack Messenger",
        Success: false,
        WorkflowName: WorkflowName,
      })
      .execute();
  }
};

const AsanaHandler = async (
  AsanaRefreshToken: string | null,
  data: any,
  WorkflowName: string,
  payload: any
): Promise<void> => {
  if (
    !AsanaRefreshToken ||
    !data?.project?.id ||
    !data.taskName ||
    !data.taskNotes
  ) {
    await db
      .insert(Logs)
      .values({
        LogMessage: "Webhook Trigger Failed for Asana due to Missing Headers",
        Success: false,
        WorkflowName: WorkflowName,
      })
      .execute();
    return;
  }

  const taskName = preprocessMessage(data?.taskName, payload);
  const taskNotes =
    (await data?.taskNotes) === "c7awKoAvbe"
      ? await geminiHandler(payload)
      : preprocessMessage(data?.taskNotes as string, payload);

  try {
    const response = await fetch(
      "https://quirk-v2.vercel.app/api/asana/create-task",
      {
        method: "POST",
        body: JSON.stringify({
          projectIds: [data?.project?.id],
          taskName: taskName,
          taskNotes: taskNotes,
          token: AsanaRefreshToken,
        }),
      }
    );
    const result = await response.json();

    if (response.ok) {
      await db
        .insert(Logs)
        .values({
          LogMessage: "Webhook Triggered Asana Task Creation",
          Success: true,
          WorkflowName: WorkflowName,
        })
        .execute();
    } else {
      await db
        .insert(Logs)
        .values({
          LogMessage: "Webhook Trigger Failed for Asana due to Errors",
          Success: false,
          WorkflowName: WorkflowName,
        })
        .execute();
    }
  } catch (error) {
    await db
      .insert(Logs)
      .values({
        LogMessage: "There was Some Error in Asana Task Creation",
        Success: false,
        WorkflowName: WorkflowName,
      })
      .execute();
  }
};

function getNestedValue(obj: any, path: string): any {
  const parts = path.split(".");
  let result = obj;

  for (const part of parts) {
    if (result === undefined || result === null) return undefined;

    const arrayMatch = part.match(/(.*?)\[\]/);
    if (arrayMatch) {
      const arrayKey = arrayMatch[1];
      if (!Array.isArray(result[arrayKey])) return undefined;

      return result[arrayKey]
        .map((item: any) => getNestedValue(item, parts.slice(1).join(".")))
        .join(", ");
    }

    result = result[part];
  }

  return result;
}

function preprocessMessage(message: string, payload: any): string {
  return message.replace(/var::([a-zA-Z0-9._\[\]]+)/g, (_, variable) => {
    const value = getNestedValue(payload, variable);
    return value !== undefined ? value : `{{${variable}}}`;
  });
}

function checker(
  payload: any,
  variable: string,
  condition: string,
  checkValue: string
): boolean {
  const value = getNestedValue(payload, variable);

  try {
    switch (condition) {
      case "<":
        if (value < checkValue) return true;
        break;
      case ">":
        if (value > checkValue) return true;
        break;
      case "<=":
        if (value <= checkValue) return true;
        break;
      case ">=":
        if (value >= checkValue) return true;
        break;
      case "==":
        if (value == checkValue) return true;
        break;
      case "!=":
        if (value != checkValue) return true;
        break;
      case "has":
        const val_1: string = value + "";
        if (val_1.includes(checkValue as string)) return true;
        break;
      case "not has":
        const val_2: string = value + "";
        if (!val_2.includes(checkValue as string)) return true;
        break;
      default:
        return false;
    }
    return false;
  } catch {
    return false;
  }
}

async function geminiHandler(payload: any): Promise<string> {
  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt =
      JSON.stringify(payload) +
      "\n Convert to a descriptive message for communicating the above in team and project management platforms like Slack and Asana. Give only the message.";

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return "Error in Gemini Handler";
  }
}
