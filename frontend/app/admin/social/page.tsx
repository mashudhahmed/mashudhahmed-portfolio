'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, Plus, Edit, Trash2, Mail, Link } from 'lucide-react';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  isActive: boolean;
}

const platforms = [
  
  { name: 'email', icon: Mail, color: 'text-red-400', label: 'Email' },
];

export default function AdminSocial() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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
    const token = localStorage.getItem('adminToken');
    const url = editingId
      ? `${process.env.NEXT_PUBLIC_API_URL}/social-links/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/social-links`;
    const method = editingId ? 'PATCH' : 'POST';

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
        setEditingId(null);
        setForm({ platform: 'github', url: '', isActive: true });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save link:', error);
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

  const getPlatformIcon = (platform: string) => {
    const found = platforms.find(p => p.name === platform);
    if (found) return found.icon;
    return Link;
  };

  const getPlatformColor = (platform: string) => {
    const found = platforms.find(p => p.name === platform);
    return found?.color || 'text-gray-400';
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
          <p className="text-gray-400 mt-1">Manage your social media and contact links</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm">
            <RefreshCw className="w-3 h-3" />
            Saved successfully
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Existing Links */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Active Links</h2>
          <div className="space-y-3">
            {links.filter(l => l.isActive).map((link) => {
              const Icon = getPlatformIcon(link.platform);
              return (
                <div key={link.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${getPlatformColor(link.platform)}`} />
                    <div>
                      <p className="text-white font-medium capitalize">{link.platform}</p>
                      <p className="text-gray-500 text-xs truncate max-w-[200px]">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(link)}
                      className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
                    >
                      Active
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(link.id);
                        setForm({ platform: link.platform, url: link.url, isActive: link.isActive });
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

          {/* Inactive Links */}
          {links.filter(l => !l.isActive).length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-white mt-6 mb-4">Inactive Links</h2>
              <div className="space-y-3">
                {links.filter(l => !l.isActive).map((link) => {
                  const Icon = getPlatformIcon(link.platform);
                  return (
                    <div key={link.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-gray-700 opacity-60">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${getPlatformColor(link.platform)}`} />
                        <div>
                          <p className="text-white font-medium capitalize">{link.platform}</p>
                          <p className="text-gray-500 text-xs truncate max-w-[200px]">{link.url}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleActive(link)}
                        className="px-2 py-1 text-xs rounded bg-gray-500/10 text-gray-400 hover:bg-green-500/20 hover:text-green-400 transition"
                      >
                        Inactive
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Add/Edit Form */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{editingId ? 'Edit Link' : 'Add New Link'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {platforms.map(p => (
                  <option key={p.name} value={p.name}>{p.label}</option>
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
                placeholder="https://..."
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50">
                {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ platform: 'github', url: '', isActive: true });
                  }}
                  className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}