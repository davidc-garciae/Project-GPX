"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
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
import { Textarea } from "@/components/atoms/textarea";
import { Label } from "@/components/atoms/label";

interface Category {
  id: number;
  name: string;
  details: string;
}

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await authFetch("/api/categories");
      if (!response.ok) {
        throw new Error("Error al cargar categorías");
      }
      const categoriesData = await response.json();
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      return;
    }

    try {
      const response = await authFetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar categoría");
      }

      await loadCategories();
      toast.success("Categoría eliminada exitosamente");
    } catch (err) {
      toast.error("Error al eliminar categoría");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Error al ${editingCategory ? "actualizar" : "crear"} categoría`
        );
      }

      await loadCategories();
      setIsDialogOpen(false);
      toast.success(
        `Categoría ${editingCategory ? "actualizada" : "creada"} exitosamente`
      );
    } catch (err) {
      toast.error(
        `Error al ${editingCategory ? "actualizar" : "crear"} categoría`
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="w-48 h-8 rounded bg-muted animate-pulse"></div>
            <div className="w-64 h-4 mt-2 rounded bg-muted animate-pulse"></div>
          </div>
          <div className="w-32 h-10 rounded bg-muted animate-pulse"></div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
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
          <Button onClick={loadCategories} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Categorías
          </h2>
          <p className="text-muted-foreground">
            Administra las categorías de vehículos del sistema
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la Categoría</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: Motos, UTV, Carros..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="details">Descripción</Label>
                <Textarea
                  id="details"
                  value={formData.details || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  placeholder="Descripción de la categoría..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCategory ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full max-w-none">
        <CardHeader>
          <CardTitle>Lista de Categorías ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-mono text-sm">
                      #{category.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FolderOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-md text-sm text-muted-foreground line-clamp-2">
                        {category.details || "Sin descripción"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {categories.length === 0 && (
            <div className="py-8 text-center">
              <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
                No hay categorías
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comienza creando tu primera categoría de vehículos.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Categoría
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
