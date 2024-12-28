import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";

export default function MenuItem({
  item,
  icon,
}: {
  item: String;
  icon: React.ReactNode;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className="text-base">
        <Link href={"/" + item.toLowerCase()} prefetch={true}>
          <span className="w-6">{icon}</span>
          <span>{item}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
