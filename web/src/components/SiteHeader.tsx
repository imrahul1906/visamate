import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto h-14 flex items-center justify-between px-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-[15px] font-medium text-indigo-600"
        >
          VisaMate
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-6 text-[13px] text-gray-400">
          <span className="cursor-default">How it works</span>
          <span className="cursor-default">Guides</span>
        </div>
      </div>
    </header>
  );
}