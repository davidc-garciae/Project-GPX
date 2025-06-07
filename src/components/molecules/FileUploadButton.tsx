import { Upload } from "lucide-react";
import { Button } from "@/components/atoms/button";

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function FileUploadButton({
  onFileSelect,
  accept = "*",
  disabled = false,
  children,
  className,
  variant = "outline",
  size = "default",
}: FileUploadButtonProps) {
  const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset input value para permitir seleccionar el mismo archivo de nuevo
    event.target.value = "";
  };

  return (
    <>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id={inputId}
        disabled={disabled}
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={() => document.getElementById(inputId)?.click()}
        disabled={disabled}
        className={className}
      >
        {children || (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Subir archivo
          </>
        )}
      </Button>
    </>
  );
}
