"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Users,
  FolderOpen,
  Trophy,
  Settings,
  Gauge,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/atoms/button";
import { SidebarNavigation } from "@/components/molecules/SidebarNavigation";
import { NavigationSection } from "@/types/profile.types";

// Importar los componentes de administración que crearemos
import { EventsManagement } from "@/components/organisms/admin/EventsManagement";
import { UsersManagement } from "@/components/organisms/admin/UsersManagement";
import { CategoriesManagement } from "@/components/organisms/admin/CategoriesManagement";
import { StageResultsManagement } from "@/components/organisms/admin/StageResultsManagement";
import { StagesManagement } from "@/components/organisms/admin/StagesManagement";
import { AdminDashboard } from "@/components/organisms/admin/AdminDashboard";

export default function AdminPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true); // Estado para mostrar/ocultar sidebar
  const [loading, setLoading] = useState(false);

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (!authLoading && isAuthenticated && user && !user.admin) {
      toast.error("No tienes permisos para acceder a esta página");
      window.location.href = "/";
    }
  }, [authLoading, isAuthenticated, user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-32 h-32 mx-auto border-b-2 rounded-full animate-spin border-primary" />
          <p className="mt-4 text-center text-muted-foreground">
            Cargando panel de administración...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="flex flex-col items-center justify-center w-full max-w-xs p-8 text-center shadow bg-card/80 rounded-xl">
          <p className="mb-4 text-lg font-semibold text-destructive">
            No estás autenticado
          </p>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="w-full mt-2"
          >
            Ir a Login
          </Button>
        </div>
      </div>
    );
  }

  if (!user?.admin) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="flex flex-col items-center justify-center w-full max-w-xs p-8 text-center shadow bg-card/80 rounded-xl">
          <p className="mb-4 text-lg font-semibold text-destructive">
            No tienes permisos de administrador
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full mt-2"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const sections: NavigationSection[] = [
    { id: "dashboard", label: "Dashboard", icon: Gauge },
    { id: "events", label: "Gestión de Eventos", icon: Calendar },
    { id: "stages", label: "Gestión de Etapas", icon: Menu },
    { id: "users", label: "Gestión de Usuarios", icon: Users },
    { id: "categories", label: "Gestión de Categorías", icon: FolderOpen },
    { id: "stageresults", label: "Resultados de Etapas", icon: Trophy },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "events":
        return <EventsManagement />;
      case "stages":
        return <StagesManagement />;
      case "users":
        return <UsersManagement />;
      case "categories":
        return <CategoriesManagement />;
      case "stageresults":
        return <StageResultsManagement />;
      case "settings":
        return (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold">
              Configuración del Sistema
            </h2>
            <p className="text-muted-foreground">
              Panel de configuración avanzada (próximamente)
            </p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent/10">
      <div className="container px-4 py-6 mx-auto md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="space-y-0.5 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Panel de Administración
              </h2>
              <p className="text-muted-foreground">
                Gestiona eventos, usuarios, categorías y resultados del sistema.
              </p>
            </div>
            {/* Botón para colapsar/expandir sidebar */}
            <button
              className="p-2 transition-colors border rounded-md lg:hidden border-border bg-card hover:bg-accent"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
          <div className="h-px mb-6 bg-border" />
          <div className="flex flex-col lg:flex-row lg:space-x-12 lg:space-y-0 space-y-8 min-h-[60vh] lg:min-h-[70vh] items-stretch">
            {/* Sidebar con ancho fijo y colapsable */}
            <aside
              className={`transition-all duration-300 lg:w-1/4 lg:min-w-[260px] lg:max-w-[260px] ${
                sidebarOpen
                  ? "block"
                  : "hidden lg:block lg:w-16 lg:min-w-[64px] lg:max-w-[64px]"
              }`}
            >
              <div className="h-full">
                <SidebarNavigation
                  sections={sections}
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                />
              </div>
            </aside>
            <div className="flex-1 min-w-0">{renderActiveSection()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
