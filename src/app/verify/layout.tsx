"use client";
import { updateVerificationStatus } from "@/action/updateVerification";
import { useAuth } from "@/contexts/authContext";
import { useWebSocket } from "@/contexts/webSocketContext";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const socket = useWebSocket()

  useEffect(() => {
    if (!socket) return;
    
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (process.env.NODE_ENV === "development") {
        console.log("Websocket response", data);
      }
      if (data.type === "USER_VERIFICATION") {
        await updateVerificationStatus(data.notification.isVerified);
        window.location.reload();
      }
    };
  }, [socket]);
  return <>{children}</>;
}
