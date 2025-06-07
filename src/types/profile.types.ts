import { z } from "zod";

// Schema de validación
export const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  identification: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  birthdate: z.date().optional(),
  typeOfId: z.string().optional(),
  teamName: z.string().optional(),
  eps: z.string().optional(),
  rh: z.string().optional(),
  emergencyPhone: z.string().optional(),
  alergies: z.string().optional(),
  wikiloc: z.string().optional(),
  terrapirata: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// Secciones de navegación
export interface NavigationSection {
  id: string;
  label: string;
  icon: any; // LucideIcon
} 