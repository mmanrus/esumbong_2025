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
  FolderX,
  Globe,
  ShieldCheck,
  Phone,
} from "lucide-react";
export type UserRole = "admin" | "resident" | "barangay_official" | "superAdmin";
export const SIDEBAR_CONFIG: Record<UserRole, SidebarPage[]> = {
  barangay_official: [
    { id: "/officials", url: "/officials", title: "Dashboard", icon: LayoutDashboard },
    { id: "/officials/viewConcerns", url: "/officials/viewConcerns", title: "View Concerns", icon: FolderOpen },
    { id: "/officials/archives", url: "/officials/archives", title: "Archives", icon: Archive },
    { id: "/feedback", url: "/feedback", title: "Feedback", icon: MessageSquare },
    { id: "/officials/spamConcern", url: "/officials/spamConcern", title: "Spam Concern", icon: FolderX },
    { id: "/officials/spamFeedback", url: "/officials/spamFeedback", title: "Spam Feedback", icon: FolderX },
    { id: "/officials/manageAnnouncements", url: "/officials/manageAnnouncements", title: "Manage Announcements", icon: Pencil },
    { id: "/announcements", url: "/announcements", title: "Announcements", icon: Megaphone },
  ],

  resident: [
    { id: "/resident", url: "/resident", title: "Dashboard", icon: LayoutDashboard },
    { id: "/resident/submitConcern", url: "/resident/submitConcern", title: "Submit Concern", icon: Pencil },
    { id: "/resident/submitFeedback", url: "/resident/submitFeedback", title: "Submit Feedback", icon: MessageCircle },
    { id: "/resident/trackStatus", url: "/resident/trackStatus", title: "Track Status", icon: ChartBar },
    { id: "/resident/history", url: "/resident/history", title: "History", icon: Clock },
    { id: "/announcements", url: "/announcements", title: "Announcements", icon: Megaphone },
  ],

  admin: [
    { id: "/admin", url: "/admin", title: "Dashboard", icon: LayoutDashboard },
    { id: "/admin/category", url: "/admin/category", title: "Categories", icon: Tag },
    { id: "/admin/users", url: "/admin/users", title: "User Management", icon: Users },
    { id: "/announcements", url: "/announcements", title: "Announcements", icon: Megaphone },
    { id: "/feedback", url: "/feedback", title: "Feedback", icon: MessageSquare },
    // in the admin array:
    { id: "/admin/hotlines", url: "/admin/hotlines", title: "Hotlines", icon: Phone },
  ],
  superAdmin: [
    { id: "/super-admin/dashboard", url: "/super-admin", title: "Dashboard", icon: LayoutDashboard },
    { id: "/super-admin/barangays", url: "/super-admin/barangays", title: "Barangays", icon: ShieldCheck },
    { id: "/super-admin/admins", url: "/super-admin/admins", title: "Admins", icon: Users },
    { id: "/super-admin/geography", url: "/super-admin/geography", title: "Geography", icon: Globe },
  ],
}
