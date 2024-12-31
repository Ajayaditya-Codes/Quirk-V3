import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import React from "react";

type ConditionNodeData = {
  variable: string;
  condition: ">" | "<" | "==" | "!=" | ">=" | "<=" | "has" | "not has";
  value: string;
  id: string;
};

// Define the ConditionNode type
type ConditionNode = Node<ConditionNodeData, "condition">;
type ConditionNodeProps = NodeProps<ConditionNode>;

const ConditionNode: React.FC<ConditionNodeProps> = ({ id, data }) => {
  const { variable, condition, value } = data;
  return (
    <>
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
