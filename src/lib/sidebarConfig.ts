// lib/sidebarConfig.ts
import { SidebarPage } from "@/components/app-sidebar";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Megaphone,
  Archive,
  ChartBar,
  Pencil,
  MessageCircle,
  Clock,
  Tag,
  MessageSquare,
  FolderX
} from "lucide-react";
export type UserRole = "admin" | "resident" | "barangay_official";
export const SIDEBAR_CONFIG: Record<UserRole, SidebarPage[]> = {
  barangay_official: [
    { id: "/officials", url: "/officials", title: "Dashboard", icon: LayoutDashboard },
    { id: "/officials/viewConcerns", url: "/officials/viewConcerns", title: "View Concerns", icon: FolderOpen },
    { id: "/officials/archives", url: "/officials/archives", title: "Archives", icon: Archive },
    { id: "/officials/manageAnnouncements", url: "/officials/manageAnnouncements", title: "Manage Announcements", icon: Megaphone },
    { id: "/feedback", url: "/feedback", title: "Feedback", icon: MessageSquare },
    { id: "/officials/spamConcern", url: "/officials/spamConcern", title: "Spam Conern", icon: FolderX },
    { id: "/officials/spamFeedback", url: "/officials/spamFeedback", title: "Spam Feedback", icon: FolderX },
  ],

  resident: [
    { id: "/resident", url: "/resident", title: "Dashboard", icon: LayoutDashboard },
    { id: "/resident/submitConcern", url: "/resident/submitConcern", title: "Submit Concern", icon: Pencil },
    { id: "/resident/submitFeedback", url: "/resident/submitFeedback", title: "Submit Feedback", icon: MessageCircle },
    { id: "/resident/trackStatus", url: "/resident/trackStatus", title: "Track Status", icon: ChartBar },
    { id: "/resident/history", url: "/resident/history", title: "History", icon: Clock },
    { id: "/announcements", url: "/announcements", title: "Announcements", icon: Megaphone },
    { id: "/feedback", url: "/feedback", title: "Feedback", icon: MessageSquare },
  ],

  admin: [
    { id: "/admin", url: "/admin", title: "Dashboard", icon: LayoutDashboard },
    { id: "/admin/category", url: "/admin/category", title: "Categories", icon: Tag },
    { id: "/admin/users", url: "/admin/users", title: "User Management", icon: Users },
    { id: "/announcements", url: "/announcements", title: "Announcements", icon: Megaphone },
    { id: "/feedback", url: "/feedback", title: "Feedback", icon: MessageSquare },
  ],
}
