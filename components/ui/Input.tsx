"use client";

import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
}

export function Input({ label, unit, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] ${unit ? "pr-14" : ""} ${className}`}
          style={{
            background: "var(--input-bg)",
            borderColor: "var(--input-border)",
            color: "var(--foreground)",
          }}
          {...props}
        />
        {unit && (
          <span
            className="absolute right-3 text-xs font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] appearance-none cursor-pointer ${className}`}
        style={{
          background: "var(--input-bg)",
          borderColor: "var(--input-border)",
          color: "var(--foreground)",
        }}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
