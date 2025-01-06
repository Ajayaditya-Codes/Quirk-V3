"use client";

import React, { ReactElement, Suspense } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Header from "@/components/global/header";
import Editor from "../_components/editor";
import { Skeleton } from "@/components/ui/skeleton";
import Menu from "../_components/sheet/menu";
import SaveWorkflow from "../_components/workflowActions/saveWorkflow";
import PublishWorkflow from "../_components/workflowActions/publichWorkflow";
import { useFlowStore } from "../_components/constants/store/reactFlowStore";

const Workflow = (): ReactElement => {
  const { slackHandler, asanaHandler, conditionHandler, gptHandler } =
    useFlowStore();

  return (
    <div className="flex w-full flex-col">
      <Header route="Editor" />
      <div className="relative h-[92vh] w-full">
        <Suspense fallback={<Skeleton className="m-2 h-full w-full" />}>
          <ContextMenu>
            <ContextMenuTrigger>
              <Editor />
              <div className="absolute top-5 right-[1.25rem] flex items-center justify-center">
                <Menu />
              </div>
              <div className="absolute top-5 right-[5rem] flex items-center justify-center">
                <SaveWorkflow />
              </div>
              <div className="absolute top-5 right-[8.75rem] flex items-center justify-center">
                <PublishWorkflow />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem inset>
                <button onClick={asanaHandler}>Create Asana Node</button>
              </ContextMenuItem>
              <ContextMenuItem inset>
                <button onClick={slackHandler}>Create Slack Node</button>
              </ContextMenuItem>
              <ContextMenuItem inset>
                <button onClick={gptHandler}>Create GPT Node</button>
              </ContextMenuItem>
              <ContextMenuItem inset>
                <button onClick={conditionHandler}>
                  Create Conditional Node
                </button>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Suspense>
      </div>
    </div>
  );
};

export default Workflow;
