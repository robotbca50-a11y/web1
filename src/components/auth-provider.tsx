"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setIsAdmin = useAuthStore((s) => s.setIsAdmin);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    try {
      const supabase = createClient();

      const getUser = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);

          if (user) {
            const { data } = await supabase
              .from("admin_users")
              .select("role")
              .eq("id", user.id)
              .single();

            setIsAdmin(!!data);
          }
        } catch (e) {
          console.warn("Auth check failed:", e);
        } finally {
          setLoading(false);
        }
      };

      getUser();

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event: string, session: Session | null) => {
          try {
            setUser(session?.user ?? null);

            if (session?.user) {
              const { data } = await supabase
                .from("admin_users")
                .select("role")
                .eq("id", session.user.id)
                .single();
              setIsAdmin(!!data);
            } else {
              setIsAdmin(false);
            }
          } catch (e) {
            console.warn("Auth state change error:", e);
          } finally {
            setLoading(false);
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (e) {
      console.warn("Supabase init failed:", e);
      setLoading(false);
    }
  }, [setUser, setIsAdmin, setLoading]);

  return <>{children}</>;
}
