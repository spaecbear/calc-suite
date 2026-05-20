/**
 * RevenueCat purchases wrapper — gracefully degrades on web (no-ops).
 *
 * BEFORE RELEASE:
 *   1. Create a RevenueCat account at https://app.revenuecat.com
 *   2. Replace REVENUECAT_API_KEY with your real iOS API key (starts with "appl_")
 *   3. Create product "com.calcsuite.app.pro" in App Store Connect
 *   4. Mirror that product in RevenueCat under an entitlement called "pro"
 *
 * Until then, DEV_MODE is active: the purchase sheet is skipped and
 * tapping "Unlock Pro" immediately grants access so you can test the UI.
 */

import { Capacitor } from "@capacitor/core";

const REVENUECAT_API_KEY = "appl_REPLACE_WITH_YOUR_REVENUECAT_KEY";
const PRO_PRODUCT_ID     = "com.calcsuite.app.pro";
const PRO_ENTITLEMENT    = "pro";

// Dev mode is active whenever the real key hasn't been set yet
const DEV_MODE = REVENUECAT_API_KEY.startsWith("appl_REPLACE");

type PurchasesPlugin = typeof import("@revenuecat/purchases-capacitor").Purchases;
let purchases: PurchasesPlugin | null = null;
let configured = false;

async function getPlugin(): Promise<PurchasesPlugin | null> {
  if (!Capacitor.isNativePlatform()) return null;
  if (DEV_MODE) return null; // skip native SDK in dev mode
  if (!purchases) {
    const mod = await import("@revenuecat/purchases-capacitor");
    purchases = mod.Purchases;
  }
  return purchases;
}

/** Call once on app mount before any other purchases calls. */
export async function initPurchases() {
  if (DEV_MODE) return;
  const plugin = await getPlugin();
  if (!plugin || configured) return;
  await plugin.configure({ apiKey: REVENUECAT_API_KEY });
  configured = true;
}

/** Returns true if the user has an active Pro entitlement. */
export async function isProUser(): Promise<boolean> {
  if (DEV_MODE) return false; // always false until purchase attempted
  const plugin = await getPlugin();
  if (!plugin) return false;
  try {
    const { customerInfo } = await plugin.getCustomerInfo();
    return PRO_ENTITLEMENT in customerInfo.entitlements.active;
  } catch {
    return false;
  }
}

/**
 * Triggers the App Store purchase sheet for CalcSuite Pro.
 * In dev mode, resolves immediately with true so the UI can be tested.
 */
export async function purchasePro(): Promise<boolean> {
  // ── Dev mode: instant unlock ──────────────────────────────────────────────
  if (DEV_MODE) {
    // Small delay so the loading spinner is visible (simulates network round-trip)
    await new Promise((r) => setTimeout(r, 800));
    return true;
  }

  // ── Production: real RevenueCat flow ─────────────────────────────────────
  const plugin = await getPlugin();
  if (!plugin) return false;
  try {
    const offerings = await plugin.getOfferings();
    const pkg = offerings.current?.availablePackages?.find(
      (p) => p.product.identifier === PRO_PRODUCT_ID
    );
    if (!pkg) {
      console.warn("[purchases] Pro product not found in current offering");
      throw new Error("Product not found. Please try again later.");
    }
    await plugin.purchasePackage({ aPackage: pkg });
    return true;
  } catch (e: unknown) {
    if ((e as { userCancelled?: boolean })?.userCancelled) return false;
    throw e; // re-throw so ProGate can show the message
  }
}

/**
 * Restores previous purchases — required by App Store guidelines.
 * Returns true if pro entitlement was found after restore.
 */
export async function restorePurchases(): Promise<boolean> {
  if (DEV_MODE) {
    await new Promise((r) => setTimeout(r, 800));
    return false; // nothing to restore in dev mode
  }
  const plugin = await getPlugin();
  if (!plugin) return false;
  try {
    const { customerInfo } = await plugin.restorePurchases();
    return PRO_ENTITLEMENT in customerInfo.entitlements.active;
  } catch {
    return false;
  }
}
