import Analytics from "@/components/global/analytics";
import Header from "@/components/global/header";
import { Skeleton } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";
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
    title: "Dashboard | Quirk",
    description: "Automate Your GitHub Workflow with Quirk",
    url: "https://quirk-v2.vercel.app/dashboard",
  },
  twitter: {
    card: "summary",
    title: "Dashboard | Quirk",
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
  Username: string;
};

const fetchUserDetails = async (): Promise<User | null> => {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();
  if (!userSession?.id) return null;

  try {
    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.KindeID, userSession.id))
      .execute();
    return result?.length ? (result[0] as User) : null;
  } catch (error) {
    toaster.create({
      title: "Error fetching user details",
      description: (error as Error)?.message || "Something went wrong.",
      type: "error",
    });
    return null;
  }
};

const fetchLogs = async (): Promise<Log[] | null> => {
  const { getUser } = getKindeServerSession();
  const userSession = await getUser();

  if (!userSession?.id) return null;

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
    toaster.create({
      title: "Error fetching user logs",
      description: (error as Error)?.message || "Something went wrong.",
      type: "error",
    });
    return null;
  }
};

const Greet: React.FC = async () => {
  const userDetails = await fetchUserDetails();

  return (
    <div className="flex flex-row space-x-3 mb-5">
      <Image
        src="/logo.svg"
        alt="logo"
        width={64}
        height={64}
        className="rounded-2xl"
      />
      <div>
        <h3 className="font-medium">Quirk V2</h3>
        <h3 className="text-xl mb-5 font-semibold">
          Welcome Back, {userDetails?.Username}!
        </h3>
      </div>
    </div>
  );
};

const WorkflowContent: React.FC = async () => {
  const userDetails = await fetchUserDetails();

  if (!userDetails) {
    return (
      <p className="text-center text-gray-500">No user details available.</p>
    );
  }

  return (
    <>
      {userDetails.Workflows.map((workflow) => (
        <WorkflowCard key={workflow} name={workflow} />
      ))}
    </>
  );
};

const Chart: React.FC = async () => {
  const logs = await fetchLogs();

  if (!logs) {
    return <p className="text-center text-gray-500">No logs available.</p>;
  }

  return <Analytics logs={logs} />;
};

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col">
      <Header route="Dashboard" />
      <div className="w-full p-[3vh]">
        <Greet />
        <Suspense
          fallback={<Skeleton className="w-full h-[400px] rounded-xl" />}
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
