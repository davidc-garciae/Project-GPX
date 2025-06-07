// SelectField.tsx
import { FormFieldGroup } from "./FormFieldGroup";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/molecules/basic/select";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  const selectContent = (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona una opción" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (label) {
    return <FormFieldGroup label={label}>{selectContent}</FormFieldGroup>;
  }

  return selectContent;
}
