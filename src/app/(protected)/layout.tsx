// OfficialLayout.jsx
"use client";
import { useState, ReactNode, useMemo } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  CheckCircle,
  Users,
  User,
  Megaphone,
  FileText,
  RotateCw,
  Archive,
  Calendar,
  ChartBar,
} from "lucide-react";
import EsumbongNavBar from "@/components/atoangUI/esumbongSidebar";
import TopNavBar from "@/components/atoangUI/layout/TopNavBar";
import { useAuth } from "@/contexts/authContext";
import { SIDEBAR_CONFIG, UserRole } from "@/lib/sidebarConfig";
import { redirect, usePathname } from "next/navigation";
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

  const activePage = sidebarPages.find((p) => pathname.startsWith(p.id))?.id;

  return (
    <div key={user.type} className="bg-gray-100 flex flex-col min-h-screen">
      <TopNavBar />
      <main className="flex flex-1">
        <EsumbongNavBar sidebarPages={sidebarPages} activePage={activePage} />
        <div className="flex-1 p-3 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
