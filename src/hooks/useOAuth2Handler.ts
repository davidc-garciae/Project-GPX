"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { setAuthToken } from "@/utils/auth.utils";
import { useAuth } from "@/hooks/useAuth";

export function useOAuth2Handler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { validateToken } = useAuth();

  useEffect(() => {
    const processOAuth2 = async () => {
      const token = searchParams.get("token");
      const userId = searchParams.get("userId");
      const admin = searchParams.get("admin");
      const provider = searchParams.get("provider");
      const profileComplete = searchParams.get("profileComplete");
      const firstName = searchParams.get("firstName");
      const picture = searchParams.get("picture");

      // Solo procesar si hay un token (indica que viene de OAuth2)
      if (token && provider === "google") {
        console.log("🔄 Procesando callback de OAuth2...");

        // Guardar token y datos del usuario
        setAuthToken(token, true);
        
        // Guardar información adicional en localStorage
        if (firstName) localStorage.setItem("firstName", firstName);
        if (picture) localStorage.setItem("userPicture", picture);
        if (userId) localStorage.setItem("userId", userId);
        if (admin) localStorage.setItem("isAdmin", admin);

        // Limpiar los parámetros de la URL para evitar reprocessing
        const newUrl = window.location.pathname;
        router.replace(newUrl);

        // Forzar actualización del contexto de autenticación
        await validateToken();

        console.log("✅ OAuth2 procesado exitosamente");
        
        // Opcionalmente mostrar notificación de éxito
        // toast.success(`¡Bienvenido, ${firstName}!`);
      }
    };
    processOAuth2();
  }, [searchParams, router, validateToken]);
}