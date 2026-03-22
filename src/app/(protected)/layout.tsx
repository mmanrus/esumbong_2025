import { Metadata } from "next";
import OfficialLayout from "./client-layout";

export const metadata: Metadata = {
  title: "e-Sumbong",
  description: "...",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OfficialLayout>{children}</OfficialLayout>;
}