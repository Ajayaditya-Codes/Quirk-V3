export const GithubVariables = [
  // Issue Event
  "issue.id",
  "issue.number",
  "issue.title",
  "issue.body",
  "issue.state",
  "issue.assignee",
  "issue.labels",
  "issue.created_at",
  "issue.updated_at",
  "issue.user.login",

  // Repository Information
  "repository.name",
  "repository.owner.login",
  "repository.url",

  // Sender Information
  "sender.login",
  "sender.id",
  "sender.type",

  // Push Event
  "before",
  "after",
  "commits[].id", // Access first commit's id
  "commits[].message", // Access first commit's message
  "commits[].timestamp", // Access first commit's timestamp
  "commits[].author.name", // Access first commit's author name
  "commits[].author.email", // Access first commit's author email
  "commits[].url", // Access first commit's URL
  "commits[].added", // Access first commit's added files
  "commits[].removed", // Access first commit's removed files
  "commits[].modified", // Access first commit's modified files

  // Pusher Information
  "pusher.name",
  "pusher.email",
];
