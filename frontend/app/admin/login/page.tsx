'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, LogIn, AlertCircle } from 'lucide-react';

function LoginForm() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setError('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${baseUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: token.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.access_token) {
        // Store cryptographically signed JWT instead of master password
        localStorage.setItem('adminToken', data.access_token);
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid admin credentials. Please check your token.');
      }
    } catch {
      setError('Cannot connect to backend server. Make sure it is running on port 4000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 max-w-md w-full border border-gray-800 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 mb-4 shadow-inner">
          <Shield className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
        <p className="text-gray-400 text-sm mt-1">Authenticate with your secure ADMIN_TOKEN</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Admin Security Token</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition"
            placeholder="Enter your admin token"
            autoFocus
            required
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs leading-relaxed animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-green-950/40 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <span>Verifying credentials...</span>
          ) : (
            <>
              <span>Authenticate & Enter</span>
              <LogIn className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4">
      <Suspense fallback={<div className="text-gray-400 text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}