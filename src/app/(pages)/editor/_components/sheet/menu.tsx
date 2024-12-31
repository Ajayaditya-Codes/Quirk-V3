"use client";

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

export function Menu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-10 w-10 justify-center items-center flex"
        >
          <SquareChevronLeft size="50" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[370px]">
        <SheetHeader>
          <SheetTitle className="text-2xl my-5">Workflow Nodes</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-y-5 my-5">
          {Actions &&
            Actions.map((action, idx) => {
              return (
                <SheetClose key={idx}>
                  <CreateNode
                    icon={action.icon}
                    action={action.name}
                    actionDescription={action.description}
                    disabled={action.disabled}
                  />{" "}
                </SheetClose>
              );
            })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
