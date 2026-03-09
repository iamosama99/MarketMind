import type { Metadata } from "next";
import Providers from "@/components/providers";
import Sidebar from "@/components/Sidebar";
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
        <Providers>
          <div className="app-shell">
            <Sidebar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
