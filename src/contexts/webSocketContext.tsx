"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "./authContext";

const WebSocketContext = createContext<WebSocket | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<WebSocket | null>(null);
  const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  const { user } = useAuth();
  if (!wsUrl) {
    throw new Error("Please set up NEXT_PUBLIC_WEBSOCKET_URL in the ENV.");
  }
  useEffect(() => {
    if (!user) return;

    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL!;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "AUTH",
          userId: user.id,
          role: user.type,
        }),
      );
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [user]);

  return (
    <WebSocketContext.Provider value={socketRef.current}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
