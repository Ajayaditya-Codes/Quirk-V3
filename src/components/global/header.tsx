import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { ThemeSelector } from "./theme-selector";

export default function Header({ route }: { route: string }) {
  return (
    <div className="border-b-2 h-[8vh] w-full flex flex-row justify-between p-5 items-center">
      <div className="flex flex-row space-x-1 items-center">
        <SidebarTrigger className="mr-2" />
        <span>Quirk</span>
        <ChevronRight size={15} />
        <span>{route}</span>
      </div>
      <ThemeSelector />
    </div>
  );
}
