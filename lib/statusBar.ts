import { Capacitor } from "@capacitor/core";

/** Call with "dark" | "light" whenever the theme changes.
 *  Degrades silently on web. */
export async function syncStatusBar(theme: "dark" | "light") {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: theme === "dark" ? Style.Dark : Style.Light });
  } catch {
    // plugin not available — ignore
  }
}
