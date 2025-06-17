"use client";
import React, { useEffect, useState } from "react";
import { EventList } from "@/components/organisms/EventList";
import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";

/**
 * Organismo reutilizable: muestra listas de eventos próximos y completados.
 * Uso: <EventsOverview />
 */
export function EventsOverview() {
  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // URL base del backend
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      console.log("🔍 EventsOverview: Cargando eventos...");

      try {
        // Cargar eventos actuales
        const currentUrl = `${backendUrl}/api/events/current`;
        console.log(
          `📡 EventsOverview: Petición eventos actuales a: ${currentUrl}`
        );

        const currentResponse = await fetch(currentUrl);
        console.log(`📊 EventsOverview: Respuesta eventos actuales:`, {
          status: currentResponse.status,
          ok: currentResponse.ok,
        });

        if (currentResponse.ok) {
          const currentData = await currentResponse.json();
          console.log(
            `✅ EventsOverview: Eventos actuales cargados:`,
            currentData
          );

          if (Array.isArray(currentData)) {
            setCurrentEvents(currentData);
          } else if (currentData && typeof currentData === "object") {
            setCurrentEvents([currentData]);
          } else {
            setCurrentEvents([]);
          }
        } else {
          console.error(
            `❌ EventsOverview: Error eventos actuales: ${currentResponse.status}`
          );
          setCurrentEvents([]);
        }

        // Cargar eventos pasados
        const pastUrl = `${backendUrl}/api/events/past`;
        console.log(
          `📡 EventsOverview: Petición eventos pasados a: ${pastUrl}`
        );

        const pastResponse = await fetch(pastUrl);
        console.log(`📊 EventsOverview: Respuesta eventos pasados:`, {
          status: pastResponse.status,
          ok: pastResponse.ok,
        });

        if (pastResponse.ok) {
          const pastData = await pastResponse.json();
          console.log(`✅ EventsOverview: Eventos pasados cargados:`, pastData);

          if (Array.isArray(pastData)) {
            setPastEvents(pastData);
          } else if (pastData && typeof pastData === "object") {
            setPastEvents([pastData]);
          } else {
            setPastEvents([]);
          }
        } else {
          console.error(
            `❌ EventsOverview: Error eventos pasados: ${pastResponse.status}`
          );
          setPastEvents([]);
        }
      } catch (error) {
        console.error("💥 EventsOverview: Error cargando eventos:", error);
        setCurrentEvents([]);
        setPastEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 max-w-xs items-start justify-center min-h-[300px] gap-8 w-full">
        <div className="w-full">
          <div className="w-2/3 h-6 mb-2">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="flex flex-col w-full gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-full h-16 mb-2">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        <Skeleton className="w-full h-10 mt-1 mb-8 rounded-lg" />
        <div className="w-full">
          <div className="w-2/3 h-6 mb-2">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="flex flex-col w-full gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-full h-16 mb-2">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 max-w-xs items-center justify-center min-h-[300px]">
      <EventList
        className=""
        title="Eventos Próximos"
        events={currentEvents.map((e) => ({
          imageUrl: e.picture,
          title: e.name,
          date: new Date(e.startDate).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          id: e.id,
        }))}
      />
      <Button
        asChild
        type="button"
        variant="outline"
        className="flex items-center justify-center w-full mt-1 mb-8"
      >
        <Link href="/eventos">Ver todos los eventos</Link>
      </Button>
      <EventList
        title="Eventos Completados"
        events={pastEvents.map((e) => ({
          imageUrl: e.picture,
          title: e.name,
          date: new Date(e.startDate).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          id: e.id,
        }))}
      />
    </div>
  );
}
