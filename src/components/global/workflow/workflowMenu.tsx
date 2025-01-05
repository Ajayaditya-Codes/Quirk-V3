"use client";

import React, { Suspense, lazy, FC, JSX } from "react";
import Link from "next/link";

import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DeleteBtn = lazy(() => import("./deleteBtn"));
const DuplicateBtn = lazy(() => import("./duplicateBtn"));
const DeactivateBtn = lazy(() => import("./deactivateBtn"));

interface WorkflowMenuProps {
  workflow: string;
}

const WorkflowMenu: FC<WorkflowMenuProps> = ({ workflow }): JSX.Element => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/editor/${workflow}`}>
          <span className="text-base font-medium">{workflow}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction aria-label="Options for this workflow">
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <Suspense fallback={<Skeleton className="w-full min-w-7 h-10" />}>
            <DropdownMenuItem>
              <DeactivateBtn workflowName={workflow} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DuplicateBtn workflowName={workflow} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteBtn workflowName={workflow} />
            </DropdownMenuItem>
          </Suspense>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export default WorkflowMenu;
