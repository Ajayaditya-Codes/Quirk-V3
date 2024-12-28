"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { ThemeSelector } from "./theme-selector";

type HeaderProps = {
  route: string;
};

export default function Header({ route }: HeaderProps) {
  return (
    <div className="border-b-2 h-[8vh] w-full flex flex-row justify-between p-5 items-center">
      <div className="flex flex-row space-x-1 items-center">
        <SidebarTrigger
          className="mr-2"
          aria-label="Open sidebar" // Accessibility improvement for screen readers
        />
        <span className="font-medium text-lg">Quirk</span>
        <ChevronRight size={15} />
        <span className="font-medium text-lg">{route}</span>
      </div>
      <ThemeSelector aria-label="Select Theme" />
    </div>
  );
}
