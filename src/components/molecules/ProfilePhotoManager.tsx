import { useState } from "react";
import { Camera, Link, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { FileUploadButton } from "./FileUploadButton";

interface ProfilePhotoManagerProps {
  hasPhoto?: boolean;
  onFileUpload: (file: File) => void;
  onUrlChange: (url: string) => void;
  onRemove: () => void;
  uploading?: boolean;
}

export function ProfilePhotoManager({
  hasPhoto = false,
  onFileUpload,
  onUrlChange,
  onRemove,
  uploading = false,
}: ProfilePhotoManagerProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleUrlSubmit = () => {
    onUrlChange(urlInput);
    setShowUrlInput(false);
    setUrlInput("");
  };

  const handleUrlCancel = () => {
    setShowUrlInput(false);
    setUrlInput("");
  };

  return (
    <div className="space-y-4">
      {/* Botones de acción */}
      <div className="flex gap-2">
        <FileUploadButton
          onFileSelect={onFileUpload}
          accept="image/*"
          disabled={uploading}
          size="sm"
        >
          <Camera className="w-4 h-4 mr-2" />
          Subir
        </FileUploadButton>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowUrlInput(!showUrlInput)}
          disabled={uploading}
        >
          <Link className="w-4 h-4 mr-2" />
          URL
        </Button>

        {hasPhoto && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            disabled={uploading}
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
              disabled={uploading}
            />
            <Button
              onClick={handleUrlSubmit}
              disabled={uploading || !urlInput.trim()}
              size="sm"
            >
              Aplicar
            </Button>
            <Button
              variant="outline"
              onClick={handleUrlCancel}
              disabled={uploading}
              size="sm"
            >
              Cancelar
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Ingresa la URL de una imagen externa o deja vacío para eliminar la
            foto actual
          </p>
        </div>
      )}
    </div>
  );
}
