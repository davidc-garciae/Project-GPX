import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User, LoginResponse, ValidationResponse } from "@/types/auth.types";
import { authFetch } from "@/utils/authFetch";
import {
  getAuthToken,
  setAuthToken,
  clearAllSessionData,
  isTokenExpired,
  decodeJWT,
} from "@/utils/auth.utils";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  validateToken: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  clearSession: () => void;
  refreshToken: () => Promise<boolean>;
  getMinutesUntilExpiration: () => number;
  isOnline: boolean;
  isReconnecting: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline, isReconnecting } = useNetworkStatus();

  // Validar token con backend
  const validateToken = useCallback(async (): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    try {
      const response = await authFetch("/api/users/validate-token");
      const data: ValidationResponse = await response.json();

      if (data.valid) {
        setIsAuthenticated(true);
        setUser({
          id: data.userId!,
          email: data.email!,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          admin: !!data.admin,
          authProvider: (data.authProvider as User["authProvider"]) || "LOCAL",
          profileComplete: !!data.profileComplete,
          picture: data.picture || undefined,
        });
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  }, []);

  // Función para refrescar datos completos del usuario
  const refreshUserData = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      const response = await authFetch(`/api/users/${user.id}`);
      if (response.ok) {
        const fullUserData = await response.json();
        setUser(fullUserData);
      }
    } catch (error) {
      console.error("Error al refrescar datos del usuario:", error);
    }
  }, [user?.id]);

  // Login local
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login fallido");
    const data: LoginResponse = await res.json();
    // Guardar token
    setAuthToken(data.token, true);
    // Guardar foto de perfil en localStorage
    if (data.picture) {
      localStorage.setItem("userPicture", data.picture);
    } else {
      localStorage.removeItem("userPicture");
    }
    // Usar directamente la respuesta del login sin validar otra vez
    setIsAuthenticated(true);
    setUser({
      id: data.userId, // LoginResponse siempre tiene userId
      email: email, // Usamos el email del formulario
      firstName: data.firstName || "",
      admin: !!data.admin,
      authProvider: (data.authProvider as User["authProvider"]) || "LOCAL",
      profileComplete: !!data.profileComplete,
      picture: data.picture || undefined,
    });
    setIsLoading(false);
  };

  // Logout unificado
  const logout = async () => {
    try {
      await authFetch("/api/users/logout", { method: "POST" });
    } catch {}
    clearSession();
    localStorage.removeItem("userPicture");
  };

  // Limpiar sesión
  const clearSession = () => {
    clearAllSessionData();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  // Preparación para refresh token (futuro)
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authFetch("/api/users/refresh-token", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.token);
        await validateToken();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Función para minutos hasta expiración
  const getMinutesUntilExpiration = (): number => {
    const token = getAuthToken();
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;
      return Math.floor(timeUntilExpiration / (1000 * 60));
    } catch {
      return 0;
    }
  };

  // Validación automática al iniciar
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await validateToken();
      setIsLoading(false);
    })();
  }, [validateToken]);

  // Monitoreo periódico de sesión (cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline) validateToken();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [validateToken, isOnline]);

  // Pausar monitoreo cuando no hay conexión
  useEffect(() => {
    if (!isOnline) return;
    if (isReconnecting) validateToken();
  }, [isOnline, isReconnecting, validateToken]);

  // Limpiar localStorage de fotos cuando se actualiza el usuario para evitar conflictos
  useEffect(() => {
    if (user && user.picture) {
      // Si el usuario tiene una foto actualizada, limpiar el cache de localStorage
      localStorage.removeItem("userPicture");
    }
  }, [user?.picture]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        validateToken,
        refreshUserData,
        clearSession,
        refreshToken,
        getMinutesUntilExpiration,
        isOnline,
        isReconnecting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return ctx;
}
