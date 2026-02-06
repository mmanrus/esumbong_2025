"use client"

import * as React from "react"
import {
  LucideIcon
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"


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
export function AppSidebar({ sidebarPages, activePage, user, ...props }: AppSidebarProps) {
  return (
    <Sidebar className="bg-[#1F4251]" collapsible="icon" {...props}><SidebarHeader className="bg-[#1F4251] text-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-[#417e98]" asChild>
              <a href="#">
                <div className=" flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    height={10}
                    width={10}
                    src="/esumbong.png"
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
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#1F4251]">
        <NavMain items={sidebarPages}/>
      </SidebarContent>
      <SidebarFooter  className="bg-[#1F4251]">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
