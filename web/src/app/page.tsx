import Link from 'next/link';

export default function HomePage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Home</h1>
      <p className="text-lg text-gray-700">
        The global layout shell is in place; data and wizard functionality will be added in later PRs.
      </p>
        <Link href="/wizard">
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Check My Document →
          </button>
        </Link>
    </section>
  );}
