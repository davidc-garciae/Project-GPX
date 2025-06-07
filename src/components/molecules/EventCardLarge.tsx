import React from "react";
import Image from "next/image";
import Link from "next/link";

interface EventCardLargeProps {
  event: {
    id: number;
    name: string;
    picture: string;
    startDate: string;
    endDate: string;
    location?: string;
    details?: string;
  };
}

export function EventCardLarge({ event }: EventCardLargeProps) {
  return (
    <Link href={`/eventos/${event.id}`} className="block group">
      <div className="flex flex-col md:flex-row items-center pl-6 border bg-card hover:bg-muted transition-colors shadow-md h-full min-h-[112px] w-full ">
        <div className="flex flex-col items-start flex-1 w-full gap-2">
          <span className="text-lg font-bold truncate text-foreground">
            {event.name}
          </span>
          <div className="text-sm text-muted-foreground">
            {event.startDate} - {event.endDate}
          </div>
          {event.location && (
            <div className="text-sm text-muted-foreground">
              {event.location}
            </div>
          )}
        </div>
        <div className="relative flex-shrink-0 w-full h-28 md:w-48">
          <Image
            src={event.picture}
            alt={event.name}
            fill
            className="object-cover border "
            sizes="(max-width: 768px) 100vw, 192px"
          />
        </div>
      </div>
    </Link>
  );
}
