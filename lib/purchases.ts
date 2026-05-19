/**
 * RevenueCat purchases wrapper — gracefully degrades on web (no-ops).
 * On iOS/Android, calls the real @revenuecat/purchases-capacitor plugin.
 *
 * Usage:
 *   import { initPurchases, purchasePro, restorePurchases, isProUser } from "@/lib/purchases";
 *   await initPurchases();
 *
 * Before release:
 *   1. Create a RevenueCat account at https://app.revenuecat.com
 *   2. Replace REVENUECAT_API_KEY with your real iOS API key
 *   3. Create a product "com.calcsuite.app.pro" in App Store Connect
 *   4. Mirror that product in your RevenueCat dashboard under an entitlement called "pro"
 */

import { Capacitor } from "@capacitor/core";

// Replace with your RevenueCat iOS API key before release
const REVENUECAT_API_KEY = "appl_REPLACE_WITH_YOUR_REVENUECAT_KEY";

// Must match App Store Connect product ID and RevenueCat dashboard
const PRO_PRODUCT_ID = "com.calcsuite.app.pro";
const PRO_ENTITLEMENT = "pro";

type PurchasesPlugin = typeof import("@revenuecat/purchases-capacitor").Purchases;
let purchases: PurchasesPlugin | null = null;

async function getPlugin(): Promise<PurchasesPlugin | null> {
  if (!Capacitor.isNativePlatform()) return null;
  if (!purchases) {
    const mod = await import("@revenuecat/purchases-capacitor");
    purchases = mod.Purchases;
  }
  return purchases;
}

export async function initPurchases() {
  const plugin = await getPlugin();
  if (!plugin) return;
  await plugin.configure({ apiKey: REVENUECAT_API_KEY });
}

/**
 * Returns true if the user has purchased CalcSuite Pro.
 * On web always returns false.
 */
export async function isProUser(): Promise<boolean> {
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
 * Returns true on success, false if cancelled or failed.
 */
export async function purchasePro(): Promise<boolean> {
  const plugin = await getPlugin();
  if (!plugin) return false;
  try {
    // getOfferings() returns PurchasesOfferings directly (not wrapped)
    const offerings = await plugin.getOfferings();
    const pkg = offerings.current?.availablePackages?.find(
      (p) => p.product.identifier === PRO_PRODUCT_ID
    );
    if (!pkg) {
      console.warn("[purchases] Pro product not found in current offering");
      return false;
    }
    await plugin.purchasePackage({ aPackage: pkg });
    return true;
  } catch (e: unknown) {
    if ((e as { userCancelled?: boolean })?.userCancelled) return false;
    console.error("[purchases] purchase error", e);
    return false;
  }
}

/**
 * Restores previous purchases — required by App Store guidelines.
 * Returns true if pro entitlement was found after restore.
 */
export async function restorePurchases(): Promise<boolean> {
  const plugin = await getPlugin();
  if (!plugin) return false;
  try {
    const { customerInfo } = await plugin.restorePurchases();
    return PRO_ENTITLEMENT in customerInfo.entitlements.active;
  } catch {
    return false;
  }
}
