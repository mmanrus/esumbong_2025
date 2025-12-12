"use client";

import { useRouter } from "next/navigation";
import { logout } from '@/action/auth'
export default function LogoutButton() {
  const router = useRouter();

  return (
     <form action={logout}>
    <button
      type="submit"
      className="bg-[#78909C] hover:bg-blue-500 px-5 py-2 rounded-md text-base font-medium transition"
    >
      Logout
    </button>
    </form>
  );
}
