/**
 * Payment Cancel Page
 * Shown when user cancels payment
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import CustomHead from '@/components/CustomHead';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function PaymentCancel() {
  const router = useRouter();
  const returnUrl = router.query.return;
  const canonicalUrl = `${siteHost}/payment/cancel`;

  return (
    <>
      <CustomHead
        title="Payment Cancelled"
        metaDescription="Your payment was cancelled. No charges were made to your account. You can continue using FixTools free features or try again later."
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Payment cancelled - FixTools"
        ogUrl={canonicalUrl}
        keywords="payment cancelled, payment cancel, fix tools payment"
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Cancelled</h1>
        <p className="text-slate-600 mb-6">
          You cancelled the payment process. No charges were made to your account.
        </p>
        <div className="space-y-3">
          {returnUrl && (
            <Link
              href={returnUrl}
              className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
            >
              Return to Tool
            </Link>
          )}
          <Link
            href="/tools/pdf"
            className="block w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:border-slate-300 transition-all"
          >
            Browse PDF Tools
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}

