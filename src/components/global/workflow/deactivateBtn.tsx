"use client";
import * as React from "react";
  import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

export default function DeactivateBtn({
  workflowName,
}: {
  workflowName: String;
}) {
  const router = useRouter();

  const handler = async () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/workflow/deactivate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workflowName,
          }),
        });

        if (response.ok) {
          resolve(workflowName); // Success case
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Workflow deactivation failed"));
        }
      } catch (error) {
        reject(error); // Unexpected errors
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Workflow Deactivated",
        description: `The workflow "${workflowName}" was successfully deactivated.`,
      },
      error: (error) => ({
        title: "Deactivation Failed",
        description: error.message || "An unexpected error occurred while deactivating the workflow.",
      }),
      loading: {
        title: "Deactivating Workflow...",
        description: `Please wait while we deactivate "${workflowName}".`,
      },
    });

    // Handle additional logic after the toast
    try {
      await promise;
      router.refresh();
    } catch (error) {
      console.log("Error during workflow deactivation:", error);
    }
  };

  return <span onClick={handler}>Deactivate Workflow</span>;
}
