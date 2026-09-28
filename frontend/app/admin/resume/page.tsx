'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, FileText, Upload, Trash2, ExternalLink, Loader2, Download, CheckCircle2, AlertTriangle, X, RefreshCw } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/components/Toast';
import { adminFetch, revalidatePortfolio } from '@/lib/adminApi';

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
  const [manualUrl, setManualUrl] = useState('');
  const [healthStatus, setHealthStatus] = useState<{
    loading: boolean;
    ok: boolean;
    status: 'valid' | 'invalid' | 'unknown';
    httpCode?: number;
    size?: string;
    error?: string;
  }>({ loading: true, ok: true, status: 'unknown' });
  const [dismissAlert, setDismissAlert] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const checkHealth = async () => {
    setHealthStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/resume?check=true', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setHealthStatus({
          loading: false,
          ok: data.ok,
          status: data.status,
          httpCode: data.httpCode,
          size: data.size,
          error: data.error,
        });
      } else {
        setHealthStatus({ loading: false, ok: false, status: 'invalid' });
      }
    } catch {
      setHealthStatus({ loading: false, ok: true, status: 'unknown' });
    }
  };

  useEffect(() => {
    fetchResume();
    checkHealth();
  }, []);

  const fetchResume = async () => {
    try {
      const data = await adminFetch<ResumeData>('/resume');
      if (data) {
        setResume(data);
        setManualUrl(data.url || '');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch current resume', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const urlToSave = (manualUrl || resume.url || '').trim();

    if (!urlToSave) {
      showToast('Please upload a resume file or enter a valid URL / path', 'error');
      return;
    }

    setSaving(true);

    try {
      const data = await adminFetch<ResumeData>('/resume', {
        method: 'PUT',
        body: JSON.stringify({
          url: urlToSave,
          fileName: resume.fileName || 'Resume.pdf',
        }),
      });

      setResume(data);
      setManualUrl(data.url);
      showToast('Resume saved successfully', 'success');
      await revalidatePortfolio(['resume']);
    } catch (error: any) {
      showToast(error.message || 'Failed to save resume', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleClearResume = () => {
    setManualUrl('');
    setResume({ ...resume, url: '' });
    showToast('Resume cleared. Click Save to confirm.', 'info');
  };

  const handlePdfUpload = (url: string, uploadedName?: string) => {
    setResume((prev) => ({
      ...prev,
      url,
      fileName: prev.fileName && prev.fileName !== 'Resume.pdf' ? prev.fileName : (uploadedName || prev.fileName || 'Mashudh_Ahmed_Resume.pdf'),
    }));
    setManualUrl(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  const activeUrl = manualUrl || resume.url;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Resume / CV</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your downloadable resume and direct document links</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column - Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6 border border-gray-800 rounded-2xl">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-400" />
            Resume Settings
          </h2>

          {/* Cloudinary Uploader */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Upload className="w-3.5 h-3.5 text-green-400" />
              Method 1: Upload PDF File
            </label>
            <ImageUpload
              onUpload={handlePdfUpload}
              currentImage={resume.url}
              folder="resume"
              accept="application/pdf"
              label="Upload PDF Document"
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="px-3 bg-gray-900 text-gray-500">OR DIRECT LINK</span>
            </div>
          </div>

          {/* Manual URL / Local Path */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-green-400" />
                Method 2: Direct URL or Local File
              </label>
              <button
                type="button"
                onClick={() => {
                  setManualUrl('/resume.pdf');
                  setResume({ ...resume, url: '/resume.pdf' });
                }}
                className="text-xs text-green-400 hover:text-green-300 underline cursor-pointer"
              >
                Use local /resume.pdf
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="https://... or /resume.pdf"
              />
              {manualUrl && (
                <button
                  type="button"
                  onClick={handleClearResume}
                  className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                  title="Clear"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-gray-500 text-[11px] mt-1.5">
              Enter a cloud link (Google Drive, Cloudinary, Dropbox) or use <code className="text-green-400">/resume.pdf</code> for your local file in <code className="text-gray-400">public/resume.pdf</code>.
            </p>
          </div>

          {/* Downloaded File Name Setting */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-green-400" />
                Downloaded File Name
              </label>
              <button
                type="button"
                onClick={() => setResume({ ...resume, fileName: 'Mashudh_Ahmed_Resume.pdf' })}
                className="text-xs text-green-400 hover:text-green-300 underline cursor-pointer font-mono"
              >
                Reset to default
              </button>
            </div>
            <input
              type="text"
              value={resume.fileName || ''}
              onChange={(e) => setResume({ ...resume, fileName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
              placeholder="e.g. Mashudh_Ahmed_Resume.pdf"
            />
            <p className="text-gray-500 text-[11px] mt-1.5">
              Visitors will always download the file with this clean name on their devices, regardless of cloud storage URLs or random hashes.
            </p>
          </div>

          {/* Status banner with live verification pill */}
          {activeUrl && (
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-gray-300 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Current Resume Target:
                </p>

                {/* Live verification status badge */}
                <div className="flex items-center gap-2">
                  {healthStatus.loading ? (
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                      <Loader2 className="w-3 h-3 animate-spin text-green-400" /> Verifying link...
                    </span>
                  ) : healthStatus.ok ? (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 flex items-center gap-1 font-mono shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      Live & Verified {healthStatus.size ? `(${Math.round(Number(healthStatus.size) / 1024)} KB)` : '(200 OK)'}
                    </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1 font-mono shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                      Access Blocked ({healthStatus.error || '401'})
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={checkHealth}
                    title="Re-check link health"
                    className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${healthStatus.loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-xs font-mono break-all bg-black/40 p-2 rounded-lg border border-gray-800/80">
                {activeUrl}
              </p>

              {resume.updatedAt && (
                <p className="text-gray-500 text-[10px]">
                  Last updated: {new Date(resume.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Conditional Dismissible Alert - ONLY displays if link actually fails health check */}
          {!dismissAlert && !healthStatus.loading && !healthStatus.ok && activeUrl && (
            <div className="relative p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2 animate-fadeIn">
              <button
                type="button"
                onClick={() => setDismissAlert(true)}
                className="absolute top-3 right-3 text-amber-400/70 hover:text-amber-300 p-1 transition cursor-pointer"
                title="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="font-semibold flex items-center gap-2 text-amber-400 pr-6">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Cloud Provider Security Alert</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                Your remote URL returned <code className="text-amber-300 bg-amber-950/50 px-1 py-0.5 rounded">401 deny or ACL failure</code>. Cloudinary accounts block direct delivery of PDF files by default.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setManualUrl('/resume.pdf');
                    setResume({ ...resume, url: '/resume.pdf' });
                    setDismissAlert(true);
                    showToast('Switched to local /resume.pdf. Click Save Changes below!', 'info');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Switch to /resume.pdf (Fixed & Guaranteed)
                </button>
                <a
                  href="https://cloudinary.com/console/settings/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-400 underline hover:text-amber-300"
                >
                  Cloudinary Security Settings ↗
                </a>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50 cursor-pointer pt-3"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Resume...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column - Live Preview */}
        <div className="space-y-6 sticky top-6">
          <div className="glass-card p-6 border border-gray-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white pb-2 border-b border-gray-800">Homepage Preview</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              How the resume download button functions on your live portfolio:
            </p>

            <div className="p-6 rounded-xl bg-black/40 border border-gray-800/80 flex flex-col items-center justify-center gap-3">
              <a
                href="/api/resume"
                target="_blank"
                rel="noopener noreferrer"
                download={resume.fileName || 'Mashudh_Ahmed_Resume.pdf'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-950/30 transition hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Test Download Resume
              </a>

              {activeUrl ? (
                <span className="text-green-400 text-xs flex items-center gap-1">
                  ✓ Ready for visitor download
                </span>
              ) : (
                <span className="text-yellow-400 text-xs">
                  ⚠️ No resume URL configured
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-400 space-y-2">
            <p className="font-semibold text-white">💡 Tips for Resume Hosting:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Keep file size under 10MB for quick mobile downloads.</li>
              <li>If using Cloudinary, ensure PDF delivery is enabled in Security settings.</li>
              <li>Or simply place your file in <code className="text-green-400">public/resume.pdf</code> and use <code className="text-green-400">/resume.pdf</code>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}