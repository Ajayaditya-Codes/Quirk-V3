import { SidebarProvider } from "@/components/ui/sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import Head from "next/head"; 
import dynamic from "next/dynamic";

interface LayoutProps {
  children: ReactNode;
}

const LazyAppSidebar = dynamic(() => import("@/components/global/sidebar/appSidebar"));

export default async function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login");
    return null; 
  }

  return (
    <>
      <Head>
        <title>Quirk</title>
      </Head>

      <SidebarProvider>
        <LazyAppSidebar />
        <Provider>
          <Toaster />
          <main className="w-full">{children}</main>
        </Provider>
      </SidebarProvider>
    </>
  );
}
