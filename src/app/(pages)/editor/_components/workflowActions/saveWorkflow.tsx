"use client";
import { Button } from "@/components/ui/button";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useFlowStore } from "../constants/store/reactFlowStore";
import { toaster } from "@/components/ui/toaster";

export default function SaveWorkflow() {
  const path = usePathname();
  const slug = path?.split("/").pop();
  const { nodes, edges, updateSaveState } = useFlowStore();

  const handler = async (): Promise<void> => {
    let githubData = nodes[0];

    for (const node of nodes) {
      if (node.id === "github-1") {
        githubData = node;
      }
    }

    if (githubData.data.repoName === "") {
      toaster.create({
        title: "Please Select a Repository Name",
        type: "error",
      });
      return;
    }

    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        const response = await fetch("/api/workflow/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workflowName: slug,
            nodes: nodes,
            edges: edges,
            githubData: githubData.data,
          }),
        });

        if (!response.ok) {
          reject(new Error("Failed to Save the Workflow"));
          return;
        }

        updateSaveState(true);
        resolve("Workflow Saved Successfully");
      } catch (error) {
        reject(new Error("Failed to Save the Workflow"));
      }
    });

    toaster.promise(promise, {
      loading: {
        title: "Saving Workflow...",
        description: "Please wait while the workflow is being saved.",
      },
      success: {
        title: "Workflow Saved Successfully",
        description: "Your workflow was saved without any issues!",
      },
      error: {
        title: "Failed to Save the Workflow",
        description:
          "An error occurred while saving your workflow. Please try again.",
      },
    });
  };

  return (
    <Button
      variant="outline"
      className="h-10 w-10 justify-center items-center flex"
      onClick={handler}
    >
      <IconDeviceFloppy size="50" />
    </Button>
  );
}
