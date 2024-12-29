"use client";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { IconBrandGithub, IconLockAccess } from "@tabler/icons-react";
import { toaster } from "@/components/ui/toaster";
import React from "react";

type GitHubNodeData = {
  repoName: string | null;
  listenerType: "issues" | "push" | null;
  id: string;
};

type GitHubNode = Node<GitHubNodeData, "github">;
type GitHubNodeProps = NodeProps<GitHubNode>;

const GitHubNode: React.FC<GitHubNodeProps> = ({ data }) => {
  const { repoName, listenerType } = data;

  return (
    <>
      <Node />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "12px",
          height: "12px",
          color: "#FF0083",
          background: "#FF0083",
        }}
      />
    </>
  );
};

const Node = () => {
  return (
    <button className="dark:bg-neutral-900 bg-white rounded-xl w-full items-center p-5 flex flex-row space-x-5 border-[#FF0083] border">
      <IconBrandGithub />
      <div className="flex flex-col justify-start items-start">
        <h5 className="text-lg font-semibold">GitHub</h5>
        <p className="text-gray-400">Listen for GitHub Events</p>
      </div>
    </button>
  );
};

export default GitHubNode;
