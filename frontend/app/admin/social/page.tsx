'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, ExternalLink, Loader2, X, Eye, EyeOff } from 'lucide-react';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaDiscord,
  FaDev,
  FaMedium,
  FaStackOverflow,
  FaEnvelope,
  FaWhatsapp,
  FaTelegram,
} from 'react-icons/fa';
import ConfirmModal from '@/components/ConfirmModal';
import { useToast } from '@/components/Toast';
import { adminFetch, revalidatePortfolio } from '@/lib/adminApi';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  isActive: boolean;
}

const availablePlatforms = [
  { name: 'github', label: 'GitHub', icon: FaGithub, color: 'text-white', defaultUrl: 'https://github.com/' },
  { name: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-400', defaultUrl: 'https://linkedin.com/in/' },
  { name: 'twitter', label: 'Twitter / X', icon: FaTwitter, color: 'text-sky-400', defaultUrl: 'https://twitter.com/' },
  { name: 'instagram', label: 'Instagram', icon: FaInstagram, color: 'text-pink-400', defaultUrl: 'https://instagram.com/' },
  { name: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'text-blue-500', defaultUrl: 'https://facebook.com/' },
  { name: 'youtube', label: 'YouTube', icon: FaYoutube, color: 'text-red-500', defaultUrl: 'https://youtube.com/@' },
  { name: 'tiktok', label: 'TikTok', icon: FaTiktok, color: 'text-white', defaultUrl: 'https://tiktok.com/@' },
  { name: 'discord', label: 'Discord', icon: FaDiscord, color: 'text-indigo-400', defaultUrl: 'https://discord.gg/' },
  { name: 'devto', label: 'Dev.to', icon: FaDev, color: 'text-gray-400', defaultUrl: 'https://dev.to/' },
  { name: 'medium', label: 'Medium', icon: FaMedium, color: 'text-white', defaultUrl: 'https://medium.com/@' },
  { name: 'stackoverflow', label: 'Stack Overflow', icon: FaStackOverflow, color: 'text-orange-400', defaultUrl: 'https://stackoverflow.com/users/' },
  { name: 'email', label: 'Email', icon: FaEnvelope, color: 'text-red-400', defaultUrl: 'mailto:' },
  { name: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-400', defaultUrl: 'https://wa.me/' },
  { name: 'telegram', label: 'Telegram', icon: FaTelegram, color: 'text-blue-400', defaultUrl: 'https://t.me/' },
];

export default function AdminSocial() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ platform: 'github', url: '', isActive: true });
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const data = await adminFetch<SocialLink[]>('/social-links');
      setLinks(data || []);
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch social links', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const endpoint = editingLink ? `/social-links/${editingLink.id}` : '/social-links';
    const method = editingLink ? 'PATCH' : 'POST';

    try {
      await adminFetch(endpoint, {
        method,
        body: JSON.stringify({
          platform: form.platform,
          url: form.url.trim(),
          isActive: form.isActive,
        }),
      });

      showToast(editingLink ? 'Social link updated' : 'Social link created', 'success');
      await revalidatePortfolio(['social-links']);
      setShowModal(false);
      setEditingLink(null);
      setForm({ platform: 'github', url: '', isActive: true });
      fetchLinks();
    } catch (error: any) {
      showToast(error.message || 'Failed to save social link', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (link: SocialLink) => {
    try {
      await adminFetch(`/social-links/${link.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !link.isActive }),
      });
      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, isActive: !link.isActive } : l))
      );
      showToast(`${link.platform} is now ${!link.isActive ? 'active' : 'hidden'}`, 'info');
      await revalidatePortfolio(['social-links']);
    } catch (error: any) {
      showToast(error.message || 'Failed to toggle status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/social-links/${deleteId}`, { method: 'DELETE' });
      showToast('Social link removed', 'success');
      setLinks((prev) => prev.filter((l) => l.id !== deleteId));
      await revalidatePortfolio(['social-links']);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete link', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const getPlatformInfo = (platformName: string) => {
    return availablePlatforms.find((p) => p.name.toLowerCase() === platformName.toLowerCase()) || {
      name: platformName,
      label: platformName,
      icon: FaGithub,
      color: 'text-white',
      defaultUrl: '',
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Social Profiles</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage public developer channels, handles, and reach-out links</p>
        </div>
        <button
          onClick={() => {
            setEditingLink(null);
            setForm({ platform: 'github', url: '', isActive: true });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:shadow-lg transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Social Link
        </button>
      </div>

      {links.length === 0 ? (
        <div className="glass-card p-12 text-center border border-gray-800">
          <p className="text-gray-400 text-sm">No social links configured. Click &quot;Add Social Link&quot; to connect your channels.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => {
            const platform = getPlatformInfo(link.platform);
            const Icon = platform.icon;
            return (
              <div
                key={link.id}
                className={`glass-card p-4 rounded-xl border flex items-center justify-between group transition-all duration-200 ${
                  link.isActive
                    ? 'border-gray-800/80 hover:border-green-500/40'
                    : 'border-gray-800/40 opacity-60 bg-gray-950/40'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-xl bg-gray-800/80 flex-shrink-0 ${platform.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm capitalize">{platform.label}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-green-400 truncate block transition max-w-[180px]"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleToggleActive(link)}
                    className={`p-1.5 rounded-lg transition ${
                      link.isActive ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-green-400'
                    }`}
                    title={link.isActive ? 'Hide on portfolio' : 'Show on portfolio'}
                  >
                    {link.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingLink(link);
                      setForm({ platform: link.platform, url: link.url, isActive: link.isActive });
                      setShowModal(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-yellow-500/10 text-yellow-400 transition"
                    title="Edit link"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(link.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                    title="Delete link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">{editingLink ? 'Edit Link' : 'Add Social Link'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => {
                    const selected = availablePlatforms.find((p) => p.name === e.target.value);
                    setForm({
                      ...form,
                      platform: e.target.value,
                      url: form.url || selected?.defaultUrl || '',
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {availablePlatforms.map((p) => (
                    <option key={p.name} value={p.name} className="bg-gray-900">
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Profile / Target URL *</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveLink"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="isActiveLink" className="text-xs text-gray-300">
                  Visible on public portfolio
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving...' : editingLink ? 'Save Changes' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Remove Social Link"
        message="Are you sure you want to delete this social link?"
        confirmText="Remove Link"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}