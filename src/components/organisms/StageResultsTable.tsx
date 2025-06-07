import React from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/organisms/basic/table";

interface StageTime {
  stageOrder: number;
  elapsedTimeSeconds: number;
  stageResultId: number;
  penaltyWaypointSeconds: number;
  penaltySpeedSeconds: number;
  discountClaimSeconds: number;
  adjustedTimeSeconds: number;
}

// StageResultsTable: agregar prop opcional showCategory y selectedStage
interface StageResultsTableProps {
  results: any[];
  stagesCount: number;
  showCategory?: boolean;
  selectedStage?: number | "all";
  categories?: string[]; // <-- nueva prop opcional
}

function formatTime(seconds: number) {
  if (!seconds) return "-";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const StageResultsTable: React.FC<StageResultsTableProps> = ({
  results,
  stagesCount,
  showCategory,
  selectedStage,
  categories,
}) => {
  // Usar las categorías pasadas por prop si existen, si no calcularlas
  const categoryList =
    categories && categories.length > 0
      ? categories
      : showCategory
      ? []
      : Array.from(new Set(results.map((r) => r.categoryName)));

  // Filtrar resultados por stage si selectedStage es un número
  const filteredResults =
    typeof selectedStage === "number"
      ? results.filter(
          (r) =>
            r.stageTimes &&
            r.stageTimes.some(
              (st: StageTime) => st.stageOrder === selectedStage
            )
        )
      : results;

  // Helper to render stage columns (either all or just selected)
  const renderStageHeaders = () => {
    if (typeof selectedStage === "number") {
      return <th className="px-2 py-2 text-center">Etapa {selectedStage}</th>;
    }
    return Array.from({ length: stagesCount }).map((_, i) => (
      <th key={i} className="px-2 py-2 text-center">
        Etapa {i}
      </th>
    ));
  };

  // Helper para renderizar la columna Total solo si no se está mostrando una etapa específica
  const renderTotalHeader = () => {
    if (typeof selectedStage === "number") return null;
    return <th className="px-2 py-2 text-center">Total</th>;
  };

  const renderTotalCell = (r: any) => {
    if (typeof selectedStage === "number") return null;
    return (
      <td className="px-2 py-2 font-semibold text-center">
        {formatTime(r.totalTime)}
      </td>
    );
  };

  const renderStageCells = (r: any) => {
    if (typeof selectedStage === "number") {
      const stageTime = r.stageTimes.find(
        (st: any) => st.stageOrder === selectedStage
      );
      return (
        <td className="px-2 py-2 text-center">
          {formatTime(stageTime?.adjustedTimeSeconds ?? 0)}
        </td>
      );
    }
    return Array.from({ length: stagesCount }).map((_, i) => {
      const stageTime = r.stageTimes.find((st: any) => st.stageOrder === i);
      return (
        <td key={i} className="px-2 py-2 text-center">
          {formatTime(stageTime?.adjustedTimeSeconds ?? 0)}
        </td>
      );
    });
  };

  if (showCategory) {
    // Tabla general con columna de categoría, foto y equipo
    return (
      <div className="w-full overflow-x-auto">
        <Table className="min-w-full overflow-hidden text-sm border rounded-lg bg-card">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="px-2 py-2 text-left">#</TableHead>
              <TableHead className="px-2 py-2 text-left">Piloto</TableHead>
              <TableHead className="px-2 py-2 text-left"></TableHead>
              <TableHead className="px-2 py-2 text-left">Equipo</TableHead>
              <TableHead className="px-2 py-2 text-left">Vehículo</TableHead>
              <TableHead className="px-2 py-2 text-left">Categoría</TableHead>
              {renderStageHeaders()}
              {renderTotalHeader()}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults
              .sort((a, b) => a.totalTime - b.totalTime)
              .map((r, idx) => (
                <TableRow key={r.vehicleId} className="border-t">
                  <TableCell className="px-2 py-2">{idx + 1}</TableCell>
                  <TableCell className="px-2 py-2 whitespace-nowrap">
                    {r.driverName}
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="relative w-8 h-8 overflow-hidden rounded-full bg-muted">
                      {r.userPicture && (
                        <Image
                          src={r.userPicture}
                          alt={r.driverName}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-2 whitespace-nowrap">
                    {r.teamName}
                  </TableCell>
                  <TableCell className="px-2 py-2 whitespace-nowrap">
                    {r.vehicleName}
                  </TableCell>
                  <TableCell className="px-2 py-2 whitespace-nowrap">
                    {r.categoryName}
                  </TableCell>
                  {renderStageCells(r)}
                  {renderTotalCell(r)}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      {categoryList.map((category) => (
        <div key={category} className="mb-8">
          <h3 className="mb-2 text-base font-semibold text-foreground">
            {category}
          </h3>
          <Table className="min-w-full overflow-hidden text-sm border rounded-lg bg-card">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="px-2 py-2 text-left">#</TableHead>
                <TableHead className="px-2 py-2 text-left">Piloto</TableHead>
                <TableHead className="px-2 py-2 text-left"></TableHead>
                <TableHead className="px-2 py-2 text-left">Equipo</TableHead>
                <TableHead className="px-2 py-2 text-left">Vehículo</TableHead>
                {renderStageHeaders()}
                {renderTotalHeader()}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults
                .filter((r) => r.categoryName === category)
                .sort((a, b) => a.totalTime - b.totalTime)
                .map((r, idx) => (
                  <TableRow key={r.vehicleId} className="border-t">
                    <TableCell className="px-2 py-2">{idx + 1}</TableCell>
                    <TableCell className="px-2 py-2 whitespace-nowrap">
                      {r.driverName}
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <div className="relative w-8 h-8 overflow-hidden rounded-full bg-muted">
                        {r.userPicture && (
                          <Image
                            src={r.userPicture}
                            alt={r.driverName}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-2 whitespace-nowrap">
                      {r.teamName}
                    </TableCell>
                    <TableCell className="px-2 py-2 whitespace-nowrap">
                      {r.vehicleName}
                    </TableCell>
                    {renderStageCells(r)}
                    {renderTotalCell(r)}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};
