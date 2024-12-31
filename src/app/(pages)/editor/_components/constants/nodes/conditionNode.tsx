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
import { IconInfoCircle } from "@tabler/icons-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
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
  const { setNodes, nodes, updateSaveState } = useFlowStore();
  const [newVariable, setVariable] = useState<string>(variable as string);
  const [newCondition, setCondition] = useState<ConditionNodeData["condition"]>(
    condition || "=="
  );
  const [newValue, setValue] = useState<string>(value as string);

  const handler = () => {
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
    updateSaveState(false);
    toaster.create({ title: "Changes saved successfully", type: "success" });
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger>
          <Node />
          <Handle
            type="target"
            position={Position.Left}
            style={{
              width: "12px",
              height: "12px",
              color: "#FF0083",
              background: "#FF0083",
            }}
          />
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
                Conditional Node Actions
              </DrawerTitle>
              <DrawerDescription className="text-center">
                Control Trigger Flow
              </DrawerDescription>
            </DrawerHeader>
            <form className="space-y-4">
              <div>
                <label className="block text-md font-medium ">Variable</label>
                <Select
                  value={newVariable}
                  onValueChange={(value) => setVariable(value)}
                >
                  <SelectTrigger className="w-full mt-1 p-2 border text-md rounded-md ">
                    <SelectValue placeholder="Select Variable" />
                  </SelectTrigger>
                  <SelectContent className=" w-[350px]">
                    {GithubVariables.map((variable) => (
                      <SelectItem key={variable} value={variable}>
                        {variable}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-md font-medium ">Condition</label>
                <Select
                  value={condition}
                  onValueChange={(value) =>
                    setCondition(value as ConditionNodeData["condition"])
                  }
                >
                  <SelectTrigger className="w-full mt-1 p-2 border text-md rounded-md ">
                    <SelectValue placeholder="Select Condition" />
                  </SelectTrigger>
                  <SelectContent className="w-[350px]">
                    {["<", ">", "==", "!=", ">=", "<=", "has", "not has"].map(
                      (condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-md font-medium ">Value</label>
                <Input
                  value={newValue}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full p-2 border text-md rounded-md "
                />
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
      <GitBranch />
      <div className="flex flex-col justify-start items-start">
        <h5 className="text-lg font-semibold">Condition</h5>
        <p className="text-gray-400">Control Trigger Flow</p>
      </div>
    </span>
  );
};

export default ConditionNode;
