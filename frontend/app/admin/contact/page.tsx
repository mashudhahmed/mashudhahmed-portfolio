'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, CheckCircle, AlertCircle, MapPin, Clock, Zap, Mail } from 'lucide-react';

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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchContact(token);
  }, [router]);

  const fetchContact = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact-info`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setContact(data);
      }
    } catch (error) {
      console.error('Failed to fetch contact:', error);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contact),
      });

      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        const errorText = await res.text();
        console.error('Save error:', errorText);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Failed to save contact:', error);
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
          <h1 className="text-3xl font-bold text-white">Contact Information</h1>
          <p className="text-gray-400 mt-1">Manage your contact details displayed on the site</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Edit Form */}
        <div>
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Edit Contact Info</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 items-center gap-2">
                <Mail className="w-4 h-4 text-green-400" />
                Email Address
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 items-center gap-2">
                <MapPin className="w-4 h-4 text-green-400" />
                Location
              </label>
              <input
                type="text"
                value={contact.location}
                onChange={(e) => setContact({ ...contact, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                Timezone
              </label>
              <input
                type="text"
                value={contact.timezone}
                onChange={(e) => setContact({ ...contact, timezone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                Working Hours
              </label>
              <input
                type="text"
                value={contact.workingHours}
                onChange={(e) => setContact({ ...contact, workingHours: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
                placeholder="Mon-Fri, 9AM-6PM UTC+6"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                Response Time
              </label>
              <input
                type="text"
                value={contact.responseTime}
                onChange={(e) => setContact({ ...contact, responseTime: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
                placeholder="Within 24 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Available for Work</label>
              <select
                value={contact.availableForWork ? 'yes' : 'no'}
                onChange={(e) => setContact({ ...contact, availableForWork: e.target.value === 'yes' })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="yes">Yes – Available for work</option>
                <option value="no">No – Not available</option>
              </select>
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
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Location</h3>
            </div>
            <div className="mb-4 p-3 rounded-lg bg-white/5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400"><Clock className="w-3.5 h-3.5 text-green-400" /><span>Working Hours</span></div>
                <span className="text-gray-300">{contact.workingHours || '—'}</span>
              </div>
            </div>
            <div className="mb-4 p-3 rounded-lg bg-white/5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400"><Zap className="w-3.5 h-3.5 text-green-400" /><span>Response Time</span></div>
                <span className="text-gray-300">{contact.responseTime || '—'}</span>
              </div>
            </div>
            <div className="mb-4 p-3 rounded-lg bg-white/5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400"><Mail className="w-3.5 h-3.5 text-green-400" /><span>Email</span></div>
                <span className="text-gray-300">{contact.email || '—'}</span>
              </div>
            </div>
            <div className="pt-3 mt-2 border-t border-gray-700">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                contact.availableForWork 
                  ? 'bg-green-500/15 text-green-400 border-green-500/40' 
                  : 'bg-red-500/15 text-red-400 border-red-500/40'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${contact.availableForWork ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {contact.availableForWork ? 'Available for work' : 'Not available'}
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center mt-4">Preview updates as you type</p>
        </div>
      </div>
    </div>
  );
}