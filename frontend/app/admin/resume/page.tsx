'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, CheckCircle, AlertCircle, FileText, Upload } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface ResumeData {
  url: string;
  fileName: string;
  lastUpdated: string;
}

export default function AdminResume() {
  const [resume, setResume] = useState<ResumeData>({
    url: '/resume.pdf',
    fileName: 'resume.pdf',
    lastUpdated: '',
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
    fetchResume(token);
  }, [router]);

  const fetchResume = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResume(data);
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: resume.url, fileName: resume.fileName }),
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
          <h1 className="text-3xl font-bold text-white">Resume / CV</h1>
          <p className="text-gray-400 mt-1">Manage your downloadable resume</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Edit Form */}
        <div>
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Resume Settings</h2>

            {/* Upload PDF via Cloudinary */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 items-center gap-2">
                <Upload className="w-4 h-4 text-green-400" />
                Upload PDF
              </label>
              <ImageUpload
                onUpload={(url) => setResume({ ...resume, url })}
                currentImage={resume.url}
                folder="resume"
              />
              <p className="text-gray-500 text-xs mt-1">Upload your resume as PDF (Cloudinary will provide the URL)</p>
            </div>

            {/* Or enter URL manually */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 items-center gap-2">
                <FileText className="w-4 h-4 text-green-400" />
                Resume URL
              </label>
              <input
                type="url"
                value={resume.url}
                onChange={(e) => setResume({ ...resume, url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://example.com/resume.pdf"
              />
            </div>

            {/* File Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
              <input
                type="text"
                value={resume.fileName}
                onChange={(e) => setResume({ ...resume, fileName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="resume.pdf"
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

        {/* Preview */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-gray-400 text-sm mb-2">Download button will look like:</p>
              <a
                href={resume.url}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                <FileText className="w-4 h-4" />
                {resume.fileName}
              </a>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-yellow-400 text-sm">Note: The resume will appear in your portfolio footer.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}