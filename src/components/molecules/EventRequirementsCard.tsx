import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";

export function EventRequirementsCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Requerimientos mínimos para participar</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <b>SI VAS A COMPETIR</b>
          <br />
          - Tener experiencia como corredor de Rally Raid (haber participado y
          terminado al menos una válida en Rally Darien o el Vultur Rally en
          Colombia o algún rally reconocido del exterior).
          <br />
          - Vehículo en excelente estado técnico. Debe pasar la revisión técnica
          para poder tomar la largada.
          <br />
          - Casco certificado es de uso obligatorio para pilotos y copilotos,
          incluidos los de camionetas y carros 4x4.
          <br />- Para los pilotos de motos deben tener botas altas
          (preferiblemente tipo Enduro), guantes, pantalón y body armor o
          chaqueta de protección.
        </div>
      </CardContent>
    </Card>
  );
}
