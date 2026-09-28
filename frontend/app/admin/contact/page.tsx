'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, MapPin, Clock, Zap, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { adminFetch, revalidatePortfolio } from '@/lib/adminApi';

interface ContactData {
  email: string;
  location: string;
  timezone: string;
  workingHours: string;
  responseTime: string;
  availableForWork: boolean;
}

export default function AdminContact() {
  const [contact, setContact] = useState<ContactData>({
    email: '',
    location: '',
    timezone: '',
    workingHours: '',
    responseTime: '',
    availableForWork: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const data = await adminFetch<ContactData>('/contact-info');
      if (data) setContact(data);
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch contact info', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await adminFetch('/contact-info', {
        method: 'PUT',
        body: JSON.stringify(contact),
      });

      showToast('Contact details saved successfully', 'success');
      await revalidatePortfolio(['contact-info']);
    } catch (error: any) {
      showToast(error.message || 'Failed to save contact details', 'error');
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Contact Information</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage public reach-out details and availability status</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 border border-gray-800 rounded-2xl">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-gray-800">Contact Settings</h2>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-green-400" />
              Email Address *
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-green-400" />
              Location
            </label>
            <input
              type="text"
              value={contact.location}
              onChange={(e) => setContact({ ...contact, location: e.target.value })}
              placeholder="e.g. Dhaka, Bangladesh"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-green-400" />
                Timezone
              </label>
              <input
                type="text"
                value={contact.timezone}
                onChange={(e) => setContact({ ...contact, timezone: e.target.value })}
                placeholder="e.g. GMT+6"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-green-400" />
                Response Time
              </label>
              <input
                type="text"
                value={contact.responseTime}
                onChange={(e) => setContact({ ...contact, responseTime: e.target.value })}
                placeholder="e.g. Within 24 hours"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-green-400" />
              Working Hours
            </label>
            <input
              type="text"
              value={contact.workingHours}
              onChange={(e) => setContact({ ...contact, workingHours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="e.g. Mon - Fri, 9:00 AM - 6:00 PM"
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Employment / Project Availability</label>
            <select
              value={contact.availableForWork ? 'yes' : 'no'}
              onChange={(e) => setContact({ ...contact, availableForWork: e.target.value === 'yes' })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="yes" className="bg-gray-900">🟢 Available for freelance / full-time opportunities</option>
              <option value="no" className="bg-gray-900">🔴 Currently unavailable / busy</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50 cursor-pointer pt-3"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Details...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Contact Details</span>
              </>
            )}
          </button>
        </form>

        {/* Live Preview */}
        <div className="glass-card p-6 border border-gray-800 rounded-2xl space-y-4 sticky top-6">
          <h2 className="text-base font-bold text-white pb-2 border-b border-gray-800">Preview</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gray-800/80">
              <span className="text-gray-400 text-xs flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-green-400" /> Email
              </span>
              <span className="text-gray-200 font-mono text-xs">{contact.email || '—'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gray-800/80">
              <span className="text-gray-400 text-xs flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-green-400" /> Location
              </span>
              <span className="text-gray-200 text-xs">{contact.location || '—'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gray-800/80">
              <span className="text-gray-400 text-xs flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-green-400" /> Hours & Timezone
              </span>
              <span className="text-gray-200 text-xs">
                {contact.workingHours || '—'} {contact.timezone ? `(${contact.timezone})` : ''}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gray-800/80">
              <span className="text-gray-400 text-xs flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-green-400" /> Response Time
              </span>
              <span className="text-gray-200 text-xs">{contact.responseTime || '—'}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800/80">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                contact.availableForWork
                  ? 'bg-green-500/15 text-green-400 border-green-500/40'
                  : 'bg-red-500/15 text-red-400 border-red-500/40'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  contact.availableForWork ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}
              />
              <span>{contact.availableForWork ? 'Available for work' : 'Not available'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}