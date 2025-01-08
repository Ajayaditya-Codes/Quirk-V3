import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const Asana = require("asana");
  const { token, projectIds, taskName, taskNotes } = await req.json();

  if (!projectIds || !taskName) {
    return NextResponse.json(
      { error: "Project IDs and task name are required" },
      { status: 400 }
    );
  }

  const asanaRefreshToken = token;
  const tokenUrl = "https://app.asana.com/-/oauth_token";
  const clientId = process.env.ASANA_CLIENT_ID;
  const clientSecret = process.env.ASANA_CLIENT_SECRET;
  const redirectUri = process.env.ASANA_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Missing required environment variables" },
      { status: 500 }
    );
  }

  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: asanaRefreshToken,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Failed to retrieve access token" },
        { status: 400 }
      );
    }

    const client = Asana.ApiClient.instance;
    const token = client.authentications["token"];
    token.accessToken = tokenData.access_token;

    const tasksApiInstance = new Asana.TasksApi();
    const body = {
      data: {
        name: taskName,
        approval_status: "pending",
        assignee_status: "upcoming",
        completed: false,
        assignee: "me",
        projects: projectIds,
        notesx: taskNotes,
      },
    };
    const opts = {};

    try {
      const result = await tasksApiInstance.createTask(body, opts);
      return NextResponse.json({
        message: "Task created successfully",
        data: result?.data,
      });
    } catch (error: any) {
      return NextResponse.json(
        { message: "Failed to create task", error: error?.response?.body },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 }
    );
  }
}
