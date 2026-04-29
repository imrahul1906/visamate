import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-zinc-200">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold text-indigo-600">
          VisaMate
        </Link>
        <ul className="flex space-x-4 text-sm text-gray-600">
          <li className="cursor-default opacity-60" title="Coming soon">How it works</li>
          <li className="cursor-default opacity-60" title="Coming soon">Guides</li>
        </ul>
      </nav>
    </header>
  );
}
