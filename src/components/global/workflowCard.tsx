"use client";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  IconBrandAsana,
  IconBrandGithub,
  IconBrandSlack,
  IconBrandOpenai,
  IconBrandTrello,
  IconEditCircle,
} from "@tabler/icons-react";
import React from "react";
import { GitBranch } from "lucide-react";

type Props = {
  name: string;
};

export default function WorkflowCard({ name }: Props) {
  return (
    <Link href={`/editor/${name}`}>
      <Card className="flex w-full items-end space-x-2  border ">
        <CardHeader className="flex flex-col flex-grow gap-4 ">
          <div className="flex flex-row gap-2">
            <IconBrandGithub />
            <IconBrandSlack />
            <IconBrandAsana />
            <IconBrandOpenai />
            <GitBranch />
            <IconBrandTrello />
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
}
