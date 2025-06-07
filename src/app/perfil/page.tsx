"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { User as UserIcon, Heart, Shield, Globe, Lock } from "lucide-react";

// Clase personalizada para errores de validación
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/auth.types";
import { authFetch } from "@/utils/authFetch";
import { getAuthToken } from "@/utils/auth.utils";
import { Button } from "@/components/atoms/button";
import { Form } from "@/components/organisms/basic/form";
import { ProfileHeader } from "@/components/organisms/ProfileHeader";
import { SidebarNavigation } from "@/components/molecules/SidebarNavigation";
import { ProfileSections } from "@/components/organisms/ProfileSections";
import { PasswordChangeForm } from "@/components/molecules/PasswordChangeForm";
import {
  profileSchema,
  ProfileFormValues,
  NavigationSection,
} from "@/types/profile.types";
import { Card } from "@/components/atoms/card";

export default function PerfilPage() {
  const {
    user: authUser,
    isLoading: authLoading,
    isAuthenticated,
    refreshUserData,
  } = useAuth();
  const [fullUserData, setFullUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Función para cargar los datos completos del usuario
  const loadUserProfile = async (userId: number) => {
    try {
      setIsLoadingProfile(true);
      const response = await authFetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Error al cargar el perfil del usuario");
      }
      const userData = await response.json();
      setFullUserData(userData);
      setError(null);
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Función para actualizar el usuario (solo campos modificados)
  const updateUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      if (!authUser?.id) {
        throw new Error("No se puede actualizar: ID de usuario no disponible");
      }

      // Para actualizaciones de datos (no archivos), usar endpoint específico
      const response = await authFetch(`/api/users/${authUser.id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Intentar parsear la respuesta de error del backend
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: "Error desconocido del servidor" };
        }

        // Manejar diferentes tipos de errores
        if (errorData.type === "VALIDATION_ERROR") {
          // Para errores de validación, no fallar completamente
          throw new ValidationError(errorData.error || "Error de validación");
        } else {
          throw new Error(errorData.error || "Error al actualizar el perfil");
        }
      }

      const updatedUser = await response.json();
      setFullUserData(updatedUser);
      await refreshUserData();
      setError(null);
      return updatedUser;
    } catch (err) {
      if (err instanceof ValidationError) {
        // No establecer error de estado para errores de validación
        throw err;
      }
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para subir archivos
  const uploadFile = async (file: File, fieldName: string) => {
    try {
      if (!authUser?.id) {
        throw new Error(
          "No se puede subir archivo: ID de usuario no disponible"
        );
      }
      const formData = new FormData();
      const userBlob = new Blob([JSON.stringify(fullUserData || authUser)], {
        type: "application/json",
      });
      formData.append("user", userBlob);
      if (fieldName === "picture") {
        formData.append("profilePhoto", file);
      } else if (fieldName === "insurance") {
        formData.append("insurance", file);
      } else {
        throw new Error(`Tipo de archivo no soportado: ${fieldName}`);
      }
      const response = await authFetch(`/api/users/${authUser.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        // Intentar parsear la respuesta de error del backend
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: "Error al subir el archivo" };
        }

        // Manejar diferentes tipos de errores
        if (errorData.type === "VALIDATION_ERROR") {
          throw new ValidationError(
            errorData.error || "Error de validación en el archivo"
          );
        } else {
          throw new Error(errorData.error || "Error al subir el archivo");
        }
      }
      const updatedUser = await response.json();
      setFullUserData(updatedUser);
      await refreshUserData();
      return updatedUser;
    } catch (err) {
      if (err instanceof ValidationError) {
        // No establecer error de estado para errores de validación
        throw err;
      }
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      identification: "",
      phone: "",
      role: "",
      birthdate: undefined,
      typeOfId: "",
      teamName: "",
      eps: "",
      rh: "",
      emergencyPhone: "",
      alergies: "",
      wikiloc: "",
      terrapirata: "",
      instagram: "",
      facebook: "",
    },
  });

  useEffect(() => {
    if (authUser?.id) {
      loadUserProfile(authUser.id);
    }
  }, [authUser?.id]);

  useEffect(() => {
    if (fullUserData) {
      form.reset({
        firstName: fullUserData.firstName || "",
        lastName: fullUserData.lastName || "",
        email: fullUserData.email || "",
        identification: fullUserData.identification || "",
        phone: fullUserData.phone || "",
        role: fullUserData.role || "",
        birthdate: fullUserData.birthdate
          ? parseISO(fullUserData.birthdate)
          : undefined,
        typeOfId: fullUserData.typeOfId || "",
        teamName: fullUserData.teamName || "",
        eps: fullUserData.eps || "",
        rh: fullUserData.rh || "",
        emergencyPhone: fullUserData.emergencyPhone || "",
        alergies: fullUserData.alergies || "",
        wikiloc: fullUserData.wikiloc || "",
        terrapirata: fullUserData.terrapirata || "",
        instagram: fullUserData.instagram || "",
        facebook: fullUserData.facebook || "",
      });
    }
  }, [fullUserData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const changedFields: Partial<User> = {};
      if (fullUserData) {
        if (
          data.firstName !== (fullUserData.firstName || "") &&
          data.firstName.trim() !== ""
        ) {
          changedFields.firstName = data.firstName.trim();
        }
        if (data.lastName !== (fullUserData.lastName || "")) {
          changedFields.lastName = data.lastName?.trim() || null;
        }
        if (
          data.email !== (fullUserData.email || "") &&
          data.email.trim() !== ""
        ) {
          changedFields.email = data.email.trim();
        }
        if (data.identification !== (fullUserData.identification || "")) {
          changedFields.identification = data.identification?.trim() || null;
        }
        if (data.phone !== (fullUserData.phone || "")) {
          changedFields.phone = data.phone?.trim() || null;
        }
        if (data.role !== (fullUserData.role || "")) {
          changedFields.role = data.role?.trim() || null;
        }
        if (data.typeOfId !== (fullUserData.typeOfId || "")) {
          changedFields.typeOfId = data.typeOfId?.trim() || null;
        }
        if (data.teamName !== (fullUserData.teamName || "")) {
          changedFields.teamName = data.teamName?.trim() || null;
        }
        if (data.eps !== (fullUserData.eps || "")) {
          changedFields.eps = data.eps?.trim() || null;
        }
        if (data.rh !== (fullUserData.rh || "")) {
          changedFields.rh = data.rh?.trim() || null;
        }
        if (data.emergencyPhone !== (fullUserData.emergencyPhone || "")) {
          changedFields.emergencyPhone = data.emergencyPhone?.trim() || null;
        }
        if (data.alergies !== (fullUserData.alergies || "")) {
          changedFields.alergies = data.alergies?.trim() || null;
        }
        if (data.wikiloc !== (fullUserData.wikiloc || "")) {
          changedFields.wikiloc = data.wikiloc?.trim() || null;
        }
        if (data.terrapirata !== (fullUserData.terrapirata || "")) {
          changedFields.terrapirata = data.terrapirata?.trim() || null;
        }
        if (data.instagram !== (fullUserData.instagram || "")) {
          changedFields.instagram = data.instagram?.trim() || null;
        }
        if (data.facebook !== (fullUserData.facebook || "")) {
          changedFields.facebook = data.facebook?.trim() || null;
        }
        const newBirthdate = data.birthdate
          ? format(data.birthdate, "yyyy-MM-dd")
          : undefined;
        const currentBirthdate = fullUserData.birthdate;
        if (newBirthdate !== currentBirthdate) {
          changedFields.birthdate = newBirthdate;
        }
      }
      if (Object.keys(changedFields).length === 0) {
        toast.info("No hay cambios para guardar");
        return;
      }
      await updateUser(changedFields);
      toast.success("Perfil actualizado exitosamente");
    } catch (error) {
      if (error instanceof ValidationError) {
        // Para errores de validación, mostrar warning en lugar de error
        toast.warning(error.message, {
          description: "Por favor corrige el problema e intenta nuevamente",
          duration: 6000,
        });
      } else {
        toast.error("Error al actualizar el perfil");
      }
    }
  };

  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadFile(file, fieldName);
      toast.success("Archivo subido exitosamente");
    } catch (error) {
      if (error instanceof ValidationError) {
        // Para errores de validación, mostrar warning con información específica
        toast.warning(error.message, {
          description: "Verifica que el archivo cumpla con los requisitos",
          duration: 6000,
        });
      } else {
        toast.error("Error al subir el archivo");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = async (url: string) => {
    if (!authUser?.id) return;
    setUploading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const token = getAuthToken();
      const fullUrl = `${backendUrl}/api/users/${authUser.id}/picture`;
      const response = await fetch(fullUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pictureUrl: url }),
      });
      if (!response.ok) {
        // Intentar parsear la respuesta de error del backend
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: "Error al actualizar la foto" };
        }

        if (errorData.type === "VALIDATION_ERROR") {
          throw new ValidationError(
            errorData.error || "Error de validación en la foto"
          );
        } else {
          throw new Error(errorData.error || "Error al actualizar la foto");
        }
      }
      await loadUserProfile(authUser.id);
      await refreshUserData();
      toast.success("Foto actualizada exitosamente");
    } catch (error) {
      if (error instanceof ValidationError) {
        toast.warning(error.message, {
          description: "Verifica que la URL de la foto sea válida",
          duration: 6000,
        });
      } else {
        toast.error("Error al actualizar la foto");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!authUser?.id) return;
    setUploading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const token = getAuthToken();
      const fullUrl = `${backendUrl}/api/users/${authUser.id}/picture`;
      const response = await fetch(fullUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pictureUrl: null }),
      });
      if (!response.ok) {
        // Intentar parsear la respuesta de error del backend
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: "Error al eliminar la foto" };
        }

        if (errorData.type === "VALIDATION_ERROR") {
          throw new ValidationError(errorData.error || "Error de validación");
        } else {
          throw new Error(errorData.error || "Error al eliminar la foto");
        }
      }
      await loadUserProfile(authUser.id);
      await refreshUserData();
      toast.success("Foto eliminada exitosamente");
    } catch (error) {
      if (error instanceof ValidationError) {
        toast.warning(error.message, {
          description: "No se pudo completar la operación",
          duration: 6000,
        });
      } else {
        toast.error("Error al eliminar la foto");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleViewInsurance = () => {
    if (displayUser?.insurance) {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const fileUrl = `${backendUrl}/${displayUser.insurance}`;
      window.open(fileUrl, "_blank");
    }
  };

  const handleDownloadInsurance = () => {
    if (displayUser?.insurance) {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const fileUrl = `${backendUrl}/${displayUser.insurance}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `seguro_medico_${displayUser.firstName}_${displayUser.lastName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRemoveInsurance = async () => {
    if (!authUser?.id) return;
    setUploading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const token = getAuthToken();
      const response = await fetch(
        `${backendUrl}/api/users/${authUser.id}/insurance`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        // Intentar parsear la respuesta de error del backend
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: "Error al eliminar el documento de seguro" };
        }

        if (errorData.type === "VALIDATION_ERROR") {
          throw new ValidationError(errorData.error || "Error de validación");
        } else {
          throw new Error(
            errorData.error || "Error al eliminar el documento de seguro"
          );
        }
      }
      await loadUserProfile(authUser.id);
      await refreshUserData();
      toast.success("Documento de seguro eliminado exitosamente");
    } catch (error) {
      if (error instanceof ValidationError) {
        toast.warning(error.message, {
          description: "No se pudo completar la operación",
          duration: 6000,
        });
      } else {
        toast.error("Error al eliminar el documento de seguro");
      }
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!authUser?.id) return;
    setLoading(true);
    try {
      const response = await authFetch(
        `/api/users/${authUser.id}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        // Intentar parsear la respuesta de error del backend
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: "Error al cambiar la contraseña" };
        }

        if (errorData.type === "VALIDATION_ERROR") {
          throw new ValidationError(errorData.error || "Error de validación");
        } else {
          throw new Error(errorData.error || "Error al cambiar la contraseña");
        }
      }

      // No necesitamos actualizar el perfil completo para cambio de contraseña
      // toast.success se maneja en el componente PasswordChangeForm
    } catch (error) {
      if (error instanceof ValidationError) {
        toast.warning(error.message, {
          description: "Verifica la información e intenta nuevamente",
          duration: 6000,
        });
      } else {
        toast.error("Error al cambiar la contraseña");
      }
      throw error; // Re-lanzar para que el componente maneje el estado
    } finally {
      setLoading(false);
    }
  };

  const displayUser = fullUserData || authUser;

  if (authLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-32 h-32 mx-auto border-b-2 rounded-full animate-spin border-primary" />
          <p className="mt-4 text-center text-muted-foreground">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="flex flex-col items-center justify-center w-full max-w-xs p-8 text-center shadow bg-card/80 rounded-xl">
          <p className="mb-4 text-lg font-semibold text-destructive">
            No estás autenticado
          </p>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="w-full mt-2"
          >
            Ir a Login
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const sections: NavigationSection[] = [
    { id: "personal", label: "Información Personal", icon: UserIcon },
    { id: "medical", label: "Información Médica", icon: Heart },
    { id: "emergency", label: "Contacto de Emergencia", icon: Shield },
    { id: "social", label: "Redes Sociales", icon: Globe },
    { id: "security", label: "Seguridad", icon: Lock },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-full px-4 py-4">
      <Card className="w-full px-10 py-6 max-w-7xl bg-card/90">
        <ProfileHeader
          user={displayUser}
          uploading={uploading}
          onFileUpload={(file) => handleFileUpload(file, "picture")}
          onUrlChange={handleUrlChange}
          onRemovePhoto={handleRemovePhoto}
        />

        <div className="flex flex-col gap-8 lg:flex-row">
          <SidebarNavigation
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1">
            {activeSection === "security" ? (
              <PasswordChangeForm
                onPasswordChange={handlePasswordChange}
                loading={loading}
                canChangePassword={displayUser?.authProvider !== "GOOGLE"}
              />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <ProfileSections
                    activeSection={activeSection}
                    form={form}
                    user={displayUser}
                    uploading={uploading}
                    onInsuranceUpload={(file) =>
                      handleFileUpload(file, "insurance")
                    }
                    onInsuranceView={handleViewInsurance}
                    onInsuranceDownload={handleDownloadInsurance}
                    onInsuranceRemove={handleRemoveInsurance}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Descartar Cambios
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
