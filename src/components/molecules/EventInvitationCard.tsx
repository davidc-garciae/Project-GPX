import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";
import Link from "next/link";

export function EventInvitationCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Invitación al evento</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          Te invitamos a ver otros videos del rally Darién y a suscribirte a
          nuestro canal de Youtube:
          <br />
          <Link
            href="https://www.youtube.com/darienrally"
            target="_blank"
            className="text-blue-600 underline"
          >
            YouTube Darién Rally
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
