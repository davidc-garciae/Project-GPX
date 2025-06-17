"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Settings,
  Link,
  X,
  Eye,
  Image,
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
import { Textarea } from "@/components/atoms/textarea";
import { Label } from "@/components/atoms/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Checkbox } from "@/components/atoms/checkbox";

interface Event {
  id: number;
  name: string;
  details: string;
  startDate: string;
  endDate: string;
  location: string;
  picture: string;
}

interface EventCategory {
  id: number;
  event: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [eventStages, setEventStages] = useState<{ [eventId: number]: number }>(
    {}
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEventForImage, setSelectedEventForImage] =
    useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [imageUrl, setImageUrl] = useState("");

  // Definición de columnas
  const allColumns = [
    { key: "evento", label: "Evento" },
    { key: "fechaInicio", label: "Fecha Inicio" },
    { key: "fechaFin", label: "Fecha Fin" },
    { key: "stages", label: "Etapas" },
    { key: "ubicacion", label: "Ubicación" },
    { key: "categorias", label: "Categorías" },
    { key: "estado", label: "Estado" },
    { key: "acciones", label: "Acciones" },
  ];
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "evento",
    "fechaInicio",
    "fechaFin",
    "stages",
    "estado",
    "acciones",
  ]);

  useEffect(() => {
    loadEvents();
    loadEventCategories();
    loadCategories();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await authFetch("/api/events");
      if (!response.ok) {
        throw new Error("Error al cargar eventos");
      }
      const eventsData = await response.json();
      // Validación defensiva para asegurar que siempre sea un array
      if (Array.isArray(eventsData)) {
        setEvents(eventsData);
        loadEventStages(eventsData);
      } else if (Array.isArray(eventsData.events)) {
        setEvents(eventsData.events);
        loadEventStages(eventsData.events);
      } else if (Array.isArray(eventsData.content)) {
        setEvents(eventsData.content);
        loadEventStages(eventsData.content);
      } else {
        setEvents([]);
        setError("La respuesta de eventos no es válida");
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const loadEventCategories = async () => {
    try {
      const response = await authFetch("/api/event-categories");
      if (response.ok) {
        const categoriesData = await response.json();
        setEventCategories(categoriesData);
      }
    } catch (err) {
      console.error("Error al cargar categorías de eventos:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await authFetch("/api/categories");
      if (response.ok) {
        const categoriesData = await response.json();
        console.log("Categorías cargadas:", categoriesData); // Debug
        // Filtramos solo las categorías activas, o si no existe isActive, las mostramos todas
        setCategories(
          categoriesData.filter((cat: Category) => cat.isActive !== false)
        );
      } else {
        console.error(
          "Error al cargar categorías:",
          response.status,
          response.statusText
        );
      }
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  const loadEventStages = async (eventsList: Event[]) => {
    try {
      const stagesCount: { [eventId: number]: number } = {};

      // Cargar stages para cada evento
      await Promise.all(
        eventsList.map(async (event) => {
          try {
            const response = await authFetch(`/api/stages/byevent/${event.id}`);
            if (response.ok) {
              const stagesData = await response.json();
              // Validación defensiva similar a StagesManagement
              if (Array.isArray(stagesData)) {
                stagesCount[event.id] = stagesData.length;
              } else if (Array.isArray(stagesData.content)) {
                stagesCount[event.id] = stagesData.content.length;
              } else {
                stagesCount[event.id] = 0;
              }
            } else {
              stagesCount[event.id] = 0;
            }
          } catch {
            stagesCount[event.id] = 0;
          }
        })
      );

      setEventStages(stagesCount);
    } catch (err) {
      console.error("Error al cargar stages de eventos:", err);
    }
  };

  const getCategoriesForEvent = (eventId: number) => {
    return eventCategories
      .filter((ec) => ec.event.id === eventId)
      .map((ec) => ec.category.name);
  };

  const updateEventCategories = async (eventId: number) => {
    try {
      // Obtener categorías actuales del evento
      const currentCategoriesResponse = await authFetch(
        `/api/event-categories/byevent/${eventId}`
      );
      const currentCategories = currentCategoriesResponse.ok
        ? await currentCategoriesResponse.json()
        : [];
      const currentCategoryIds = currentCategories.map(
        (ec: EventCategory) => ec.category.id
      );

      // Eliminar categorías que ya no están seleccionadas
      for (const eventCategory of currentCategories) {
        if (!selectedCategories.includes(eventCategory.category.id)) {
          await authFetch(`/api/event-categories/${eventCategory.id}`, {
            method: "DELETE",
          });
        }
      }

      // Agregar nuevas categorías seleccionadas
      for (const categoryId of selectedCategories) {
        if (!currentCategoryIds.includes(categoryId)) {
          await authFetch("/api/event-categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event: { id: eventId },
              category: { id: categoryId },
            }),
          });
        }
      }
    } catch (err) {
      console.error("Error al actualizar categorías del evento:", err);
      throw err;
    }
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setFormData({});
    setSelectedCategories([]);
    setIsDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData(event);
    // Cargar las categorías actuales del evento
    const eventCategoryIds = eventCategories
      .filter((ec) => ec.event.id === event.id)
      .map((ec) => ec.category.id);
    setSelectedCategories(eventCategoryIds);
    setIsDialogOpen(true);
  };

  const handleImageEdit = (event: Event) => {
    setSelectedEventForImage(event);
    setImageUrl("");
    setIsImageDialogOpen(true);
  };

  const handleDelete = async (eventId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      return;
    }

    try {
      const response = await authFetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Intentar obtener el mensaje de error del backend
        let errorMessage = "Error al eliminar evento";
        try {
          const errorData = await response.json();
          if (errorData.message || errorData.error) {
            const backendMessage = errorData.message || errorData.error;

            // Detectar errores de restricción de clave foránea (dependencias)
            if (
              backendMessage.includes("constraint") ||
              backendMessage.includes("foreign key") ||
              backendMessage.includes("referenced") ||
              backendMessage.includes("event_category") ||
              backendMessage.includes("stage") ||
              backendMessage.includes("batch")
            ) {
              errorMessage =
                "❌ No se puede eliminar este evento porque tiene información asociada (etapas, categorías o participantes). Primero elimina las etapas y categorías del evento, luego intenta nuevamente.";
            } else {
              errorMessage = backendMessage;
            }
          }
        } catch {
          // Si no se puede parsear la respuesta, usar mensaje genérico
          if (response.status === 409) {
            errorMessage =
              "❌ No se puede eliminar este evento porque tiene información asociada. Primero elimina las etapas y categorías del evento.";
          } else if (response.status === 403) {
            errorMessage = "🚫 No tienes permisos para eliminar este evento.";
          } else if (response.status === 404) {
            errorMessage = "❓ El evento no existe o ya fue eliminado.";
          }
        }
        throw new Error(errorMessage);
      }

      await loadEvents();
      toast.success("Evento eliminado exitosamente");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar evento";
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Error al ${editingEvent ? "actualizar" : "crear"} evento`
        );
      }

      const eventData = await response.json();
      const eventId = editingEvent ? editingEvent.id : eventData.id;

      // Actualizar categorías del evento
      if (selectedCategories.length > 0 || editingEvent) {
        await updateEventCategories(eventId);
      }

      await loadEvents();
      await loadEventCategories();
      setIsDialogOpen(false);
      setEditingEvent(null);
      setFormData({});
      setSelectedCategories([]);
      toast.success(
        `Evento ${editingEvent ? "actualizado" : "creado"} exitosamente`
      );
    } catch (err) {
      toast.error(`Error al ${editingEvent ? "actualizar" : "crear"} evento`);
    }
  };

  // ========== NUEVA FUNCIÓN: Solo manejo de URLs ==========
  const handleUrlUpload = async () => {
    if (!imageUrl || !selectedEventForImage) return;

    // Validación de URL en el frontend
    if (!isValidImageUrl(imageUrl)) {
      toast.error(
        "URL de imagen no válida. Debe ser HTTPS y de un servicio confiable."
      );
      return;
    }

    setUpdating(true);
    try {
      const response = await authFetch(
        `/api/events/${selectedEventForImage.id}/picture`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pictureUrl: imageUrl }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al actualizar la imagen");
      }

      await loadEvents();
      setIsImageDialogOpen(false);
      setImageUrl("");
      toast.success("Imagen actualizada exitosamente");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar la imagen";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveImage = async (event: Event) => {
    if (
      !confirm("¿Estás seguro de que quieres eliminar la imagen del evento?")
    ) {
      return;
    }

    setUpdating(true);
    try {
      const response = await authFetch(`/api/events/${event.id}/picture`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la imagen");
      }

      await loadEvents();
      toast.success("Imagen eliminada exitosamente");
    } catch (err) {
      toast.error("Error al eliminar la imagen");
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ========== NUEVA FUNCIÓN: Validación de URLs de imagen ==========
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim().length === 0) return true; // Permitir vacío para eliminar imagen

    // Debe ser HTTPS
    if (!url.startsWith("https://")) return false;

    // Debe contener una extensión de imagen válida o ser de servicios conocidos
    const lowerUrl = url.toLowerCase();
    return (
      !!lowerUrl.match(/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i) ||
      lowerUrl.includes("imgur.com") ||
      lowerUrl.includes("cloudinary.com") ||
      lowerUrl.includes("drive.google.com") ||
      lowerUrl.includes("dropbox.com") ||
      lowerUrl.includes("unsplash.com") ||
      lowerUrl.includes("pexels.com") ||
      lowerUrl.includes("googleusercontent.com") ||
      lowerUrl.includes("lh3.googleusercontent.com") ||
      lowerUrl.includes("lh4.googleusercontent.com") ||
      lowerUrl.includes("lh5.googleusercontent.com") ||
      lowerUrl.includes("lh6.googleusercontent.com")
    );
  };

  const formatDate = (dateString: string) => {
    // Si el string es YYYY-MM-DD, parsear manualmente para evitar desfase por zona horaria
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-").map(Number);
      // Mes en JS es 0-indexado
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("es-ES");
    }
    // Si viene con hora, usar el método normal
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const getStatusBadge = (startDate: string, endDate: string) => {
    const eventStart = new Date(startDate);
    // Ajustar eventEnd a las 23:59:59 del día de fin para que el evento esté "En Curso" todo ese día
    let eventEnd: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      const [year, month, day] = endDate.split("-").map(Number);
      eventEnd = new Date(year, month - 1, day, 23, 59, 59);
    } else {
      eventEnd = new Date(endDate);
    }
    const now = new Date();

    if (now < eventStart) {
      return <Badge variant="default">Próximo</Badge>;
    } else if (now >= eventStart && now <= eventEnd) {
      return <Badge variant="destructive">En Curso</Badge>;
    } else {
      return <Badge variant="secondary">Finalizado</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="w-48 h-8 rounded bg-muted animate-pulse"></div>
            <div className="w-64 h-4 mt-2 rounded bg-muted animate-pulse"></div>
          </div>
          <div className="w-32 h-10 rounded bg-muted animate-pulse"></div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Eventos
          </h2>
          <p className="text-muted-foreground">
            Administra todos los eventos del sistema
          </p>
        </div>

        <div className="flex items-center space-x-4">
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

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingEvent(null);
                setFormData({});
                setSelectedCategories([]);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Evento</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="details">Descripción</Label>
                  <Textarea
                    id="details"
                    value={formData.details || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Fecha de Fin</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label>Categorías del Evento</Label>
                    {categories.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        Gestiona categorías desde el panel de administración
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-4 mt-2 overflow-y-auto border rounded-lg max-h-40">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() =>
                            handleCategoryToggle(category.id)
                          }
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <div className="col-span-2 text-center">
                        <p className="text-sm text-muted-foreground">
                          No hay categorías disponibles.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Ve al panel de administración para crear categorías.
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedCategories.map((categoryId) => {
                        const category = categories.find(
                          (c) => c.id === categoryId
                        );
                        return category ? (
                          <Badge
                            key={categoryId}
                            variant="outline"
                            className="text-xs"
                          >
                            {category.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingEvent ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.includes("evento") && (
                    <TableHead>Evento</TableHead>
                  )}
                  {visibleColumns.includes("fechaInicio") && (
                    <TableHead>Fecha de Inicio</TableHead>
                  )}
                  {visibleColumns.includes("fechaFin") && (
                    <TableHead>Fecha de Fin</TableHead>
                  )}
                  {visibleColumns.includes("stages") && (
                    <TableHead>Etapas</TableHead>
                  )}
                  {visibleColumns.includes("ubicacion") && (
                    <TableHead>Ubicación</TableHead>
                  )}
                  {visibleColumns.includes("categorias") && (
                    <TableHead>Categorías</TableHead>
                  )}
                  {visibleColumns.includes("estado") && (
                    <TableHead>Estado</TableHead>
                  )}
                  {visibleColumns.includes("acciones") && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    {visibleColumns.includes("evento") && (
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-lg bg-muted">
                            {event.picture ? (
                              <img
                                src={event.picture}
                                alt={event.name}
                                className="object-cover w-12 h-12 rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                            ) : (
                              <Calendar className="w-6 h-6 text-muted-foreground" />
                            )}
                            <Calendar className="hidden w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{event.name}</p>
                            {event.details && (
                              <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                                {event.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("fechaInicio") && (
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                          {formatDate(event.startDate)}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("fechaFin") && (
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                          {formatDate(event.endDate)}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("stages") && (
                      <TableCell>
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-xs">
                            {eventStages[event.id] || 0}
                          </Badge>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("ubicacion") && (
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          {event.location}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("categorias") && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getCategoriesForEvent(event.id).map(
                            (categoryName, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {categoryName}
                              </Badge>
                            )
                          )}
                          {getCategoriesForEvent(event.id).length === 0 && (
                            <span className="text-sm text-muted-foreground">
                              Sin categorías
                            </span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("estado") && (
                      <TableCell>
                        {getStatusBadge(event.startDate, event.endDate)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("acciones") && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleImageEdit(event)}
                            title="Cambiar imagen"
                          >
                            <Image className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
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
        </CardContent>
      </Card>

      {/* Dialog simplificado para URL de imagen del evento */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Cambiar Imagen - {selectedEventForImage?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Vista previa de la imagen actual */}
            {selectedEventForImage?.picture && (
              <div className="space-y-2">
                <Label>Imagen actual:</Label>
                <div className="relative">
                  <img
                    src={selectedEventForImage.picture}
                    alt={selectedEventForImage.name}
                    className="object-cover w-full h-32 rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.svg";
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveImage(selectedEventForImage)}
                    disabled={updating}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Solo URL de imagen */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-url">URL de la imagen</Label>
                <Input
                  id="image-url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={updating}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Debe ser una URL HTTPS de servicios confiables (Imgur,
                  Cloudinary, Drive, Dropbox, etc.)
                </p>
              </div>
              <Button
                onClick={handleUrlUpload}
                disabled={!imageUrl || updating}
                className="w-full"
              >
                <Link className="w-4 h-4 mr-2" />
                {updating ? "Actualizando..." : "Actualizar Imagen"}
              </Button>
            </div>

            {updating && (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-b-2 rounded-full animate-spin border-primary" />
                <span className="ml-2 text-sm">Procesando...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
