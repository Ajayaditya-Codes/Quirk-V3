"use client";
import React from "react";
import {
  Handle,
  Position,
  type Node,
  type NodeProps,
  type Edge,
} from "@xyflow/react";
import { IconBrandOpenai } from "@tabler/icons-react";
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
        <span className="flex w-full items-center space-x-5 rounded-xl border border-[#FF0083] bg-white p-5 dark:bg-neutral-900">
          <IconBrandOpenai />
          <div className="flex flex-col items-start justify-start">
            <h5 className="text-lg font-semibold">GPT Webhook Handler</h5>
            <p className="text-gray-400">Generate Messages using GPT</p>
          </div>
        </span>
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
  );
};

export default GPTNode;
