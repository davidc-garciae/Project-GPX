"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/basic/table";

interface Participant {
  eventVehicleId: number;
  userId: number;
  userName: string;
  userPicture: string;
  teamName: string;
  vehicleId: number;
  vehicleName: string;
  vehiclePlates: string;
  vehicleSoat: string;
  categoryId: number;
  categoryName: string;
  registrationDate: string;
}

interface ParticipantsTableProps {
  participants: Participant[];
  loading?: boolean;
}

export function ParticipantsTable({
  participants,
  loading = false,
}: ParticipantsTableProps) {
  if (loading) {
    return (
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Participantes Inscritos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="text-muted-foreground">
              Cargando participantes...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (participants.length === 0) {
    return (
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Participantes Inscritos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="text-muted-foreground">
              No hay participantes inscritos aún
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Participantes Inscritos ({participants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table className="min-w-full overflow-hidden text-sm rounded-lg bg-card">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Participante</TableHead>
                <TableHead></TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Placas</TableHead>
                <TableHead>SOAT</TableHead>
                <TableHead>Categoría</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant, index) => (
                <TableRow key={participant.eventVehicleId}>
                  <TableCell className="text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {participant.userName}
                  </TableCell>
                  <TableCell>
                    <div className="relative w-8 h-8 overflow-hidden rounded-full bg-muted">
                      {participant.userPicture && (
                        <Image
                          src={participant.userPicture}
                          alt={participant.userName}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {participant.teamName || "Sin equipo"}
                  </TableCell>
                  <TableCell>{participant.vehicleName}</TableCell>
                  <TableCell>{participant.vehiclePlates}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {participant.vehicleSoat}
                    </span>
                  </TableCell>
                  <TableCell>{participant.categoryName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
