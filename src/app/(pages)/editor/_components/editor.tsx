"use client";

import React, { useCallback, useEffect, ReactElement } from "react";
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

type Project = {
  gid: string;
  name: string;
};

type Workspace = {
  projects: Project[];
};

const Editor = (): ReactElement => {
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
    (changes: NodeChange[]): void => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]): void => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection): void => {
      addNewEdge(connection);
    },
    [addNewEdge]
  );

  useEffect(() => {
    const fetchWorkflow = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/workflow/get?workflowName=${slug}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData.error === "User not found"
              ? "Please log in and try again."
              : errorData.error === "Unauthorized to Access the Workflow"
              ? "You are not authorized to access this workflow."
              : "There was some error.";
          toaster.create({ title: errorMessage, type: "error" });
          return;
        }

        const data = await response.json();
        setNodes(data.Nodes);
        setEdges(data.Edges);
      } catch {
        toaster.create({
          title: "There was an error fetching the workflow.",
          type: "error",
        });
      }
    };

    const fetchRepos = async (): Promise<void> => {
      try {
        const response = await fetch("/api/github/fetcher");
        if (!response.ok) throw new Error("Failed to fetch GitHub data");

        const data = await response.json();
        const repos: string[] = data.map(
          (repo: { full_name: string }) => repo.full_name
        );
        setRepos(repos);
      } catch {
        toaster.create({ title: "Error fetching repositories", type: "error" });
      }
    };

    const fetchChannels = async (): Promise<void> => {
      try {
        const response = await fetch("/api/slack/fetcher");
        if (!response.ok) throw new Error("Failed to fetch Slack data");

        const data = await response.json();
        const channels = data.channels.map(
          (channel: { name: string }) => channel.name
        );
        setChannels(channels);
      } catch {
        toaster.create({ title: "Error fetching channels", type: "error" });
      }
    };

    const fetchProjects = async (): Promise<void> => {
      try {
        const response = await fetch("/api/asana/fetcher");
        if (!response.ok) throw new Error("Failed to fetch Asana data");

        const data = await response.json();
        const projects = data.data.flatMap((workspace: Workspace) =>
          workspace.projects.map((project: Project) => ({
            id: project.gid,
            name: project.name,
          }))
        );
        setProjects(projects);
      } catch {
        toaster.create({ title: "Error fetching projects", type: "error" });
      }
    };

    fetchWorkflow();
    fetchRepos();
    fetchChannels();
    fetchProjects();
  }, [slug]);

  return (
    <div className="h-[92vh] w-full">
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
        fitView
      >
        <Background //@ts-expect-error
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
};

export default Editor;
