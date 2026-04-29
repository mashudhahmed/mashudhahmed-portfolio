'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';

interface Settings {
  siteTitle: string;
  heroGradient: string;
  typewriterPhrases: string[];
  footerText: string;
  adminToken: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteTitle: 'Mashudh Ahmed | Terminal Portfolio',
    heroGradient: 'from-green-400 via-cyan-400 to-blue-500',
    typewriterPhrases: ['Full‑Stack Developer', 'Problem Solver', 'Tech Enthusiast', 'Creative Technologist'],
    footerText: 'Built with Next.js & NestJS',
    adminToken: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [phrasesInput, setPhrasesInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSettings(token);
  }, [router]);

  const fetchSettings = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setPhrasesInput(data.typewriterPhrases.join('\n'));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');

    const updatedPhrases = phrasesInput.split('\n').filter(p => p.trim());

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...settings, typewriterPhrases: updatedPhrases }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Configure your portfolio settings</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm">
            <RefreshCw className="w-3 h-3" />
            Settings saved
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Settings */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">General Settings</h2>

          {/* Site Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Site Title</label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Hero Gradient */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Hero Gradient</label>
            <input
              type="text"
              value={settings.heroGradient}
              onChange={(e) => setSettings({ ...settings, heroGradient: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
              placeholder="from-green-400 via-cyan-400 to-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">Example: from-green-400 via-cyan-400 to-blue-500</p>
          </div>

          {/* Typewriter Phrases */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Typewriter Phrases (one per line)</label>
            <textarea
              value={phrasesInput}
              onChange={(e) => setPhrasesInput(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Full‑Stack Developer&#10;Problem Solver&#10;Tech Enthusiast"
            />
          </div>

          {/* Footer Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Footer Text</label>
            <input
              type="text"
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
            <Save className="w-4 h-4" />
          </button>
        </form>

        {/* Admin Token Info */}
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Security</h2>
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Admin Token</p>
                <p className="text-gray-400 text-xs mt-1">
                  Your admin token is stored in the backend <code className="text-green-400">.env</code> file.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  To change it, edit <code className="text-green-400">ADMIN_TOKEN=your-secure-token</code> in your backend .env file.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <h3 className="text-white text-sm font-medium mb-2">What to change</h3>
            <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
              <li>Update your photo in the About section</li>
              <li>Add new projects regularly</li>
              <li>Keep your skills up to date</li>
              <li>Monitor your portfolio analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}