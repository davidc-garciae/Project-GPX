import { useState } from "react";
import { FileText, Link, Eye, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";

interface InsuranceUrlManagerProps {
  insurance?: string;
  onUrlChange: (url: string) => void;
  onView: () => void;
  onDownload: () => void;
  onRemove: () => void;
  updating?: boolean;
}

export function InsuranceUrlManager({
  insurance,
  onUrlChange,
  onView,
  onDownload,
  onRemove,
  updating = false,
}: InsuranceUrlManagerProps) {
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
    <div className="p-4 border rounded-lg bg-muted/50">
      {/* Estado actual del seguro */}
      {insurance ? (
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
              onClick={onView}
              disabled={updating}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={updating}
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
              disabled={updating}
            >
              <Link className="w-4 h-4 mr-2" />
              Cambiar URL
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRemove}
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUrlInput(!showUrlInput)}
            disabled={updating}
          >
            <Link className="w-4 h-4 mr-2" />
            Agregar URL de Documento
          </Button>
        </div>
      )}

      {/* Input para URL del documento */}
      {showUrlInput && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="https://drive.google.com/file/d/document-id"
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
          <p className="text-xs text-muted-foreground">
            Ingresa la URL HTTPS de tu documento de seguro médico desde
            servicios confiables (Google Drive, Dropbox, OneDrive, etc.)
          </p>
        </div>
      )}
    </div>
  );
}
