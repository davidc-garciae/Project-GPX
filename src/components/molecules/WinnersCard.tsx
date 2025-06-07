import React from "react";
import Image from "next/image";
import Link from "next/link";

interface WinnersCardProps {
  imageUrl: string;
  title: string;
  date: string;
  eventId: number;
}

export function WinnersCard({
  imageUrl,
  title,
  date,
  eventId,
}: WinnersCardProps) {
  return (
    <Link
      href={`/eventos/${eventId}?tab=results&stage=all&category=general`}
      className="group"
      tabIndex={0}
    >
      <div className="flex flex-col w-full max-w-xs overflow-hidden transition-colors duration-500 shadow-md bg-card group-hover:bg-primary/10 group-focus:ring-2 group-focus:ring-primary">
        <div className="relative w-full h-40">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 640px) 100vw, 400px"
            priority={false}
          />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <span className="text-lg font-bold truncate text-foreground">
            {title}
          </span>
          <span className="text-sm truncate text-muted-foreground">{date}</span>
        </div>
      </div>
    </Link>
  );
}
