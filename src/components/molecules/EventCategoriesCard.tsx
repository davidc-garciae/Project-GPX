import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";

export function EventCategoriesCard({ stages }: { stages: any[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Categorías / Etapas</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="ml-4 list-disc">
          {stages.map((stage, idx) => {
            // Extraer nombre después del primer guion
            const nameParts = stage.name.split("-");
            const displayName =
              nameParts.length > 1
                ? nameParts.slice(1).join("-").trim()
                : stage.name;
            return (
              <li key={stage.id}>
                {`Etapa ${idx} - ${displayName}`}
                {stage.neutralized ? " (Neutralizada)" : ""}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
