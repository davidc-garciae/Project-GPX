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

  // Función para filtrar caracteres no válidos en SOAT
  const handleSoatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9\-_]/g, ""); // Solo permitir letras, números, guiones y guiones bajos
    form.setValue("soat", value);
  };

  // Función para filtrar caracteres no válidos en placas
  const handlePlatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9\-]/g, ""); // Solo permitir letras, números y guiones
    form.setValue("plates", value);
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
                  <Input
                    placeholder="Ej: ABC123456789 (sin espacios)"
                    {...field}
                    className={
                      form.formState.errors.soat ? "border-red-500" : ""
                    }
                    onChange={handleSoatChange}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground mt-1">
                  Solo letras, números, guiones (-) y guiones bajos (_)
                </p>
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
                  <Input
                    placeholder="Ej: ABC-123 (sin espacios)"
                    {...field}
                    className={
                      form.formState.errors.plates ? "border-red-500" : ""
                    }
                    onChange={handlePlatesChange}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground mt-1">
                  Solo letras, números y guiones (-)
                </p>
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
