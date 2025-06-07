import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";

export function EventPaymentCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Medios de pago</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <b>Turismo:</b> Transferencia bancaria, tarjeta de crédito, efectivo
          en el vivac.
          <br />
          <b>Competencia:</b> Transferencia bancaria, tarjeta de crédito, pago
          en línea.
          <br />
        </div>
      </CardContent>
    </Card>
  );
}
