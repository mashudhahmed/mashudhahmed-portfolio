'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw } from 'lucide-react';

interface AboutData {
  bio: string;
  photoUrl: string;
  education: string;
  university: string;
  major: string;
  yearStart: string;
  yearEnd: string;
  coursework: string;
}

export default function AdminAbout() {
  const [about, setAbout] = useState<AboutData>({
    bio: '',
    photoUrl: '',
    education: '',
    university: '',
    major: '',
    yearStart: '',
    yearEnd: '',
    coursework: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchAbout(token);
  }, [router]);

  const fetchAbout = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAbout(data);
      }
    } catch (error) {
      console.error('Failed to fetch about:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(about),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save about:', error);
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
          <h1 className="text-3xl font-bold text-white">About Section</h1>
          <p className="text-gray-400 mt-1">Manage your about page content</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm">
            <RefreshCw className="w-3 h-3" />
            Saved successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
          <textarea
            value={about.bio}
            onChange={(e) => setAbout({ ...about, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Write your bio here..."
          />
        </div>

        {/* Photo URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Photo URL</label>
          <input
            type="url"
            value={about.photoUrl}
            onChange={(e) => setAbout({ ...about, photoUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="/your-photo.jpg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Degree</label>
            <input
              type="text"
              value={about.education}
              onChange={(e) => setAbout({ ...about, education: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">University</label>
            <input
              type="text"
              value={about.university}
              onChange={(e) => setAbout({ ...about, university: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
            />
          </div>

          {/* Major */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Major</label>
            <input
              type="text"
              value={about.major}
              onChange={(e) => setAbout({ ...about, major: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
            />
          </div>

          {/* Years */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Years</label>
            <input
              type="text"
              value={`${about.yearStart} – ${about.yearEnd}`}
              onChange={(e) => {
                const [start, end] = e.target.value.split(' – ');
                setAbout({ ...about, yearStart: start || '', yearEnd: end || '' });
              }}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
              placeholder="2022 – 2026"
            />
          </div>
        </div>

        {/* Coursework */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Relevant Coursework</label>
          <textarea
            value={about.coursework}
            onChange={(e) => setAbout({ ...about, coursework: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
          <Save className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}