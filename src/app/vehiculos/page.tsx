"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Vehicle, Category, VehicleFormValues } from "@/types/vehicle.types";
import VehicleList from "@/components/organisms/VehicleList";
import VehicleForm from "@/components/organisms/VehicleForm";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/basic/dialog";
import { toast } from "sonner";
import { Card } from "@/components/atoms/card";

export default function VehiculosPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar vehículos del usuario
  const loadVehicles = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/vehicles/byuser/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error("Error cargando vehículos:", error);
      toast.error("No se pudieron cargar los vehículos");
    }
  };

  // Cargar categorías
  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  // Crear vehículo
  const createVehicle = async (data: VehicleFormValues) => {
    if (!user?.id) return;

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId: user.id,
        }),
      });

      if (response.ok) {
        toast.success("Vehículo creado correctamente");
        setIsModalOpen(false);
        loadVehicles();
      } else {
        throw new Error("Error al crear vehículo");
      }
    } catch (error) {
      console.error("Error creando vehículo:", error);
      toast.error("No se pudo crear el vehículo");
    }
  };

  // Actualizar vehículo
  const updateVehicle = async (data: VehicleFormValues) => {
    if (!editingVehicle) return;

    try {
      const response = await fetch(`/api/vehicles/${editingVehicle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Vehículo actualizado correctamente");
        setIsModalOpen(false);
        setEditingVehicle(null);
        loadVehicles();
      } else {
        throw new Error("Error al actualizar vehículo");
      }
    } catch (error) {
      console.error("Error actualizando vehículo:", error);
      toast.error("No se pudo actualizar el vehículo");
    }
  };

  // Eliminar vehículo
  const deleteVehicle = async (vehicle: Vehicle) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el vehículo ${vehicle.name}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Vehículo eliminado correctamente");
        loadVehicles();
      } else if (response.status === 409) {
        // Error de conflicto - vehículo vinculado a eventos/resultados
        const errorData = await response.json();
        toast.error(
          errorData.message ||
            "No se puede eliminar el vehículo porque está vinculado a eventos"
        );
      } else {
        throw new Error("Error al eliminar vehículo");
      }
    } catch (error) {
      console.error("Error eliminando vehículo:", error);
      toast.error("No se pudo eliminar el vehículo");
    }
  };

  // Manejar edición de vehículo
  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  // Manejar envío del formulario
  const handleSubmit = (data: VehicleFormValues) => {
    if (editingVehicle) {
      updateVehicle(data);
    } else {
      createVehicle(data);
    }
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([loadVehicles(), loadCategories()]);
      setLoading(false);
    };

    if (user?.id) {
      loadInitialData();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <main className="container p-4 mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start w-full min-h-full px-4 py-4">
      <Card className="w-full px-10 py-6 max-w-7xl bg-card/90">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestión de Vehículos</h1>
          <Button onClick={() => setIsModalOpen(true)}>Añadir Vehículo</Button>
        </div>

        <VehicleList
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={deleteVehicle}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? "Editar Vehículo" : "Añadir Vehículo"}
              </DialogTitle>
            </DialogHeader>
            <VehicleForm
              categories={categories}
              initialData={editingVehicle || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
            />
          </DialogContent>
        </Dialog>
      </Card>
    </main>
  );
}
