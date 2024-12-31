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
import { IconBrandAsana, IconInfoCircle } from "@tabler/icons-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
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
import { Input } from "@/components/ui/input";

type AsanaNodeData = {
  project: Project;
  taskName: string;
  taskNotes: string;
  id: string;
};

type Project = {
  id: string;
  name: string;
};

type AsanaNode = Node<AsanaNodeData, "asana">;
type AsanaNodeProps = NodeProps<AsanaNode>;

const AsanaNode: React.FC<AsanaNodeProps> = ({ id, data }) => {
  const { project, taskName, taskNotes } = data;
  const { projects, setNodes, nodes } = useFlowStore();
  const [selectedProject, setSelectedProject] = useState<Project>(
    project || projects[0]
  );
  const [newTaskName, setTaskName] = useState<string>(taskName as string);
  const [newTaskNotes, setTaskNotes] = useState<string>(taskNotes as string);

  const handler = () => {
    setNodes(
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                project: selectedProject,
                taskName: taskName,
                taskNotes: taskNotes,
              },
            }
          : node
      )
    );
    toaster.create({ title: "Changes saved successfully", type: "success" });
  };
  const variableAdder = (variable: string) => {
    setTaskNotes(newTaskNotes + "var::" + variable + " ");
  };

  return (
    <>
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
          />
        </DrawerTrigger>
        <DrawerContent className="my-[100px]">
          <div className="w-[350px] mx-auto">
            <DrawerHeader>
              <DrawerTitle className="text-center">
                Asana Node Actions
              </DrawerTitle>
              <DrawerDescription className="text-center">
                Add Task to Asana Project
              </DrawerDescription>
            </DrawerHeader>
            <form className="space-y-4">
              <div>
                <label className="block text-md font-medium ">
                  Select Project
                </label>
                <Select
                  onValueChange={(value) => {
                    const selectedProject = projects.find(
                      (project) => project.name === value
                    );
                    if (selectedProject) {
                      setSelectedProject(selectedProject);
                    }
                  }}
                  value={selectedProject.name}
                >
                  <SelectTrigger className="w-full  text-md mt-1 p-2 border rounded-md ">
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent className="w-[350px]">
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.name}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-md font-medium ">Task Name</label>
                <Input
                  value={newTaskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full p-2 border text-md rounded-md"
                />
              </div>

              <div>
                <label className="block text-md font-medium ">Task Notes</label>
                <Textarea
                  value={newTaskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  className="w-full p-2 border text-md rounded-md "
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
                <span onClick={handler} className="border p-2 px-3 rounded-lg">
                  Submit
                </span>
              </DrawerClose>
              <DrawerClose>
                <span className="border p-2 px-3 rounded-lg">Cancel</span>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const Node = () => {
  return (
    <span className="dark:bg-neutral-900 bg-white rounded-xl w-full items-center p-5 flex flex-row space-x-5 border-[#FF0083] border">
      <IconBrandAsana />
      <div className="flex flex-col justify-start items-start">
        <h5 className="text-lg font-semibold">Asana</h5>
        <p className="text-gray-400">Add Task to Asana Project</p>
      </div>
    </span>
  );
};

export default AsanaNode;
