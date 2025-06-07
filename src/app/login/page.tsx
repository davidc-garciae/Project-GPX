"use client";
import { LoginForm } from "@/app/login/LoginForm";
import { Card } from "@/components/molecules/basic/card";

export default function LoginPage() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex items-center justify-center flex-1 w-full">
        <Card className="flex max-w-7xl h-[700px] overflow-hidden bg-card p-0 md:p-0 ">
          {/* Imagen lado izquierdo (oculta en mobile) */}
          <div className="items-center justify-center hidden w-3/5 overflow-hidden xl:flex bg-muted">
            <img
              src="/login.webp"
              alt="Login Illustration"
              className="object-cover w-full h-full"
              style={{ objectPosition: "60% center" }}
            />
          </div>
          {/* Formulario responsivo: ocupa todo el ancho en mobile, 2/5 en desktop */}
          <div className="flex items-center justify-center w-full p-6 xl:w-2/5 bg-card">
            <LoginForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
