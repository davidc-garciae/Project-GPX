import { z } from "zod";

// Interface para las categorías de vehículos que vienen del backend
export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Interface para los vehículos que vienen del backend
export interface Vehicle {
  id: number;
  name: string;
  soat: string;
  plates: string;
  category: Category;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// Schema de Zod para la validación del formulario de vehículos
export const vehicleSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .trim(),
  soat: z.string()
    .min(1, "El SOAT es requerido")
    .max(50, "El SOAT no puede tener más de 50 caracteres")
    .regex(/^[A-Za-z0-9\-_]+$/, "El SOAT solo puede contener letras, números, guiones y guiones bajos (sin espacios)")
    .trim(),
  plates: z.string()
    .min(4, "La placa debe tener al menos 4 caracteres")
    .max(20, "La placa no puede tener más de 20 caracteres")
    .regex(/^[A-Za-z0-9\-]+$/, "La placa solo puede contener letras, números y guiones (sin espacios)")
    .trim(),
  categoryId: z.coerce.number().min(1, "Debes seleccionar una categoría"),
});

// Tipo inferido del schema de Zod para los valores del formulario
export type VehicleFormValues = z.infer<typeof vehicleSchema>; 