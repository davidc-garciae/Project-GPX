import React from "react";

interface LabelAttributeValueProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

/**
 * LabelAttributeValue
 * Molecule para mostrar un atributo con su label y valor, siguiendo atomic design.
 */
export function LabelAttributeValue({
  label,
  value,
  className = "",
  labelClassName = "block text-xs font-medium text-muted-foreground",
  valueClassName = "mt-1 text-base font-semibold",
}: LabelAttributeValueProps) {
  return (
    <div className={className}>
      <span className={labelClassName}>{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
