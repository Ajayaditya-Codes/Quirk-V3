"use client";
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
  Edge,
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import React, { useState } from "react";
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
  id: String;
  channel: string;
  message: string;
};

type SlackNode = Node<SlackNodeData, "slack">;
type SlackNodeProps = NodeProps<SlackNode>;

const SlackNode: React.FC<SlackNodeProps> = ({ id, data }) => {
  const { channel, message } = data;
  const { channels, setNodes, nodes, updateSaveState, edges, setEdges } =
    useFlowStore();
  const [selectedChannel, setSelectedChannel] = useState<string>(
    channel || channels[0]
  );
  const [newMessage, setMessage] = useState<string>(message as string);

  const handler = () => {
    setNodes(
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                channel: selectedChannel,
                message: newMessage,
              },
            }
          : node
      )
    );
    updateSaveState(false);
    toaster.create({ title: "Changes saved successfully", type: "success" });
  };

  const variableAdder = (variable: string) => {
    setMessage(newMessage + "var::" + variable + " ");
  };

  const handleDeleteNode = () => {
    const updatedNodes = nodes.filter((el: Node) => el.id !== id);
    const updatedEdges = edges.filter(
      (el: Edge) => el.source !== id && el.target !== id
    );
    updateSaveState(false);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  const handleDeleteEdge = () => {
    const updatedEdges = edges.filter((el: Edge) => el.target !== id);
    updateSaveState(false);
    setEdges(updatedEdges);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Drawer>
            <DrawerTrigger>
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
              />{" "}
            </DrawerTrigger>
            <DrawerContent className="my-[100px]">
              <div className="w-[350px] mx-auto">
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
                      <SelectTrigger className="w-full mt-1 p-2 text-md border  rounded-md ">
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
                    <label className="block text-md font-medium ">
                      Message
                    </label>
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2 border  text-md rounded-md"
                    />
                  </div>
                </form>
                <div className="flex flex-col my-5 space-y-4">
                  <VariableScrollArea onClick={variableAdder} />
                  <div className="flex items-center flex-grow justify-end space-y-3 flex-col">
                    <small className="flex flex-row items-center text-sm space-x-1">
                      <IconInfoCircle size={20} />
                      <p>Use </p>
                      <span className="font-semibold tracking-wider px-2 py-0 ">
                        var::
                      </span>
                      <p>to use variables </p>
                    </small>
                  </div>
                </div>
                <DrawerFooter className="flex flex-row space-x-3 mt-3 w-full items-center justify-center">
                  <DrawerClose>
                    <span
                      onClick={handler}
                      className="border p-2 px-3 rounded-lg"
                    >
                      Submit
                    </span>
                  </DrawerClose>
                  <DrawerClose>
                    <span className="border p-2 px-3 rounded-lg">Cancel</span>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>{" "}
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

const Node = () => {
  return (
    <span className="dark:bg-neutral-900 bg-white rounded-xl w-full items-center p-5 flex flex-row space-x-5 border-[#FF0083] border">
      <IconBrandSlack />
      <div className="flex flex-col justify-start items-start">
        <h5 className="text-lg font-semibold">Slack</h5>
        <p className="text-gray-400">Send Message to Slack Channel</p>
      </div>
    </span>
  );
};

export default SlackNode;
