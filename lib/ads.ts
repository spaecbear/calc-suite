/**
 * AdMob wrapper — gracefully degrades on web (no-ops).
 *
 * BEFORE RELEASE — replace the two test ad unit IDs below with real ones
 * from https://admob.google.com → Apps → your app → Ad Units.
 *
 * Also replace the App ID in capacitor.config.ts + Info.plist.
 */

import { Capacitor } from "@capacitor/core";

const IS_PROD = process.env.NODE_ENV === "production";

// ─── Swap these before App Store submission ───────────────────────────────────
const AD_UNITS = {
  // Test IDs (Google official test IDs — safe during development)
  banner_test:       "ca-app-pub-3940256099942544/2934735716",
  interstitial_test: "ca-app-pub-3940256099942544/4411468910",

  // TODO: replace with real IDs from admob.google.com
  banner_real:       "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
  interstitial_real: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
};

const BANNER_ID       = IS_PROD ? AD_UNITS.banner_real       : AD_UNITS.banner_test;
const INTERSTITIAL_ID = IS_PROD ? AD_UNITS.interstitial_real : AD_UNITS.interstitial_test;

let admob: typeof import("@capacitor-community/admob").AdMob | null = null;

async function getPlugin() {
  if (!Capacitor.isNativePlatform()) return null;
  if (!admob) {
    const mod = await import("@capacitor-community/admob");
    admob = mod.AdMob;
  }
  return admob;
}

/** Call once on app mount, before showBanner(). */
export async function initAds() {
  const plugin = await getPlugin();
  if (!plugin) return;
  await plugin.initialize({
    testingDevices: [],
    initializeForTesting: !IS_PROD,
  });
}

/** Show a native banner pinned to the bottom of the screen. */
export async function showBanner() {
  const plugin = await getPlugin();
  if (!plugin) return;
  const { BannerAdSize, BannerAdPosition } = await import("@capacitor-community/admob");
  await plugin.showBanner({
    adId: BANNER_ID,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: !IS_PROD,
  });
}

/** Hide the banner (e.g. after user upgrades to Pro). */
export async function hideBanner() {
  const plugin = await getPlugin();
  if (!plugin) return;
  await plugin.hideBanner();
}

/**
 * Show a full-screen interstitial ad.
 * Good moment: when user switches calculators (don't spam — max once per ~3 switches).
 */
export async function showInterstitial() {
  const plugin = await getPlugin();
  if (!plugin) return;
  try {
    await plugin.prepareInterstitial({ adId: INTERSTITIAL_ID, isTesting: !IS_PROD });
    await plugin.showInterstitial();
  } catch {
    // User closed early or ad not ready — ignore
  }
}
