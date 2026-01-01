import { Menu } from "lucide-react";
import LogoutButton from "../logout";
import Image from "next/image";
import { useState } from "react";
import NotificationComponent from "../notifications";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
export default function TopNavBar({ title="Official Dashboard" }: { title?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const {user} = useAuth();
  return (
    <header className="bg-[#1F4251] sticky left-0 right-0 top-0 text-white flex items-center justify-between px-6 py-4 shadow-md h-[90px]">
      <div className="flex items-center space-x-3">
        <Image
          height={50}
          width={50}
          src="/esumbong.png"
          alt="E-Sumbong Logo"
          className="w-auto object-contain"
        />
        <div>
          <h1 className="text-2xl font-semibold leading-tight">E-Sumbong</h1>
          <p className="text-sm opacity-90">{title}</p>
        </div>
      </div>
      {/* Mobile Menu Button */}
      <Button
        className="md:hidden bg-[#78909C] px-3 py-2 rounded-md hover:bg-blue-500 transition"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu className="w-6 h-6" />
      </Button>
      {/* Logout */}
      <div className="flex gap-5 items-center justify-between">
        <NotificationComponent userId={user?.id} type={user?.type}/>
        <LogoutButton />
      </div>
    </header>
  );
}
