"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";

export function SimpleRegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [emailExists, setEmailExists] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Validación en tiempo real del email
  const checkEmailExists = async (email: string) => {
    setCheckingEmail(true);
    try {
      const response = await fetch(
        `/api/users/check-email?email=${encodeURIComponent(email.trim())}`
      );
      const data = await response.json();
      setEmailExists(data.exists);
    } catch (error) {
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  // Handler de cambio de campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "email" && value.includes("@")) {
      checkEmailExists(value);
    }
  };

  // Registro simplificado
  const handleSimpleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // Validaciones de confirmación
    if (form.email !== form.confirmEmail) {
      setError("Los correos electrónicos no coinciden.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/users/simple-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        // Guardar foto de perfil en localStorage (puede ser null)
        if (data.picture) {
          localStorage.setItem("userPicture", data.picture);
        } else {
          localStorage.removeItem("userPicture");
        }
        window.location.href = "/";
      } else {
        const errorText = await response.text();
        setError(errorText || "Error en el registro");
      }
    } catch (error) {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSimpleRegister}
        className="w-full max-w-md mx-auto space-y-4"
        autoComplete="off"
      >
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">Registro rápido</h2>
            <p className="text-muted-foreground">
              Crea tu cuenta para comenzar a participar
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="simple-firstName">Nombre</Label>
              <Input
                id="simple-firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="simple-lastName">Apellido</Label>
              <Input
                id="simple-lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="simple-email">Correo electrónico</Label>
              <Input
                id="simple-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={emailExists ? "border-destructive" : ""}
              />
              {checkingEmail && (
                <span className="text-xs text-muted-foreground">
                  Verificando email...
                </span>
              )}
              {emailExists && (
                <span className="text-xs text-destructive">
                  Este correo ya está registrado.
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="simple-confirmEmail">
                Confirmar correo electrónico
              </Label>
              <Input
                id="simple-confirmEmail"
                name="confirmEmail"
                type="email"
                value={form.confirmEmail}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="simple-password">Contraseña</Label>
              <Input
                id="simple-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="simple-confirmPassword">
                Confirmar contraseña
              </Label>
              <Input
                id="simple-confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || emailExists}
            >
              {loading ? "Registrando..." : "Registrarse"}
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
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
        Al registrarte aceptas nuestros{" "}
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
