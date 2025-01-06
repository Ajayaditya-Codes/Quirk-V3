import {
  IconBrandGithub,
  IconBrandSlack,
  IconBrandAsana,
  IconBrandTrello,
  IconBrandOpenai,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { GitBranch } from "lucide-react";
import React from "react";

type Action = {
  name: string;
  icon: ReactNode;
  description: string;
  disabled?: boolean;
};

export const Actions: ReadonlyArray<Action> = [
  {
    name: "GitHub",
    icon: <IconBrandGithub />,
    description: "Listen for GitHub Events",
    disabled: true,
  },
  {
    name: "Slack",
    icon: <IconBrandSlack />,
    description: "Send Message to Slack Channel",
  },
  {
    name: "Asana",
    icon: <IconBrandAsana />,
    description: "Add Task to Asana Project",
  },
  {
    name: "Trello",
    icon: <IconBrandTrello />,
    description: "Add Task to Trello Project",
  },
  {
    name: "Condition",
    icon: <GitBranch />,
    description: "Control Trigger Flow",
  },
  {
    name: "GPT Webhook Handler",
    icon: <IconBrandOpenai />,
    description: "Generate Messages using GPT",
  },
] as const;
