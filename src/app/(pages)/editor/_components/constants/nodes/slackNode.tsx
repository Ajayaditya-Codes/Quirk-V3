"use client";

import React, { JSX, useState } from "react";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { IconBrandSlack, IconInfoCircle } from "@tabler/icons-react";
import {
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useFlowStore } from "../store/reactFlowStore";
import { toaster } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import VariableScrollArea from "../../sheet/Github Variables/variableScrollArea";

type SlackNodeData = {
  id: string;
  channel: string;
  message: string;
};

type SlackNode = Node<SlackNodeData, "slack">;
type SlackNodeProps = NodeProps<SlackNode>;

const SlackNode: React.FC<SlackNodeProps> = ({ id, data }) => {
  const { channel, message } = data;
  const { channels, setNodes, nodes, edges, setEdges } = useFlowStore();
  const [selectedChannel, setSelectedChannel] = useState<string>(
    channel || channels[0]
  );
  const [newMessage, setMessage] = useState<string>(message);

  const source = (): boolean => {
    const edge = edges.find((edge) => edge.target === id);
    return edge?.source.startsWith("gpt") ?? false;
  };

  const handler = (): void => {
    setNodes(
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                channel: selectedChannel,
                message: source() ? "c7awKoAvbe" : newMessage,
              },
            }
          : node
      )
    );
    toaster.create({ title: "Changes saved successfully", type: "success" });
  };

  const variableAdder = (variable: string): void => {
    if (!source()) setMessage(`${newMessage}var::${variable} `);
  };

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
        <Drawer>
          <DrawerTrigger>
            <Node />
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
          </DrawerTrigger>
          <DrawerContent className="my-[100px]">
            <div className="mx-auto w-[350px]">
              <DrawerHeader>
                <DrawerTitle className="text-center">
                  Slack Node Actions
                </DrawerTitle>
                <DrawerDescription className="text-center">
                  Send Message to Slack Channel
                </DrawerDescription>
              </DrawerHeader>
              <form className="space-y-4">
                <div>
                  <label className="block text-md font-medium">
                    Select Slack Channel
                  </label>
                  <Select
                    onValueChange={setSelectedChannel}
                    value={selectedChannel}
                  >
                    <SelectTrigger className="mt-1 w-full rounded-md border p-2 text-md">
                      <SelectValue placeholder="Select Channel" />
                    </SelectTrigger>
                    <SelectContent className="w-[350px]">
                      {channels.map((channel, index) => (
                        <SelectItem key={index} value={channel}>
                          {channel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-md font-medium">Message</label>
                  <Textarea
                    disabled={source()}
                    value={source() ? "GPT Handler" : newMessage}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-md border p-2 text-md"
                  />
                </div>
              </form>
              <div className="my-5 flex flex-col space-y-4">
                <VariableScrollArea onClick={variableAdder} />
                <div className="flex flex-col items-center justify-end space-y-3">
                  <small className="flex flex-row items-center space-x-1 text-sm">
                    <IconInfoCircle size={20} />
                    <p>Use </p>
                    <span className="px-2 py-0 font-semibold tracking-wider">
                      var::
                    </span>
                    <p>to use variables</p>
                  </small>
                </div>
              </div>
              <DrawerFooter className="mt-3 flex w-full flex-row items-center justify-center space-x-3">
                <DrawerClose>
                  <span
                    onClick={handler}
                    className="rounded-lg border p-2 px-3"
                  >
                    Submit
                  </span>
                </DrawerClose>
                <DrawerClose>
                  <span className="rounded-lg border p-2 px-3">Cancel</span>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
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

const Node: React.FC = (): JSX.Element => {
  return (
    <span className="flex w-full flex-row items-center space-x-5 rounded-xl border border-[#FF0083] bg-white p-5 dark:bg-neutral-900">
      <IconBrandSlack />
      <div className="flex flex-col items-start justify-start">
        <h5 className="text-lg font-semibold">Slack</h5>
        <p className="text-gray-400">Send Message to Slack Channel</p>
      </div>
    </span>
  );
};

export default SlackNode;
