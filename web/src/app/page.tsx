import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center max-w-xl">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Welcome to VisaMate
        </h1>

        <p className="text-gray-500 mb-6">
          Guided visa preparation made simple.
        </p>

        <Link href="/wizard">
          <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            Check My Document →
          </button>
        </Link>
      </div>
    </div>
  );
}