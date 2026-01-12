import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

function Error({ statusCode }) {
  const router = useRouter();


  return (
    <>
      <Head>
        <title>
          {statusCode ? `${statusCode} - Error` : 'Error'} | FixTools
        </title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content={
            statusCode
              ? `An error ${statusCode} occurred. Please try again or return to the homepage.`
              : 'An error occurred. Please try again or return to the homepage.'
          }
        />
        <link rel="canonical" href={`${siteHost}${router.asPath}`} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {statusCode || 'Error'}
          </h1>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            {statusCode === 404
              ? 'Page Not Found'
              : statusCode === 500
              ? 'Internal Server Error'
              : 'Something Went Wrong'}
          </h2>
          <p className="text-slate-600 mb-6">
            {statusCode === 404
              ? "The page you're looking for doesn't exist or has been moved."
              : statusCode === 500
              ? 'We encountered an error processing your request. Please try again later.'
              : 'An unexpected error occurred. Please try again or return to the homepage.'}
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
            <button
              onClick={() => window.location.reload()}
              className="block w-full rounded-xl border-2 border-blue-200 bg-blue-50 px-6 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

