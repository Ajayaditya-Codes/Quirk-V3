import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { IconBrandAsana } from "@tabler/icons-react";
import React from "react";

type AsanaNodeData = {
  project: {
    id: string;
    name: string;
  };
  taskName: string;
  taskNotes: string;
  id: string;
};

type AsanaNode = Node<AsanaNodeData, "asana">;
type AsanaNodeProps = NodeProps<AsanaNode>;

const AsanaNode: React.FC<AsanaNodeProps> = ({ data }) => {
  const { project, taskName, taskNotes } = data;

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
    </>
  );
};

const Node = () => {
  return (
    <button className="dark:bg-neutral-900 bg-white rounded-xl w-full items-center p-5 flex flex-row space-x-5 border-[#FF0083] border">
      <IconBrandAsana />
      <div className="flex flex-col justify-start items-start">
        <h5 className="text-lg font-semibold">Asana</h5>
        <p className="text-gray-400">Add Task to Asana Project</p>
      </div>
    </button>
  );
};

export default AsanaNode;
