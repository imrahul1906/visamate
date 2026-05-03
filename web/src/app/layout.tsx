import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import type { Metadata } from "next";

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
    <html lang="en">
      <body className="min-h-screen bg-[#f3f4f6] text-gray-900">
        <SiteHeader />

        <main className="pt-16 min-h-[calc(100vh-64px)]">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}