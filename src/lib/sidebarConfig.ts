// lib/sidebarConfig.ts
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
  Pencil,
  MessageCircle,
  Clock,
  Tag,
} from "lucide-react";
export type UserRole = "admin" | "resident" | "barangay_official";

export const SIDEBAR_CONFIG = {
  barangay_official: [
    { id: "/officials/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "/officials/viewConcerns", name: "View Concerns", icon: FolderOpen },
    { id: "/officials/validateConcerns", name: "Validate / Record", icon: CheckCircle },
    { id: "/officials/assignConcerns", name: "Assign / Respond", icon: Users },
    { id: "/officials/updateStatus", name: "Update Status", icon: RotateCw },
    { id: "/officials/generateSummons", name: "Generate Summons", icon: FileText },
    { id: "/officials/scheduleMediation", name: "Schedule Mediation", icon: Calendar },
    { id: "/officials/reports", name: "Reports & Analytics", icon: ChartBar },
    { id: "/officials/archives", name: "Archives", icon: Archive },
    { id: "/officials/manageAnnouncements", name: "Manage Announcements", icon: Megaphone },
    { id: "/officials/profile", name: "Profile", icon: User },
  ],

  resident: [
    { id: "/resident/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "/resident/submitConcern", name: "Submit Concern", icon: Pencil },
    { id: "/resident/submitFeedback", name: "Submit Feedback", icon: MessageCircle },
    { id: "/resident/trackStatus", name: "Track Status", icon: ChartBar },
    { id: "/resident/history", name: "History", icon: Clock },
    { id: "/resident/profile", name: "Profile", icon: User },
  ],

  admin: [
    { id: "/admin/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "/admin/category", name: "Categories", icon: Tag },
  ],
};
