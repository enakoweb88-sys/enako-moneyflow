import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/layout/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-NAKO MoneyFlow — Cross-Border Remittance & Regional Settlement",
  description:
    "Institutional cross-border remittances, BEAC parity FX conversion, and instant mobile money payout to XAF across the CEMAC region.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-slate-900 bg-white font-sans selection:bg-[#00c2c7]/20 selection:text-[#001f5b]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
