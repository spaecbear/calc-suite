/**
 * AdMob wrapper — gracefully degrades on web (no-ops).
 * On iOS/Android, calls the real @capacitor-community/admob plugin.
 *
 * Usage:
 *   import { initAds, showBanner, showInterstitial } from "@/lib/ads";
 *   await initAds();
 */

import { Capacitor } from "@capacitor/core";

// Google test ad unit IDs — safe to use during development.
// Replace with your real ad unit IDs from https://admob.google.com before release.
const AD_UNITS = {
  banner:       "ca-app-pub-3940256099942544/2934735716",
  interstitial: "ca-app-pub-3940256099942544/4411468910",
};

let admob: typeof import("@capacitor-community/admob").AdMob | null = null;

async function getPlugin() {
  if (!Capacitor.isNativePlatform()) return null;
  if (!admob) {
    const mod = await import("@capacitor-community/admob");
    admob = mod.AdMob;
  }
  return admob;
}

export async function initAds() {
  const plugin = await getPlugin();
  if (!plugin) return;
  await plugin.initialize({ testingDevices: [], initializeForTesting: true });
}

export async function showBanner() {
  const plugin = await getPlugin();
  if (!plugin) return;
  const { BannerAdSize, BannerAdPosition } = await import("@capacitor-community/admob");
  await plugin.showBanner({
    adId: AD_UNITS.banner,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: true,
  });
}

export async function hideBanner() {
  const plugin = await getPlugin();
  if (!plugin) return;
  await plugin.hideBanner();
}

export async function showInterstitial() {
  const plugin = await getPlugin();
  if (!plugin) return;
  await plugin.prepareInterstitial({ adId: AD_UNITS.interstitial, isTesting: true });
  await plugin.showInterstitial();
}
