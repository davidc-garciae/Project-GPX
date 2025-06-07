"use client";
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/organisms/basic/sheet";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { toast } from "sonner";

export function ChangePasswordSheet({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // Simula una solicitud POST y validaciones
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const current = (
      form.elements.namedItem("currentPassword") as HTMLInputElement
    )?.value;
    const nueva = (form.elements.namedItem("newPassword") as HTMLInputElement)
      ?.value;
    const confirmar = (
      form.elements.namedItem("confirmNewPassword") as HTMLInputElement
    )?.value;

    setTimeout(() => {
      setSaving(false);
      if (!current || !nueva || !confirmar) {
        toast.error("Todos los campos son obligatorios");
        return;
      }
      if (nueva !== confirmar) {
        toast.error("Las contraseñas nuevas no coinciden");
        return;
      }
      if (nueva.length < 6) {
        toast.error("La nueva contraseña debe tener al menos 6 caracteres");
        return;
      }
      // Simula éxito
      setOpen(false);
      toast.success("Contraseña actualizada", {
        description: new Date().toLocaleString("es-CO", {
          dateStyle: "full",
          timeStyle: "short",
        }),
      });
    }, 1200);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Cambiar contraseña</SheetTitle>
        </SheetHeader>
        <form
          className="flex flex-col gap-4 mt-4"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <label>
            Contraseña actual
            <Input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              disabled={saving}
            />
          </label>
          <label>
            Nueva contraseña
            <Input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              disabled={saving}
            />
          </label>
          <label>
            Confirmar nueva contraseña
            <Input
              name="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              disabled={saving}
            />
          </label>
          <div className="flex gap-2 mt-4">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
