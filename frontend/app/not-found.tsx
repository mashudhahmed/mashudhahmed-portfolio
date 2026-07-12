export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-green-400 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-block"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}