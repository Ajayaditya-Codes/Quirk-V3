"use client";
import React from "react";
import { IconLockAccess } from "@tabler/icons-react";
import { FC, ReactNode } from "react";
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
  const { slackHandler, asanaHandler, conditionHandler } = useFlowStore();

  const handler = (name: string) => {
    switch (name) {
      case "GitHub":
        toaster.create({
          title: "Hooby Plan Supports only one Github Node",
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
          title: "Trello Coming Soon",
          type: "warning",
        });
        break;
      default:
        break;
    }
  };
  return (
    <span
      className="dark:bg-neutral-900 bg-white rounded-xl w-full items-center p-5 flex flex-row space-x-5 dark:border-white border-black border"
      onClick={() => handler(action)}
    >
      {icon}
      <div className="flex flex-col justify-start items-start">
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
