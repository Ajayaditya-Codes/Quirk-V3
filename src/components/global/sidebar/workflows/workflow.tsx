import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import CreateBtn from "../../workflow/createBtn";
import WorkflowMenu from "../../workflow/workflowMenu";

import { Box } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import React, { JSX } from "react";
import { toaster } from "@/components/ui/toaster";

const get = async (): Promise<any | null> => {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  const id = kindeUser?.id;

  let userDetails = null;
  try {
    const result =
      id &&
      (await db.select().from(Users).where(eq(Users.KindeID, id)).execute());
    userDetails = result && result.length > 0 ? result[0] : null;
    return userDetails;
  } catch (error) {
    toaster.create({
      title: "Error fetching user details",
      description: (error as Error)?.message || "Something went wrong.",
      type: "error",
    });
    return null;
  }
};

export default async function Workflow(): Promise<JSX.Element> {
  const userDetails = await get();

  if (!userDetails) {
    return <div>Error loading workflows.</div>;
  }

  const { Workflows = [] } = userDetails;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="space-y-1">
        <div className="flex flex-row justify-between items-center my-2">
          <p className="text-sm font-semibold">Workflows</p>
          <CreateBtn />
        </div>
        {Workflows.length === 0 ? (
          <div className="flex w-full justify-center mb-5 text-sm text-center">
            No Workflows Found.
          </div>
        ) : (
          <div className="flex flex-col w-full mb-5">
            {Workflows.map((workflow: string) => (
              <WorkflowMenu workflow={workflow} key={workflow} />
            ))}
          </div>
        )}

        <div className="flex items-start space-x-2 rounded-xl bg-white p-3 shadow-lg dark:bg-neutral-800">
          <Box />
          <div>
            <p>
              You are left with <br />
              {3 - Workflows.length} Free Workflows
            </p>
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
