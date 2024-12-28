export type User = {
    KindeID: string;
    Username: string;
    Email: string;
    Credits: number;
    SlackAccessToken: string | null;
    AsanaRefreshToken: string | null;
    GitHubAccessToken: string | null;
    Workflows: string[];
  };
  
  export type Workflow = {
    WorkflowName: string;
    PublicName: string | null;
    GitHubNode: Record<string, unknown>;
    Nodes: Record<string, unknown>[];
    Edges: Record<string, unknown>[];
    Published: boolean;
    Public: boolean;
    HookID: string | null;
  };
  
  export type Log = {
    createdAt: Date;
    LogMessage: string;
    WorkflowName: string;
    Success: boolean | null;
  };
  