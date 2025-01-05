import React, { JSX, Suspense } from "react";
import dynamic from "next/dynamic";
import { db } from "@/db/drizzle";
import { Logs, Users } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { eq, inArray } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Header from "@/components/global/header";
import { Skeleton } from "@/components/ui/skeleton";
import { Log, User } from "@/db/types";
import { toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Workflow Logs | Quirk",
  description:
    "View detailed logs for workflow activities, including timestamps, messages, and success indicators.",
  openGraph: {
    title: "Workflow Logs | Quirk",
    description:
      "View detailed logs for workflow activities, including timestamps, messages, and success indicators.",
  },
  twitter: {
    card: "summary",
    title: "Workflow Logs | Quirk",
    description:
      "View detailed logs for workflow activities, including timestamps, messages, and success indicators.",
  },
};

export const viewport = "width=device-width, initial-scale=1";

const IconCircleCheck = dynamic(() =>
  import("@tabler/icons-react").then((mod) => mod.IconCircleCheck)
);
const IconExclamationCircle = dynamic(() =>
  import("@tabler/icons-react").then((mod) => mod.IconExclamationCircle)
);

const fetchLogs = async (): Promise<Log[] | null> => {
  const { getUser } = getKindeServerSession();
  const { id } = await getUser();
  if (!id) return null;

  try {
    const user: User[] = await db
      .select()
      .from(Users)
      .where(eq(Users.KindeID, id))
      .execute();

    if (user.length === 0) return null;

    const logs: Log[] = await db
      .select()
      .from(Logs)
      .where(inArray(Logs.WorkflowName, user[0].Workflows))
      .execute();

    if (logs.length > 50) {
      const excessLogs = logs.slice(50);
      for (const log of excessLogs) {
        await db
          .delete(Logs)
          .where(eq(Logs.createdAt, log.createdAt))
          .execute();
      }
    }

    return logs;
  } catch (error: any) {
    toaster.create({
      title: "Error fetching logs",
      description: error?.message || "Something went wrong.",
      type: "error",
    });
    console.error("Error fetching logs:", error);
    return null;
  }
};

const TableSkeleton: React.FC = (): JSX.Element => (
  <div className="w-full">
    <Table className="text-base">
      <TableHeader>
        <TableRow>
          <TableHead className="xl:w-[20vw]">Timestamp</TableHead>
          <TableHead className="xl:w-[15vw]">Workflow</TableHead>
          <TableHead>Message</TableHead>
          <TableHead className="text-right">Success</TableHead>
        </TableRow>
      </TableHeader>
    </Table>
    <div className="my-2 space-y-2">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

const TableContent: React.FC = async () => {
  const logs = await fetchLogs();
  return (
    <TableBody>
      {logs?.length !== 0 && logs ? (
        logs.reverse().map((log, idx) => (
          <TableRow key={idx} className="hover:bg-transparent font-medium">
            <TableCell>{log.createdAt.toTimeString()}</TableCell>
            <TableCell>{log.WorkflowName}</TableCell>
            <TableCell>{log.LogMessage}</TableCell>
            <TableCell className="flex justify-end">
              {log.Success ? (
                <div
                  className="flex items-center space-x-2 rounded-xl p-1 px-2"
                  aria-label="Succeeded"
                >
                  <IconCircleCheck
                    className="text-green-500"
                    aria-hidden="true"
                  />
                  <p>Succeeded</p>
                </div>
              ) : (
                <div
                  className="flex items-center space-x-2 rounded-xl p-1 px-2"
                  aria-label="Failed"
                >
                  <IconExclamationCircle
                    className="text-red-500"
                    aria-hidden="true"
                  />
                  <p>Failed</p>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-gray-500">
            No logs available.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

const Page: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <Header route="Logs" />
      <main className="w-full p-[3vh]">
        <Suspense fallback={<TableSkeleton />}>
          <Table className="text-base">
            <TableCaption>Workflow Activity Logs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="xl:w-[20vw]">Timestamp</TableHead>
                <TableHead className="xl:w-[15vw]">Workflow</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Success</TableHead>
              </TableRow>
            </TableHeader>
            <TableContent />
          </Table>
        </Suspense>
      </main>
    </div>
  );
};

export default Page;
