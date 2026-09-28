'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Sliders, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { adminFetch, revalidatePortfolio } from '@/lib/adminApi';

interface Settings {
  typewriterPhrases: string[];
  footerText: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    typewriterPhrases: ['Full‑Stack Developer', 'Problem Solver', 'Tech Enthusiast', 'Creative Technologist'],
    footerText: 'Built with Next.js & NestJS',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phrasesInput, setPhrasesInput] = useState('');
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminFetch<Settings>('/settings');
      if (data) {
        const phrases = data.typewriterPhrases || ['Full‑Stack Developer', 'Problem Solver'];
        setSettings({
          typewriterPhrases: phrases,
          footerText: data.footerText || 'Built with Next.js & NestJS',
        });
        setPhrasesInput(phrases.join('\n'));
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updatedPhrases = phrasesInput
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const payload = {
      typewriterPhrases: updatedPhrases,
      footerText: settings.footerText.trim(),
    };

    try {
      await adminFetch('/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      setSettings({ ...settings, typewriterPhrases: updatedPhrases });
      showToast('Settings saved successfully', 'success');
      await revalidatePortfolio(['settings']);
    } catch (error: any) {
      showToast(error.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  const livePhrases = phrasesInput
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Portfolio Settings</h1>
          <p className="text-gray-400 mt-1 text-sm">Configure hero animation phrases and site-wide branding</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6 border border-gray-800 rounded-2xl">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-gray-800 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-green-400" />
            General Branding
          </h2>

          {/* Typewriter Phrases */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Hero Rotating Phrases (one per line)
              </label>
              <span className="text-[11px] text-gray-500 font-mono">{livePhrases.length} phrases</span>
            </div>
            <textarea
              value={phrasesInput}
              onChange={(e) => setPhrasesInput(e.target.value)}
              rows={6}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-green-500 font-mono text-xs leading-relaxed"
              placeholder={'Full‑Stack Developer\nNext.js Specialist\nPostgreSQL & TypeORM Enthusiast'}
              required
            />
            <p className="text-gray-500 text-[11px] mt-1.5">Each non-empty line rotates with typewriter animation in the homepage hero.</p>
          </div>

          {/* Footer Text */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Footer Credits Text</label>
            <input
              type="text"
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Built with Next.js, NestJS & TailwindCSS"
            />
            <p className="text-gray-500 text-[11px] mt-1.5">Appears right next to copyright year in the footer.</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50 cursor-pointer pt-3"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </form>

        <div className="space-y-6">
          {/* Live Preview Card */}
          <div className="glass-card p-6 border border-gray-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white pb-2 border-b border-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              Live Preview
            </h2>
            
            <div className="p-4 rounded-xl bg-black/40 border border-gray-800/80 space-y-2">
              <p className="text-gray-400 text-xs font-medium">Hero Typewriter Carousel:</p>
              <div className="flex flex-wrap gap-1.5">
                {livePhrases.length === 0 ? (
                  <span className="text-gray-600 text-xs italic">No phrases specified</span>
                ) : (
                  livePhrases.map((phrase, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 font-mono"
                    >
                      {phrase}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-gray-800/80 space-y-1">
              <p className="text-gray-400 text-xs font-medium">Footer Preview:</p>
              <p className="text-gray-300 text-xs font-mono">
                © {new Date().getFullYear()} Mashudh Ahmed. {settings.footerText || 'Built with Next.js'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}