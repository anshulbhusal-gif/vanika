import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiClient, setStoredToken, getStoredToken, clearStoredToken } from '../services/api/apiClient';

// ─── Types ───

interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: string;
  isActive: boolean;
  profile?: {
    fullName: string;
    location?: string;
    dateOfBirth?: string;
    primaryLanguage?: string;
    bio?: string;
  };
  accessibilitySettings?: any;
  userPreferences?: any;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<AuthUser>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  fullName: string;
  phone?: string;
  email?: string;
  password: string;
  role?: string;
}

// ─── Context ───

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ───

interface AuthProviderProps {
  children: ReactNode;
  onLogout?: () => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onLogout }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  const clearError = useCallback(() => setError(null), []);

  // Logout handler
  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
    setToken(null);
    setError(null);
    onLogout?.();
  }, [onLogout]);

  // Listen for forced logout from apiClient (401 responses)
  useEffect(() => {
    const handleForcedLogout = () => logout();
    window.addEventListener('vanika:auth:logout', handleForcedLogout);
    return () => window.removeEventListener('vanika:auth:logout', handleForcedLogout);
  }, [logout]);

  // Validate existing token on mount
  useEffect(() => {
    const validateSession = async () => {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await apiClient.get<AuthUser>('/auth/me');
        setUser(userData);
        setToken(storedToken);
      } catch {
        // Token is invalid or backend unreachable — clear silently
        clearStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  // Login
  const login = useCallback(async (loginIdentifier: string, password: string): Promise<AuthUser> => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await apiClient.post<{ user: AuthUser; token: string }>(
        '/auth/login',
        { login: loginIdentifier, password },
        true // skipAuth — this is a public endpoint
      );

      setStoredToken(result.token);
      setToken(result.token);
      setUser(result.user);
      return result.user;
    } catch (err: any) {
      const message = err?.message || 'Login failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await apiClient.post<{ user: AuthUser; token: string }>(
        '/auth/register',
        {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          password: data.password,
          role: data.role || 'ELDER',
        },
        true // skipAuth — public endpoint
      );

      setStoredToken(result.token);
      setToken(result.token);
      setUser(result.user);
    } catch (err: any) {
      const message = err?.message || 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const userData = await apiClient.get<AuthUser>('/auth/me');
      setUser(userData);
    } catch {
      // Silently fail — user data will remain stale
    }
  }, [token]);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ───

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
