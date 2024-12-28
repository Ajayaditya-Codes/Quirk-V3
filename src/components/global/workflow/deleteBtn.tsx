"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

interface DeleteBtnProps {
  workflowName: string; // Replaced String with string for correct TypeScript usage
}

const DeleteBtn: React.FC<DeleteBtnProps> = ({ workflowName }) => {
  const router = useRouter();

  const handler = async () => {
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
          resolve(); // Success case
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Workflow deletion failed"));
        }
      } catch (error) {
        reject(new Error("Unexpected error occurred during deletion"));
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Workflow Deleted",
        description: `The workflow "${workflowName}" was successfully deleted.`,
      },
      error: (error) => ({
        title: "Deletion Failed",
        description:
          error.message ||
          "An unexpected error occurred while deleting the workflow.",
      }),
      loading: {
        title: "Deleting Workflow...",
        description: `Please wait while we delete "${workflowName}".`,
      },
    });

    // Handle post-toast logic
    try {
      await promise;
      router.refresh(); // Refresh the page after successful deletion
    } catch (error) {
      console.error("Error during workflow deletion:", error);
    }
  };

  return (
    <button
      onClick={handler}
      className="text-red-600 text-sm font-medium"
      aria-label={`Delete ${workflowName}`}
    >
      Delete Workflow
    </button>
  );
};

export default DeleteBtn;
