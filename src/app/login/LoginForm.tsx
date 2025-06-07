"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { useState, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/organisms/basic/dialog";
import { SimpleRegisterForm } from "./SimpleRegisterForm";
import { handleGoogleLogin } from "@/utils/auth";
import { useAuth } from "@/hooks/useAuth";

// Usa variable de entorno pública para el backend en el cliente
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formId = useId(); // Unique per instance

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const email =
      (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
    const password =
      (form.elements.namedItem("password") as HTMLInputElement)?.value || "";
    try {
      await login(email, password);
      // Redirigir a la ruta original si existe, si no a la principal
      const from = searchParams.get("from");
      if (from) {
        router.replace(from);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Credenciales equivocadas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <form
        className="w-full max-w-md mx-auto space-y-4"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">Iniciar sesión</h2>
            <p className="text-muted-foreground">
              ¡Bienvenido/a a tu portal de competencias GPX!
            </p>
          </div>
          {/* Botón de Google */}
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center w-full gap-2"
            onClick={handleGoogleLogin}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Entrar con Google
          </Button>
          <div className="relative text-sm text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 px-2 bg-card text-muted-foreground">
              O continúa con
            </span>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor={`${formId}-login-email`}>
                Correo electrónico
              </Label>
              <Input
                id={`${formId}-login-email`}
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor={`${formId}-login-password`}>Contraseña</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Input
                id={`${formId}-login-password`}
                name="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ingresando..." : "Inicia Sesión"}
            </Button>
          </div>
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 text-sm font-medium text-center text-destructive animate-fade-in"
            >
              {error}
            </div>
          )}
          <div className="text-sm text-center">
            ¿No tienes cuenta?{" "}
            <Dialog>
              <DialogTrigger asChild>
                <a
                  href="#"
                  className="underline cursor-pointer underline-offset-4"
                >
                  Regístrate
                </a>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogTitle>Registro</DialogTitle>
                <SimpleRegisterForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
        Al hacer clic en continuar, aceptas nuestros{" "}
        <a href="#" className="transition-colors hover:text-primary">
          Términos de servicio
        </a>{" "}
        y{" "}
        <a href="#" className="transition-colors hover:text-primary">
          Política de privacidad
        </a>
        .
      </div>
    </div>
  );
}
