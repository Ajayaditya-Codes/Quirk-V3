"use client";
import * as React from "react";
import { generate } from "random-words";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

export default function DuplicateBtn({
  workflowName,
}: {
  workflowName: String;
}) {
  const router = useRouter();

  const handler = async () => {
    const newWorkflow = join(generate(3)); // Generate the name for the new workflow

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/workflow/duplicate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workflow: workflowName,
            newWorkflow,
          }),
        });

        if (response.ok) {
          resolve(workflowName); // Success case
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Workflow duplication failed"));
        }
      } catch (error) {
        reject(error); // Unexpected errors
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Workflow Duplicated",
        description: `The workflow "${workflowName}" was successfully duplicated as "${newWorkflow}".`,
      },
      error: (error) => ({
        title: "Duplication Failed",
        description: error.message || "An unexpected error occurred while duplicating the workflow.",
      }),
      loading: {
        title: "Duplicating Workflow...",
        description: `Please wait while we duplicate "${workflowName}".`,
      },
    });

    // Post-toast logic
    try {
      await promise;
      router.refresh();
    } catch (error) {
      console.log("Error during workflow duplication:", error);
    }
  };
    
  const join = (strings: String[] | String) => {
    let result = "";
    for (const string of strings) {
      result += string[0].toUpperCase() + string.slice(1);
      result += "-";
    }
    return result.slice(0, -1);
  };
  return <span onClick={handler}>Duplicate Workflow</span>;
}
