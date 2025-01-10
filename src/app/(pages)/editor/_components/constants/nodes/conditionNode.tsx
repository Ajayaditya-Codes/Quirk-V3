"use client";
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
import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { GitBranch } from "lucide-react";
import React, { useState } from "react";
import { useFlowStore } from "../store/reactFlowStore";
import { toaster } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GithubVariables } from "../../sheet/Github Variables/githubVariables";
import { Input } from "@/components/ui/input";

type ConditionNodeData = {
  variable: string;
  condition: ">" | "<" | "==" | "!=" | ">=" | "<=" | "has" | "not has";
  value: string;
  id: string;
};

type ConditionNode = Node<ConditionNodeData, "condition">;
type ConditionNodeProps = NodeProps<ConditionNode>;

const ConditionNode: React.FC<ConditionNodeProps> = ({ id, data }) => {
  const { variable, condition, value } = data;
  const { setNodes, nodes, edges, setEdges } = useFlowStore();
  const [newVariable, setVariable] = useState<string>(variable as string);
  const [newCondition, setCondition] = useState<ConditionNodeData["condition"]>(
    condition || "=="
  );
  const [newValue, setValue] = useState<string>(value as string);

  const handler = (): void => {
    setNodes(
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                variable: newVariable,
                condition: newCondition,
                value: newValue,
              },
            }
          : node
      )
    );
    toaster.create({ title: "Changes saved successfully", type: "success" });
  };

  const deleteNode = (): void => {
    setNodes(nodes.filter((node) => node.id !== id));
    setEdges(edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const deleteEdge = (): void => {
    setEdges(edges.filter((edge) => edge.target !== id));
  };

  return (
    <>
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
              <Handle
                type="source"
                position={Position.Right}
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
                    Conditional Node Actions
                  </DrawerTitle>
                  <DrawerDescription className="text-center">
                    Control Trigger Flow
                  </DrawerDescription>
                </DrawerHeader>
                <form className="space-y-4">
                  <div>
                    <label className="block text-md font-medium">
                      Variable
                    </label>
                    <Select
                      value={newVariable}
                      onValueChange={(value) => setVariable(value)}
                    >
                      <SelectTrigger className="border mt-1 p-2 rounded-md text-md w-full">
                        <SelectValue placeholder="Select Variable" />
                      </SelectTrigger>
                      <SelectContent className="w-[350px]">
                        {GithubVariables.map((variable) => (
                          <SelectItem key={variable} value={variable}>
                            {variable}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-md font-medium">
                      Condition
                    </label>
                    <Select
                      value={condition}
                      onValueChange={(value) =>
                        setCondition(value as ConditionNodeData["condition"])
                      }
                    >
                      <SelectTrigger className="border mt-1 p-2 rounded-md text-md w-full">
                        <SelectValue placeholder="Select Condition" />
                      </SelectTrigger>
                      <SelectContent className="w-[350px]">
                        {[
                          "<",
                          ">",
                          "==",
                          "!=",
                          ">=",
                          "<=",
                          "has",
                          "not has",
                        ].map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-md font-medium">Value</label>
                    <Input
                      value={newValue}
                      onChange={(e) => setValue(e.target.value)}
                      className="border p-2 rounded-md text-md w-full"
                    />
                  </div>
                </form>

                <DrawerFooter className="flex w-full flex-row items-center justify-center space-x-3 mt-3">
                  <DrawerClose>
                    <span
                      onClick={handler}
                      className="border p-2 px-3 rounded-lg"
                    >
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
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <span onClick={deleteEdge}>Delete Source Edge</span>
          </ContextMenuItem>
          <ContextMenuItem>
            <span onClick={deleteNode}>Delete Node</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

const Node: React.FC = () => {
  return (
    <span className="bg-white border border-[#FF0083] dark:bg-neutral-900 flex flex-row items-center p-5 rounded-xl space-x-5 w-full">
      <GitBranch />
      <div className="flex flex-col items-start justify-start">
        <h5 className="text-lg font-semibold">Condition</h5>
        <p className="text-gray-400">Control Trigger Flow</p>
      </div>
    </span>
  );
};

export default ConditionNode;
