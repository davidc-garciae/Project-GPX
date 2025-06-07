import { FileText, Eye, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { FileUploadButton } from "./FileUploadButton";

interface InsuranceFileManagerProps {
  insurance?: string;
  onFileUpload: (file: File) => void;
  onView: () => void;
  onDownload: () => void;
  onRemove: () => void;
  uploading?: boolean;
}

export function InsuranceFileManager({
  insurance,
  onFileUpload,
  onView,
  onDownload,
  onRemove,
  uploading = false,
}: InsuranceFileManagerProps) {
  return (
    <div className="space-y-4">
      {/* Mostrar archivo actual si existe */}
      {insurance && (
        <div className="p-4 border rounded-lg bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium">Documento de seguro médico</p>
                <p className="text-sm text-muted-foreground">
                  {insurance.split("/").pop()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onView}
                title="Ver documento"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDownload}
                title="Descargar documento"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRemove}
                disabled={uploading}
                title="Eliminar documento"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Botón para subir/reemplazar */}
      <FileUploadButton
        onFileSelect={onFileUpload}
        accept=".pdf,.jpg,.jpeg,.png"
        disabled={uploading}
      >
        <span>
          {insurance ? "Reemplazar documento" : "Subir documento de seguro"}
        </span>
      </FileUploadButton>

      <p className="text-sm text-muted-foreground">
        Sube una copia de tu tarjeta de seguro médico (PDF, JPG, PNG)
      </p>
    </div>
  );
}
