

import { DashboardOverview } from "@/components/atoangUI/dashboardResident";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Resident Dashboard",
  description: "...",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function Page() {
 
  return (
    <DashboardOverview/>
  );
}
