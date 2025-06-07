"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/molecules/basic/select";

interface ThemeOption {
  name: string;
  className: string;
  label: string;
  color: string;
}

const THEMES: ThemeOption[] = [
  {
    name: "default",
    className: "",
    label: "Base",
    color: "hsl(240 5.9% 10%)",
  },
  {
    name: "red",
    className: "theme-red",
    label: "Rojo",
    color: "hsl(0, 72.2%, 50.6%)",
  },
  {
    name: "rose",
    className: "theme-rose",
    label: "Rosa",
    color: "hsl(346.8, 77.2%, 49.8%)",
  },
  {
    name: "orange",
    className: "theme-orange",
    label: "Naranja",
    color: "hsl(24.6, 95%, 53.1%)",
  },
  {
    name: "green",
    className: "theme-green",
    label: "Verde",
    color: "hsl(142.1, 76.2%, 36.3%)",
  },
  {
    name: "blue",
    className: "theme-blue",
    label: "Azul",
    color: "hsl(221.2, 83.2%, 53.3%)",
  },
  {
    name: "yellow",
    className: "theme-yellow",
    label: "Amarillo",
    color: "hsl(47.9, 95.8%, 53.1%)",
  },
  {
    name: "violet",
    className: "theme-violet",
    label: "Violeta",
    color: "hsl(262.1, 83.3%, 57.8%)",
  },
];

export function ColorThemeSelect() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string>("default");

  // Sincroniza el color desde localStorage y aplica la clase al <html>
  useEffect(() => {
    setMounted(true);
    const color = localStorage.getItem("theme-color") || "default";
    setSelected(color);
    applyColorClass(color);
  }, []);

  // Cuando cambia el color, actualiza localStorage y la clase
  const handleChange = (value: string) => {
    setSelected(value);
    localStorage.setItem("theme-color", value);
    applyColorClass(value);
  };

  // Cuando cambia el modo (oscuro/claro), re-aplica la clase de color
  useEffect(() => {
    if (!mounted) return;
    applyColorClass(selected);
  }, [resolvedTheme, mounted]);

  function applyColorClass(color: string) {
    const classList = document.documentElement.classList;
    // Quita todas las clases de color
    THEMES.forEach((t) => {
      if (t.className) classList.remove(t.className);
    });
    // Aplica la clase seleccionada
    const themeObj = THEMES.find((t) => t.name === color);
    if (themeObj && themeObj.className) {
      classList.add(themeObj.className);
    }
  }

  if (!mounted) return null;

  return (
    <Select value={selected} onValueChange={handleChange}>
      <SelectTrigger className="w-fit min-w-[2.5rem] border-border px-2">
        <span
          className="w-4 h-4 rounded-full"
          style={{
            background: THEMES.find((t) => t.name === selected)?.color,
            display: "inline-block",
          }}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {THEMES.map((t) => (
            <SelectItem key={t.name} value={t.name}>
              <span
                className="inline-block w-4 h-4 mr-2 border rounded-full border-border"
                style={{ background: t.color }}
              />
              {t.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
