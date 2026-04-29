import './globals.css';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VisaMate – Your visa assistant',
  description: 'Guided visa preparation platform – not legal advice.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50">
        <SiteHeader />
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
            {children}
          </div>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
