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

const get = async () => {
  const { getUser } = getKindeServerSession();
  const { id } = await getUser();
  let userDetails = null;
  try {
    const result =
      id &&
      (await db.select().from(Users).where(eq(Users.KindeID, id)).execute());
    userDetails = result && result.length > 0 ? result[0] : null;
    return userDetails;
  } catch (error) {
    return null;
  }
};

export default async function Workflow() {
  const userDetails = await get();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workflows</SidebarGroupLabel>
      <SidebarGroupAction className="p-2">
        <CreateBtn />
      </SidebarGroupAction>
      <SidebarGroupContent className="py-2 space-y-1">
        {userDetails?.Workflows.length == 0 ||
        userDetails?.Workflows.length == undefined ? (
          <div className="text-sm text-center mb-5 flex w-full justify-center">
            No Workflows Found.
          </div>
        ) : (
          <div className="flex flex-col  mb-5 w-full">
            {userDetails?.Workflows.map((workflow) => (
              <WorkflowMenu workflow={workflow} key={workflow}/>
            ))}
          </div>
        )}
        <div className="rounded-xl bg-white shadow-lg dark:bg-neutral-800 p-3 flex fle-row justify-start items-start space-x-2">
          <Box />
          <h5>
            You are left with <br />
            {3 - (userDetails?.Workflows.length || 0)} Free Workflows
          </h5>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
