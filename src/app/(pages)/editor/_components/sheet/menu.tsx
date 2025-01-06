"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SquareChevronLeft } from "lucide-react";
import CreateNode from "./createNode";
import { Actions } from "../constants/actions";

const Menu: FC = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button
        variant="outline"
        className="flex h-10 w-10 items-center justify-center"
      >
        <SquareChevronLeft size="50" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-[370px]">
      <SheetHeader>
        <SheetTitle className="my-5 text-2xl">Workflow Nodes</SheetTitle>
      </SheetHeader>
      <div className="my-5 flex flex-col gap-y-5">
        {Actions?.map((action, idx) => (
          <SheetClose key={idx}>
            <CreateNode
              icon={action.icon}
              action={action.name}
              actionDescription={action.description}
              disabled={action.disabled}
            />
          </SheetClose>
        ))}
      </div>
    </SheetContent>
  </Sheet>
);

export default Menu;
