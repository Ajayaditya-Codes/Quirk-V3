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
import { Suspense, FC } from "react";
import FooterSkeleton from "./footer/footerSkeleton";
import MenuItem from "./menuItem";
import Workflow from "./workflows/workflow";
import WorkflowSkeleton from "./workflows/workflowSkeleton";

const AppSidebar: FC = () => {
  return (
    <Sidebar collapsible="offcanvas">
      {/* Semantic Header Component */}
      <Header />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Use semantic and accessible menu items */}
              <MenuItem icon={<Home size={20} />} item="Dashboard" />
              <MenuItem icon={<Unplug size={20} />} item="Connections" />

              {/* Wrap Workflow with Suspense for optimized lazy-loading */}
              <Suspense fallback={<WorkflowSkeleton />}>
                <Workflow />
              </Suspense>

              <MenuItem icon={<SquareTerminal size={20} />} item="Logs" />
              <MenuItem icon={<LayoutPanelTop size={20} />} item="Template" />

              {/* Profile Section */}
              <SidebarGroup>
                <SidebarGroupLabel>Profile</SidebarGroupLabel>
                <SidebarGroupContent className="py-2 space-y-1">
                  <MenuItem
                    icon={<BadgeDollarSign size={20} />}
                    item="Pricing"
                  />
                  <SidebarMenuItem>
                    {/* Add accessible Logout button */}
                    <SidebarMenuButton asChild className="text-base">
                      <LogoutLink>
                        <span className="w-6" aria-hidden="true">
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

      {/* Suspense for Footer */}
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </Sidebar>
  );
};

export default AppSidebar;
