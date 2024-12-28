import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface MenuItemProps {
  item: string;
  icon: ReactNode;
}

const MenuItem: FC<MenuItemProps> = ({ item, icon }) => {
  const itemPath = `/${item.toLowerCase()}`;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className="text-base">
        <Link href={itemPath} prefetch={false} aria-label={`${item} page`}>
          <span className="w-6">{icon}</span>
          <span className="ml-2">{item}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default MenuItem;
