import {
  Home,
  Unplug,
  SquareTerminal,
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
import React, { Suspense, FC, JSX } from "react";
import FooterSkeleton from "./footer/footerSkeleton";
import MenuItem from "./menuItem";
import Workflow from "./workflows/workflow";
import WorkflowSkeleton from "./workflows/workflowSkeleton";

const AppSidebar: FC = (): JSX.Element => {
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
              <SidebarGroup>
                <SidebarGroupLabel>Profile</SidebarGroupLabel>
                <SidebarGroupContent className="py-2 space-y-1">
                  <MenuItem
                    icon={<BadgeDollarSign size={20} />}
                    item="Pricing"
                  />

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <LogoutLink>
                        <span className="w-6" aria-hidden="true">
                          <LogOut size={20} />
                        </span>
                        <span className="ml-2">Logout</span>
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
};

export default AppSidebar;
