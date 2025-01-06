"use client";

import React, { FC, ReactNode } from "react";
import { IconLockAccess } from "@tabler/icons-react";
import { useFlowStore } from "../constants/store/reactFlowStore";
import { toaster } from "@/components/ui/toaster";

type CreateNodeProps = {
  icon: ReactNode;
  action: string;
  actionDescription: string;
  disabled?: boolean;
};

const CreateNode: FC<CreateNodeProps> = ({
  icon,
  action,
  actionDescription,
  disabled,
}) => {
  const { slackHandler, asanaHandler, conditionHandler, gptHandler } =
    useFlowStore();

  const handler = (name: string): void => {
    switch (name) {
      case "GitHub":
        toaster.create({
          title: "Hobby Plan supports only one GitHub Node.",
          type: "warning",
        });
        break;
      case "Slack":
        slackHandler();
        break;
      case "Asana":
        asanaHandler();
        break;
      case "Condition":
        conditionHandler();
        break;
      case "Trello":
        toaster.create({
          title: "Trello Coming Soon.",
          type: "warning",
        });
        break;
      case "GPT Webhook Handler":
        gptHandler();
        break;
      default:
        toaster.create({
          title: "Unknown Action.",
          type: "error",
        });
        break;
    }
  };

  return (
    <span
      className="flex w-full items-center p-5 space-x-5 bg-white dark:bg-neutral-900 rounded-xl border border-black dark:border-white"
      onClick={() => handler(action)}
    >
      {icon}
      <div className="flex flex-col items-start justify-start">
        <h5 className="text-lg font-semibold">{action}</h5>
        <p className="text-gray-400">{actionDescription}</p>
      </div>
      {disabled && (
        <div className="flex flex-grow items-end justify-end h-full">
          <IconLockAccess />
        </div>
      )}
    </span>
  );
};

export default CreateNode;
