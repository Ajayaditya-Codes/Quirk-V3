"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

interface DeactivateBtnProps {
  workflowName: string; // Changed String to string for proper TypeScript usage
}

const DeactivateBtn: React.FC<DeactivateBtnProps> = ({ workflowName }) => {
  const router = useRouter();

  const handler = async () => {
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const response = await fetch("/api/workflow/deactivate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ workflowName }),
        });

        if (response.ok) {
          resolve(); // Success case
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Workflow deactivation failed"));
        }
      } catch (error) {
        reject(
          new Error("Network error occurred while deactivating workflow.")
        );
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Workflow Deactivated",
        description: `The workflow "${workflowName}" was successfully deactivated.`,
      },
      error: (error) => ({
        title: "Deactivation Failed",
        description: error.message || "An unexpected error occurred.",
      }),
      loading: {
        title: "Deactivating Workflow...",
        description: `Please wait while we deactivate "${workflowName}".`,
      },
    });

    try {
      await promise;
      router.refresh(); // Refresh the page upon successful deactivation
    } catch (error) {
      console.error("Error during workflow deactivation:", error);
    }
  };

  return (
    <button
      onClick={handler}
      className="text-sm font-medium"
      aria-label={`Deactivate ${workflowName}`}
    >
      Deactivate Workflow
    </button>
  );
};

export default DeactivateBtn;
