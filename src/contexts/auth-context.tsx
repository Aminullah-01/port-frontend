import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { ssrStorage } from '@/lib/ssr-storage';
import { authApi } from '@/api/endpoints';
import type { User } from '@/types/api';

type AuthCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = ssrStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return ssrStorage.getItem('token');
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    authApi.user()
      .then((u) => {
        setUser(u);
        ssrStorage.setItem('user', JSON.stringify(u));
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        ssrStorage.removeItem('token');
        ssrStorage.removeItem('user');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setUser(res.user);
    setToken(res.token);
    ssrStorage.setItem('token', res.token);
    ssrStorage.setItem('user', JSON.stringify(res.user));
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout API may fail (e.g., token already expired), clear state anyway
    }
    setUser(null);
    setToken(null);
    ssrStorage.removeItem('token');
    ssrStorage.removeItem('user');
  }, []);

  const value = { user, token, loading, login, logout, isAuthenticated: !!token && !!user };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
