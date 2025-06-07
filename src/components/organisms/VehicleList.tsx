import React from "react";
import { Vehicle } from "@/types/vehicle.types";
import VehicleCard from "@/components/organisms/VehicleCard";

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  onEdit,
  onDelete,
}) => {
  if (vehicles.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-2 text-lg text-gray-500">
          No tienes vehículos registrados
        </div>
        <div className="text-sm text-gray-400">
          Haz clic en "Añadir Vehículo" para comenzar
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onEdit={() => onEdit(vehicle)}
          onDelete={() => onDelete(vehicle)}
        />
      ))}
    </div>
  );
};

export default VehicleList;
