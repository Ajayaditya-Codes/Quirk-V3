"use client";
import * as React from "react";
import { Plus } from "lucide-react";
  import { generate } from "random-words";
  import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

export default function CreateBtn() {
  const router = useRouter();

  const handler = async () => {
    const workflowName = join(generate(3));

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/workflow/create", {
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
          reject(new Error(errorData.error || "Workflow creation failed"));
        }
      } catch (error) {
        reject(error); // Unexpected errors
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

    // Handle post-toast logic, e.g., refreshing the page after success
    try {
      await promise;
      router.refresh();
    } catch (error) {
      console.log("Error during workflow creation:", error);
    }
  };

  const join = (strings: String[] | String) => {
    let result = "";
    for (const string of strings) {
      result += string[0].toUpperCase() + string.slice(1);
      result += "-";
    }
    return result.slice(0, -1);
  };

  return (
    <span onClick={handler}>
      <Plus size={15} />
    </span>
  );
}
