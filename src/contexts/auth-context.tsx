import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { ssrStorage } from "@/lib/ssr-storage";
import { supabase } from "@/lib/supabase";
import { authApi } from "@/api/endpoints";
import type { User } from "@/types/api";

type AuthCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

function mapSupabaseUser(sbUser: { email?: string; user_metadata?: Record<string, unknown> } | null): User | null {
  if (!sbUser || !sbUser.email) return null;
  return {
    id: 1,
    email: sbUser.email,
    name:
      (sbUser.user_metadata?.name as string) ||
      sbUser.email.split("@")[0] ||
      "Admin",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = ssrStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return ssrStorage.getItem("token");
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Restore existing Supabase session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user && session.access_token) {
          const u = mapSupabaseUser(session.user);
          setUser(u);
          setToken(session.access_token);
          ssrStorage.setItem("user", JSON.stringify(u));
          ssrStorage.setItem("token", session.access_token);
        } else {
          setUser(null);
          setToken(null);
          ssrStorage.removeItem("user");
          ssrStorage.removeItem("token");
        }
      })
      .catch(() => {
        setUser(null);
        setToken(null);
      })
      .finally(() => {
        setLoading(false);
      });

    // 2. Listen to real-time auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && session.access_token) {
        const u = mapSupabaseUser(session.user);
        setUser(u);
        setToken(session.access_token);
        ssrStorage.setItem("user", JSON.stringify(u));
        ssrStorage.setItem("token", session.access_token);
      } else {
        setUser(null);
        setToken(null);
        ssrStorage.removeItem("user");
        ssrStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setUser(res.user);
    setToken(res.token);
    ssrStorage.setItem("token", res.token);
    ssrStorage.setItem("user", JSON.stringify(res.user));
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout network errors
    }
    setUser(null);
    setToken(null);
    ssrStorage.removeItem("token");
    ssrStorage.removeItem("user");
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
