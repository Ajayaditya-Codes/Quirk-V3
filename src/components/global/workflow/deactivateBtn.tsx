"use client";

import React, { FC, JSX } from "react";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

interface DeactivateBtnProps {
  workflowName: string;
}

const DeactivateBtn: FC<DeactivateBtnProps> = ({
  workflowName,
}): JSX.Element => {
  const router = useRouter();

  const handler = async (): Promise<void> => {
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
          resolve();
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Workflow deactivation failed"));
        }
      } catch {
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
      error: (error: Error) => ({
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
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handler}
      className="font-medium text-sm"
      aria-label={`Deactivate ${workflowName}`}
    >
      Deactivate Workflow
    </button>
  );
};

export default DeactivateBtn;
