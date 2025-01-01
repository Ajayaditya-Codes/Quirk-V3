"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Header from "@/components/global/header";
import Editor from "../_components/editor";
import { Suspense, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "../_components/sheet/menu";
import SaveWorkflow from "../_components/workflowActions/saveWorkflow";
import PublishWorkflow from "../_components/workflowActions/publichWorkflow";
import { useFlowStore } from "../_components/constants/store/reactFlowStore";
import { useRouter } from "next/router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Workflow() {
  const router = useRouter();
  const { saveStatus, updateSaveState } = useFlowStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (!saveStatus) {
        setNextRoute(url);
        setIsDialogOpen(true);
        throw new Error("Route change blocked by unsaved changes dialog.");
      }
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [saveStatus, router.events]);

  const handleProceed = () => {
    setIsDialogOpen(false);
    updateSaveState(true);
    if (nextRoute) {
      router.push(nextRoute);
      setNextRoute(null);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setNextRoute(null);
  };

  const { slackHandler, asanaHandler, conditionHandler } = useFlowStore();
  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them before leaving
              this page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={cancelRef} onClick={handleCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                updateSaveState(true);
                handleProceed();
              }}
            >
              Save & Proceed
            </AlertDialogAction>
            <AlertDialogAction onClick={handleProceed}>
              Proceed Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
