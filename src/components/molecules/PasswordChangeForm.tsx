import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";

// Schema de validación para el cambio de contraseña
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .max(128, "La nueva contraseña no puede tener más de 128 caracteres")
      .regex(
        /.*[a-zA-Z].*/,
        "La nueva contraseña debe contener al menos una letra"
      )
      .regex(/.*\d.*/, "La nueva contraseña debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeFormProps {
  onPasswordChange: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  loading?: boolean;
  canChangePassword?: boolean;
}

export function PasswordChangeForm({
  onPasswordChange,
  loading = false,
  canChangePassword = true,
}: PasswordChangeFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordChangeFormValues) => {
    try {
      await onPasswordChange(data.currentPassword, data.newPassword);
      form.reset();
      toast.success("Contraseña cambiada exitosamente");
    } catch (error) {
      // El error ya se maneja en el componente padre
    }
  };

  if (!canChangePassword) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Cambiar Contraseña
          </CardTitle>
          <CardDescription>
            No puedes cambiar la contraseña de una cuenta que inició sesión con
            Google.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Cambiar Contraseña
        </CardTitle>
        <CardDescription>
          Cambia tu contraseña por una nueva. Asegúrate de que sea segura.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Contraseña Actual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña actual"
                {...form.register("currentPassword")}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
            {form.formState.errors.currentPassword && (
              <p className="text-sm text-destructive">
                {form.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* Nueva Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Ingresa tu nueva contraseña"
                {...form.register("newPassword")}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
            {form.formState.errors.newPassword && (
              <p className="text-sm text-destructive">
                {form.formState.errors.newPassword.message}
              </p>
            )}
            <div className="text-xs text-muted-foreground">
              <p>La contraseña debe tener:</p>
              <ul className="ml-2 space-y-1 list-disc list-inside">
                <li>Al menos 8 caracteres</li>
                <li>Al menos una letra</li>
                <li>Al menos un número</li>
              </ul>
            </div>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirma tu nueva contraseña"
                {...form.register("confirmPassword")}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !form.formState.isValid}>
              {loading ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
