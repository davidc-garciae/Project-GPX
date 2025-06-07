import { getAuthToken, clearAllSessionData } from "./auth.utils";

export interface AuthFetchOptions extends RequestInit {
  skipAuth?: boolean;
  retryOnAuth?: boolean;
}

/**
 * Wrapper para fetch que añade el token automáticamente y maneja errores 401 globalmente.
 * Usa directamente la URL del backend para evitar problemas de proxy.
 */
export async function authFetch(
  url: string,
  options: AuthFetchOptions = {}
): Promise<Response> {
  // Enforce uso de rutas relativas /api/*
  if (!url.startsWith("/api/")) {
    throw new Error(
      `authFetch solo acepta rutas que empiecen con /api/. Recibido: ${url}`
    );
  }

  // Construir URL completa del backend
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const fullUrl = `${backendUrl}${url}`;

  const { skipAuth = false, retryOnAuth = true, ...fetchOptions } = options;

  if (!skipAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No hay token de autenticación disponible");
    }

    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  console.log(`🔍 AuthFetch: ${fetchOptions.method || 'GET'} ${fullUrl}`);

  const response = await fetch(fullUrl, fetchOptions);

  console.log(`📡 Response: ${response.status} ${response.statusText}`);

  if (response.status === 401 && retryOnAuth && !skipAuth) {
    clearAllSessionData();
    throw new Error("Token inválido o expirado");
  }

  return response;
}
