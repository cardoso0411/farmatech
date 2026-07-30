import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { api } from '../lib/api';

export type AuthUser = { id: string; name: string; username: string; role: 'ADMIN' | 'MANAGER' | 'ATTENDANT' };
type AuthContextValue = { user: AuthUser | null; login: (token: string, user: AuthUser) => void; logout: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = 'farmatech-auth';

function readSession() {
  try { return JSON.parse(localStorage.getItem(storageKey) || 'null') as { token: string; user: AuthUser } | null; } catch { return null; }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const session = readSession();
  const [user, setUser] = useState<AuthUser | null>(session?.user ?? null);
  if (session?.token) api.defaults.headers.common.Authorization = `Bearer ${session.token}`;
  function login(token: string, nextUser: AuthUser) {
    localStorage.setItem(storageKey, JSON.stringify({ token, user: nextUser }));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(nextUser);
  }
  function logout() { localStorage.removeItem(storageKey); delete api.defaults.headers.common.Authorization; setUser(null); }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
