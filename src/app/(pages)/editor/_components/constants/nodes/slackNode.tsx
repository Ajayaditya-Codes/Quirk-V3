import { IconBrandSlack } from "@tabler/icons-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import React from "react";

type SlackNodeData = {
  id: String;
  channel: string;
  message: string;
};

type SlackNode = Node<SlackNodeData, "slack">;
type SlackNodeProps = NodeProps<SlackNode>;

const SlackNode: React.FC<SlackNodeProps> = ({ id, data }) => {
  const { channel, message } = data;
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
      <IconBrandSlack />
      <div className="flex flex-col justify-start items-start">
        <h5 className="text-lg font-semibold">Slack</h5>
        <p className="text-gray-400">Send Message to Slack Channel</p>
      </div>
    </button>
  );
};

export default SlackNode;
