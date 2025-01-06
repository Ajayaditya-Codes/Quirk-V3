"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useFlowStore } from "../constants/store/reactFlowStore";
import { toaster } from "@/components/ui/toaster";

const SaveWorkflow: React.FC = () => {
  const path = usePathname();
  const slug = path?.split("/").pop();
  const { nodes, edges } = useFlowStore();

  const handler = async (): Promise<void> => {
    const githubData = nodes.find((node) => node.id === "github-1") || nodes[0];

    if (!githubData?.data?.repoName) {
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

        resolve("Workflow Saved Successfully");
      } catch {
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
      className="flex h-10 w-10 items-center justify-center"
      onClick={handler}
    >
      <IconDeviceFloppy size="50" />
    </Button>
  );
};

export default SaveWorkflow;
