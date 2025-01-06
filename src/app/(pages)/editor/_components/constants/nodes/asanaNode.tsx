"use client";

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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { IconBrandAsana, IconInfoCircle } from "@tabler/icons-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useFlowStore } from "../store/reactFlowStore";
import { toaster } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import VariableScrollArea from "../../sheet/Github Variables/variableScrollArea";
import { Input } from "@/components/ui/input";

type AsanaNodeData = {
  project: Project;
  taskName: string;
  taskNotes: string;
  id: string;
};

type Project = {
  id: string;
  name: string;
};

type AsanaNode = Node<AsanaNodeData, "asana">;
type AsanaNodeProps = NodeProps<AsanaNode>;
const AsanaNode: React.FC<AsanaNodeProps> = ({ id, data }) => {
  const { project, taskName, taskNotes } = data;
  const { projects, setNodes, nodes, edges, setEdges } = useFlowStore();
  const [selectedProject, setSelectedProject] = useState<Project>(
    project || projects[0]
  );
  const [newTaskName, setTaskName] = useState(taskName || "");
  const [newTaskNotes, setTaskNotes] = useState(taskNotes || "");

  const source = () =>
    edges.find((edge) => edge.target === id)?.source.startsWith("gpt");

  const handleSave = () => {
    setNodes(
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                project: selectedProject,
                taskName: newTaskName,
                taskNotes: source() ? "c7awKoAvbe" : newTaskNotes,
              },
            }
          : node
      )
    );
    toaster.create({ title: "Changes saved successfully", type: "success" });
  };

  const addVariable = (variable: string) => {
    if (!source()) setTaskNotes((prev) => `${prev}var::${variable} `);
  };

  const deleteNode = (): void => {
    setNodes(nodes.filter((node) => node.id !== id));
    setEdges(edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const deleteEdge = (): void => {
    setEdges(edges.filter((edge) => edge.target !== id));
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Drawer>
          <DrawerTrigger>
            <Node />
            <Handle
              type="target"
              position={Position.Left}
              style={{
                background: "#FF0083",
                color: "#FF0083",
                height: "12px",
                width: "12px",
              }}
            />
          </DrawerTrigger>
          <DrawerContent className="my-[100px]">
            <div className="mx-auto w-[350px]">
              <DrawerHeader>
                <DrawerTitle className="text-center">
                  Asana Node Actions
                </DrawerTitle>
                <DrawerDescription className="text-center">
                  Add Task to Asana Project
                </DrawerDescription>
              </DrawerHeader>
              <form className="space-y-4">
                <div>
                  <label className="block text-md font-medium">
                    Select Project
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setSelectedProject(
                        projects.find((project) => project.name === value) ||
                          projects[0]
                      )
                    }
                    value={selectedProject?.name || ""}
                  >
                    <SelectTrigger className="w-full rounded-md border p-2 text-md mt-1">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent className="w-[350px]">
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.name}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-md font-medium">Task Name</label>
                  <Input
                    value={newTaskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full rounded-md border p-2 text-md"
                  />
                </div>
                <div>
                  <label className="block text-md font-medium">
                    Task Notes
                  </label>
                  <Textarea
                    disabled={source()}
                    value={source() ? "GPT Handler" : newTaskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    className="w-full rounded-md border p-2 text-md"
                  />
                </div>
              </form>
              <div className="my-5 flex flex-col space-y-4">
                <VariableScrollArea onClick={addVariable} />
                <div className="flex flex-col items-end space-y-3">
                  <small className="flex items-center text-sm space-x-1">
                    <IconInfoCircle size={20} />
                    <span>Use </span>
                    <span className="font-semibold px-2 py-0 tracking-wider">
                      var::
                    </span>
                    <span>to use variables</span>
                  </small>
                </div>
              </div>
              <DrawerFooter className="mt-3 flex w-full items-center justify-center space-x-3">
                <DrawerClose>
                  <button
                    onClick={handleSave}
                    className="rounded-lg border px-3 py-2"
                  >
                    Submit
                  </button>
                </DrawerClose>
                <DrawerClose>
                  <button className="rounded-lg border px-3 py-2">
                    Cancel
                  </button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <button onClick={deleteEdge}>Delete Source Edge</button>
        </ContextMenuItem>
        <ContextMenuItem>
          <button onClick={deleteNode}>Delete Node</button>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const Node: React.FC = () => (
  <span className="flex w-full items-center space-x-5 rounded-xl border border-[#FF0083] bg-white p-5 dark:bg-neutral-900">
    <IconBrandAsana />
    <div className="flex flex-col items-start">
      <h5 className="text-lg font-semibold">Asana</h5>
      <p className="text-gray-400">Add Task to Asana Project</p>
    </div>
  </span>
);

export default AsanaNode;
