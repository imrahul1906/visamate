import "./globals.css";
import { DM_Sans } from "next/font/google";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import type { Metadata } from "next";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "VisaMate – Your visa assistant",
  description: "Guided visa preparation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body
        className="min-h-screen bg-[#f3f4f6] text-gray-900"
        style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', system-ui,sans-serif" }}>
        <SiteHeader />

        <main className="pt-16 min-h-[calc(100vh-64px)]">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}