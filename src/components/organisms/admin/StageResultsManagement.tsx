"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Trophy,
  Clock,
  MapPin,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { authFetch } from "@/utils/authFetch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/basic/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/organisms/basic/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Checkbox } from "@/components/atoms/checkbox";

interface StageResult {
  id: number;
  stage: {
    id: number;
    name: string;
    orderNumber: number;
    event: {
      id: number;
      name: string;
    };
  };
  vehicle: {
    id: number;
    name: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      picture: string;
      teamName: string;
    };
    category: {
      id: number;
      name: string;
    };
  };
  timestamp: string;
  latitude: number;
  longitude: number;
  elapsedTimeSeconds?: number;
  penaltyWaypoint?: string;
  penaltySpeed?: string;
  discountClaim?: string;
}

interface Stage {
  id: number;
  name: string;
  orderNumber: number;
  event: {
    id: number;
    name: string;
  };
}

interface EventVehicle {
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
}

interface NewStageResult {
  stageId: number;
  vehicleId: number;
  timestamp: string;
  latitude: number;
  longitude: number;
}

interface PenaltyData {
  penaltyWaypoint?: string;
  penaltySpeed?: string;
  discountClaim?: string;
}

export function StageResultsManagement() {
  const [results, setResults] = useState<StageResult[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [eventVehicles, setEventVehicles] = useState<EventVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPenaltyDialogOpen, setIsPenaltyDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<StageResult | null>(null);
  const [formData, setFormData] = useState<Partial<NewStageResult>>({});
  const [penaltyData, setPenaltyData] = useState<PenaltyData>({});
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  // Definición de columnas
  const allColumns = [
    { key: "participante", label: "Participante" },
    { key: "vehiculo", label: "Vehículo" },
    { key: "categoria", label: "Categoría" },
    { key: "etapa", label: "Etapa" },
    { key: "timestamp", label: "Timestamp" },
    { key: "penalizaciones", label: "Penalizaciones" },
    { key: "acciones", label: "Acciones" },
  ];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns.map((col) => col.key)
  );

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Cargar stages para el selector
      const stagesResponse = await authFetch("/api/stages");
      if (stagesResponse.ok) {
        const stagesData = await stagesResponse.json();
        setStages(stagesData);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const loadEventVehicles = async (eventId: number) => {
    try {
      const response = await authFetch(
        `/api/event-vehicles/participants/${eventId}`
      );
      if (response.ok) {
        const vehiclesData = await response.json();
        setEventVehicles(vehiclesData);
      }
    } catch (err) {
      console.error("Error loading event vehicles:", err);
    }
  };

  const loadResults = async (eventId: number) => {
    try {
      setLoading(true);
      // Usar el nuevo endpoint para obtener todos los StageResults del evento
      const response = await authFetch(`/api/stageresults/by-event/${eventId}`);
      if (!response.ok) {
        throw new Error("Error al cargar resultados");
      }
      const resultsData = await response.json();
      setResults(resultsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (eventId: number) => {
    setSelectedEventId(eventId);
    setSelectedStageId(null);
    setSelectedCategoryId(null);
    loadResults(eventId);
    loadEventVehicles(eventId);
  };

  const handleCreate = () => {
    setEditingResult(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (result: StageResult) => {
    setEditingResult(result);
    // Para edición básica (solo datos principales, no penalizaciones)
    setFormData({
      stageId: result.stage.id,
      vehicleId: result.vehicle.id,
      timestamp: new Date(result.timestamp).toISOString().slice(0, 16),
      latitude: result.latitude,
      longitude: result.longitude,
    });
    setIsDialogOpen(true);
  };

  const handleEditPenalties = (result: StageResult) => {
    setEditingResult(result);
    // Convertir Duration ISO 8601 a formato HH:MM:SS para el input
    const convertDurationToTime = (duration: string) => {
      if (!duration) return "";
      if (duration.startsWith("PT")) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
          const hours = parseInt(match[1] || "0");
          const minutes = parseInt(match[2] || "0");
          const seconds = parseInt(match[3] || "0");
          return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
      }
      return duration;
    };

    setPenaltyData({
      penaltyWaypoint: convertDurationToTime(result.penaltyWaypoint || ""),
      penaltySpeed: convertDurationToTime(result.penaltySpeed || ""),
      discountClaim: convertDurationToTime(result.discountClaim || ""),
    });
    setIsPenaltyDialogOpen(true);
  };

  const handleDelete = async (resultId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este resultado?")) {
      return;
    }

    try {
      const response = await authFetch(`/api/stageresults/${resultId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar resultado");
      }

      if (selectedEventId) {
        await loadResults(selectedEventId);
      }
      toast.success("Resultado eliminado exitosamente");
    } catch (err) {
      toast.error("Error al eliminar resultado");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        stageId: formData.stageId,
        vehicleId: formData.vehicleId,
        timestamp: formData.timestamp,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      const url = editingResult
        ? `/api/stageresults/${editingResult.id}`
        : "/api/stageresults";
      const method = editingResult ? "PUT" : "POST";

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(
          `Error al ${editingResult ? "actualizar" : "crear"} resultado`
        );
      }

      if (selectedEventId) {
        await loadResults(selectedEventId);
      }
      setIsDialogOpen(false);
      setFormData({});
      toast.success(
        `Resultado ${editingResult ? "actualizado" : "creado"} exitosamente`
      );
    } catch (err) {
      toast.error(
        `Error al ${editingResult ? "actualizar" : "crear"} resultado`
      );
    }
  };

  const handlePenaltySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingResult) return;

    try {
      // Convertir tiempos a formato Duration - envía PT0S para limpiar penalizaciones
      const formatDuration = (timeString: string) => {
        if (
          !timeString ||
          timeString.trim() === "" ||
          timeString === "00:00:00"
        ) {
          // Enviar PT0S (Duration de 0 segundos) para limpiar/resetear penalización
          return "PT0S";
        }
        // Convertir formato HH:MM:SS a Duration ISO 8601 (PT1H30M45S)
        const [hours, minutes, seconds] = timeString.split(":").map(Number);
        let duration = "PT";
        if (hours > 0) duration += `${hours}H`;
        if (minutes > 0) duration += `${minutes}M`;
        if (seconds > 0) duration += `${seconds}S`;
        return duration === "PT" ? "PT0S" : duration;
      };

      const params = new URLSearchParams();

      const penaltyWaypoint = formatDuration(penaltyData.penaltyWaypoint || "");
      const penaltySpeed = formatDuration(penaltyData.penaltySpeed || "");
      const discountClaim = formatDuration(penaltyData.discountClaim || "");

      // Siempre enviar los parámetros con valores válidos (PT0S para limpiar)
      params.append("penaltyWaypoint", penaltyWaypoint);
      params.append("penaltySpeed", penaltySpeed);
      params.append("discountClaim", discountClaim);

      const response = await authFetch(
        `/api/stageresults/penalizacion/${
          editingResult.id
        }?${params.toString()}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Error al aplicar penalizaciones");
      }

      if (selectedEventId) {
        await loadResults(selectedEventId);
      }
      setIsPenaltyDialogOpen(false);
      setPenaltyData({});
      toast.success("Penalizaciones actualizadas exitosamente");
    } catch (err) {
      toast.error("Error al aplicar penalizaciones");
      console.error("Error:", err);
    }
  };

  const formatDateTime = (timestamp: string) => {
    if (!timestamp) return "-";
    try {
      return new Date(timestamp).toLocaleString("es-ES");
    } catch {
      return timestamp;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return null;
    try {
      // Convertir duración ISO 8601 a formato legible
      if (timeString.startsWith("PT")) {
        const match = timeString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
          const hours = parseInt(match[1] || "0");
          const minutes = parseInt(match[2] || "0");
          const seconds = parseInt(match[3] || "0");
          return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
      }
      // Si es un formato de tiempo estándar
      const time = new Date(`1970-01-01T${timeString}`);
      return time.toLocaleTimeString("es-ES", { hour12: false });
    } catch {
      return timeString;
    }
  };

  const formatLocation = (lat: number, lng: number) => {
    if (!lat || !lng) return "-";
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Obtener eventos únicos de los stages
  const events = stages.reduce((acc, stage) => {
    if (stage.event && stage.event.id && stage.event.name) {
      const eventExists = acc.find((e) => e.id === stage.event.id);
      if (!eventExists) {
        acc.push(stage.event);
      }
    }
    return acc;
  }, [] as Array<{ id: number; name: string }>);

  // Obtener lista de etapas y categorías únicas de los resultados actuales
  const stageOptions = Array.from(
    new Set(
      results
        .map((r) =>
          r.stage?.id && r.stage?.name ? `${r.stage.id}|${r.stage.name}` : null
        )
        .filter(Boolean)
    )
  ).map((s) => {
    const [id, name] = s!.split("|");
    return { id: Number(id), name };
  });
  const categoryOptions = Array.from(
    new Set(
      results
        .map((r) =>
          r.vehicle?.category?.id && r.vehicle?.category?.name
            ? `${r.vehicle.category.id}|${r.vehicle.category.name}`
            : null
        )
        .filter(Boolean)
    )
  ).map((c) => {
    const [id, name] = c!.split("|");
    return { id: Number(id), name };
  });

  // Filtrar resultados según etapa y categoría seleccionadas
  const filteredResults = results.filter((result) => {
    const stageMatch = selectedStageId
      ? result.stage?.id === selectedStageId
      : true;
    const categoryMatch = selectedCategoryId
      ? result.vehicle?.category?.id === selectedCategoryId
      : true;
    return stageMatch && categoryMatch;
  });

  if (loading && !selectedEventId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="w-48 h-8 rounded bg-muted animate-pulse"></div>
            <div className="w-64 h-4 mt-2 rounded bg-muted animate-pulse"></div>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded bg-muted animate-pulse"
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="mb-4 text-destructive">{error}</p>
          <Button onClick={loadInitialData} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Resultados de Etapas
          </h2>
          <p className="text-muted-foreground">
            Administra los resultados de las etapas de los eventos
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Select
            value={selectedEventId?.toString() || ""}
            onValueChange={(value) => handleEventSelect(Number(value))}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Seleccionar evento..." />
            </SelectTrigger>
            <SelectContent>
              {events
                .filter((event) => event && event.id && event.name)
                .map((event) => (
                  <SelectItem key={event.id} value={event.id.toString()}>
                    {event.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Selector de columnas */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" /> Columnas
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="mb-2 font-semibold">Mostrar columnas</div>
              <div className="space-y-1">
                {allColumns.map((col) => (
                  <div key={col.key} className="flex items-center gap-2">
                    <Checkbox
                      id={`col-${col.key}`}
                      checked={visibleColumns.includes(col.key)}
                      onCheckedChange={() => handleToggleColumn(col.key)}
                    />
                    <Label htmlFor={`col-${col.key}`}>{col.label}</Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {selectedEventId && (
            <>
              {/* Diálogo para crear/editar resultado básico */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Resultado
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingResult ? "Editar Resultado" : "Nuevo Resultado"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="stage">Etapa</Label>
                      <Select
                        value={formData.stageId?.toString() || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, stageId: Number(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar etapa" />
                        </SelectTrigger>
                        <SelectContent>
                          {stages
                            .filter(
                              (stage) =>
                                stage &&
                                stage.event &&
                                stage.event.id === selectedEventId
                            )
                            .map((stage) => (
                              <SelectItem
                                key={stage.id}
                                value={stage.id.toString()}
                              >
                                Etapa {stage.orderNumber}: {stage.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="vehicle">Vehículo</Label>
                      <Select
                        value={formData.vehicleId?.toString() || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, vehicleId: Number(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar vehículo" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventVehicles
                            .filter((vehicle) => vehicle && vehicle.vehicleId)
                            .map((vehicle) => (
                              <SelectItem
                                key={vehicle.vehicleId}
                                value={vehicle.vehicleId.toString()}
                              >
                                {vehicle.userName || "N/A"} -{" "}
                                {vehicle.vehicleName || "N/A"}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timestamp">Fecha y Hora</Label>
                      <Input
                        id="timestamp"
                        type="datetime-local"
                        value={formData.timestamp?.slice(0, 16) || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            timestamp: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="latitude">Latitud</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            latitude: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitud</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            longitude: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 py-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                      {editingResult
                        ? "Actualizar Resultado"
                        : "Crear Resultado"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Diálogo para editar penalizaciones */}
              <Dialog
                open={isPenaltyDialogOpen}
                onOpenChange={setIsPenaltyDialogOpen}
              >
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      Editar Penalizaciones y Descuentos
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Participante: {editingResult?.vehicle?.user?.firstName}{" "}
                      {editingResult?.vehicle?.user?.lastName} - Etapa:{" "}
                      {editingResult?.stage?.name}
                    </p>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="penaltyWaypoint">
                          Penalización por Waypoint
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setPenaltyData({
                              ...penaltyData,
                              penaltyWaypoint: "",
                            })
                          }
                        >
                          Limpiar
                        </Button>
                      </div>
                      <Input
                        id="penaltyWaypoint"
                        type="time"
                        step="1"
                        value={penaltyData.penaltyWaypoint || ""}
                        onChange={(e) =>
                          setPenaltyData({
                            ...penaltyData,
                            penaltyWaypoint: e.target.value,
                          })
                        }
                        placeholder="00:00:00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Formato: HH:MM:SS (ej: 00:05:30 = 5 min 30 seg). Vacío o
                        00:00:00 elimina la penalización.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="penaltySpeed">
                          Penalización por Velocidad
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setPenaltyData({
                              ...penaltyData,
                              penaltySpeed: "",
                            })
                          }
                        >
                          Limpiar
                        </Button>
                      </div>
                      <Input
                        id="penaltySpeed"
                        type="time"
                        step="1"
                        value={penaltyData.penaltySpeed || ""}
                        onChange={(e) =>
                          setPenaltyData({
                            ...penaltyData,
                            penaltySpeed: e.target.value,
                          })
                        }
                        placeholder="00:00:00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Formato: HH:MM:SS (ej: 00:02:15 = 2 min 15 seg). Vacío o
                        00:00:00 elimina la penalización.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="discountClaim">
                          Descuento por Reclamo
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setPenaltyData({
                              ...penaltyData,
                              discountClaim: "",
                            })
                          }
                        >
                          Limpiar
                        </Button>
                      </div>
                      <Input
                        id="discountClaim"
                        type="time"
                        step="1"
                        value={penaltyData.discountClaim || ""}
                        onChange={(e) =>
                          setPenaltyData({
                            ...penaltyData,
                            discountClaim: e.target.value,
                          })
                        }
                        placeholder="00:00:00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Formato: HH:MM:SS (ej: 00:01:00 = 1 minuto de
                        descuento). Vacío o 00:00:00 elimina el descuento.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 py-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPenaltyData({
                          penaltyWaypoint: "",
                          penaltySpeed: "",
                          discountClaim: "",
                        });
                      }}
                    >
                      Limpiar Todo
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsPenaltyDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handlePenaltySubmit}>
                        Aplicar Cambios
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Filtros por etapa y categoría */}
      {selectedEventId &&
        (stageOptions.length > 0 || categoryOptions.length > 0) && (
          <div className="flex flex-wrap items-center gap-4 mb-2">
            {stageOptions.length > 0 && (
              <div className="min-w-[200px]">
                <Label className="block mb-1">Filtrar por etapa</Label>
                <Select
                  value={selectedStageId?.toString() || "all"}
                  onValueChange={(value) =>
                    setSelectedStageId(value === "all" ? null : Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las etapas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las etapas</SelectItem>
                    {stageOptions.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id.toString()}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {categoryOptions.length > 0 && (
              <div className="min-w-[200px]">
                <Label className="block mb-1">Filtrar por categoría</Label>
                <Select
                  value={selectedCategoryId?.toString() || "all"}
                  onValueChange={(value) =>
                    setSelectedCategoryId(
                      value === "all" ? null : Number(value)
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

      {selectedEventId ? (
        <Card className="w-full max-w-none">
          <CardHeader>
            <CardTitle>
              Resultados de Etapas ({filteredResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded bg-muted animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.includes("participante") && (
                        <TableHead>Participante</TableHead>
                      )}
                      {visibleColumns.includes("vehiculo") && (
                        <TableHead>Vehículo</TableHead>
                      )}
                      {visibleColumns.includes("categoria") && (
                        <TableHead>Categoría</TableHead>
                      )}
                      {visibleColumns.includes("etapa") && (
                        <TableHead>Etapa</TableHead>
                      )}
                      {visibleColumns.includes("timestamp") && (
                        <TableHead>Timestamp</TableHead>
                      )}
                      {visibleColumns.includes("penalizaciones") && (
                        <TableHead>Penalizaciones</TableHead>
                      )}
                      {visibleColumns.includes("acciones") && (
                        <TableHead className="text-right">Acciones</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        {visibleColumns.includes("participante") && (
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {result.vehicle?.user?.picture && (
                                <img
                                  src={result.vehicle.user.picture}
                                  alt="Avatar"
                                  className="object-cover object-center w-8 h-8 border rounded-full bg-muted border-border"
                                  style={{
                                    aspectRatio: "1 / 1",
                                    minWidth: 32,
                                    minHeight: 32,
                                    maxWidth: 32,
                                    maxHeight: 32,
                                  }}
                                />
                              )}
                              <div>
                                <p className="font-medium">
                                  {result.vehicle?.user?.firstName || ""}{" "}
                                  {result.vehicle?.user?.lastName || ""}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {result.vehicle?.user?.teamName ||
                                    "Sin equipo"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("vehiculo") && (
                          <TableCell>
                            <p className="font-medium">
                              {result.vehicle?.name || "N/A"}
                            </p>
                          </TableCell>
                        )}
                        {visibleColumns.includes("categoria") && (
                          <TableCell>
                            {result.vehicle?.category?.name || "N/A"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("etapa") && (
                          <TableCell>{result.stage?.name || "N/A"}</TableCell>
                        )}
                        {visibleColumns.includes("timestamp") && (
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                              {formatDateTime(result.timestamp)}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("penalizaciones") && (
                          <TableCell>
                            <div className="space-y-1">
                              {result.penaltyWaypoint && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  WP: {formatTime(result.penaltyWaypoint)}
                                </Badge>
                              )}
                              {result.penaltySpeed && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Vel: {formatTime(result.penaltySpeed)}
                                </Badge>
                              )}
                              {result.discountClaim && (
                                <Badge variant="default" className="text-xs">
                                  Desc: {formatTime(result.discountClaim)}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("acciones") && (
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(result)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPenalties(result)}
                              >
                                ⚖️
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(result.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {filteredResults.length === 0 && !loading && (
              <div className="py-8 text-center">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
                  No hay resultados
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  No se han registrado resultados para este evento aún.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-none">
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Selecciona un evento</h3>
            <p className="text-muted-foreground">
              Selecciona un evento para ver y gestionar los resultados de sus
              etapas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
