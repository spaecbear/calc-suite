"use client";

/**
 * Reserves vertical space at the bottom of the scroll area so content
 * doesn't hide under the native AdMob banner view.
 *
 * On web (dev/preview) it renders a visible placeholder so layout is testable.
 * On device the div is invisible — the real ad sits on top as a native layer.
 */

import { Capacitor } from "@capacitor/core";

const BANNER_HEIGHT = 60; // ADAPTIVE_BANNER is typically 50–90px

export function AdBanner() {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    // Just a spacer — the native AdMob view floats over this area
    return <div style={{ height: BANNER_HEIGHT }} />;
  }

  // Web/dev: visible placeholder so layout looks correct while building
  return (
    <div
      className="flex items-center justify-center rounded-xl border border-dashed text-xs font-medium select-none w-full"
      style={{
        height: BANNER_HEIGHT,
        borderColor: "var(--card-border)",
        color: "var(--muted-foreground)",
        background: "var(--muted)",
      }}
    >
      <span className="opacity-40">Advertisement</span>
    </div>
  );
}
