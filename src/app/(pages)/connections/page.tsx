import dynamic from "next/dynamic";
import Header from "@/components/global/header";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { Suspense } from "react";

export const metadata = {
  title: "Connections | Quirk",
  description: "Manage and connect your accounts including GitHub, Slack, and Asana.",
  openGraph: {
    title: "Connections | Quirk",
    description: "Manage and connect your accounts including GitHub, Slack, and Asana.",
    url: "https://quirk.com/connections",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connections | Quirk",
    description: "Manage and connect your accounts including GitHub, Slack, and Asana.",
  },
};

export const viewport = "width=device-width, initial-scale=1";

const ConnectionCard = dynamic(
  () => import("@/components/global/connectionCard"),
  {
    loading: () => <Skeleton className="w-full h-32 rounded-xl" />,
  }
);

const IconBrandGithub = dynamic(() =>
  import("@tabler/icons-react").then((mod) => mod.IconBrandGithub)
);
const IconBrandSlack = dynamic(() =>
  import("@tabler/icons-react").then((mod) => mod.IconBrandSlack)
);
const IconBrandAsana = dynamic(() =>
  import("@tabler/icons-react").then((mod) => mod.IconBrandAsana)
);

const API_ROUTES = {
  GITHUB_DISCONNECT: "/api/github/disconnect",
  SLACK_DISCONNECT: "/api/slack/disconnect",
  ASANA_DISCONNECT: "/api/asana/disconnect",
};

const AUTH_URLS = {
  GITHUB: process.env.GITHUB_AUTH_URL || "#",
  SLACK: process.env.SLACK_AUTH_URL || "#",
  ASANA: process.env.ASANA_AUTH_URL || "#",
};

type User = {
  KindeID: string;
  GitHubAccessToken: string | null;
  SlackAccessToken: string | null;
  AsanaRefreshToken: string | null;
};

const fetchUserDetails = async (): Promise<User | null> => {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  if (!userSession?.id) {
    return null;
  }

  try {
    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.KindeID, userSession.id))
      .execute();

    return result?.length ? (result[0] as User) : null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

const ConnectionsContent = async () => {
  const userDetails = await fetchUserDetails();

  if (!userDetails) {
    return <p className="text-center text-gray-500">No user details available.</p>;
  }

  return (
    <>
      <ConnectionCard
        title="GitHub"
        description="Connect your GitHub account"
        icon={<IconBrandGithub className="h-5 w-5" aria-label="GitHub Icon" />}
        connectionLink={AUTH_URLS.GITHUB}
        disconnectionLink={API_ROUTES.GITHUB_DISCONNECT}
        connected={!!userDetails.GitHubAccessToken}
      />
      <ConnectionCard
        title="Slack"
        description="Connect your Slack account"
        icon={<IconBrandSlack className="h-5 w-5" aria-label="Slack Icon" />}
        connectionLink={AUTH_URLS.SLACK}
        disconnectionLink={API_ROUTES.SLACK_DISCONNECT}
        connected={!!userDetails.SlackAccessToken}
      />
      <ConnectionCard
        title="Asana"
        description="Connect your Asana account"
        icon={<IconBrandAsana className="h-5 w-5" aria-label="Asana Icon" />}
        connectionLink={AUTH_URLS.ASANA}
        disconnectionLink={API_ROUTES.ASANA_DISCONNECT}
        connected={!!userDetails.AsanaRefreshToken}
      />
    </>
  );
};

export default function Connections() {
  return (
    <div className="w-full flex flex-col">
      <Header route="Connections" />
      <main className="w-full p-[3vh]">
        <h1 className="text-2xl font-semibold">Connections</h1>
        <div className="flex flex-col space-y-5 mt-5 w-full">
          <Suspense
            fallback={
              <>
                <Skeleton className="w-full h-32 rounded-xl" />
                <Skeleton className="w-full h-32 rounded-xl" />
                <Skeleton className="w-full h-32 rounded-xl" />
              </>
            }
          >
            <ConnectionsContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
