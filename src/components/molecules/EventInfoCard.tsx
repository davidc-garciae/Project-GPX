"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";
import { Subtitle, Detail } from "@/components/atoms/text";
import { Badge } from "@/components/atoms/badge";

interface EventCategory {
  id: number;
  category: {
    id: number;
    name: string;
    details?: string;
  };
}

export function EventInfoCard({ event }: { event: any }) {
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      if (!event?.id) {
        setLoadingCategories(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/event-categories/byevent/${event.id}`
        );
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

    loadCategories();
  }, [event?.id]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row">
          <img
            src={event.picture}
            alt={event.name}
            className="object-cover w-full h-48 rounded-lg md:w-64"
          />
          <div className="flex-1">
            <Subtitle>Ubicación: {event.location}</Subtitle>
            <br />
            <Detail>
              Fechas: {event.startDate} - {event.endDate}
            </Detail>
            <br />
            <Detail>{event.details}</Detail>

            {/* Categorías del evento */}
            <div className="mt-4">
              <Subtitle className="mb-2">Categorías:</Subtitle>
              {loadingCategories ? (
                <div className="text-sm text-muted-foreground">
                  Cargando categorías...
                </div>
              ) : eventCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2 py-2">
                  {eventCategories.map((eventCategory) => (
                    <Badge key={eventCategory.id} variant="secondary">
                      {eventCategory.category.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No hay categorías asignadas
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
