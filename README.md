# CalcSuite

An all-in-one calculator web app. No ads, no accounts, no APIs — just fast, offline-capable tools in one place.

## Calculators

| Calculator | What it does |
|---|---|
| **Unit Converter** | Length, weight, temperature, volume, area, speed |
| **Tip Calculator** | Tip amount, total bill, per-person split |
| **Loan Calculator** | Monthly payment, total interest, principal vs. interest bar |
| **Date Calculator** | Date difference (days/weeks/months/years) and add/subtract days |
| **Discount Calculator** | Discount by %, by $ amount, reverse lookup, and markup/profit margin |
| **Fuel Cost Calculator** | Trip cost in imperial (MPG) or metric (L/100km) |
| **Split Bill Calculator** | Split with tip & tax, per-person adjustments |

## Features

- Light & dark mode (system default, user-overridable)
- Mobile-first with bottom navigation, desktop sidebar
- Ad placeholder slots (top banner, bottom banner, side rail) — ready for Google AdSense
- Zero external APIs — all math runs client-side
- Static export compatible with Vercel

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes) — light/dark mode
- [Lucide React](https://lucide.dev/) — icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — click **Deploy**.

No environment variables needed.

## Roadmap

- [ ] Google AdSense integration (replace placeholder banners)
- [ ] Pro tier — remove ads, unlock premium calculators
- [ ] Premium calculators: BMI, currency exchange, mortgage amortization table, compound interest, VAT
- [ ] React Native / Expo port for App Store & Play Store
- [ ] PWA support (offline mode, install to home screen)

## Monetization Plan

1. **Free web version** — ad-supported via Google AdSense (3 banner slots already wired)
2. **Pro subscription** — removes ads, unlocks premium calculators
3. **App Store / Play Store** — native app (React Native migration) with in-app purchases

## License

MIT
