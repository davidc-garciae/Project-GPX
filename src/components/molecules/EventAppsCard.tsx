import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";

export function EventAppsCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Apps requeridas</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="ml-4 list-disc">
          <li>WhatsApp</li>
          <li>Google Maps</li>
          <li>RaceTracker (para seguimiento en vivo)</li>
          <li>Roadbook Reader (para navegación digital)</li>
        </ul>
      </CardContent>
    </Card>
  );
}
