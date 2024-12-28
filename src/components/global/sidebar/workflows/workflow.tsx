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

  if (!userDetails) {
    return <div>Error loading workflows.</div>; // Fallback message if user details can't be loaded
  }

  const { Workflows = [] } = userDetails;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workflows</SidebarGroupLabel>

      <SidebarGroupAction className="p-2">
        <CreateBtn />
      </SidebarGroupAction>

      <SidebarGroupContent className="py-2 space-y-1">
        {Workflows.length === 0 ? (
          <div className="text-sm text-center mb-5 flex w-full justify-center">
            No Workflows Found.
          </div>
        ) : (
          <div className="flex flex-col mb-5 w-full">
            {Workflows.map((workflow) => (
              <WorkflowMenu workflow={workflow} key={workflow} />
            ))}
          </div>
        )}

        <div className="rounded-xl bg-white shadow-lg dark:bg-neutral-800 p-3 flex fle-row justify-start items-start space-x-2">
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
