import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import React, { FC, ReactNode } from "react";

interface MenuItemProps {
  item: string;
  icon: ReactNode;
}

const MenuItem: FC<MenuItemProps> = ({ item, icon }) => {
  const itemPath = `/${item.toLowerCase()}`;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          href={itemPath}
          prefetch={true}
          aria-label={`Navigate to ${item} page`}
          className="flex items-center text-base"
        >
          <span className="w-6">{icon}</span>
          <span className="ml-2">{item}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default MenuItem;
