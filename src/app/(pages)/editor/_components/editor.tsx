"use client";

import React, { useCallback, useEffect } from "react";
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
import { usePathname } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

export default function Editor() {
  const path = usePathname();
  const slug = path?.split("/").pop();

  const { theme } = useTheme();
  const {
    nodes,
    edges,
    edgeOptions,
    setNodes,
    setEdges,
    addNewEdge,
    nodeTypes,
    setRepos,
    setChannels,
    setProjects,
  } = useFlowStore();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      addNewEdge(connection);
    },
    [addNewEdge]
  );

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await fetch(`/api/workflow/get?workflowName=${slug}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === "User not found") {
            toaster.create({
              title: "Please log in and try again.",
              type: "error",
            });
          } else if (
            errorData.error === "Unauthorized to Access the Workflow"
          ) {
            toaster.create({
              title: "You are not authorized to access this workflow.",
              type: "error",
            });
          } else {
            toaster.create({
              title: "There was Some Error",
              type: "error",
            });
          }
          return;
        }
        const data = await response.json();
        setNodes(data.Nodes);
        setEdges(data.Edges);
      } catch (error: any) {
        toaster.create({
          title: "There was Some Error Fetching the Workflow",
          type: "error",
        });
      }
    };

    const fetchRepos = async () => {
      try {
        const response = await fetch("/api/github/fetcher");
        const repos: string[] = [];

        if (!response.ok) throw new Error("Failed to fetch GitHub data");
        const data = await response.json();
        repos.push(...data.map((repo: any) => repo.full_name));
        setRepos(repos);
      } catch (error) {
        console.error(error);
        toaster.create({ title: "Error fetching repositories", type: "error" });
      }
    };

    const fetchChannels = async () => {
      try {
        const response = await fetch("/api/slack/fetcher");
        const channels: string[] = [];

        if (!response.ok) throw new Error("Failed to fetch Slack data");
        const data = await response.json();
        for (const channel of data.channels) {
          channels.push(channel.name);
        }
        setChannels(channels);
      } catch (error: any) {
        console.error(error);
        toaster.create({
          title: "There was Some Error fetching the Channels",
          type: "error",
        });
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/asana/fetcher");
        const projects: { id: string; name: string }[] = [];

        if (!response.ok) throw new Error("Failed to fetch Asana data");
        const data = await response.json();
        for (const workspace of data.data) {
          for (const project of workspace.projects) {
            projects.push({ id: project.gid, name: project.name });
          }
        }
        setProjects(projects);
      } catch (error: any) {
        console.error(error);
        toaster.create({
          title: "There was Some Error fetching the Projects",
          type: "error",
        });
      }
    };

    fetchWorkflow();
    fetchRepos();
    fetchChannels();
    fetchProjects();
  }, []);

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
