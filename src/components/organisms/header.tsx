import React from "react";
import { ThemeToggleButton } from "@/components/atoms/ThemeToggleButton";
import { ColorThemeSelect } from "@/components/molecules/ColorThemeSelect";
import Link from "next/link";
import { Button } from "../atoms/button";
import { useAuth } from "@/hooks/useAuth";
import { HeaderUserMenu } from "@/components/molecules/HeaderUserMenu";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  // Validación y construcción del menú
  const userMenuData = React.useMemo(() => {
    // Verificar que tenemos los datos mínimos necesarios
    if (!user || !user.email || !isAuthenticated) {
      return null;
    }

    // Construir nombre de forma segura
    const firstName = user.firstName?.trim() || "";
    const lastName = user.lastName?.trim() || "";
    const displayName = firstName + (lastName ? ` ${lastName}` : "");

    // Si no hay nombre, usar el email como fallback
    const finalName = displayName.trim() || user.email.split("@")[0];

    return {
      name: finalName,
      email: user.email,
      avatar: user.picture || "/avatar.webp",
      admin: user.admin, // <-- Propagamos el flag admin
    };
  }, [user, isAuthenticated]);

  return (
    <header
      className={`sticky top-0 z-5 flex items-center justify-between w-full gap-4 px-6 py-3 border-b shadow-sm bg-card/80 dark:bg-card/80 backdrop-blur-sm border-border ${className}`.trim()}
    >
      <Link href="/">
        <div
          className="transition-transform duration-300 hover:scale-110"
          style={{
            height: 42,
            width: "auto",
            overflow: "hidden",
            display: "flex",
            alignItems: "start",
          }}
        >
          <img
            src="/Logo.webp"
            alt="Logo Darien Rally Raid"
            className="object-cover w-auto h-20"
            style={{ objectPosition: "top" }}
          />
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggleButton />
        <ColorThemeSelect />
        {/* Lógica de renderizado del usuario */}
        {isLoading ? (
          // Mostrar loading mientras se valida
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        ) : isAuthenticated && userMenuData ? (
          // Usuario autenticado con datos válidos
          <HeaderUserMenu user={userMenuData} onLogout={logout} />
        ) : (
          // No autenticado o sin datos válidos
          <Link href="/login">
            <Button variant="default" className="inline-flex">
              Iniciar sesión
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
