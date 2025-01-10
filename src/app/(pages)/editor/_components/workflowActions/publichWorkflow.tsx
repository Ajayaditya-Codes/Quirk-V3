"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { IconBrowserShare } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useFlowStore } from "../constants/store/reactFlowStore";

const PublishWorkflow: React.FC = () => {
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
            publish: true,
          }),
        });

        if (!response.ok) {
          reject(new Error("Failed to Publish the Workflow"));
          return;
        }

        resolve("Workflow Published Successfully");
      } catch {
        reject(new Error("Failed to Publish the Workflow"));
      }
    });

    toaster.promise(promise, {
      loading: {
        title: "Publishing Workflow...",
        description: "Please wait while the workflow is being published.",
      },
      success: {
        title: "Workflow Published Successfully",
        description: "Your workflow was published without any issues!",
      },
      error: {
        title: "Failed to Publish the Workflow",
        description:
          "An error occurred while publishing your workflow. Please try again.",
      },
    });
  };

  return (
    <Button
      variant="outline"
      className="flex h-10 w-10 items-center justify-center"
      onClick={handler}
    >
      <IconBrowserShare size="50" />
    </Button>
  );
};

export default PublishWorkflow;
