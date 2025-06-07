"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon } from "./sun";
import { MoonIcon } from "./moon";

interface ThemeToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function ThemeToggleButton({
  className = "",
  ...props
}: ThemeToggleButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      ref={buttonRef}
      aria-label="Alternar tema"
      {...props}
      className={` p-2 transition-colors border rounded-full shadow bg-background/80 hover:bg-primary/10 border-border px-2 ${className}`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <SunIcon className="flex items-center justify-center w-5 h-5 " />
      ) : (
        <MoonIcon className="flex items-center justify-center w-5 h-5" />
      )}
    </button>
  );
}
