import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Category,
  Vehicle,
  VehicleFormValues,
  vehicleSchema,
} from "@/types/vehicle.types";
import { Button } from "@/components/atoms/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/basic/form";

interface VehicleFormProps {
  categories: Category[];
  initialData?: Partial<Vehicle>;
  onSubmit: (data: VehicleFormValues) => void;
  onCancel: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  categories,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: initialData?.name || "",
      soat: initialData?.soat || "",
      plates: initialData?.plates || "",
      categoryId: initialData?.category?.id || undefined,
    },
  });

  const handleSubmit = (data: VehicleFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Nombre del vehículo */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Vehículo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Toyota Corolla 2020 Blanco..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SOAT y Placa */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="soat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SOAT</FormLabel>
                <FormControl>
                  <Input placeholder="Número de SOAT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
                <FormControl>
                  <Input placeholder="ABC-123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Categoría */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botones */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {initialData ? "Actualizar" : "Crear"} Vehículo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleForm;
