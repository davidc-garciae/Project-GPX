// FormFieldGroup.tsx
import { ReactNode } from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/organisms/basic/form";

interface FormFieldGroupProps {
  label: ReactNode;
  children: ReactNode;
  description?: ReactNode;
}

export function FormFieldGroup({
  label,
  children,
  description,
}: FormFieldGroupProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{children}</FormControl>
      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
}
