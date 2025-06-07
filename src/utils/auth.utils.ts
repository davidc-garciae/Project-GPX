// Utilidades para manejo de JWT y sesión
type DecodedJWT = { exp: number; [key: string]: any };

export function decodeJWT(token: string): DecodedJWT | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() / 1000 > decoded.exp;
}

export function getTokenExpiration(token: string): number {
  const decoded = decodeJWT(token);
  return decoded?.exp ? decoded.exp * 1000 : 0;
}

export function shouldWarnExpiration(token: string): boolean {
  const exp = getTokenExpiration(token);
  return exp > 0 && exp - Date.now() < 30 * 60 * 1000; // 30 min
}

export function setAuthToken(token: string, persist: boolean = true) {
  // Siempre limpia el token anterior antes de guardar el nuevo
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
  if (persist) localStorage.setItem("auth_token", token);
  else sessionStorage.setItem("auth_token", token);
}

export function getAuthToken(): string | null {
  // Prioriza localStorage, luego sessionStorage
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
}

export function clearAllSessionData() {
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
}
