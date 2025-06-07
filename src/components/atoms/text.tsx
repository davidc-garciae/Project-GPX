import React from "react";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Title atom: fuente actual, 700, 14px, theme-aware color, 21px line-height
 * Uso: <Title>Texto</Title>
 */
export function Title({ children, className = "" }: TitleProps) {
  return (
    <span
      className={`font-sans font-bold text-[14px] leading-[21px] text-foreground ${className}`.trim()}
    >
      {children}
    </span>
  );
}

/**
 * Subtitle atom: GeistSans, 500, 14px, theme-aware color, 14px line-height
 * Uso: <Subtitle>Texto</Subtitle>
 */
export function Subtitle({ children, className = "" }: TitleProps) {
  return (
    <span
      className={`font-sans font-medium text-[14px] leading-[14px] text-foreground ${className}`.trim()}
    >
      {children}
    </span>
  );
}

/**
 * Detail atom: GeistSans, 400, 12px, theme-aware color, 16px line-height
 * Uso: <Detail>Texto</Detail>
 */
export function Detail({ children, className = "" }: TitleProps) {
  return (
    <span
      className={`font-sans font-normal text-[12px] leading-[16px] text-muted-foreground ${className}`.trim()}
    >
      {children}
    </span>
  );
}

/**
 * LabelText atom: fuente actual, 700, 10px, theme-aware color, 10px line-height
 * Uso: <LabelText>Texto</LabelText>
 */
export function LabelText({ children, className = "" }: TitleProps) {
  return (
    <span
      className={`font-sans font-bold text-[10px] leading-[10px] text-muted-foreground uppercase tracking-wide ${className}`.trim()}
    >
      {children}
    </span>
  );
}
