import { Metadata } from "next";
import OfficialLayout from "./client-layout";
import { NotificationProvider } from "@/contexts/notificationContext";

export const metadata: Metadata = {
  title: "e-Sumbong",
  description: "...",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <OfficialLayout>{children}</OfficialLayout>
    </NotificationProvider>
  );
}
