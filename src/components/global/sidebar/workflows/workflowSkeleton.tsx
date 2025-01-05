import React, { JSX } from "react";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

const WorkflowSkeleton: React.FC = (): JSX.Element => {
  const skeletonItems = Array.from({ length: 3 }).map((_, index) => (
    <Skeleton
      key={`workflow-skeleton-${index}`}
      className="w-full h-5 rounded-lg"
      aria-hidden="true"
    />
  ));

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workflows</SidebarGroupLabel>

      <SidebarGroupAction className="p-2" aria-label="Add workflow">
        <Plus aria-hidden="true" />
      </SidebarGroupAction>

      <SidebarGroupContent
        className="py-2 space-y-3 flex flex-col items-center w-full"
        aria-busy="true"
      >
        {skeletonItems}
        <Skeleton
          className="w-full h-10 rounded-lg"
          aria-hidden="true"
          role="presentation"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default WorkflowSkeleton;
