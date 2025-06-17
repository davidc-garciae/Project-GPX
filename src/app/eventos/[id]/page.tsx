"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authFetch } from "@/utils/authFetch";
import { EventsOverview } from "@/components/organisms/EventsOverview";
import { EventDetailRow } from "@/components/organisms/EventDetailRow";
import { EventInfoCard } from "@/components/molecules/EventInfoCard";
import { EventCategoriesCard } from "@/components/molecules/EventCategoriesCard";
import { EventPaymentCard } from "@/components/molecules/EventPaymentCard";
import { EventFeesCard } from "@/components/molecules/EventFeesCard";
import { EventTourismCard } from "@/components/molecules/EventTourismCard";
import { EventAppsCard } from "@/components/molecules/EventAppsCard";
import { EventInvitationCard } from "@/components/molecules/EventInvitationCard";
import { EventRequirementsCard } from "@/components/molecules/EventRequirementsCard";
import { EventDetailsFullCard } from "@/components/molecules/EventDetailsFullCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import { ResultsTabs } from "@/components/organisms/ResultsTabs";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/basic/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { ParticipantsTable } from "@/components/organisms/ParticipantsTable";
import { toast } from "sonner";

const tarifas = [
  {
    fase: "Preventa",
    motos: "$1.200.000",
    utv: "$1.600.000",
    carros: "$1.800.000",
  },
  {
    fase: "Fase 1",
    motos: "$1.400.000",
    utv: "$1.800.000",
    carros: "$2.000.000",
  },
  {
    fase: "Precio Full",
    motos: "$1.600.000",
    utv: "$2.000.000",
    carros: "$2.200.000",
  },
];

interface Vehicle {
  id: number;
  name: string;
  plates: string;
  soat: string;
  category: {
    id: number;
    name: string;
  };
}

export default function EventoPage() {
  const params = useParams();
  const eventId = Number(params.id);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "info";

  // URL base del backend
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const [event, setEvent] = useState<any>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInscriptionModalOpen, setIsInscriptionModalOpen] = useState(false);
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [loadingInscription, setLoadingInscription] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [participants, setParticipants] = useState<any[]>([]);

  // Cargar datos del evento
  useEffect(() => {
    const loadEventData = async () => {
      setLoading(true);
      console.log(`🔍 Cargando datos del evento ${eventId}...`);

      try {
        // Cargar evento
        const eventUrl = `${backendUrl}/api/events/${eventId}`;
        console.log(`📡 Petición evento: ${eventUrl}`);

        const eventRes = await fetch(eventUrl);
        console.log(`📊 Respuesta evento:`, {
          status: eventRes.status,
          ok: eventRes.ok,
        });

        if (eventRes.ok) {
          const eventData = await eventRes.json();
          console.log(`✅ Evento cargado:`, eventData);
          setEvent(eventData);
        } else {
          console.error(
            `❌ Error cargando evento: ${eventRes.status} ${eventRes.statusText}`
          );
        }

        // Cargar etapas
        const stagesUrl = `${backendUrl}/api/stages/byevent/${eventId}`;
        console.log(`📡 Petición etapas: ${stagesUrl}`);

        const stagesRes = await fetch(stagesUrl);
        console.log(`📊 Respuesta etapas:`, {
          status: stagesRes.status,
          ok: stagesRes.ok,
        });

        if (stagesRes.ok) {
          const stagesData = await stagesRes.json();
          console.log(`✅ Etapas cargadas:`, stagesData);
          setStages(stagesData);
        } else {
          console.error(
            `❌ Error cargando etapas: ${stagesRes.status} ${stagesRes.statusText}`
          );
        }

        // Cargar participantes para el conteo
        const participantsUrl = `${backendUrl}/api/event-vehicles/byevent/${eventId}`;
        console.log(`📡 Petición participantes: ${participantsUrl}`);

        const participantsRes = await fetch(participantsUrl);
        console.log(`📊 Respuesta participantes:`, {
          status: participantsRes.status,
          ok: participantsRes.ok,
        });

        if (participantsRes.ok) {
          const participantsData = await participantsRes.json();
          console.log(`✅ Participantes cargados:`, participantsData);
          setParticipantsCount(participantsData.length);
        } else {
          console.error(
            `❌ Error cargando participantes: ${participantsRes.status} ${participantsRes.statusText}`
          );
        }

        // Cargar participantes detallados para la tabla
        const participantsDetailUrl = `${backendUrl}/api/event-vehicles/participants/${eventId}`;
        console.log(
          `📡 Petición detalles participantes: ${participantsDetailUrl}`
        );

        const participantsDetailRes = await fetch(participantsDetailUrl);
        console.log(`📊 Respuesta detalles participantes:`, {
          status: participantsDetailRes.status,
          ok: participantsDetailRes.ok,
        });

        if (participantsDetailRes.ok) {
          const participantsDetailData = await participantsDetailRes.json();
          console.log(
            `✅ Detalles participantes cargados:`,
            participantsDetailData
          );
          setParticipants(participantsDetailData);
        } else {
          console.error(
            `❌ Error cargando detalles participantes: ${participantsDetailRes.status} ${participantsDetailRes.statusText}`
          );
        }
      } catch (error) {
        console.error("💥 Error cargando datos del evento:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [eventId]);

  // Verificar si el usuario ya está inscrito
  useEffect(() => {
    const checkUserRegistration = async () => {
      if (!user?.id || !eventId) return;

      try {
        console.log(
          `🔍 Verificando inscripción del usuario ${user.id} en evento ${eventId}...`
        );
        const registrationUrl = `${backendUrl}/api/event-vehicles/byevent/${eventId}`;
        console.log(`📡 Petición verificación inscripción: ${registrationUrl}`);

        const response = await fetch(registrationUrl);
        console.log(`📊 Respuesta verificación inscripción:`, {
          status: response.status,
          ok: response.ok,
        });

        if (response.ok) {
          const eventVehicles = await response.json();
          console.log(`✅ Event vehicles obtenidos:`, eventVehicles);

          const userRegistration = eventVehicles.find(
            (ev: any) => ev.vehicleId?.user?.id === user.id
          );
          console.log(`🎯 Usuario inscrito:`, !!userRegistration);
          setIsUserRegistered(!!userRegistration);
        }
      } catch (error) {
        console.error("💥 Error verificando inscripción:", error);
      }
    };

    checkUserRegistration();
  }, [user?.id, eventId]);

  // Cargar vehículos del usuario cuando abre el modal
  const loadUserVehicles = async () => {
    if (!user?.id) {
      console.log("⚠️ No hay usuario autenticado para cargar vehículos");
      return;
    }

    setLoadingVehicles(true);
    try {
      console.log(`🔍 Cargando vehículos del usuario ${user.id}...`);

      const response = await authFetch(`/api/vehicles/byuser/${user.id}`);
      console.log(`📊 Respuesta vehículos del usuario:`, {
        status: response.status,
        ok: response.ok,
      });

      if (response.ok) {
        const vehicles = await response.json();
        console.log(`✅ Vehículos del usuario cargados:`, vehicles);
        console.log(`📈 Número de vehículos: ${vehicles.length}`);
        setUserVehicles(vehicles);

        if (vehicles.length === 0) {
          console.log("⚠️ El usuario no tiene vehículos registrados");
          toast.info("No tienes vehículos registrados. Registra uno primero.");
        }
      } else {
        console.error(
          `❌ Error cargando vehículos: ${response.status} ${response.statusText}`
        );
        toast.error("No se pudieron cargar los vehículos");
      }
    } catch (error) {
      console.error("💥 Error cargando vehículos:", error);
      toast.error("Error de conexión al cargar vehículos");
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Manejar inscripción
  const handleInscription = async () => {
    if (!selectedVehicleId || !user?.id) {
      console.log("⚠️ Faltan datos para inscripción:", {
        selectedVehicleId,
        userId: user?.id,
      });
      return;
    }

    setLoadingInscription(true);
    console.log(
      `🔍 Iniciando inscripción: vehículo ${selectedVehicleId} en evento ${eventId}...`
    );

    try {
      const inscriptionData = {
        event: { id: eventId },
        vehicleId: { id: Number(selectedVehicleId) },
      };
      console.log(`📤 Datos de inscripción:`, inscriptionData);

      const response = await authFetch("/api/event-vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inscriptionData),
      });

      console.log(`📊 Respuesta inscripción:`, {
        status: response.status,
        ok: response.ok,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(`✅ Inscripción exitosa:`, responseData);
        toast.success("¡Inscripción realizada exitosamente!");
        setIsInscriptionModalOpen(false);
        setSelectedVehicleId("");
        setIsUserRegistered(true);
        setParticipantsCount((prev) => prev + 1);
      } else if (response.status === 403) {
        // Error de permisos - obtener mensaje del backend
        try {
          const errorData = await response.json();
          console.log(`❌ Error 403:`, errorData);
          toast.error(
            errorData.message ||
              "No tienes permisos para inscribir este vehículo"
          );
        } catch {
          toast.error("No tienes permisos para inscribir este vehículo");
        }
      } else if (response.status === 409) {
        // Usuario ya inscrito
        const errorData = await response.json();
        console.log(`❌ Error 409:`, errorData);
        toast.error(errorData.message || "Ya estás inscrito en este evento");
        setIsInscriptionModalOpen(false);
        setIsUserRegistered(true);
      } else if (response.status === 404) {
        // Vehículo no encontrado
        const errorData = await response.json();
        console.log(`❌ Error 404:`, errorData);
        toast.error(errorData.message || "El vehículo seleccionado no existe");
      } else if (response.status === 400) {
        // Error de validación (reglas de negocio)
        try {
          const errorData = await response.json();
          console.log(`❌ Error 400 (Validación):`, errorData);
          toast.error(
            errorData.message || "Error de validación en la inscripción"
          );
        } catch {
          toast.error("Error de validación en la inscripción");
        }
      } else {
        try {
          const errorData = await response.json();
          console.log(`❌ Error ${response.status}:`, errorData);
          toast.error(errorData.message || "Error al realizar la inscripción");
        } catch {
          toast.error("Error al realizar la inscripción");
        }
      }
    } catch (error) {
      console.error("💥 Error en inscripción:", error);
      toast.error("Error al procesar la inscripción");
    } finally {
      setLoadingInscription(false);
    }
  };

  // Abrir modal de inscripción
  const openInscriptionModal = () => {
    console.log("🔍 Abriendo modal de inscripción...");
    loadUserVehicles();
    setIsInscriptionModalOpen(true);
  };

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
          <h2 className="text-2xl font-bold text-muted-foreground">
            Cargando evento...
          </h2>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="mb-4 text-2xl font-bold">No se pudo cargar el evento</h2>
        <p className="mb-2 text-muted-foreground">
          Verifica la URL o intenta más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 pt-8 mx-auto text-center md:flex-row md:items-start md:text-left">
      <div className="flex flex-col items-center w-full max-w-5xl min-w-0 md:flex-1 md:items-stretch">
        {/* Información de participantes */}
        <div className="w-full mb-4">
          <p className="text-sm text-muted-foreground">
            {participantsCount} participante
            {participantsCount !== 1 ? "s" : ""} inscrito
            {participantsCount !== 1 ? "s" : ""}
          </p>
        </div>

        <Tabs
          value={tabParam}
          onValueChange={handleTabChange}
          className="w-full"
        >
          {/* Header de tabs con botón de inscripción integrado */}
          <div className="flex items-center justify-between w-full mb-4">
            <TabsList className="grid w-auto grid-cols-3">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="participants">Inscripciones</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>
            {user && !user.admin && (
              <div className="flex gap-2">
                {isUserRegistered ? (
                  <Button variant="outline" disabled>
                    Ya inscrito
                  </Button>
                ) : (
                  <Button onClick={openInscriptionModal}>Inscribirse</Button>
                )}
              </div>
            )}
          </div>

          <TabsContent value="info" className="mt-0">
            <div className="flex flex-col w-full gap-4">
              <EventDetailRow
                left={<EventInfoCard event={event} />}
                right={<EventCategoriesCard stages={stages} />}
                leftClass="md:w-3/5"
                rightClass="md:w-2/5"
              />
              <EventDetailRow
                left={<EventPaymentCard />}
                right={<EventFeesCard tarifas={tarifas} />}
                leftClass="md:w-2/5"
                rightClass="md:w-3/5"
              />
              <EventDetailRow
                left={<EventTourismCard />}
                right={<EventAppsCard />}
                leftClass="md:w-3/5"
                rightClass="md:w-2/5"
              />
              <EventDetailRow
                left={<EventInvitationCard />}
                right={<EventRequirementsCard />}
                leftClass="md:w-2/5"
                rightClass="md:w-3/5"
              />
              <div className="w-full">
                <EventDetailsFullCard />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="mt-0">
            <ParticipantsTable participants={participants} loading={loading} />
          </TabsContent>

          <TabsContent value="results" className="mt-0">
            {Array.isArray(stages) && stages.length > 0 ? (
              <ResultsTabs
                results={[]}
                stagesCount={stages.length}
                categories={[]}
                stages={stages.map((stage: any, idx: number) => ({
                  ...stage,
                  name: `Etapa ${idx}`,
                }))}
                eventId={eventId}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-40 text-muted-foreground">
                No hay resultados disponibles para este evento.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <aside className="flex items-start w-full max-w-xs md:w-2/5 md:mt-0 md:justify-start md:items-start">
        <EventsOverview />
      </aside>

      {/* Modal de inscripción */}
      <Dialog
        open={isInscriptionModalOpen}
        onOpenChange={setIsInscriptionModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inscribirse al evento</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <p className="mb-4 text-sm text-muted-foreground">
                Selecciona el vehículo con el que deseas participar en este
                evento:
              </p>

              {loadingVehicles ? (
                <div className="flex items-center justify-center p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-b-2 rounded-full animate-spin border-primary"></div>
                    <span className="text-sm text-muted-foreground">
                      Cargando vehículos...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <Select
                    value={selectedVehicleId}
                    onValueChange={setSelectedVehicleId}
                    disabled={userVehicles.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          userVehicles.length === 0
                            ? "No hay vehículos disponibles"
                            : "Selecciona un vehículo"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {userVehicles.map((vehicle) => (
                        <SelectItem
                          key={vehicle.id}
                          value={vehicle.id.toString()}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{vehicle.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {vehicle.category.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {userVehicles.length === 0 && !loadingVehicles && (
                    <div className="p-4 mt-2 border rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        <strong>No tienes vehículos registrados.</strong>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Para participar en eventos necesitas registrar al menos
                        un vehículo.
                      </p>
                      <a
                        href="/vehiculos"
                        className="inline-block mt-2 text-sm text-primary hover:underline"
                      >
                        → Registrar vehículo aquí
                      </a>
                    </div>
                  )}

                  {userVehicles.length > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      💡 Tienes {userVehicles.length} vehículo
                      {userVehicles.length !== 1 ? "s" : ""} disponible
                      {userVehicles.length !== 1 ? "s" : ""} para inscripción.
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsInscriptionModalOpen(false);
                  setSelectedVehicleId("");
                  setUserVehicles([]);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleInscription}
                disabled={
                  !selectedVehicleId ||
                  loadingInscription ||
                  userVehicles.length === 0
                }
              >
                {loadingInscription
                  ? "Inscribiendo..."
                  : "Confirmar inscripción"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
