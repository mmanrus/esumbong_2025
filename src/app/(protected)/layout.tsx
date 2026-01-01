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
import { usePathname } from "next/navigation";
export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const sidebarPages = useMemo(() => {
    return SIDEBAR_CONFIG[user?.type as UserRole] ?? [];
  }, [user]);

  const activePage = sidebarPages.find((p) =>
    pathname.startsWith(p.id)
  )?.id;

  return (
    <>
      <div className="bg-gray-100 font-sans text-gray-800 flex flex-col min-h-screen">
        {/* Header */}
        <TopNavBar />

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-1">
            {/* Sidebar */}
            <EsumbongNavBar
              sidebarPages={sidebarPages}
              activePage={activePage}
            />
            <div className="flex-1 p-2 md:p-3 overflow-y-auto">{children}</div>
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
                <ul id="sidebarAnnouncements" className="space-y-4">
                  <li className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
                    <p className="text-sm">
                      <strong>October 12:</strong> Barangay Council Meeting at 9
                      AM.
                    </p>
                  </li>
                  <li className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                    <p className="text-sm">
                      <strong>Notice:</strong> Submit all pending reports before
                      Friday.
                    </p>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#1F4251] text-white text-center py-4 text-sm mt-auto">
          © 2025 E-Sumbong | All Rights Reserved
        </footer>
      </div>
    </>
  );
}
