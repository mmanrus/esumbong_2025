// OfficialLayout.jsx
"use client";

import { ReactNode, useEffect } from "react";
import { ClientOnly } from "@/components/ui/client-only";
import { useAuth } from "@/contexts/authContext";
import { SIDEBAR_CONFIG, UserRole } from "@/lib/sidebarConfig";
import { redirect, usePathname } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

import NotificationComponent from "@/components/atoangUI/notifications";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUpdateNotification } from "@/contexts/popOverContext";
import { useWebSocket } from "@/contexts/webSocketContext";
import HotlinePanel from "@/components/hotlinePanel";
export default function Layout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) {
    redirect("/");
  }

  const sidebarPages = SIDEBAR_CONFIG[user.type as UserRole] ?? [];
  const router = useRouter(); // call hook at top level
  const activePage = sidebarPages.find((p) => pathname.startsWith(p.id))?.id;
  const { showUpdate } = useUpdateNotification();
  const socket = useWebSocket();
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = async (event) => {
      const res = JSON.parse(event.data);
      if (process.env.NODE_ENV) console.log("Websocket response", res);
      if (res.type === "USER_VERIFICATION") {
        await fetch("/api/update-verification", {
          method: "POST",
          body: JSON.stringify({
            isVerified: res.notification.isVerified,
          }),
        });

        window.location.reload();
      }
      if (res.type === "UPDATES") {
        showUpdate(res.update.id, res.update.message, res.update.type);
      }
    };
  }, [socket]);
  return (
    <ClientOnly>
      <SidebarProvider>
        <AppSidebar
          user={user}
          sidebarPages={sidebarPages}
          activePage={activePage}
        />
        <SidebarInset className="px-0 py-0">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] border-b ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex flex-1 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </div>
              {/**
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
              <div className="flex items-center gap-2">
                <Button
                  variant={"outline"}
                  className="flex items-center p-2"
                  onClick={() => router.back()}
                >
                  <ChevronLeft />
                  {!isMobile && <span>Back</span>}
                </Button>
                <NotificationComponent />
              </div>
            </div>
          </header>
          <main className="flex flex-1">
            <div className="flex-1 p-3 overflow-y-auto">{children}</div>
            <HotlinePanel />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ClientOnly>
  );
}
