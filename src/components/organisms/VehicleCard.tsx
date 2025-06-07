import React from "react";
import { Vehicle } from "@/types/vehicle.types";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Car, Hash, Shield } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Car className="w-5 h-5" />
          {vehicle.name}
        </CardTitle>
        {vehicle.category && (
          <Badge variant="secondary" className="w-fit">
            {vehicle.category.name}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4" />
          <span className="font-mono">{vehicle.plates}</span>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span className="text-sm">{vehicle.soat}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="flex-1"
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
