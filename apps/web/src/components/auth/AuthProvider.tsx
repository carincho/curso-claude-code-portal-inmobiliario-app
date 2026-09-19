"use client";

import type { UserDTO } from "@portal-inmobiliario/shared-types";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchCurrentUser, logoutUser } from "@/lib/auth-client";

type AuthContextValue = {
  user: UserDTO | null;
  isLoading: boolean;
  apiUrl: string;
  setUser: (user: UserDTO | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ apiUrl, children }: { apiUrl: string; children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser(apiUrl).then((currentUser) => {
      if (!cancelled) {
        setUser(currentUser);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  async function logout() {
    await logoutUser(apiUrl);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, apiUrl, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
