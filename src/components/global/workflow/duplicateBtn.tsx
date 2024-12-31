"use client";

import React from "react";
import { generate } from "random-words";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

interface DuplicateBtnProps {
  workflowName: string; // Replaced `String` with `string` for correct TypeScript usage
}

const DuplicateBtn: React.FC<DuplicateBtnProps> = ({ workflowName }) => {
  const router = useRouter();

  const handler = async () => {
    const newWorkflow = join(generate(3)); // Generate the name for the new workflow

    const promise = new Promise<void>(async (resolve, reject) => {
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
          resolve(); // Success case
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Workflow duplication failed"));
        }
      } catch (error) {
        reject(new Error("Unexpected error occurred during duplication"));
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Workflow Duplicated",
        description: `The workflow "${workflowName}" was successfully duplicated as "${newWorkflow}".`,
      },
      error: (error) => ({
        title: "Duplication Failed",
        description:
          error.message ||
          "An unexpected error occurred while duplicating the workflow.",
      }),
      loading: {
        title: "Duplicating Workflow...",
        description: `Please wait while we duplicate "${workflowName}".`,
      },
    });

    // Post-toast logic
    try {
      await promise;
      router.refresh(); // Refresh the page after successful duplication
    } catch (error) {
      console.error("Error during workflow duplication:", error);
    }
  };

  const join = (strings: string[] | string) => {
    let result = "";
    for (const string of strings) {
      result += string[0].toUpperCase() + string.slice(1);
      result += "-";
    }
    return result.slice(0, -1);
  };

  return (
    <button
      onClick={handler}
      className="text-sm font-medium"
      aria-label={`Duplicate ${workflowName}`}
    >
      Duplicate Workflow
    </button>
  );
};

export default DuplicateBtn;
