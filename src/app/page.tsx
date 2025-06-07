"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EventsOverview } from "@/components/organisms/EventsOverview";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/organisms/basic/3d-card";
import { WinnersCard } from "@/components/molecules/WinnersCard";
import { LabelText } from "@/components/atoms/text";
import { Skeleton } from "@/components/atoms/skeleton";
import { Badge } from "@/components/atoms/badge";

interface EventCategory {
  id: number;
  category: {
    id: number;
    name: string;
    details?: string;
  };
}

export default function Page() {
  const [mainEvent, setMainEvent] = useState<any>(null);
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Función para cargar las categorías de un evento
  const loadEventCategories = async (eventId: number) => {
    setLoadingCategories(true);
    try {
      const response = await fetch(`/api/event-categories/byevent/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEventCategories(data || []);
      } else {
        setEventCategories([]);
      }
    } catch (error) {
      console.error("Error cargando categorías del evento:", error);
      setEventCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/events/current")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const event = data[0] || null;
            setMainEvent(event);
            if (event?.id) {
              loadEventCategories(event.id);
            }
          } else if (data && typeof data === "object") {
            setMainEvent(data);
            if (data.id) {
              loadEventCategories(data.id);
            }
          } else {
            setMainEvent(null);
          }
        })
        .catch(() => setMainEvent(null)),
      fetch("/api/events/past")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setWinners(data.slice(0, 3));
          else if (data && typeof data === "object") setWinners([data]);
          else setWinners([]);
        })
        .catch(() => setWinners([])),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 pt-8 text-center md:flex-row md:items-start md:text-left">
      {/* Imagen principal del evento */}
      <div className="flex flex-col items-center w-full max-w-5xl min-w-0 md:flex-1 md:items-stretch">
        {loading ? (
          <Skeleton className="w-full h-[400px] md:h-[500px] rounded-xl" />
        ) : mainEvent && mainEvent.name ? (
          <CardContainer className="w-full h-[400px] md:h-[500px] flex items-center justify-center shadow-md">
            <CardBody className="flex flex-col items-center w-full h-full p-6 text-center border group/card bg-card border-border md:items-start md:text-left">
              <div className="flex flex-col w-full md:flex-row md:items-start md:gap-4">
                <div className="flex-1">
                  <CardItem
                    translateZ={20}
                    className="text-2xl font-bold text-foreground"
                  >
                    {mainEvent.name}
                  </CardItem>
                  <CardItem
                    as="p"
                    className="max-w-2xl mt-2 text-base text-muted-foreground"
                  >
                    {mainEvent.details}
                  </CardItem>
                </div>
                <CardItem
                  translateZ={40}
                  className="flex flex-wrap items-center gap-2 mt-3 md:mt-0 md:ml-4"
                  as="div"
                  style={{ perspective: "800px" }}
                >
                  {loadingCategories ? (
                    <div className="text-sm text-muted-foreground">
                      Cargando categorías...
                    </div>
                  ) : eventCategories.length > 0 ? (
                    <>
                      <CardItem
                        as="span"
                        translateZ={45}
                        className="text-sm font-medium text-muted-foreground"
                      >
                        Categorías:
                      </CardItem>
                      {eventCategories.map((eventCategory) => (
                        <CardItem
                          key={eventCategory.id}
                          translateZ={42}
                          as="span"
                          className="flex"
                          style={{ display: "inline-block", marginRight: 8 }}
                        >
                          <Badge
                            variant="outline"
                            className="text-xs cursor-default"
                          >
                            {eventCategory.category.name}
                          </Badge>
                        </CardItem>
                      ))}
                    </>
                  ) : null}
                </CardItem>
              </div>
              <CardItem
                translateZ={100}
                className="flex items-center justify-center flex-1 w-full mt-4 overflow-hidden rounded-xl"
              >
                <img
                  src={mainEvent.picture}
                  height="1500"
                  width="1500"
                  className="object-cover w-full h-full rounded-xl group-hover/card:shadow-xl max-h-[400px]"
                  alt={mainEvent.name}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    display: "block",
                  }}
                />
              </CardItem>
              <CardItem translateZ={20} className="w-full mt-8">
                <div className="flex items-center justify-between w-full">
                  <Link
                    href={`/eventos/${mainEvent.id}`}
                    className="px-4 py-2 text-xs font-normal transition-colors rounded-xl text-foreground hover:bg-muted"
                  >
                    Ver evento →
                  </Link>
                  <Link
                    href={`/eventos/${mainEvent.id}?tab=participants`}
                    className="px-4 py-2 text-xs font-bold transition-colors rounded-md bg-primary text-primary-foreground hover:bg-primary/80"
                  >
                    Inscribirse
                  </Link>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-40 text-muted-foreground">
            No hay evento principal disponible.
          </div>
        )}
        <LabelText className="mt-8 mb-2">Ganadores</LabelText>
        <div className="grid w-full grid-cols-1 mt-2 sm:grid-cols-2 md:grid-cols-3 gap-7 place-items-center md:place-items-stretch">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-64 max-w-xs rounded-xl" />
            ))
          ) : winners && winners.length > 0 ? (
            winners.map((event) => (
              <div className="w-full max-w-xs" key={event.id}>
                <WinnersCard
                  imageUrl={event.picture}
                  title={event.name}
                  date={new Date(event.startDate).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  eventId={event.id}
                />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-40 col-span-3 text-muted-foreground">
              No hay ganadores disponibles.
            </div>
          )}
        </div>
      </div>
      {/* Barra lateral de eventos */}
      <aside className="flex justify-center w-full max-w-xs mt-8 md:mt-0 md:justify-start">
        {loading ? (
          <div className="flex flex-col w-full gap-6">
            <Skeleton className="w-full h-8 rounded" />
            <Skeleton className="w-full h-40 rounded" />
            <Skeleton className="w-full h-8 mt-8 rounded" />
            <Skeleton className="w-full h-40 rounded" />
          </div>
        ) : (
          <EventsOverview />
        )}
      </aside>
    </div>
  );
}
