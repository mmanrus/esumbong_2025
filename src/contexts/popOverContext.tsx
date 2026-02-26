"use client";

import GlobalUpdatePopover from "@/components/atoangUI/GlobalUpdatePopover";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWebSocket } from "./webSocketContext";

type UpdateNotification = {
  message: string;
  type: string;
  id: number;
};

type UpdateConTextType = {
  showUpdate: (id: number, message: string, type: string) => void;
};

const UpdateContext = createContext<UpdateConTextType | null>(null);

export function UpdateProvider({ children }: { children: React.ReactNode }) {
  const [update, setUpdate] = useState<UpdateNotification | null>(null);

  const showUpdate = useCallback(
    (id: number, message: string, type: string) => {
      setUpdate({ message, type, id });

      setTimeout(() => {
        setUpdate(null);
      }, 10000);
    },
    [],
  );

  return (
    <UpdateContext.Provider value={{ showUpdate }}>
      {children}
      {update && (
        <GlobalUpdatePopover
          message={update.message}
          id={update.id}
          type={update.type}
          onClose={() => setUpdate(null)}
        />
      )}
    </UpdateContext.Provider>
  );
}

export function useUpdateNotification() {
  const context = useContext(UpdateContext);
  if (!context) throw new Error("Must be used inside UpdateProvider");
  return context;
}
