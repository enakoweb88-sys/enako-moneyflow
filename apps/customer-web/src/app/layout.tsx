import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/layout/Providers";

export const metadata: Metadata = {
  title: "E-NAKO MoneyFlow — Customer Portal",
  description:
    "Enterprise cross-border remittances, wholesale FX conversion, and instant mobile money payout to XAF.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <body className="min-h-full flex flex-col text-slate-900 bg-slate-50 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
