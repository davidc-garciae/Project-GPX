// src/components/atoms/BackgroundGradient.tsx
"use client";
import { useEffect } from "react";

export default function BackgroundGradient() {
  useEffect(() => {
    const setGradient = () => {
      const isDark = document.documentElement.classList.contains("dark");
      document.body.style.setProperty(
        "--bg-gradient",
        isDark
          ? "linear-gradient(to bottom right, hsl(var(--primary)/0.5), hsl(var(--background)))"
          : "linear-gradient(to bottom right, hsl(var(--primary)/0), hsl(var(--background)))"
      );
      document.body.style.background = "var(--bg-gradient)";
    };
    setGradient();
    // Listen for theme changes if using next-themes
    const observer = new MutationObserver(setGradient);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return null;
}
