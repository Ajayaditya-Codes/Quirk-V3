import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
  } from "@/components/ui/context-menu"
import Header from "@/components/global/header";
import Editor from "../_components/editor";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Workflow(){
    return(      <div className="w-full flex flex-col">
        <Header route="Editor" />
        <div className="w-full h-[92vh]">
        <ContextMenu >

  <ContextMenuTrigger className="w-full ">         
  <Suspense fallback={<Skeleton className="w-full h-full m-2"/>}>
  <Editor/>
  </Suspense>
     </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Billing</ContextMenuItem>
    <ContextMenuItem>Team</ContextMenuItem>
    <ContextMenuItem>Subscription</ContextMenuItem>
  </ContextMenuContent>
  </ContextMenu>

        </div>
        </div>
)
}
