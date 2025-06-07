// Tipos globales de autenticación
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  identification?: string;
  phone?: string;
  role?: string;
  birthdate?: string; // ISO date string
  typeOfId?: string;
  teamName?: string;
  eps?: string;
  rh?: string;
  emergencyPhone?: string;
  alergies?: string;
  wikiloc?: string;
  insurance?: string; // file path
  terrapirata?: string;
  instagram?: string;
  facebook?: string;
  picture?: string; // file path
  admin: boolean;
  authProvider: "LOCAL" | "GOOGLE";
  profileComplete: boolean;
}

export interface LoginResponse {
  token: string;
  userId: number;
  admin: boolean;
  authProvider: string;
  profileComplete: boolean;
  firstName: string;
  picture?: string; // ← Añadido para soportar avatar
}

export interface LogoutResponse {
  message: string;
  provider: "LOCAL" | "GOOGLE";
  user: string;
  userId?: number;
  requiresGoogleLogout: boolean;
  timestamp: number;
  success: boolean;
}

export interface ValidationResponse {
  valid: boolean;
  userId?: number;
  email?: string;
  firstName?: string;    // ← NUEVO
  lastName?: string;     // ← NUEVO
  admin?: boolean;
  authProvider?: string;
  profileComplete?: boolean;
  picture?: string;      // ← NUEVO
  message?: string;
}

export interface AuthError {
  message: string;
  code?: string;
  statusCode?: number;
}
