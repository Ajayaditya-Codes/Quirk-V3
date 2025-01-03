import { Analytics } from "@/components/global/analytics";
import Header from "@/components/global/header";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db/drizzle";
import { Logs, Users } from "@/db/schema";
import { Log } from "@/db/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq, inArray } from "drizzle-orm";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard | Quirk",
  description: "Automate Your GitHub Workflow with Quirk",
  openGraph: {
    title: "dashboard | Quirk",
    description: "Automate Your GitHub Workflow with Quirk",
    url: "https://quirk.com/dashboard",
  },
  twitter: {
    card: "summary",
    title: "dashboard | Quirk",
    description: "Automate Your GitHub Workflow with Quirk",
  },
};

export const viewport = "width=device-width, initial-scale=1";

const WorkflowCard = dynamic(() => import("@/components/global/workflowCard"), {
  loading: () => <Skeleton className="w-full h-32 rounded-xl" />,
});

type User = {
  KindeID: string;
  Workflows: string[];
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

const fetchLogs = async (): Promise<Log[] | null> => {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  if (!userSession?.id) {
    return null;
  }

  try {
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.KindeID, userSession.id))
      .execute();

    const logs: Log[] = await db
      .select()
      .from(Logs)
      .where(inArray(Logs.WorkflowName, user[0].Workflows))
      .execute();

    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return null;
  }
};

export async function Greet() {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  function getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good Afternoon";
    } else if (hour >= 18 && hour < 22) {
      return "Good Evening";
    } else {
      return "Hope you're having a great night,";
    }
  }

  return (
    <div className="flex flex-row space-x-3 mb-5">
      <div>
        <Image
          src={"/logo.svg"}
          alt="logo"
          width={64}
          height={64}
          className="rounded-2xl"
        />
      </div>

      <div>
        <h1>Quirk Inc. </h1>
        <h3 className="text-xl mb-5  font-semibold">
          {getGreeting()}, {userSession?.given_name || "User"}!
        </h3>
      </div>
    </div>
  );
}

const WorkflowContent = async () => {
  const userDetails = await fetchUserDetails();

  if (!userDetails) {
    return (
      <p className="text-center text-gray-500">No user details available.</p>
    );
  }

  return (
    <>
      {userDetails?.Workflows &&
        userDetails.Workflows.map((workflow) => (
          <WorkflowCard key={workflow} name={workflow} />
        ))}
    </>
  );
};

const Chart = async () => {
  const logs = await fetchLogs();
  if (!logs) {
    return <p className="text-center text-gray-500">No logs available.</p>;
  }
  return <Analytics logs={logs || []} />;
};

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col">
      <Header route="Dashboard" />
      <div className="w-full p-[3vh]">
        <Greet />
        <Suspense
          fallback={<Skeleton className="w-full h-[200px] rounded-xl" />}
        >
          <Chart />
        </Suspense>
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
            <WorkflowContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
