"use client";
import { useEffect,ReactNode, useState } from "react";

import {
  Menu,
  LayoutDashboard,
  Pencil,
  MessageCircle,
  ChartBar,
  Bell,
  User,
  Clock,
} from "lucide-react";
import { usePathname } from "next/navigation";

import EsumbongNavBar from "@/components/atoangUI/esumbongSidebar";
import TopNavBar from "@/components/atoangUI/layout/TopNavBar";
export default function layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState(pathname);

  useEffect(() => {
    setActivePage(pathname);
  }, [pathname]);

  const sidebarPages = [
    { id: "/resident/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "/resident/submitConcern", name: "Submit Concern", icon: Pencil },
    {
      id: "/resident/submitFeedback",
      name: "Submit Feedback",
      icon: MessageCircle,
    },
    { id: "/resident/trackStatus", name: "Track Status", icon: ChartBar },
    //{ id: "/resident/notifications", name: "Notifications", icon: Bell },
    { id: "/resident/history", name: "History", icon: Clock },
    { id: "/resident/profile", name: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavBar title="Resident Dashboard"/>

      <div className="flex flex-1 overflow-hidden">
        {/* <!-- Sidebar --> */}
        <EsumbongNavBar
          sidebarPages={sidebarPages}
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <div className="flex flex-1 flex-col p-3 max-w-6xl">{children}</div>
        {/* <!-- Emergency & Announcements Sidebar --> */}
        <aside className="hidden lg:block w-85 bg-white border-l shadow-md p-5 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4 text-[#1F4251]">
            Emergency Hotlines
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>Barangay Hotline:</strong> 123-4567
            </li>
            <li>
              <strong>Police:</strong> 166
            </li>
            <li>
              <strong>Fire Station:</strong> 160
            </li>
            <li>
              <strong>Ambulance:</strong> 911
            </li>
          </ul>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-[#1F4251]">
              Announcements
            </h3>
            <ul className="space-y-4">
              <li className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
                <p className="text-sm">
                  <strong>October 10:</strong> Barangay Clean-Up Drive at 8 AM.
                </p>
              </li>
              <li className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                <p className="text-sm">
                  <strong>Reminder:</strong> Keep your area clean and segregate
                  waste properly.
                </p>
              </li>
              <li className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="text-sm">
                  <strong>Notice:</strong> Free health check-up on Oct 15 at the
                  Barangay Hall.
                </p>
              </li>
            </ul>
          </div>
        </aside>
      </div>
      {/*<!-- Footer --> */}
      <footer className="bg-[#1F4251] text-white text-center py-4 text-sm mt-auto">
        © 2025 E-Sumbong | All Rights Reserved
      </footer>
    </div>
  );
}
