"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
  };

  const variants = {
    primary: "text-white shadow-sm",
    secondary: "border text-sm",
    ghost: "text-sm",
  };

  const styles: React.CSSProperties =
    variant === "primary"
      ? { background: "var(--accent)" }
      : variant === "secondary"
      ? { borderColor: "var(--card-border)", color: "var(--foreground)", background: "var(--muted)" }
      : { color: "var(--muted-foreground)", background: "transparent" };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={styles}
      {...props}
    >
      {children}
    </button>
  );
}
