/**
 * Payment Success Page
 * Handles successful payment and redirects back to tool
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PaymentSuccess() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = router.query.session_id;
      const returnUrl = router.query.return;

      if (!sessionId) {
        setError('No session ID provided');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/payments/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.valid) {
          setIsValid(true);
          // Store processing pass in session/localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('processingPass', JSON.stringify(data.processingPass));
          }

          // Redirect back to tool after 2 seconds
          if (returnUrl) {
            setTimeout(() => {
              router.push(returnUrl);
            }, 2000);
          }
        } else {
          setError('Payment verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Failed to verify payment');
      } finally {
        setIsVerifying(false);
      }
    };

    if (router.isReady) {
      verifyPayment();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {isVerifying ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifying Payment...</h1>
            <p className="text-slate-600">Please wait while we confirm your payment.</p>
          </>
        ) : isValid ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
            <p className="text-slate-600 mb-6">
              Your Processing Pass is now active. You'll be redirected shortly...
            </p>
            <Link
              href="/tools/pdf"
              className="inline-block rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
            >
              Continue to PDF Tools
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Verification Failed</h1>
            <p className="text-slate-600 mb-6">{error || 'Please contact support if you were charged.'}</p>
            <Link
              href="/tools/pdf"
              className="inline-block rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:border-slate-300 transition-all"
            >
              Return to PDF Tools
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

