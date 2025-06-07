import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";

export function EventDetailsFullCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Muchos detalles</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          Atención, guerreros del rally colombiano! El rugido de los motores se
          acerca con la Tercera Válida del Campeonato Colombiano de Rally Raid
          Darién, y este año, del 30 de mayo al 2 de junio, la adrenalina
          conquistará el corazón del Valle del Cauca. ¡Regresamos por tercer año
          consecutivo, esta vez para desafiar los límites en la histórica ciudad
          de Buga!
          <br />
          <br />
          Dejamos atrás la indómita belleza del Meta y la tierra resbaladiza y
          empinada de Cundinamarca para sumergirnos en los paisajes
          vallecaucanos, donde una nueva y electrizante aventura espera a cada
          tripulación. Prepárense para una épica batalla contra el cronómetro y
          una exigente navegación a través de terrenos que pondrán a prueba su
          temple y habilidad al volante.
          <br />
          <br />
          El campamento base, epicentro de la acción, vibrará con las revisiones
          técnicas y administrativas en el vivac de Buga, donde también se
          encenderá la chispa de la competencia con el prólogo y la largada de
          las especiales. Tras la partida del último piloto, el equipo de
          logística, los acompañantes y los equipos de asistencia estarán
          pendientes para vivir intensamente cada kilómetro de esta desafiante
          contienda como si se trataran de los mismos pilotos.
          <br />
          <br />
          Fieles a la esencia del Darién, desvelaremos los tesoros ocultos de
          una Colombia inexplorada, esa tierra de secretos y maravillas que se
          irán revelando curva a curva en el implacable roadbook.
        </div>
      </CardContent>
    </Card>
  );
}
