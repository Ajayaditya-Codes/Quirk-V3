"use client";
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
import SaveWorkflow from "../_components/workflowActions/saveWorkflow";
import PublishWorkflow from "../_components/workflowActions/publichWorkflow";
import { useFlowStore } from "../_components/constants/store/reactFlowStore";

export default function Workflow() {
  const { slackHandler, asanaHandler, conditionHandler, gptHandler } =
    useFlowStore();
  return (
    <>
      <div className="w-full flex flex-col">
        <Header route="Editor" />
        <div className="w-full h-[92vh] relative">
          <Suspense fallback={<Skeleton className="w-full h-full m-2" />}>
            <ContextMenu>
              <ContextMenuTrigger>
                <Editor />
                <div className="absolute top-5 right-[1.25rem] justify-center items-center flex">
                  <Menu />
                </div>
                <div className="absolute top-5 right-[5rem] justify-center items-center flex">
                  <SaveWorkflow />
                </div>
                <div className="absolute top-5 right-[8.75rem] justify-center items-center flex">
                  <PublishWorkflow />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem inset>
                  <button onClick={asanaHandler}>Create Aana Node</button>
                </ContextMenuItem>
                <ContextMenuItem inset>
                  <button onClick={slackHandler}>Create Slack Node</button>
                </ContextMenuItem>
                <ContextMenuItem inset>
                  <button onClick={gptHandler}>Create GPT Node</button>
                </ContextMenuItem>
                <ContextMenuItem inset>
                  <button onClick={conditionHandler}>
                    Create Condtional Node
                  </button>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </Suspense>
        </div>
      </div>
    </>
  );
}
