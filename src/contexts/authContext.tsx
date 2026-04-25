"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type User = {
  id: string;
  fullname: string;
  email: string;
  type: string;
  createdAt: Date;
  isVerified?: Boolean;
  contactNumber: string;
  position?: string;
  profilePhoto?: string;
  address: string;
  barangay: {
    id: number;
    name: string;
  };
  barangayId: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
  initialUser: User | null;
};

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [loading, setLoading] = useState<boolean>(!initialUser);
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(!!initialUser);

  const fetchUser = useCallback(async () => {
  try {
    setLoading(true);
    const res = await fetch("/api/me", { credentials: "include" });

    if (!res.ok) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    const data = await res.json();
    setUser(data.user ?? data);
    setIsAuthenticated(true);

    // Guard against null barangay (superAdmin has none)
    if (data.user?.barangayId) {
      localStorage.setItem("lastBarangayId", String(data.user.barangayId));
    }
    if (data.user?.barangay?.name) {
      localStorage.setItem("lastBarangayName", data.user.barangay.name);
    }
  } catch (err) {
    console.error("Auth fetch failed:", err);
    setUser(null);
  } finally {
    setLoading(false);
  }
}, []); // ✅ stable reference

  useEffect(() => {
    if (!initialUser) {
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser: fetchUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
