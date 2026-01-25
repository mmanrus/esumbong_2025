// OfficialLayout.jsx
"use client";
import { useState, ReactNode, useEffect } from "react";

import EsumbongNavBar from "@/components/atoangUI/esumbongSidebar";
import TopNavBar from "@/components/atoangUI/layout/TopNavBar";
import { useAuth } from "@/contexts/authContext";
import { SIDEBAR_CONFIG, UserRole } from "@/lib/sidebarConfig";
import { redirect, usePathname } from "next/navigation";
import AnnouncementList from "@/components/atoangUI/announcement/announcements";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NotificationComponent from "@/components/atoangUI/notifications";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Layout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    redirect("/login");
  }

  const sidebarPages = SIDEBAR_CONFIG[user.type as UserRole] ?? [];
  const router = useRouter(); // call hook at top level
  const activePage = sidebarPages.find((p) => pathname.startsWith(p.id))?.id;

  return (
    <>
      <SidebarProvider>
        <AppSidebar
          user={user}
          sidebarPages={sidebarPages}
          activePage={activePage}
        />
        <SidebarInset className="px-0 py-0">
          <header className="flex h-16 shrink-0 border-b items-center gap-2">
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
                <Button variant={"outline"} className="flex items-center p-2"
                  onClick={() =>  router.back()}
                >
                  <ChevronLeft /><span>Back</span>
                </Button>
                <NotificationComponent userId={user?.id} type={user?.type} />
              </div>
            </div>
          </header>
          <main className="flex flex-1">
            <div className="flex-1 p-3 overflow-y-auto">{children}</div>
            <aside className="hidden lg:block w-85 bg-white border-l shadow-md p-5 overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-[#1F4251]">
                Emergency Hotlines
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Barangay Hotline:</strong> 123-4567
                </li>
                <li>
                  <strong>Police:</strong> 166
                </li>
                <li>
                  <strong>Fire Station:</strong> 160
                </li>
                <li>
                  <strong>Ambulance:</strong> 911
                </li>
              </ul>
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-[#1F4251]">
                  Announcements
                </h3>
                <ul id="sidebarAnnouncements" className="space-y-4">
                  <AnnouncementList sidebar={"true"} />
                </ul>
              </div>
            </aside>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
