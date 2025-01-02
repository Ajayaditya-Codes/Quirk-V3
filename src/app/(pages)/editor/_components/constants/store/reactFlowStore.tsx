import { addEdge, DefaultEdgeOptions, Edge, Node } from "@xyflow/react";
import { create } from "zustand";
import GitHubNode from "../nodes/githubNode";
import AsanaNode from "../nodes/asanaNode";
import SlackNode from "../nodes/slackNode";
import ConditionNode from "../nodes/conditionNode";
import GPTNode from "../nodes/gpt";

type FlowState = {
  nodes: Node[];
  edges: Edge[];
  edgeOptions: DefaultEdgeOptions;
  nodeTypes: {
    github: typeof GitHubNode;
    asana: typeof AsanaNode;
    slack: typeof SlackNode;
    condition: typeof ConditionNode;
    gpt: typeof GPTNode;
  };
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Edge) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNewEdge: (connection: any) => void;

  githubHandler: () => void;
  slackHandler: () => void;
  asanaHandler: () => void;
  conditionHandler: () => void;
  gptHandler: () => void;

  repos: string[];
  setRepos: (repos: string[]) => void;
  channels: string[];
  setChannels: (channels: string[]) => void;
  projects: { id: string; name: string }[];
  setProjects: (projects: { id: string; name: string }[]) => void;
};

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  edgeOptions: {
    animated: true,
    deletable: true,
    type: "smoothstep",
    style: { stroke: "#FF0083", strokeWidth: 2 },
  },
  nodeTypes: {
    github: GitHubNode,
    asana: AsanaNode,
    slack: SlackNode,
    condition: ConditionNode,
    gpt: GPTNode,
  },

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNewEdge: (connection) =>
    set((state) => {
      const { edges, nodes } = state;

      const targetNode = nodes.find((node) => node.id === connection.target);
      const sourceNode = nodes.find((node) => node.id === connection.source);

      const isGitHubNode = (node: any) => node?.type === "github";
      const isGPTNode = (node: any) => node?.type === "gpt";
      const isConditionNode = (node: any) => node?.type === "condition";

      if (
        (isConditionNode(targetNode) || isGPTNode(targetNode)) &&
        isGPTNode(sourceNode)
      ) {
        return { edges: edges };
      }

      if (isGPTNode(sourceNode) || isGitHubNode(sourceNode)) {
        return { edges: addEdge(connection, edges) };
      }

      const incomingEdges = edges.filter(
        (edge) => edge.target === connection.target
      );
      const outgoingEdges = edges.filter(
        (edge) => edge.source === connection.source
      );

      if (incomingEdges.length === 0 && outgoingEdges.length === 0) {
        const updatedEdges = addEdge(connection, edges);
        return { edges: updatedEdges };
      }

      return { edges };
    }),
  githubHandler: () => {
    const newNode: Node = {
      id: `github-${Math.random().toString(36).slice(2, 9)}`,
      type: "github",
      data: {
        repoName: "",
        listenerType: "",
      },
      position: {
        x: Math.floor(Math.random() * 600),
        y: (Math.random() < 0.5 ? -1 : 1) * 50,
      },
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },

  slackHandler: () => {
    const newNode: Node = {
      id: `slack-${Math.random().toString(36).slice(2, 9)}`,
      type: "slack",
      data: {
        channel: "",
        message: "",
      },
      position: {
        x: Math.floor(Math.random() * 600),
        y: (Math.random() < 0.5 ? -1 : 1) * 50,
      },
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },

  asanaHandler: () => {
    const newNode: Node = {
      id: `asana-${Math.random().toString(36).slice(2, 9)}`,
      type: "asana",
      data: {
        project: "",
        taskName: "",
        taskNotes: "",
      },
      position: {
        x: Math.floor(Math.random() * 600),
        y: (Math.random() < 0.5 ? -1 : 1) * 100,
      },
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },

  gptHandler: () => {
    const newNode: Node = {
      id: `gpt-${Math.random().toString(36).slice(2, 9)}`,
      type: "gpt",
      data: {},
      position: {
        x: Math.floor(Math.random() * 600),
        y: (Math.random() < 0.5 ? -1 : 1) * 100,
      },
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },

  conditionHandler: () => {
    const newNode: Node = {
      id: `condition-${Math.random().toString(36).slice(2, 9)}`,
      type: "condition",
      data: {
        variable: "",
        condition: "",
        value: "",
      },
      position: {
        x: Math.floor(Math.random() * 600),
        y: (Math.random() < 0.5 ? -1 : 1) * 50,
      },
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },
  repos: [],
  setRepos: (repos) => set({ repos }),
  channels: [],
  setChannels: (channels) => set({ channels }),
  projects: [],
  setProjects: (projects) => set({ projects }),
}));
