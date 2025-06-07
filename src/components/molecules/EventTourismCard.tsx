import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";
import Link from "next/link";

export function EventTourismCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Turismo: Vivac en Buga</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          El Rally Raid Valle 2025 solo tendrá un vivac en la ciudad de Buga,
          exactamente dentro del histórico hotel Guadalajara de Buga, que cuenta
          con amplios espacios para poder ubicarnos y compartir con toda la
          familia del rally.
          <br />
          <Link
            href="https://darien.pro/vivac"
            target="_blank"
            className="text-blue-600 underline"
          >
            Ver ubicación
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
