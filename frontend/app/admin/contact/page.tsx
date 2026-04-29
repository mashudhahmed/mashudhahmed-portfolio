'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, MapPin, Clock, Zap, Mail } from 'lucide-react';

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
  const [saved, setSaved] = useState(false);
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
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save contact:', error);
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
        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm">
            <RefreshCw className="w-3 h-3" />
            Saved successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-400" />
              Email Address
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
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

          {/* Timezone */}
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

          {/* Working Hours */}
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

          {/* Response Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 items-center gap-2">
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

          {/* Availability */}
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