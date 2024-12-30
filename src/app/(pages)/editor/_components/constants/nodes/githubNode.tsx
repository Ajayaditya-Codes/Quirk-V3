"use client";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { IconBrandGithub } from "@tabler/icons-react";
import { toaster } from "@/components/ui/toaster";
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

type GitHubNodeData = {
  repoName: string | null;
  listenerType: "issues" | "push" | null;
  id: string;
};

type GitHubNode = Node<GitHubNodeData, "github">;
type GitHubNodeProps = NodeProps<GitHubNode>;

const GitHubNode: React.FC<GitHubNodeProps> = async ({ data }) => {
  const { repoName, listenerType } = data;
  const repos = ["repo1", "repo2", "repo3"];
  const [selectedRepo, setSelectedRepo] = useState(repoName as string);
  const [selectedListener, setSelectedListener] = useState<
    "issues" | "push" | null
  >(listenerType);

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
        <DrawerContent>
          <div className="w-[400px] mx-auto">
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
                <label className="block text-sm font-medium text-neutral-400">
                  Select Repository
                </label>
                <Select
                  onValueChange={setSelectedRepo}
                  defaultValue={selectedRepo}
                >
                  <SelectTrigger className="w-full mt-1 p-2 border border-neutral-700 rounded-md bg-neutral-900 text-neutral-200">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white w-[25vw]">
                    {repos &&
                      repos.map((repo, index) => (
                        <SelectItem key={index} value={repo}>
                          {repo}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400">
                  Select Listener Type
                </label>
                <Select
                  onValueChange={(value) =>
                    setSelectedListener(value as "issues" | "push")
                  }
                  defaultValue={selectedListener || "issues"}
                >
                  <SelectTrigger className="w-full mt-1 p-2 border border-neutral-700 rounded-md bg-neutral-900 text-neutral-200">
                    <SelectValue placeholder="Select listener type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white">
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="issues">Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
            <DrawerFooter>
              <button>Submit</button>
              <DrawerClose>
                <button>Cancel</button>
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
