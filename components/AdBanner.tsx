"use client";

export function AdBanner({ position = "top" }: { position?: "top" | "bottom" | "side" }) {
  const isVertical = position === "side";

  return (
    <div
      className={`flex items-center justify-center border border-dashed rounded-xl text-xs font-medium select-none ${
        isVertical ? "w-full h-32 md:h-full md:w-full" : "w-full h-16"
      }`}
      style={{
        borderColor: "var(--card-border)",
        color: "var(--muted-foreground)",
        background: "var(--muted)",
      }}
    >
      <span className="opacity-40">Advertisement</span>
    </div>
  );
}
