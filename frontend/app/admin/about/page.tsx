'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, CheckCircle, AlertCircle, GraduationCap, Award } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
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
    setSaveStatus('idle');
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
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
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
          <h1 className="text-3xl font-bold text-white">About Section</h1>
          <p className="text-gray-400 mt-1">Manage your about page content</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Edit Form */}
        <div>
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Edit Content</h2>

            {/* Profile Photo - with direct upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Profile Photo</label>
              <ImageUpload
                onUpload={(url) => setAbout({ ...about, photoUrl: url })}
                currentImage={about.photoUrl}
                folder="profile"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bio (one sentence per line)</label>
              <textarea
                value={about.bio}
                onChange={(e) => setAbout({ ...about, bio: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Degree</label>
                <input
                  type="text"
                  value={about.education}
                  onChange={(e) => setAbout({ ...about, education: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">University</label>
                <input
                  type="text"
                  value={about.university}
                  onChange={(e) => setAbout({ ...about, university: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Major</label>
                <input
                  type="text"
                  value={about.major}
                  onChange={(e) => setAbout({ ...about, major: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
                />
              </div>
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
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
              />
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
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Error! Try again
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Live Preview</h2>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                {about.photoUrl ? (
                  <img src={about.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">📷</div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mashudh Ahmed</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">About Me</h4>
                <div className="text-gray-300 text-sm whitespace-pre-line">{about.bio || 'Your bio will appear here...'}</div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-green-400" />
                  <h4 className="text-md font-semibold text-white">Education</h4>
                </div>
                <div className="space-y-1 pl-7">
                  <p className="text-white font-medium">{about.education || '—'}</p>
                  <p className="text-gray-400 text-sm">{about.university || '—'}</p>
                  <p className="text-gray-500 text-xs">Major: {about.major || '—'} | {about.yearStart && about.yearEnd ? `${about.yearStart} – ${about.yearEnd}` : '—'}</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-green-400" />
                  <h4 className="text-md font-semibold text-white">Relevant Coursework</h4>
                </div>
                <p className="text-gray-400 text-sm pl-7">{about.coursework || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}