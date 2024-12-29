import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Header from "@/components/global/header";
import Editor from "../_components/editor";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "../_components/sheet/menu";

export default function Workflow() {
  return (
    <div className="w-full flex flex-col">
      <Header route="Editor" />
      <div className="w-full h-[92vh] relative">
        <Suspense fallback={<Skeleton className="w-full h-full m-2" />}>
          <Editor />
          <div className="absolute top-5 right-5 justify-center items-center flex">
            <Menu />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
