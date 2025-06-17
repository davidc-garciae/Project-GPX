"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Car,
  Shield,
  Mail,
  Phone,
  Eye,
  Settings,
  Calendar,
  Heart,
  Instagram,
  Facebook,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { authFetch } from "@/utils/authFetch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/basic/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/organisms/basic/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Switch } from "@/components/atoms/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Checkbox } from "@/components/atoms/checkbox";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  identification: string;
  phone: string;
  role: string;
  admin: boolean;
  authProvider: string;
  teamName: string;
  picture: string;
  birthdate: string;
  typeOfId: string;
  eps: string;
  rh: string;
  emergencyPhone: string;
  alergies: string;
  wikiloc: string;
  insurance: string;
  terrapirata: string;
  instagram: string;
  facebook: string;
}

interface Vehicle {
  id: number;
  name: string;
  plates: string;
  soat: string;
  category: {
    id: number;
    name: string;
  };
}

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Definición de columnas
  const allColumns = [
    { key: "usuario", label: "Usuario" },
    { key: "email", label: "Email" },
    { key: "identificacion", label: "Identificación" },
    { key: "telefono", label: "Teléfono" },
    { key: "equipo", label: "Equipo" },
    { key: "rol", label: "Rol" },
    { key: "tipo", label: "Tipo de Auth" },
    { key: "admin", label: "Admin" },
    { key: "acciones", label: "Acciones" },
  ];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns
      .map((col) => col.key)
      .filter(
        (key) => !["identificacion", "equipo", "rol", "tipo"].includes(key)
      )
  );

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await authFetch("/api/users");
      if (!response.ok) {
        throw new Error("Error al cargar usuarios");
      }
      const usersData = await response.json();
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const loadUserVehicles = async (userId: number) => {
    try {
      setLoadingVehicles(true);
      const response = await authFetch(`/api/vehicles/byuser/${userId}`);
      if (!response.ok) {
        throw new Error("Error al cargar vehículos del usuario");
      }
      const vehiclesData = await response.json();
      setUserVehicles(vehiclesData);
    } catch (err) {
      toast.error("Error al cargar vehículos del usuario");
      setUserVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
    await loadUserVehicles(user.id);
  };

  // Cambiar rol admin
  const handleToggleAdmin = async (user: User) => {
    const newAdminStatus = !user.admin;
    const action = newAdminStatus ? "dar" : "quitar";

    if (
      !confirm(
        `¿Seguro que quieres ${action} permisos de administrador a ${user.firstName} ${user.lastName}?`
      )
    )
      return;

    try {
      const response = await authFetch(`/api/users/${user.id}/admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin: newAdminStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo actualizar el rol");
      }

      const result = await response.json();
      toast.success(result.message || `Rol actualizado para ${user.firstName}`);
      loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al actualizar el rol de administrador";
      toast.error(errorMessage);
    }
  };

  const handleToggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No registrado";
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.identification &&
        user.identification.toLowerCase().includes(searchLower)) ||
      (user.teamName && user.teamName.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="w-48 h-8 rounded bg-muted animate-pulse"></div>
            <div className="w-64 h-4 mt-2 rounded bg-muted animate-pulse"></div>
          </div>
          <div className="w-64 h-10 rounded bg-muted animate-pulse"></div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded bg-muted animate-pulse"
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="mb-4 text-destructive">{error}</p>
          <Button onClick={loadUsers} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Usuarios
          </h2>
          <p className="text-muted-foreground">
            Administra todos los usuarios del sistema
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-64">
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Selector de columnas */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" /> Columnas
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="mb-2 font-semibold">Mostrar columnas</div>
              <div className="space-y-1">
                {allColumns.map((col) => (
                  <div key={col.key} className="flex items-center gap-2">
                    <Checkbox
                      id={`col-${col.key}`}
                      checked={visibleColumns.includes(col.key)}
                      onCheckedChange={() => handleToggleColumn(col.key)}
                    />
                    <Label htmlFor={`col-${col.key}`}>{col.label}</Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Administradores
            </CardTitle>
            <Shield className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.admin).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Usuarios OAuth2
            </CardTitle>
            <Mail className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.authProvider === "GOOGLE").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Usuarios Locales
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.authProvider === "LOCAL").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-md">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  {visibleColumns.includes("usuario") && (
                    <TableHead>Usuario</TableHead>
                  )}
                  {visibleColumns.includes("email") && (
                    <TableHead>Email</TableHead>
                  )}
                  {visibleColumns.includes("identificacion") && (
                    <TableHead>Identificación</TableHead>
                  )}
                  {visibleColumns.includes("telefono") && (
                    <TableHead>Teléfono</TableHead>
                  )}
                  {visibleColumns.includes("equipo") && (
                    <TableHead>Equipo</TableHead>
                  )}
                  {visibleColumns.includes("rol") && <TableHead>Rol</TableHead>}
                  {visibleColumns.includes("tipo") && (
                    <TableHead>Tipo Auth</TableHead>
                  )}
                  {visibleColumns.includes("admin") && (
                    <TableHead>Admin</TableHead>
                  )}
                  {visibleColumns.includes("acciones") && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    {visibleColumns.includes("usuario") && (
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-muted">
                            {user.picture ? (
                              <img
                                src={
                                  user.picture.startsWith("http")
                                    ? user.picture
                                    : `${
                                        process.env.NEXT_PUBLIC_BACKEND_URL ||
                                        "http://localhost:8080"
                                      }/${user.picture}`
                                }
                                alt={user.firstName}
                                className="object-cover w-10 h-10 rounded-full"
                              />
                            ) : (
                              <Users className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium max-w-[160px] truncate">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("email") && (
                      <TableCell>
                        <div className="flex items-center max-w-[200px]">
                          <Mail className="flex-shrink-0 w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("identificacion") && (
                      <TableCell>
                        <div>
                          <p>{user.identification || "No registrado"}</p>
                          {user.typeOfId && (
                            <p className="text-xs text-muted-foreground">
                              {user.typeOfId}
                            </p>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("telefono") && (
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                          {user.phone || "No registrado"}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("equipo") && (
                      <TableCell>
                        <span className="max-w-[120px] truncate block">
                          {user.teamName || "Sin equipo"}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.includes("rol") && (
                      <TableCell>{user.role || "No especificado"}</TableCell>
                    )}
                    {visibleColumns.includes("tipo") && (
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {user.authProvider}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.includes("admin") && (
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={user.admin}
                            onCheckedChange={() => handleToggleAdmin(user)}
                            aria-label="Cambiar rol admin"
                          />
                          <span className="text-xs text-muted-foreground">
                            {user.admin ? "Admin" : "Usuario"}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("acciones") && (
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de detalles del usuario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalles del Usuario - {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Información personal */}
              <div>
                <h3 className="flex items-center mb-3 text-lg font-semibold">
                  <Users className="w-5 h-5 mr-2" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <Label>Nombre Completo</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <Label>Identificación</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.identification || "No registrado"}
                      {selectedUser.typeOfId && (
                        <span className="block text-xs">
                          ({selectedUser.typeOfId})
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.phone || "No registrado"}
                    </p>
                  </div>
                  <div>
                    <Label>Teléfono de Emergencia</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.emergencyPhone || "No registrado"}
                    </p>
                  </div>
                  <div>
                    <Label>Fecha de Nacimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedUser.birthdate)}
                    </p>
                  </div>
                  <div>
                    <Label>Equipo</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.teamName || "Sin equipo"}
                    </p>
                  </div>
                  <div>
                    <Label>Rol</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.role || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <Label>Tipo de Cuenta</Label>
                    <Badge variant="secondary">
                      {selectedUser.authProvider}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Información médica */}
              <div>
                <h3 className="flex items-center mb-3 text-lg font-semibold">
                  <Heart className="w-5 h-5 mr-2" />
                  Información Médica
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <Label>EPS</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.eps || "No registrado"}
                    </p>
                  </div>
                  <div>
                    <Label>RH (Tipo de Sangre)</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.rh || "No registrado"}
                    </p>
                  </div>
                  <div>
                    <Label>Seguro</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.insurance || "No registrado"}
                    </p>
                  </div>
                  <div className="col-span-full">
                    <Label>Alergias</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.alergies || "No registrado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Redes sociales y plataformas */}
              <div>
                <h3 className="flex items-center mb-3 text-lg font-semibold">
                  <Globe className="w-5 h-5 mr-2" />
                  Redes Sociales y Plataformas
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <Label className="flex items-center">
                      <Instagram className="w-4 h-4 mr-1" />
                      Instagram
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.instagram ? (
                        <a
                          href={selectedUser.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedUser.instagram}
                        </a>
                      ) : (
                        "No registrado"
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="flex items-center">
                      <Facebook className="w-4 h-4 mr-1" />
                      Facebook
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.facebook ? (
                        <a
                          href={selectedUser.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedUser.facebook}
                        </a>
                      ) : (
                        "No registrado"
                      )}
                    </p>
                  </div>
                  <div>
                    <Label>Wikiloc</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.wikiloc ? (
                        <a
                          href={selectedUser.wikiloc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedUser.wikiloc}
                        </a>
                      ) : (
                        "No registrado"
                      )}
                    </p>
                  </div>
                  <div>
                    <Label>Terrapirata</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.terrapirata ? (
                        <a
                          href={selectedUser.terrapirata}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedUser.terrapirata}
                        </a>
                      ) : (
                        "No registrado"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehículos del usuario */}
              <div>
                <h3 className="flex items-center mb-3 text-lg font-semibold">
                  <Car className="w-5 h-5 mr-2" />
                  Vehículos Registrados ({userVehicles.length})
                </h3>
                {loadingVehicles ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 rounded bg-muted animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : userVehicles.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {userVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Car className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{vehicle.name}</p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-mono">
                                {vehicle.plates}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SOAT: {vehicle.soat || "No registrado"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{vehicle.category.name}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    <Car className="w-8 h-8 mx-auto mb-2" />
                    <p>No tiene vehículos registrados</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
