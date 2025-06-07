import React from "react";
import { LabelText } from "@/components/atoms/text";
import { EventCard } from "@/components/molecules/EventCard";

interface EventListProps {
  title: string;
  events: Array<{
    imageUrl: string;
    title: string;
    date: string;
  }>;
  className?: string;
}

/**
 * Organism: EventList
 * Muestra un título y una lista de EventCard en fila
 */
export function EventList({ title, events, className = "" }: EventListProps) {
  return (
    <section className={`w-full max-w-md mx-auto ${className}`}>
      <LabelText className="block mb-4">{title}</LabelText>
      <div className="flex flex-col gap-y-[2px]">
        {events.map((event, idx) => (
          <EventCard key={event.title + idx} {...event} />
        ))}
      </div>
    </section>
  );
}
