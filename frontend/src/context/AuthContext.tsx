import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authApi';
import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  updateAvatar: (file: File) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: async (data) => {
      const authenticatedUser = await authApi.login(data);
      setUser(authenticatedUser);
    },
    register: async (data) => {
      const authenticatedUser = await authApi.register(data);
      setUser(authenticatedUser);
    },
    updateAvatar: async (file) => {
    const updatedUser = await authApi.uploadAvatar(file);
    setUser(updatedUser);
    },
    logout: async () => {
      await authApi.logout();
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth має використовуватися всередині AuthProvider.');
  }

  return context;
}
