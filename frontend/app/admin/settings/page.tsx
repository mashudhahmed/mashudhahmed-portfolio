'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface Settings {
  siteTitle: string;
  typewriterPhrases: string[];
  footerText: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteTitle: 'Mashudh Ahmed | Terminal Portfolio',
    typewriterPhrases: ['Full‑Stack Developer', 'Problem Solver', 'Tech Enthusiast', 'Creative Technologist'],
    footerText: 'Built with Next.js & NestJS',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
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
        cache: 'no-store',  // ← ADD THIS
      });
      if (res.ok) {
        const data = await res.json();
        setSettings({
          siteTitle: data.siteTitle || 'Mashudh Ahmed | Terminal Portfolio',
          typewriterPhrases: data.typewriterPhrases || ['Full‑Stack Developer', 'Problem Solver', 'Tech Enthusiast', 'Creative Technologist'],
          footerText: data.footerText || 'Built with Next.js & NestJS',
        });
        setPhrasesInput((data.typewriterPhrases || ['Full‑Stack Developer', 'Problem Solver', 'Tech Enthusiast', 'Creative Technologist']).join('\n'));
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
    setSaveStatus('idle');
    const token = localStorage.getItem('adminToken');

    const updatedPhrases = phrasesInput.split('\n').filter(p => p.trim());

    const payload = {
      siteTitle: settings.siteTitle,
      typewriterPhrases: updatedPhrases,
      footerText: settings.footerText,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSettings({ ...settings, typewriterPhrases: updatedPhrases });
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
        // Refresh to show updated settings
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
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
        {saveStatus === 'success' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm">
            <CheckCircle className="w-3 h-3" />
            Settings saved
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-3 h-3" />
            Error saving
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">General Settings</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Site Title</label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-gray-500 text-xs mt-1">Appears in browser tab title</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Typewriter Phrases (one per line)</label>
            <textarea
              value={phrasesInput}
              onChange={(e) => setPhrasesInput(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
              placeholder="Full‑Stack Developer&#10;Problem Solver&#10;Tech Enthusiast&#10;Creative Technologist"
            />
            <p className="text-gray-500 text-xs mt-1">Each line will appear as a rotating phrase in the hero section</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Footer Text</label>
            <input
              type="text"
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-gray-500 text-xs mt-1">Appears after the copyright symbol in footer</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </form>

        <div className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Information</h2>
          
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <h3 className="text-white text-sm font-medium mb-2">What these settings do</h3>
            <ul className="text-gray-400 text-xs space-y-2 list-disc list-inside">
              <li><strong>Site Title:</strong> Shown in browser tab and search results</li>
              <li><strong>Typewriter Phrases:</strong> Rotating text in hero section (one per line)</li>
              <li><strong>Footer Text:</strong> Text after copyright in footer</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <h3 className="text-white text-sm font-medium mb-2">Live Preview</h3>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">Browser title: <span className="text-green-400">{settings.siteTitle}</span></p>
              <div>
                <p className="text-gray-300 text-sm mb-1">Hero typewriter will show:</p>
                <div className="flex flex-wrap gap-2">
                  {phrasesInput.split('\n').filter(p => p.trim()).slice(0, 3).map((phrase, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-green-400">
                      {phrase || '—'}
                    </span>
                  ))}
                  {phrasesInput.split('\n').filter(p => p.trim()).length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                      +{phrasesInput.split('\n').filter(p => p.trim()).length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-300 text-sm">Footer: <span className="text-green-400">© 2025 Mashudh Ahmed. {settings.footerText}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}