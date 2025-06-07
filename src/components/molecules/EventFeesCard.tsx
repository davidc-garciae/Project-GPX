import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/organisms/basic/table";

export function EventFeesCard({ tarifas }: { tarifas: any[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tarifas de inscripción</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fase</TableHead>
              <TableHead>Motos/ATV</TableHead>
              <TableHead>UTV</TableHead>
              <TableHead>Carros</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tarifas.map((t, i) => (
              <TableRow key={i}>
                <TableCell>{t.fase}</TableCell>
                <TableCell>{t.motos}</TableCell>
                <TableCell>{t.utv}</TableCell>
                <TableCell>{t.carros}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
