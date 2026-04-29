'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, CheckCircle, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
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

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  isActive: boolean;
}

// Available platforms with their icons and colors
const availablePlatforms = [
  { name: 'github', label: 'GitHub', icon: FaGithub, color: 'text-white', defaultUrl: 'https://github.com/' },
  { name: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-400', defaultUrl: 'https://linkedin.com/in/' },
  { name: 'twitter', label: 'Twitter', icon: FaTwitter, color: 'text-sky-400', defaultUrl: 'https://twitter.com/' },
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [form, setForm] = useState({ platform: 'github', url: '', isActive: true });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchLinks(token);
  }, [router]);

  const fetchLinks = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social-links`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      } else {
        setLinks([]);
      }
    } catch (error) {
      console.error('Failed to fetch social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus('idle');
    const token = localStorage.getItem('adminToken');
    const url = editingLink
      ? `${process.env.NEXT_PUBLIC_API_URL}/social-links/${editingLink.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/social-links`;
    const method = editingLink ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        fetchLinks(token!);
        setShowModal(false);
        setEditingLink(null);
        setForm({ platform: 'github', url: '', isActive: true });
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Failed to save link:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social-links/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchLinks(token!);
      }
    } catch (error) {
      console.error('Failed to delete link:', error);
    }
  };

  const handleToggleActive = async (link: SocialLink) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social-links/${link.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...link, isActive: !link.isActive }),
      });
      if (res.ok) {
        fetchLinks(token!);
      }
    } catch (error) {
      console.error('Failed to toggle link:', error);
    }
  };

  const getPlatformInfo = (platformName: string) => {
    return availablePlatforms.find(p => p.name === platformName) || availablePlatforms[0];
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
          <h1 className="text-3xl font-bold text-white">Social Links</h1>
          <p className="text-gray-400 mt-1">Manage your social media and contact links displayed in the footer</p>
        </div>
        {saveStatus === 'success' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm">
            <CheckCircle className="w-3 h-3" />
            Saved successfully
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-3 h-3" />
            Error saving
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Existing Links List */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Your Social Links</h2>
              <button
                onClick={() => {
                  setEditingLink(null);
                  setForm({ platform: 'github', url: '', isActive: true });
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>

            {links.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No social links added yet.</p>
                <p className="text-sm mt-1">Click "Add Link" to add your social media profiles.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {links.map((link) => {
                  const platform = getPlatformInfo(link.platform);
                  const IconComponent = platform.icon;
                  return (
                    <div
                      key={link.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        link.isActive ? 'bg-white/5 border border-gray-700' : 'bg-white/5 border border-gray-700 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-5 h-5 ${platform.color}`} />
                        <div>
                          <p className="text-white font-medium">{platform.label}</p>
                          <p className="text-gray-500 text-xs truncate max-w-[200px]">{link.url}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(link)}
                          className={`px-2 py-1 text-xs rounded transition ${
                            link.isActive
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                          }`}
                        >
                          {link.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingLink(link);
                            setForm({ platform: link.platform, url: link.url, isActive: link.isActive });
                            setShowModal(true);
                          }}
                          className="p-1.5 rounded hover:bg-yellow-500/20 text-yellow-400 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(link.id)} className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">About Social Links</h2>
          <p className="text-gray-400 text-sm mb-4">
            These links appear in the footer of your portfolio. Add your social media profiles to let visitors connect with you.
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-white text-sm font-medium mb-2">Supported Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map(platform => (
                <span key={platform.name} className="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded">
                  {platform.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-4">{editingLink ? 'Edit Social Link' : 'Add Social Link'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => {
                    const platform = availablePlatforms.find(p => p.name === e.target.value);
                    setForm({ ...form, platform: e.target.value, url: platform?.defaultUrl || '' });
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {availablePlatforms.map(platform => (
                    <option key={platform.name} value={platform.name}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={`https://${form.platform}.com/username`}
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  Example: {availablePlatforms.find(p => p.name === form.platform)?.defaultUrl}username
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded bg-black/50 border-gray-700 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-300">Active (show on portfolio)</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50">
                  {saving ? 'Saving...' : editingLink ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}