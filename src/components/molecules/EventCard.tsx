/**
 * next.config.js debe incluir:
 *
 * module.exports = {
 *   images: {
 *     domains: ["images.unsplash.com", "plus.unsplash.com", "unsplash.com"],
 *   },
 * };
 */

import React from "react";
import Image from "next/image";
import { Subtitle, Detail } from "@/components/atoms/text";
import { Card } from "@/components/molecules/basic/card";
import Link from "next/link";

interface EventCardProps {
  imageUrl: string;
  title: string;
  date: string;
  id?: number;
}

export function EventCard({ imageUrl, title, date, id }: EventCardProps) {
  return (
    <Link href={id ? `/eventos/${id}` : "#"} tabIndex={0} className="group">
      <Card className="flex items-center w-full max-w-xs gap-4 p-2 transition-colors duration-500 rounded-none shadow-none bg-card group-hover:bg-primary/10 hover:cursor-pointer group-focus:ring-2 group-focus:ring-primary">
        <div className="flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            width={100}
            height={100}
            className="object-cover rounded-lg w-14 h-14"
          />
        </div>
        <div className="flex flex-col gap-2 overflow-hidden">
          <Subtitle className="truncate">{title}</Subtitle>
          <Detail className="truncate">{date}</Detail>
        </div>
      </Card>
    </Link>
  );
}
