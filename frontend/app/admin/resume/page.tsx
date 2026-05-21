'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, CheckCircle, AlertCircle, FileText, Upload, Trash2, ExternalLink } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface ResumeData {
  id: number;
  url: string;
  fileName: string;
  updatedAt: string;
}

export default function AdminResume() {
  const [resume, setResume] = useState<ResumeData>({
    id: 1,
    url: '',
    fileName: 'Resume.pdf',
    updatedAt: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [manualUrl, setManualUrl] = useState('');
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
        setManualUrl(data.url);
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const urlToSave = manualUrl || resume.url;
    
    if (!urlToSave) {
      alert('Please upload a resume file or enter a URL');
      return;
    }
    
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
        body: JSON.stringify({ 
          url: urlToSave, 
          fileName: 'Resume.pdf'
        }),
      });

      if (res.ok) {
        setSaveStatus('success');
        setResume({ ...resume, url: urlToSave, fileName: 'Resume.pdf' });
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Failed to save resume:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleClearResume = () => {
    if (confirm('Are you sure you want to clear the resume?')) {
      setManualUrl('');
      setResume({ ...resume, url: '', fileName: 'Resume.pdf' });
    }
  };

  const handlePdfUpload = (url: string) => {
    setResume({ ...resume, url });
    setManualUrl(url);
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
        {saveStatus === 'success' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm">
            <CheckCircle className="w-3 h-3" />
            Resume saved successfully
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-3 h-3" />
            Error saving resume
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Upload Form */}
        <div>
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-400" />
              Resume Settings
            </h2>

            {/* Method 1: Upload PDF via Cloudinary */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Upload className="w-4 h-4 inline mr-2 text-green-400" />
                Method 1: Upload PDF File
              </label>
              <ImageUpload
                onUpload={handlePdfUpload}
                currentImage={resume.url}
                folder="resume"
                accept="application/pdf"
                label="Upload PDF"
              />
              <p className="text-gray-500 text-xs mt-2">
                Upload your resume as PDF. Cloudinary will host it automatically.
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gray-900 text-gray-500">OR</span>
              </div>
            </div>

            {/* Method 2: Manual URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <ExternalLink className="w-4 h-4 inline mr-2 text-green-400" />
                Method 2: Enter URL Manually
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.com/resume.pdf"
                />
                {manualUrl && (
                  <button
                    type="button"
                    onClick={handleClearResume}
                    className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Paste a direct link to your resume (Google Drive, Dropbox, Cloudinary, etc.)
              </p>
            </div>

            {/* Current Resume Display */}
            {(resume.url || manualUrl) && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-green-400 text-xs mb-1">✓ Current Resume URL:</p>
                <p className="text-gray-300 text-xs break-all">{manualUrl || resume.url}</p>
                {resume.updatedAt && (
                  <p className="text-gray-500 text-xs mt-2">
                    Last updated: {new Date(resume.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
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

        {/* Right Column - Preview & Instructions */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Live Preview</h2>
          
          {/* Preview Card */}
          <div className="glass-card p-6 mb-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-gray-400 text-sm mb-3">Resume button on your portfolio will look like:</p>
                <div className="flex justify-center">
                  <a
                    href={manualUrl || resume.url || '#'}
                    download
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold transition ${
                      (manualUrl || resume.url) ? 'hover:shadow-lg hover:-translate-y-0.5' : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (!manualUrl && !resume.url) {
                        e.preventDefault();
                        alert('Please upload a resume first');
                      }
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    Download Resume
                  </a>
                </div>
                {(!manualUrl && !resume.url) && (
                  <p className="text-yellow-400 text-xs text-center mt-3">
                    ⚠️ No resume configured. Upload a file or enter a URL above.
                  </p>
                )}
                {(manualUrl || resume.url) && (
                  <p className="text-green-400 text-xs text-center mt-3">
                    ✓ Resume is ready for download
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">📋 Instructions</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">1</div>
                <p className="text-gray-300 text-sm">Upload your resume PDF using the Cloudinary uploader above</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">2</div>
                <p className="text-gray-300 text-sm">Or paste any direct PDF URL (Google Drive, Dropbox, etc.)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">3</div>
                <p className="text-gray-300 text-sm">Click "Save Changes" to update your portfolio</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">4</div>
                <p className="text-gray-300 text-sm">Visitors can download your resume from the homepage</p>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <p className="text-blue-400 text-xs">
                💡 <span className="text-gray-300">Pro tip:</span> Use a professional filename and keep your resume updated regularly!
              </p>
            </div>
          </div>

          {/* Support Card */}
          <div className="mt-6 p-4 rounded-lg bg-gray-800/50">
            <p className="text-gray-400 text-xs text-center">
              Supported formats: PDF (recommended) • Max file size: 10MB • Hosted on Cloudinary
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}