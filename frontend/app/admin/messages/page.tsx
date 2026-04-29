'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Trash2, RefreshCw, ArrowLeft } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchMessages(token);
  }, [router]);

  const fetchMessages = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
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
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 mt-1">Messages sent from the contact form</p>
        </div>
        <button
          onClick={() => fetchMessages(localStorage.getItem('adminToken')!)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No messages yet. Messages from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-4 lg:col-span-1">
            <h2 className="text-lg font-semibold text-white mb-4">Inbox ({messages.length})</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedMessage?.id === msg.id
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">{msg.name}</p>
                      <p className="text-xs text-gray-400">{msg.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.receivedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                    {msg.message.substring(0, 60)}...
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 lg:col-span-2">
            {selectedMessage ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                    <a href={`mailto:${selectedMessage.email}`} className="text-green-400 text-sm hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
                <div className="border-t border-gray-800 pt-4 mt-2">
                  <p className="text-gray-400 text-sm mb-2">
                    Received: {new Date(selectedMessage.receivedAt).toLocaleString()}
                  </p>
                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Mail className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-gray-400">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}