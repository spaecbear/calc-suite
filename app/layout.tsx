import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "CalcSuite — All-in-One Calculators",
  description:
    "Unit conversion, tip, loan, date, discount, fuel cost, and split bill calculators — all in one place.",
  keywords: ["calculator", "unit converter", "tip calculator", "loan calculator"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
