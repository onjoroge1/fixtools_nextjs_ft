import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function Custom404() {
  const router = useRouter();


  return (
    <>
      <Head>
        <title>404 - Page Not Found | FixTools</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="The page you're looking for doesn't exist. Return to FixTools homepage."
        />
        <link rel="canonical" href={`${siteHost}/404`} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
          <p className="text-slate-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
            >
              Go to Homepage
            </Link>
            <button
              onClick={() => router.back()}
              className="block w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:border-slate-300 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

