"use client";
import {
  type Edge,
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { IconBrandOpenai } from "@tabler/icons-react";
import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useFlowStore } from "../store/reactFlowStore";

type GPTNodeData = {
  id: string;
};

type GPTNode = Node<GPTNodeData, "GPT">;
type GPTNodeProps = NodeProps<GPTNode>;

const GPTNode: React.FC<GPTNodeProps> = ({ id }) => {
  const { setNodes, nodes, edges, setEdges } = useFlowStore();
  const handleDeleteNode = () => {
    const updatedNodes = nodes.filter((el: Node) => el.id !== id);
    const updatedEdges = edges.filter(
      (el: Edge) => el.source !== id && el.target !== id
    );
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  const handleDeleteEdge = () => {
    const updatedEdges = edges.filter((el: Edge) => el.target !== id);
    setEdges(updatedEdges);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <span className="dark:bg-neutral-900 bg-white rounded-xl w-full items-center p-5 flex flex-row space-x-5 border-[#FF0083] border">
            <IconBrandOpenai />
            <div className="flex flex-col justify-start items-start">
              <h5 className="text-lg font-semibold">GPT Webhook Handler</h5>
              <p className="text-gray-400">Generate Messages using GPT</p>
            </div>
          </span>
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
          />{" "}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <span onClick={handleDeleteEdge}>Delete Source Edge</span>
          </ContextMenuItem>
          <ContextMenuItem>
            <span onClick={handleDeleteNode}>Delete Node</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default GPTNode;
