import { UseFormReturn } from "react-hook-form";
import { User } from "@/types/auth.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/basic/form";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { DatePickerField } from "@/components/molecules/DatePickerField";
import { InsuranceFileManager } from "@/components/molecules/InsuranceFileManager";

import { ProfileFormValues } from "@/types/profile.types";

interface ProfileSectionsProps {
  activeSection: string;
  form: UseFormReturn<ProfileFormValues>;
  user?: User;
  uploading?: boolean;
  onInsuranceUpload: (file: File) => void;
  onInsuranceView: () => void;
  onInsuranceDownload: () => void;
  onInsuranceRemove: () => void;
}

export function ProfileSections({
  activeSection,
  form,
  user,
  uploading = false,
  onInsuranceUpload,
  onInsuranceView,
  onInsuranceDownload,
  onInsuranceRemove,
}: ProfileSectionsProps) {
  return (
    <>
      {/* Información Personal */}
      {activeSection === "personal" && (
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Información básica de tu perfil y datos de identificación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Este es tu email principal para notificaciones
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="typeOfId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo de documento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">
                          Cédula de Extranjería
                        </SelectItem>
                        <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                        <SelectItem value="PAS">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Documento</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+57 300 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <DatePickerField
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecciona tu fecha de nacimiento"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol/Posición</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Desarrollador, Estudiante, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Equipo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de tu equipo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información Médica */}
      {activeSection === "medical" && (
        <Card>
          <CardHeader>
            <CardTitle>Información Médica</CardTitle>
            <CardDescription>
              Información médica importante para casos de emergencia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="eps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EPS</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de tu EPS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Sangre (RH)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu tipo de sangre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="alergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alergias</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe cualquier alergia conocida..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Lista cualquier alergia a medicamentos, alimentos o
                    sustancias
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Seguro Médico</FormLabel>
              <InsuranceFileManager
                insurance={user?.insurance}
                onFileUpload={onInsuranceUpload}
                onView={onInsuranceView}
                onDownload={onInsuranceDownload}
                onRemove={onInsuranceRemove}
                uploading={uploading}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contacto de Emergencia */}
      {activeSection === "emergency" && (
        <Card>
          <CardHeader>
            <CardTitle>Contacto de Emergencia</CardTitle>
            <CardDescription>
              Información de contacto para casos de emergencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="emergencyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono de Emergencia</FormLabel>
                  <FormControl>
                    <Input placeholder="+57 300 123 4567" {...field} />
                  </FormControl>
                  <FormDescription>
                    Número de contacto de un familiar o persona cercana
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* Redes Sociales */}
      {activeSection === "social" && (
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociales y Enlaces</CardTitle>
            <CardDescription>
              Conecta tus perfiles de redes sociales y plataformas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="@tu_usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="facebook.com/tu_perfil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="wikiloc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wikiloc</FormLabel>
                    <FormControl>
                      <Input placeholder="wikiloc.com/tu_perfil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terrapirata"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terrapirata</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="terrapirata.com/tu_perfil"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
