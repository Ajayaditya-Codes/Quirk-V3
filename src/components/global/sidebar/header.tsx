import { SidebarHeader } from "@/components/ui/sidebar";
import Image from "next/image";

export default function Header() {
  return (
    <SidebarHeader className="m-3 flex flex-row justify-start items-center">
      <Image
        alt="Logo"
        src="/logo.svg"
        width={50}
        height={50}
        className="bg-white dark:bg-neutral-800 rounded-xl"
      />
      <div className="flex flex-col justify-center items-start">
        <h3 className="font-semibold text-xl tracking-tighter leading-snug">
          Quirk Inc.
        </h3>
        <p className="leading-snug font-medium">GitHub Workflows</p>
      </div>
    </SidebarHeader>
  );
}
