"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { generate } from "random-words";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

const CreateBtn: React.FC = () => {
  const router = useRouter();

  const handler = async () => {
    const workflowName = joinWords(generate({ exactly: 3 }) as string[]);

    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        const response = await fetch("/api/workflow/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ workflowName }),
        });

        if (response.ok) {
          resolve(workflowName); // Success case
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Workflow creation failed"));
        }
      } catch (error) {
        reject(new Error("Network error occurred while creating workflow."));
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Workflow Created!",
        description: `Workflow "${workflowName}" was created successfully.`,
      },
      error: (error) => ({
        title: "Workflow Creation Failed",
        description: error.message || "An unexpected error occurred.",
      }),
      loading: {
        title: "Creating Workflow...",
        description: "Please wait while we create the workflow.",
      },
    });

    try {
      await promise;
      router.refresh(); // Refresh the page after a successful workflow creation
    } catch (error) {
      console.error("Error during workflow creation:", error);
    }
  };

  const joinWords = (words: string[]): string => {
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  };

  return (
    <span
      onClick={handler}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Create Workflow"
    >
      <Plus size={15} />
    </span>
  );
};

export default CreateBtn;
