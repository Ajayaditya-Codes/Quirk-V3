"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { ThemeSelector } from "./theme-selector";
import React, { JSX } from "react";

type HeaderProps = {
  route: string;
};

const Header: React.FC<HeaderProps> = ({ route }: HeaderProps): JSX.Element => {
  return (
    <div className="border-b-2 h-[8vh] w-full flex justify-between items-center p-5">
      <div className="flex items-center space-x-1">
        <SidebarTrigger className="mr-2" aria-label="Open sidebar" />
        <span className="font-medium text-lg">Quirk</span>
        <ChevronRight size={15} />
        <span className="font-medium text-lg">{route}</span>
      </div>
      <ThemeSelector aria-label="Select Theme" />
    </div>
  );
};

export default Header;
