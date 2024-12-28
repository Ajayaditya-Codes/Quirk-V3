"use client";
import * as React from "react";
  import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

export default function DeleteBtn({ workflowName }: { workflowName: String }) {
  const router = useRouter();

  const handler = async () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/workflow/delete", {
          method: "DELETE",
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
          reject(new Error(errorData.error || "Workflow deletion failed"));
        }
      } catch (error) {
        reject(error); // Unexpected errors
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Workflow Deleted",
        description: `The workflow "${workflowName}" was successfully deleted.`,
      },
      error: (error) => ({
        title: "Deletion Failed",
        description: error.message || "An unexpected error occurred while deleting the workflow.",
      }),
      loading: {
        title: "Deleting Workflow...",
        description: `Please wait while we delete "${workflowName}".`,
      },
    });

    // Handle post-toast logic
    try {
      await promise;
      router.refresh();
    } catch (error) {
      console.log("Error during workflow deletion:", error);
    }
  };
    return (
    <span onClick={handler} className="text-red-600"> 
      Delete Workflow
    </span>
  );
}
