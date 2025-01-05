"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import React, { JSX } from "react";

const IconBrandGithub = dynamic(() => {
  return import("@tabler/icons-react").then((mod) => mod.IconBrandGithub);
});
const IconBrandSlack = dynamic(() => {
  return import("@tabler/icons-react").then((mod) => mod.IconBrandSlack);
});
const IconBrandAsana = dynamic(() => {
  return import("@tabler/icons-react").then((mod) => mod.IconBrandAsana);
});
const IconBrandOpenai = dynamic(() => {
  return import("@tabler/icons-react").then((mod) => mod.IconBrandOpenai);
});
const IconBrandTrello = dynamic(() => {
  return import("@tabler/icons-react").then((mod) => mod.IconBrandTrello);
});
const GitBranch = dynamic(() => {
  return import("lucide-react").then((mod) => mod.GitBranch);
});

type Props = {
  name: string;
};

const WorkflowCard: React.FC<Props> = ({ name }): JSX.Element => {
  return (
    <Link href={`/editor/${name}`} prefetch={true}>
      <Card
        className="flex w-full items-end space-x-2 border shadow-lg "
        aria-label={`Edit workflow: ${name}`}
      >
        <CardHeader className="flex flex-grow flex-col space-4">
          <div className="flex flex-row space-2" aria-label="Workflow icons">
            <IconBrandGithub aria-hidden="true" />
            <IconBrandSlack aria-hidden="true" />
            <IconBrandAsana aria-hidden="true" />
            <IconBrandOpenai aria-hidden="true" />
            <GitBranch aria-hidden="true" />
            <IconBrandTrello aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-lg mt-5">{name} Workflow</CardTitle>
            <CardDescription>
              Automate Your GitHub Workflow with Quirk
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default WorkflowCard;
