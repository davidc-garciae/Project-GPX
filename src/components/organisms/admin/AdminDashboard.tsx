"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, FolderOpen, Trophy, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { authFetch } from "@/utils/authFetch";

interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalCategories: number;
  totalResults: number;
  currentEvents: number;
  pastEvents: number;
  recentUsers: any[];
  recentEvents: any[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Cargar estadísticas básicas
        const [eventsRes, usersRes, categoriesRes, currentEventsRes] =
          await Promise.all([
            authFetch("/api/events"),
            authFetch("/api/users"),
            authFetch("/api/categories"),
            authFetch("/api/events/current"),
          ]);

        if (
          !eventsRes.ok ||
          !usersRes.ok ||
          !categoriesRes.ok ||
          !currentEventsRes.ok
        ) {
          throw new Error("Error al cargar datos del dashboard");
        }

        const [events, users, categories, currentEvents] = await Promise.all([
          eventsRes.json(),
          usersRes.json(),
          categoriesRes.json(),
          currentEventsRes.json(),
        ]);

        // Calcular estadísticas
        const now = new Date();
        const pastEvents = events.filter(
          (event: any) => new Date(event.endDate) < now
        );
        const recentEvents = events.slice(-3); // Últimos 3 eventos

        setStats({
          totalEvents: events.length,
          totalUsers: users.length,
          totalCategories: categories.length,
          totalResults: 0, // Se puede agregar cuando tengamos el endpoint
          currentEvents: currentEvents.length,
          pastEvents: pastEvents.length,
          recentUsers: users.slice(-5), // Últimos 5 usuarios por ID (más recientes)
          recentEvents,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="w-20 h-4 rounded bg-muted animate-pulse"></div>
                <div className="w-4 h-4 rounded bg-muted animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="w-16 h-8 mb-2 rounded bg-muted animate-pulse"></div>
                <div className="w-24 h-3 rounded bg-muted animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="mb-4 text-destructive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Resumen general del sistema</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.currentEvents} activos, {stats.pastEvents} finalizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Categorías de vehículos disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Eventos Activos
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentEvents}</div>
            <p className="text-xs text-muted-foreground">
              Eventos en curso o próximos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actividad reciente */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Eventos recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentEvents.length > 0 ? (
              stats.recentEvents.map((event: any) => (
                <div key={event.id} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {event.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.location} •{" "}
                      {new Date(event.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      new Date(event.startDate) > new Date()
                        ? "default"
                        : "secondary"
                    }
                  >
                    {new Date(event.startDate) > new Date()
                      ? "Próximo"
                      : "Finalizado"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay eventos recientes
              </p>
            )}
          </CardContent>
        </Card>

        {/* Usuarios recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Badge variant={user.admin ? "destructive" : "outline"}>
                    {user.admin ? "Admin" : "Usuario"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay usuarios recientes
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
