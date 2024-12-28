import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function WorkflowSkeleton() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workflows</SidebarGroupLabel>
      <SidebarGroupAction className="p-2">
        <Plus />
      </SidebarGroupAction>
      <SidebarGroupContent className="py-2 space-y-3 items-center flex flex-col w-full ">
        <Skeleton className="w-full h-5 rounded-lg" />
        <Skeleton className="w-full h-5 rounded-lg" />
        <Skeleton className="w-full h-5 rounded-lg" />
        <Skeleton className="w-full h-10 rounded-lg " />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
