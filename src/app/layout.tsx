"use client";
import React, { useState, useEffect, ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/atoms/sonner";
import { Header } from "@/components/organisms/header";
import BackgroundGradient from "@/components/atoms/BackgroundGradient";
import { GeistSans } from "geist/font/sans";
import { AuthProvider } from "@/contexts/AuthContext";
import { useOAuth2Handler } from "@/hooks/useOAuth2Handler";

function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

interface RootLayoutProps {
  children: ReactNode;
}

function OAuth2HandlerEffect() {
  useOAuth2Handler();
  return null;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" className={GeistSans.className}>
      <head>
        {/* Inline script to apply color class from localStorage before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var color = localStorage.getItem('color-theme');
                if (color) {
                  document.documentElement.classList.add(color);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <BackgroundGradient />
        <AuthProvider>
          <ThemeProviderWrapper>
            <OAuth2HandlerEffect />
            <Header className="sticky top-0 z-50" />
            <main className="flex flex-1">{children}</main>
            <Toaster />
          </ThemeProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
