import { useState } from "react";
import { Link, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";

interface ProfilePhotoManagerProps {
  hasPhoto?: boolean;
  onUrlChange: (url: string) => void;
  onRemove: () => void;
  updating?: boolean;
}

export function ProfilePhotoManager({
  hasPhoto = false,
  onUrlChange,
  onRemove,
  updating = false,
}: ProfilePhotoManagerProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleUrlSubmit = () => {
    // Validación de URL en el frontend (igual que EventsManagement)
    if (urlInput.trim() && !isValidImageUrl(urlInput)) {
      // El toast será manejado en page.tsx a través del error 400
      console.warn("URL de imagen no válida:", urlInput);
    }

    onUrlChange(urlInput);
    setShowUrlInput(false);
    setUrlInput("");
  };

  // Validación de URLs de imagen (igual que EventsManagement)
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim().length === 0) return true; // Permitir vacío para eliminar imagen

    // Debe ser HTTPS
    if (!url.startsWith("https://")) return false;

    // Debe contener una extensión de imagen válida o ser de servicios conocidos
    const lowerUrl = url.toLowerCase();
    return (
      !!lowerUrl.match(/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i) ||
      lowerUrl.includes("imgur.com") ||
      lowerUrl.includes("cloudinary.com") ||
      lowerUrl.includes("drive.google.com") ||
      lowerUrl.includes("dropbox.com") ||
      lowerUrl.includes("unsplash.com") ||
      lowerUrl.includes("plus.unsplash.com") ||
      lowerUrl.includes("pexels.com") ||
      lowerUrl.includes("googleusercontent.com") ||
      lowerUrl.includes("lh3.googleusercontent.com") ||
      lowerUrl.includes("lh4.googleusercontent.com") ||
      lowerUrl.includes("lh5.googleusercontent.com") ||
      lowerUrl.includes("lh6.googleusercontent.com")
    );
  };

  const handleUrlCancel = () => {
    setShowUrlInput(false);
    setUrlInput("");
  };

  return (
    <div className="space-y-4">
      {/* Botones de acción */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowUrlInput(!showUrlInput)}
          disabled={updating}
        >
          <Link className="w-4 h-4 mr-2" />
          Cambiar Foto
        </Button>

        {hasPhoto && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            disabled={updating}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        )}
      </div>

      {/* Input para URL de imagen */}
      {showUrlInput && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Input
              placeholder="https://ejemplo.com/mi-foto.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={updating}
            />
            <Button
              onClick={handleUrlSubmit}
              disabled={updating || !urlInput.trim()}
              size="sm"
            >
              {updating ? "Aplicando..." : "Aplicar"}
            </Button>
            <Button
              variant="outline"
              onClick={handleUrlCancel}
              disabled={updating}
              size="sm"
            >
              Cancelar
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Ingresa la URL HTTPS de una imagen externa (Imgur, Cloudinary, etc.)
            o deja vacío para eliminar la foto actual
          </p>
        </div>
      )}
    </div>
  );
}
