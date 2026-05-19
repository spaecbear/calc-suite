import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.calcsuite.app',
  appName: 'CalcSuite',
  webDir: 'out',
  ios: {
    contentInset: 'automatic',
  },
  plugins: {
    AdMob: {
      // Replace with your real AdMob App ID from https://admob.google.com
      // Format: ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
      appId: 'ca-app-pub-3940256099942544~1458002511', // ← Google test App ID (safe for dev)
    },
  },
};

export default config;
