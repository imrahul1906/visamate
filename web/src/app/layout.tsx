import "./globals.css";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import type { Metadata } from "next";
import { ApplicantProvider } from "@/lib/context/ApplicantContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-dm-serif-display",
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
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('vm-theme');
                  var theme = saved || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen bg-[var(--vm-bg)] text-[var(--vm-text)] transition-colors duration-300"
        style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif" }}>
        <ApplicantProvider>
          <SiteHeader />

          <main className="pt-16 min-h-[calc(100vh-64px)]">
            {children}
          </main>

          <SiteFooter />
        </ApplicantProvider>
      </body>
    </html>
  );
}