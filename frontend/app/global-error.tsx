'use client';

import { useEffect } from 'react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center max-w-md px-4">
            <div className="text-6xl mb-6">🚀</div>
            <h1 className="text-3xl font-bold text-green-400 mb-4">Something went wrong!</h1>
            <p className="text-gray-400 mb-6">
              We're sorry, but an unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={reset}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Try again
              </button>
              <a
                href="/"
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition"
              >
                Go back home
              </a>
            </div>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-6">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}