import {
  Home,
  Unplug,
  SquareTerminal,
  LayoutPanelTop,
  BadgeDollarSign,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";

import Header from "./header";
import Footer from "./footer/footer";
import { Suspense } from "react";
import FooterSkeleton from "./footer/footerSkeleton";
import MenuItem from "./menuItem";
import Workflow from "./workflows/workflow";
import WorkflowSkeleton from "./workflows/workflowSkeleton";

export default async function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <Header />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <MenuItem icon={<Home size={20} />} item="Dashboard" />
              <MenuItem icon={<Unplug size={20} />} item="Connections" />

              <Suspense fallback={<WorkflowSkeleton />}>
                <Workflow />
              </Suspense>

              <MenuItem icon={<SquareTerminal size={20} />} item="Logs" />
              <MenuItem icon={<LayoutPanelTop size={20} />} item="Template" />

              <SidebarGroup>
                <SidebarGroupLabel>Profile</SidebarGroupLabel>
                <SidebarGroupContent className="py-2 space-y-1">
                  <MenuItem
                    icon={<BadgeDollarSign size={20} />}
                    item="Pricing"
                  />
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-base">
                      <LogoutLink>
                        <span className="w-6">
                          <LogOut size={20} />
                        </span>
                        <span>Logout</span>
                      </LogoutLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </Sidebar>
  );
}
