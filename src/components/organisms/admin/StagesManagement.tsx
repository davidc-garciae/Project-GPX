"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Calendar, Settings, MapPin } from "lucide-react";
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

interface Stage {
  id: number;
  name: string;
  orderNumber: number;
  isNeutralized: boolean;
  event: {
    id: number;
    name: string;
  };
}

interface Event {
  id: number;
  name: string;
}

interface NewStage {
  name: string;
  orderNumber?: number;
  isNeutralized: boolean;
  eventId: number;
}

export function StagesManagement() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [formData, setFormData] = useState<Partial<NewStage>>({});
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Definición de columnas
  const allColumns = [
    { key: "orden", label: "Orden" },
    { key: "nombre", label: "Nombre" },
    { key: "neutralizada", label: "Neutralizada" },
    { key: "acciones", label: "Acciones" },
  ];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns.map((col) => col.key)
  );

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Cargar todos los eventos para el selector
      const eventsResponse = await authFetch("/api/events");
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        // Validación defensiva para asegurar que siempre sea un array
        if (Array.isArray(eventsData)) {
          setEvents(eventsData);
        } else if (Array.isArray(eventsData.content)) {
          setEvents(eventsData.content);
        } else {
          setEvents([]);
        }
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const loadStages = async (eventId: number) => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/stages/byevent/${eventId}`);
      if (!response.ok) {
        throw new Error("Error al cargar etapas");
      }
      const stagesData = await response.json();
      setStages(stagesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (eventId: number) => {
    setSelectedEventId(eventId);
    loadStages(eventId);
  };

  const getNextAvailableOrderNumber = (eventId: number): number => {
    const eventStages = stages.filter((s) => s.event.id === eventId);
    const usedNumbers = eventStages
      .map((s) => s.orderNumber)
      .sort((a, b) => a - b);

    // Buscar el primer número disponible empezando desde 0
    for (let i = 0; i <= usedNumbers.length; i++) {
      if (!usedNumbers.includes(i)) {
        return i;
      }
    }

    // Si todos los números están ocupados, devolver el siguiente
    return usedNumbers.length;
  };

  const handleCreate = () => {
    setEditingStage(null);
    const nextOrderNumber = selectedEventId
      ? getNextAvailableOrderNumber(selectedEventId)
      : 0;
    setFormData({
      eventId: selectedEventId || undefined,
      isNeutralized: false,
      orderNumber: nextOrderNumber,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (stage: Stage) => {
    setEditingStage(stage);
    setFormData({
      name: stage.name,
      orderNumber: stage.orderNumber,
      isNeutralized: stage.isNeutralized,
      eventId: stage.event.id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (stageId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta etapa?")) {
      return;
    }

    try {
      const response = await authFetch(`/api/stages/${stageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar etapa");
      }

      if (selectedEventId) {
        await loadStages(selectedEventId);
      }
      toast.success("Etapa eliminada exitosamente");
    } catch (err) {
      toast.error("Error al eliminar etapa");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.eventId) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Para creación, orderNumber es requerido
    if (
      !editingStage &&
      (formData.orderNumber === undefined || formData.orderNumber < 0)
    ) {
      toast.error(
        "El número de orden es requerido y debe ser mayor o igual a 0"
      );
      return;
    }

    // Validar que el orderNumber sea único en el evento
    if (formData.orderNumber !== undefined) {
      const existingStage = stages.find(
        (stage) =>
          stage.orderNumber === formData.orderNumber &&
          stage.event.id === formData.eventId &&
          (!editingStage || stage.id !== editingStage.id)
      );

      if (existingStage) {
        toast.error(
          `Ya existe una etapa con el número de orden ${formData.orderNumber} en este evento`
        );
        return;
      }
    }

    try {
      const submitData = {
        name: formData.name,
        orderNumber:
          formData.orderNumber !== undefined
            ? formData.orderNumber
            : editingStage?.orderNumber || 0,
        isNeutralized: formData.isNeutralized || false,
        event: { id: formData.eventId },
      };

      const url = editingStage
        ? `/api/stages/${editingStage.id}`
        : "/api/stages";
      const method = editingStage ? "PUT" : "POST";

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          toast.error(
            `Ya existe una etapa con el número de orden ${formData.orderNumber} en este evento`
          );
        } else {
          toast.error(
            `Error al ${editingStage ? "actualizar" : "crear"} etapa`
          );
        }
        return;
      }

      if (selectedEventId) {
        await loadStages(selectedEventId);
      }
      setIsDialogOpen(false);
      setFormData({});
      toast.success(
        `Etapa ${editingStage ? "actualizada" : "creada"} exitosamente`
      );
    } catch (err) {
      toast.error(`Error al ${editingStage ? "actualizar" : "crear"} etapa`);
    }
  };

  const handleToggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

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
          <Button onClick={loadEvents} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Etapas
          </h2>
          <p className="text-muted-foreground">
            Administra las etapas de los eventos
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Etapa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingStage ? "Editar Etapa" : "Nueva Etapa"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nombre de la etapa"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="orderNumber">Número de Orden *</Label>
                      {formData.eventId && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const nextNumber = getNextAvailableOrderNumber(
                              formData.eventId!
                            );
                            setFormData({
                              ...formData,
                              orderNumber: nextNumber,
                            });
                          }}
                          className="text-xs"
                        >
                          Sugerir número
                        </Button>
                      )}
                    </div>
                    <Input
                      id="orderNumber"
                      type="number"
                      min="0"
                      value={
                        formData.orderNumber !== undefined
                          ? formData.orderNumber.toString()
                          : ""
                      }
                      onChange={(e) => {
                        const newOrderNumber =
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value);
                        setFormData({
                          ...formData,
                          orderNumber: newOrderNumber,
                        });
                      }}
                      placeholder="0"
                      required
                      className={
                        formData.orderNumber !== undefined &&
                        formData.eventId &&
                        stages.find(
                          (stage) =>
                            stage.orderNumber === formData.orderNumber &&
                            stage.event.id === formData.eventId &&
                            (!editingStage || stage.id !== editingStage.id)
                        )
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {formData.orderNumber !== undefined &&
                      formData.eventId &&
                      stages.find(
                        (stage) =>
                          stage.orderNumber === formData.orderNumber &&
                          stage.event.id === formData.eventId &&
                          (!editingStage || stage.id !== editingStage.id)
                      ) && (
                        <p className="text-xs text-red-600 mt-1">
                          ⚠️ Ya existe una etapa con este número de orden
                        </p>
                      )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Números usados:{" "}
                      {stages
                        .filter((s) => s.event.id === formData.eventId)
                        .map((s) => s.orderNumber)
                        .sort((a, b) => a - b)
                        .join(", ") || "Ninguno"}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="event">Evento *</Label>
                    <Select
                      value={formData.eventId?.toString() || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, eventId: Number(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar evento" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem
                            key={event.id}
                            value={event.id.toString()}
                          >
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNeutralized"
                      checked={formData.isNeutralized || false}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isNeutralized: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="isNeutralized">Etapa neutralizada</Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingStage ? "Actualizar Etapa" : "Crear Etapa"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {selectedEventId ? (
        <Card className="w-full max-w-none">
          <CardHeader>
            <CardTitle>Etapas del Evento ({stages.length})</CardTitle>
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
                      {visibleColumns.includes("orden") && (
                        <TableHead>Orden</TableHead>
                      )}
                      {visibleColumns.includes("nombre") && (
                        <TableHead>Nombre</TableHead>
                      )}
                      {visibleColumns.includes("neutralizada") && (
                        <TableHead>Estado</TableHead>
                      )}
                      {visibleColumns.includes("acciones") && (
                        <TableHead className="text-right">Acciones</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stages
                      .sort((a, b) => a.orderNumber - b.orderNumber)
                      .map((stage) => (
                        <TableRow key={stage.id}>
                          {visibleColumns.includes("orden") && (
                            <TableCell>
                              <Badge variant="secondary">
                                #{stage.orderNumber}
                              </Badge>
                            </TableCell>
                          )}
                          {visibleColumns.includes("nombre") && (
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {stage.name}
                                </span>
                              </div>
                            </TableCell>
                          )}
                          {visibleColumns.includes("neutralizada") && (
                            <TableCell>
                              {stage.isNeutralized ? (
                                <Badge
                                  variant="outline"
                                  className="text-orange-600"
                                >
                                  Neutralizada
                                </Badge>
                              ) : (
                                <Badge variant="default">Activa</Badge>
                              )}
                            </TableCell>
                          )}
                          {visibleColumns.includes("acciones") && (
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(stage)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(stage.id)}
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

            {stages.length === 0 && !loading && (
              <div className="py-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
                  No hay etapas
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  No se han creado etapas para este evento aún.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-none">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Selecciona un evento</h3>
            <p className="text-muted-foreground">
              Selecciona un evento para ver y gestionar sus etapas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
