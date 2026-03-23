"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export type SidebarPage = {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  children?: {
    title: string;
    url: string;
  }[];
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  sidebarPages: SidebarPage[];
  activePage?: string;
  user: {
    fullname?: string;
    type?: string;
    email?: string;
    avatar?: string;
  };
};
export function AppSidebar({
  sidebarPages,
  activePage,
  user,
  ...props
}: AppSidebarProps) {
  const isMobile = useIsMobile();
  return (
    <Sidebar className="bg-[#1F4251]" collapsible="icon" {...props}>
      <SidebarHeader className="bg-[#1F4251] text-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size={`${isMobile ? "sm" : "lg"}`}
              className="hover:bg-[#417e98]"
              asChild
            >
              <div className="flex flex-row justify-between">
                <a href="/" className="flex-row flex gap-3">
                  <div className=" flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Image
                      height={10}
                      width={10}
                      src="/esumbongLogo.png"
                      alt="E-Sumbong Logo"
                      className="w-auto object-contain"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Esumbong</span>
                    <span className="truncate text-xs">
                      {user?.type === "admin"
                        ? "Admin Dashboard"
                        : user?.type === "resident"
                          ? "Resident Dashboard"
                          : user?.type === "barangay_official"
                            ? "Barangay Official"
                            : "Dashboard"}
                    </span>
                  </div>
                </a>
                {isMobile && <SidebarTrigger />}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#1F4251]">
        <NavMain items={sidebarPages} />
      </SidebarContent>
      <SidebarFooter className="bg-[#1F4251]">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
