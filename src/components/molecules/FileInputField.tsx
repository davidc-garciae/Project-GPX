// FileInputField.tsx
import { FormFieldGroup } from "./FormFieldGroup";
import { Input } from "@/components/atoms/input";

interface FileInputFieldProps {
  label?: string;
  onChange: (file: File | null) => void;
  accept?: string;
  description?: string;
}

export function FileInputField({
  label,
  onChange,
  accept,
  description,
}: FileInputFieldProps) {
  const fileInputContent = (
    <Input
      type="file"
      accept={accept}
      onChange={(e) => onChange(e.target.files?.[0] || null)}
    />
  );

  if (label) {
    return (
      <FormFieldGroup label={label} description={description}>
        {fileInputContent}
      </FormFieldGroup>
    );
  }

  return fileInputContent;
}
