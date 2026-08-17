import { create } from "zustand";

interface AuthUser {
  id: string;
  username: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  setUser: (user) => set({ user }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setLoading: (loading) => set({ loading }),
}));
