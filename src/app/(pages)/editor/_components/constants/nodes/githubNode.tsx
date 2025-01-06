"use client";
import React, { JSX, useState } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { IconBrandGithub } from "@tabler/icons-react";
import { useFlowStore } from "../store/reactFlowStore";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toaster } from "@/components/ui/toaster";

type GitHubNodeData = {
  repoName: string | null;
  listenerType: "issues" | "push" | null;
  id: string;
};

type GitHubNode = Node<GitHubNodeData, "github">;
type GitHubNodeProps = NodeProps<GitHubNode>;

const GitHubNode: React.FC<GitHubNodeProps> = ({ id, data }) => {
  const { repoName, listenerType } = data;
  const { repos, setNodes, nodes } = useFlowStore();
  const [selectedRepo, setSelectedRepo] = useState<string>(
    repoName || repos[0]
  );
  const [selectedListener, setSelectedListener] = useState<
    "issues" | "push" | null
  >(listenerType);

  const handler = (): void => {
    setNodes(
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                repoName: selectedRepo,
                listenerType: selectedListener,
              },
            }
          : node
      )
    );
    toaster.create({ title: "Changes saved successfully", type: "success" });
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger>
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
        </DrawerTrigger>
        <DrawerContent className="my-[100px]">
          <div className="mx-auto w-[350px]">
            <DrawerHeader>
              <DrawerTitle className="text-center">
                GitHub Node Actions
              </DrawerTitle>
              <DrawerDescription className="text-center">
                Listen to GitHub Actions
              </DrawerDescription>
            </DrawerHeader>
            <form className="space-y-4">
              <div>
                <label className="block font-medium">Select Repository</label>
                <Select
                  onValueChange={setSelectedRepo}
                  defaultValue={selectedRepo}
                >
                  <SelectTrigger className="mt-1 w-full rounded-md border p-2">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent className="w-[350px]">
                    {repos &&
                      repos.map((repo: string, index: number) => (
                        <SelectItem key={index} value={repo}>
                          {repo}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-medium">
                  Select Listener Type
                </label>
                <Select
                  onValueChange={(value) =>
                    setSelectedListener(value as "issues" | "push")
                  }
                  defaultValue={selectedListener || "issues"}
                >
                  <SelectTrigger className="mt-1 w-full rounded-md border p-2">
                    <SelectValue placeholder="Select listener type" />
                  </SelectTrigger>
                  <SelectContent className="w-[350px]">
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="issues">Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
            <DrawerFooter className="mt-3 flex w-full flex-row items-center justify-center space-x-3">
              <DrawerClose>
                <span onClick={handler} className="rounded-lg border p-2 px-3">
                  Submit
                </span>
              </DrawerClose>
              <DrawerClose>
                <span className="rounded-lg border p-2 px-3">Cancel</span>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const Node: React.FC = (): JSX.Element => {
  return (
    <span className="flex w-full flex-row items-center space-x-5 rounded-xl border border-[#FF0083] bg-white p-5 dark:bg-neutral-900">
      <IconBrandGithub />
      <div className="flex flex-col items-start justify-start">
        <h5 className="text-lg font-semibold">GitHub</h5>
        <p className="text-gray-400">Listen for GitHub Events</p>
      </div>
    </span>
  );
};

export default GitHubNode;
