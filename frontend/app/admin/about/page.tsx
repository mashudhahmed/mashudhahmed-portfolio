'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, GraduationCap, Award, Loader2, Sparkles } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/components/Toast';
import { adminFetch, revalidatePortfolio } from '@/lib/adminApi';

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
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const data = await adminFetch<AboutData>('/about');
      if (data) setAbout(data);
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch about information', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await adminFetch('/about', {
        method: 'PUT',
        body: JSON.stringify(about),
      });

      showToast('About profile updated successfully', 'success');
      await revalidatePortfolio(['about']);
    } catch (error: any) {
      showToast(error.message || 'Failed to update about details', 'error');
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">About & Education</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your profile bio, picture, and educational journey</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6 border border-gray-800 rounded-2xl">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-gray-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            Profile Content
          </h2>

          {/* Profile Photo */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">Profile Avatar / Photo</label>
            <ImageUpload
              onUpload={(url) => setAbout({ ...about, photoUrl: url })}
              currentImage={about.photoUrl}
              folder="profile"
              accept="image/*"
              label="Upload Photo"
            />
          </div>

          {/* Bio */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-gray-300">Bio / Introduction</label>
              <span className="text-[11px] text-gray-500">{about.bio.length} characters</span>
            </div>
            <textarea
              value={about.bio}
              onChange={(e) => setAbout({ ...about, bio: e.target.value })}
              rows={5}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 leading-relaxed"
              placeholder="Tell your story, your stack, your passions..."
            />
          </div>

          {/* Education Section */}
          <div className="space-y-4 pt-2 border-t border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-semibold text-white">Degree & University</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Degree Title</label>
              <input
                type="text"
                value={about.education}
                onChange={(e) => setAbout({ ...about, education: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="e.g. Bachelor of Science in Computer Science"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">University / Institute</label>
                <input
                  type="text"
                  value={about.university}
                  onChange={(e) => setAbout({ ...about, university: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="e.g. Dhaka University"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Major / Concentration</label>
                <input
                  type="text"
                  value={about.major}
                  onChange={(e) => setAbout({ ...about, major: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="e.g. Software Engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Start Year</label>
                <input
                  type="text"
                  value={about.yearStart}
                  onChange={(e) => setAbout({ ...about, yearStart: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="2022"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">End / Expected Year</label>
                <input
                  type="text"
                  value={about.yearEnd}
                  onChange={(e) => setAbout({ ...about, yearEnd: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="2026"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          {/* Coursework */}
          <div className="pt-2 border-t border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-green-400" />
              <label className="text-xs font-semibold text-white">Relevant Coursework</label>
            </div>
            <textarea
              value={about.coursework}
              onChange={(e) => setAbout({ ...about, coursework: e.target.value })}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Data Structures, Algorithms, Distributed Systems, Database Management..."
            />
            <p className="text-gray-500 text-[11px] mt-1">Separate subjects with commas</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </form>

        {/* Live Preview */}
        <div className="glass-card p-6 border border-gray-800 rounded-2xl space-y-6 sticky top-6">
          <h2 className="text-base font-bold text-white pb-2 border-b border-gray-800">Live Preview</h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 flex-shrink-0">
              {about.photoUrl ? (
                <img src={about.photoUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-mono">
                  Avatar
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Preview Card</h3>
              <p className="text-gray-400 text-xs mt-0.5">How your about card appears on your homepage</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bio</h4>
            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed bg-black/40 p-4 rounded-xl border border-gray-800/80">
              {about.bio || 'Your bio will appear here...'}
            </p>
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Education</h4>
            <div className="bg-black/40 p-4 rounded-xl border border-gray-800/80 space-y-1 text-sm">
              <p className="font-semibold text-white">{about.education || 'Degree Name'}</p>
              <p className="text-green-400 text-xs">{about.university || 'University Name'}</p>
              <p className="text-gray-400 text-xs">
                {about.yearStart || 'YYYY'} – {about.yearEnd || 'YYYY'}
                {about.major ? ` • Major in ${about.major}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}