import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

// Custom storage for js-cookie
const cookieStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, { expires: 7, secure: true, sameSite: "strict" });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
