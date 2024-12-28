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

export default function WorkflowMenu({ workflow }: { workflow: String }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={"/editor/" + workflow}>
          <span>{workflow}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
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
}
