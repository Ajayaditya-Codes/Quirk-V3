import { SidebarHeader } from "@/components/ui/sidebar";
import Image from "next/image";
import { FC } from "react";

const Header: FC = () => {
  return (
    <SidebarHeader className="m-3 flex flex-row justify-start items-center">
      <Image
        alt="Quirk Inc. Logo"
        src="/logo.svg"
        width={50}
        height={50}
        priority
        className="bg-white dark:bg-neutral-800 rounded-xl"
      />
      <div className="flex flex-col justify-center items-start ml-3">
        <h1 className="font-semibold text-xl tracking-tighter leading-snug">
          Quirk Inc.
        </h1>
        <p className="leading-snug font-medium text-sm text-neutral-600 dark:text-neutral-400">
          GitHub Workflows
        </p>
      </div>
    </SidebarHeader>
  );
};

export default Header;
