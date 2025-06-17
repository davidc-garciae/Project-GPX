import { UseFormReturn } from "react-hook-form";
import { CalendarIcon, FileText, Eye, Download, Trash2 } from "lucide-react";

import { User } from "@/types/auth.types";
import { ProfileFormValues } from "@/types/profile.types";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Button } from "@/components/atoms/button";
import { Calendar } from "@/components/atoms/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/atoms/badge";

// Función utilitaria simple para clases condicionales
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface ProfileSectionsProps {
  activeSection: string;
  form: UseFormReturn<ProfileFormValues>;
  user?: User;
  updating?: boolean;
  onInsuranceUrlChange: (url: string) => void;
  onInsuranceView: () => void;
  onInsuranceDownload: () => void;
  onInsuranceRemove: () => void;
}

function DatePickerField({
  value,
  onChange,
  placeholder,
}: {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {value ? format(value, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}

export function ProfileSections({
  activeSection,
  form,
  user,
  updating = false,
  onInsuranceUrlChange,
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
              <div className="p-4 border rounded-lg bg-muted/50">
                {/* Estado actual del seguro */}
                {user?.insurance ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Documento cargado
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onInsuranceView}
                        disabled={updating}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onInsuranceDownload}
                        disabled={updating}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onInsuranceRemove}
                        disabled={updating}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        No hay documento de seguro cargado
                      </span>
                    </div>

                    <Input
                      placeholder="https://drive.google.com/file/d/document-id"
                      onChange={(e) => {
                        if (e.target.value.trim()) {
                          onInsuranceUrlChange(e.target.value.trim());
                        }
                      }}
                      disabled={updating}
                    />
                    <p className="text-xs text-muted-foreground">
                      Ingresa la URL HTTPS de tu documento de seguro médico
                      desde servicios confiables (Google Drive, Dropbox,
                      OneDrive, etc.)
                    </p>
                  </div>
                )}
              </div>
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
                    <FormLabel>Terra Pirata</FormLabel>
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
