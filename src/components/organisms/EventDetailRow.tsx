import React from "react";

interface EventDetailRowProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftClass?: string;
  rightClass?: string;
}

export function EventDetailRow({
  left,
  right,
  leftClass = "md:w-3/5",
  rightClass = "md:w-2/5",
}: EventDetailRowProps) {
  return (
    <div className="flex flex-col w-full gap-4 md:flex-row">
      <div className={`w-full ${leftClass}`}>{left}</div>
      <div className={`w-full ${rightClass}`}>{right}</div>
    </div>
  );
}
