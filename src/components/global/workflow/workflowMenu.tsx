"use client";
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

import DeleteBtn from "./deleteBtn";
import DuplicateBtn from "./duplicateBtn";
import DeactivateBtn from "./deactivateBtn";

interface WorkflowMenuProps {
  workflow: string; // Replaced `String` with `string` for correct TypeScript type
}

const WorkflowMenu: React.FC<WorkflowMenuProps> = ({ workflow }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/editor/${workflow}`}>
          <span className="text-base">{workflow}</span>{" "}
          {/* Added class for consistent styling */}
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction aria-label="Options for this workflow">
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem>
            <DeactivateBtn workflowName={workflow} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DuplicateBtn workflowName={workflow} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DeleteBtn workflowName={workflow} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export default WorkflowMenu;
