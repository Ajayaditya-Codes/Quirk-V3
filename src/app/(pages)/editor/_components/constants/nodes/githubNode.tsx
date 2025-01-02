"use client";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { IconBrandGithub } from "@tabler/icons-react";
import { useFlowStore } from "../store/reactFlowStore";
import React, { useState } from "react";
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

  const handler = () => {
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
          <div className="w-[350px] mx-auto">
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
                <label className="block  font-medium ">Select Repository</label>
                <Select
                  onValueChange={setSelectedRepo}
                  defaultValue={selectedRepo}
                >
                  <SelectTrigger className="w-full mt-1 p-2 border rounded-md ">
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
                <label className="block  font-medium ">
                  Select Listener Type
                </label>
                <Select
                  onValueChange={(value) =>
                    setSelectedListener(value as "issues" | "push")
                  }
                  defaultValue={selectedListener || "issues"}
                >
                  <SelectTrigger className="w-full mt-1 p-2 border  rounded-md ">
                    <SelectValue placeholder="Select listener type" />
                  </SelectTrigger>
                  <SelectContent className="w-[350px]">
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="issues">Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
            <DrawerFooter className="flex flex-row space-x-3 mt-3 w-full items-center justify-center">
              <DrawerClose>
                <span onClick={handler} className="border p-2 px-3 rounded-lg">
                  Submit
                </span>
              </DrawerClose>
              <DrawerClose>
                <span className="border p-2 px-3 rounded-lg">Cancel</span>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const Node = () => {
  return (
    <span className="dark:bg-neutral-900 bg-white rounded-xl w-full items-center p-5 flex flex-row space-x-5 border-[#FF0083] border">
      <IconBrandGithub />
      <div className="flex flex-col justify-start items-start">
        <h5 className="text-lg font-semibold">GitHub</h5>
        <p className="text-gray-400">Listen for GitHub Events</p>
      </div>
    </span>
  );
};

export default GitHubNode;
