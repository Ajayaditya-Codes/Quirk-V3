"use client";

import React, { useCallback } from "react";
import { useTheme } from "next-themes";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ColorMode,
  Connection,
  Controls,
  EdgeChange,
  MiniMap,
  NodeChange,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowStore } from "./constants/store/reactFlowStore";

export default function Editor() {
  const { theme } = useTheme();
  const {
    nodes,
    edges,
    edgeOptions,
    setNodes,
    setEdges,
    addNewEdge,
    updateSaveState,
    nodeTypes,
  } = useFlowStore();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      updateSaveState(false);
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      updateSaveState(false);
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      updateSaveState(false);
      addNewEdge(connection);
    },
    [addNewEdge]
  );

  return (
    <div className="w-full h-[92vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={edgeOptions}
        nodeTypes={nodeTypes}
        zoomOnPinch
        snapToGrid
        colorMode={theme as ColorMode}
        minZoom={1.5}
        fitView={true}
      >
        <Background //@ts-ignore
          variant="dots"
          gap={20}
          size={2}
        />
        <Controls position="top-left" aria-label="Controls" />
        <MiniMap
          position="bottom-left"
          pannable
          zoomable
          ariaLabel="Mini Map"
        />
      </ReactFlow>
    </div>
  );
}
