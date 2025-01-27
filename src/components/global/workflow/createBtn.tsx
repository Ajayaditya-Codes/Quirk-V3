"use client";

import React, { FC, JSX } from "react";
import { Plus } from "lucide-react";
import { generate } from "random-words";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

const CreateBtn: FC = (): JSX.Element => {
  const router = useRouter();

  const joinWords = (words: string[]): string =>
    words.map((word) => word[0].toUpperCase() + word.slice(1)).join("-");

  const handler = async (): Promise<void> => {
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
          resolve(workflowName);
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Workflow creation failed"));
        }
      } catch {
        reject(
          new Error("Network error occurred while creating the workflow.")
        );
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Workflow Created!",
        description: `Workflow "${workflowName}" was created successfully.`,
      },
      error: (error: Error) => ({
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
      router.refresh();
    } catch {
      return;
    }
  };

  return (
    <button
      onClick={handler}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
      aria-label="Create Workflow"
      role="button"
    >
      <Plus size={15} />
    </button>
  );
};

export default CreateBtn;
