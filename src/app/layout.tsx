import type { Metadata } from "next";
import Providers from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketMind — Autonomous Market Intelligence Terminal",
  description:
    "AI-powered financial intelligence dashboard. Real-time sector analysis, earnings insights, and market shift detection streamed by autonomous AI agents.",
  keywords: [
    "market intelligence",
    "AI finance",
    "sector analysis",
    "earnings reports",
    "market terminal",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
