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

  useEffect(() => {
    fetch("/api/events/current")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCurrentEvents(data);
        else if (data && typeof data === "object") setCurrentEvents([data]);
        else setCurrentEvents([]);
      });
    fetch("/api/events/past")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPastEvents(data);
        else if (data && typeof data === "object") setPastEvents([data]);
        else setPastEvents([]);
      });
  }, []);

  if (!currentEvents.length && !pastEvents.length) {
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
