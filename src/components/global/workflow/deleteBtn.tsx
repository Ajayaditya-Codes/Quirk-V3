"use client";

import React, { FC, JSX } from "react";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

interface DeleteBtnProps {
  workflowName: string;
}

const DeleteBtn: FC<DeleteBtnProps> = ({ workflowName }): JSX.Element => {
  const router = useRouter();

  const handler = async (): Promise<void> => {
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const response = await fetch("/api/workflow/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ workflowName }),
        });

        if (response.ok) {
          resolve();
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Workflow deletion failed"));
        }
      } catch {
        reject(new Error("Unexpected error occurred during deletion"));
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Workflow Deleted",
        description: `The workflow "${workflowName}" was successfully deleted.`,
      },
      error: (error: Error) => ({
        title: "Deletion Failed",
        description: error.message || "An unexpected error occurred.",
      }),
      loading: {
        title: "Deleting Workflow...",
        description: `Please wait while we delete "${workflowName}".`,
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
      className="text-red-600 font-medium text-sm"
      aria-label={`Delete ${workflowName}`}
    >
      Delete Workflow
    </button>
  );
};

export default DeleteBtn;
