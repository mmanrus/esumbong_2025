import { DashboardAdmin } from "@/components/atoangUI/adminDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "...",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function AdminDashboard() {
  return (
    <DashboardAdmin/>
  );
}
