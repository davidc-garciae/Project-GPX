import React from "react";
import { EventCardLarge } from "@/components/molecules/EventCardLarge";
import { LabelText } from "@/components/atoms/text";
import { Skeleton } from "@/components/atoms/skeleton";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default async function EventosPage() {
  // Fetch eventos actuales y pasados desde la API real (server-side: usar URL absoluta)
  const currentRes = await fetch(`${baseUrl}/api/events/current`, {
    cache: "no-store",
  });
  const currentData = await currentRes.json();
  // Asegurar que currentEvents siempre es un array
  const currentEvents = Array.isArray(currentData)
    ? currentData
    : currentData && typeof currentData === "object"
    ? [currentData]
    : [];

  const pastRes = await fetch(`${baseUrl}/api/events/past`, {
    cache: "no-store",
  });
  const pastData = await pastRes.json();
  // Asegurar que pastEvents siempre es un array
  const pastEvents = Array.isArray(pastData)
    ? pastData
    : pastData && typeof pastData === "object"
    ? [pastData]
    : [];

  // Simulación de loading: muestra skeletons si ambos arrays están vacíos
  const isLoading = currentEvents.length === 0 && pastEvents.length === 0;

  return (
    <div className="flex flex-col w-full max-w-6xl gap-8 py-8 mx-auto md:flex-row">
      {/* Próximos eventos */}
      <section className="flex-1">
        <LabelText className="mt-8 text-[12px]">Próximos Eventos</LabelText>
        <div className="flex flex-col gap-1 mt-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="w-full mb-2 h-28 md:h-32 rounded-xl" />
              </div>
            ))
          ) : currentEvents.length === 0 ? (
            <div className="text-muted-foreground">
              No hay eventos próximos.
            </div>
          ) : (
            currentEvents.map((event) => (
              <EventCardLarge
                key={event.id || event.name || event.startDate}
                event={event}
              />
            ))
          )}
        </div>
      </section>
      {/* Eventos completados */}
      <section className="flex-1">
        <LabelText className="mt-8 text-[12px]">Eventos Completados</LabelText>
        <div className="flex flex-col gap-1 mt-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="w-full mb-2 h-28 md:h-32 rounded-xl" />
              </div>
            ))
          ) : pastEvents.length === 0 ? (
            <div className="text-muted-foreground">
              No hay eventos completados.
            </div>
          ) : (
            pastEvents.map((event) => (
              <EventCardLarge
                key={event.id || event.name || event.startDate}
                event={event}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
