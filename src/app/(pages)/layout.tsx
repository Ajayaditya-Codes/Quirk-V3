import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/global/sidebar/appSidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

// Define the Layout props type for TypeScript compatibility
interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  // Check for authentication using Kinde
  const { isAuthenticated } = getKindeServerSession();

  // Redirect if the user is not authenticated
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
    return null; // Early return to prevent rendering after redirect
  }

  // Return the layout JSX structure
  return (
    <SidebarProvider>
      <AppSidebar />
      <Provider>
        <Toaster />
        <main className="w-full">{children}</main>
      </Provider>
    </SidebarProvider>
  );
}
