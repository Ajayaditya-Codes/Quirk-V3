import React, { Suspense } from "react";
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
import { IconCircleCheck, IconExclamationCircle } from "@tabler/icons-react";
import { eq, inArray } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Header from "@/components/global/header";
import { Skeleton } from "@/components/ui/skeleton";
import Head from "next/head";

type Log = {
  createdAt: Date;
  LogMessage: string;
  WorkflowName: string;
  Success: boolean | null;
};

type User = {
  KindeID: string;
  Workflows: string[];
};

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

    if (logs.length > 30) {
      const excessLogs = logs.slice(30);
      for (const log of excessLogs) {
        await db.delete(Logs).where(eq(Logs.createdAt, log.createdAt)).execute();
      }
    }

    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return null;
  }
};

const TableSkeleton = () => (
  <div className="w-full p-[3vh]">
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

const TableContent = ({ logs }: { logs: Log[] | null }) => (
  <TableBody>
    {logs
      ? logs
          .reverse()
          .map((log, idx) => (
            <TableRow key={idx} className="hover:bg-transparent font-medium">
              <TableCell>{log.createdAt.toLocaleTimeString()}</TableCell>
              <TableCell>{log.WorkflowName}</TableCell>
              <TableCell>{log.LogMessage}</TableCell>
              <TableCell className="flex justify-end">
                {log.Success ? (
                  <div className="flex items-center space-x-2 rounded-xl p-1 px-2">
                    <IconCircleCheck className="text-green-500" />
                    <p>Succeeded</p>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 rounded-xl p-1 px-2">
                    <IconExclamationCircle className="text-red-500" />
                    <p>Failed</p>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))
      : (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-gray-500">
            No logs available.
          </TableCell>
        </TableRow>
      )}
  </TableBody>
);

export default async function Page() {
  const logs = await fetchLogs();

  return (
    <>
      <Head>
        <title>Workflow Logs | My App</title>
        <meta
          name="description"
          content="View detailed logs for workflow activities, including timestamps, messages, and success indicators."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Suspense fallback={<TableSkeleton />}>
        <div className="w-full flex flex-col">
          <Header route="Logs" />
          <div className="w-full p-[3vh]">
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
              <TableContent logs={logs} />
            </Table>
          </div>
        </div>
      </Suspense>
    </>
  );
}
