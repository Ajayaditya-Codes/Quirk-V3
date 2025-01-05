"use client";

import React, { FC, JSX } from "react";
import { generate } from "random-words";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

interface DuplicateBtnProps {
  workflowName: string;
}

const DuplicateBtn: FC<DuplicateBtnProps> = ({ workflowName }): JSX.Element => {
  const router = useRouter();

  const handler = async (): Promise<void> => {
    const newWorkflow = join(generate({ exactly: 3 }) as string[]);

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
          resolve();
        } else {
          const errorData = await response.json();
          reject(new Error(errorData.error || "Workflow duplication failed"));
        }
      } catch {
        reject(new Error("Unexpected error occurred during duplication"));
      }
    });

    toaster.promise(promise, {
      success: {
        title: "Workflow Duplicated",
        description: `The workflow "${workflowName}" was successfully duplicated as "${newWorkflow}".`,
      },
      error: (error: Error) => ({
        title: "Duplication Failed",
        description: error.message || "An unexpected error occurred.",
      }),
      loading: {
        title: "Duplicating Workflow...",
        description: `Please wait while we duplicate "${workflowName}".`,
      },
    });

    try {
      await promise;
      router.refresh();
    } catch (error) {
      console.error("Error during workflow duplication:", error);
    }
  };

  const join = (strings: string[]): string =>
    strings.map((str) => str.charAt(0).toUpperCase() + str.slice(1)).join("-");

  return (
    <button
      onClick={handler}
      className="font-medium text-sm"
      aria-label={`Duplicate ${workflowName}`}
    >
      Duplicate Workflow
    </button>
  );
};

export default DuplicateBtn;
