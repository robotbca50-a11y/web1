"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setIsAdmin = useAuthStore((s) => s.setIsAdmin);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch {
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setIsAdmin, setLoading]);

  return <>{children}</>;
}
