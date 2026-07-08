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
  console.log('[AUTH] PROVIDER MOUNT');
  const [user, setUser] = useState<User | null>(() => {
    const stored = ssrStorage.getItem('user');
    const u = stored ? JSON.parse(stored) : null;
    console.log('[AUTH] USER INIT FROM STORAGE', u);
    return u;
  });
  const [token, setToken] = useState<string | null>(() => {
    const t = ssrStorage.getItem('token');
    console.log('[AUTH] TOKEN INIT FROM STORAGE', t ? t.slice(0, 20) + '...' : null);
    return t;
  });
  const [loading, setLoading] = useState(() => {
    console.log('[AUTH] LOADING INIT true');
    return true;
  });

  useEffect(() => {
    console.log('[AUTH] useEffect token CHANGED', token ? token.slice(0, 20) + '...' : null);
    if (!token) {
      console.log('[AUTH] No token → loading done');
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log('[AUTH] RESTORE SESSION START — fetching /user');
    authApi.user()
      .then((u) => {
        console.log('[AUTH] RESTORE SESSION SUCCESS', u);
        setUser(u);
        ssrStorage.setItem('user', JSON.stringify(u));
      })
      .catch((err) => {
        console.log('[AUTH] RESTORE SESSION FAILED', err);
        setUser(null);
        setToken(null);
        ssrStorage.removeItem('token');
        ssrStorage.removeItem('user');
      })
      .finally(() => {
        console.log('[AUTH] RESTORE SESSION finally — loading=false');
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    console.log('[AUTH] LOGIN START');
    const res = await authApi.login(email, password);
    console.log('[AUTH] LOGIN RESPONSE', { user: res.user, token: res.token ? res.token.slice(0, 20) + '...' : null });
    setUser(res.user);
    setToken(res.token);
    ssrStorage.setItem('token', res.token);
    ssrStorage.setItem('user', JSON.stringify(res.user));
    console.log('[AUTH] LOGIN DONE — token saved');
  }, []);

  const logout = useCallback(async () => {
    console.log('[AUTH] LOGOUT START');
    try {
      await authApi.logout();
      console.log('[AUTH] LOGOUT API OK');
    } catch (e) {
      console.log('[AUTH] LOGOUT API ERROR', e);
    }
    setUser(null);
    setToken(null);
    ssrStorage.removeItem('token');
    ssrStorage.removeItem('user');
    console.log('[AUTH] LOGOUT DONE — storage cleared');
  }, []);

  const value = { user, token, loading, login, logout, isAuthenticated: !!token && !!user };
  console.log('[AUTH] STATE', { hasUser: !!user, hasToken: !!token, loading, isAuthenticated: value.isAuthenticated });

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
