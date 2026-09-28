'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MailOpen, Trash2, RefreshCw, Reply, Loader2, CheckCircle2, Clock } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import { useToast } from '@/components/Toast';
import { adminFetch } from '@/lib/adminApi';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead?: boolean;
  receivedAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Message[]>('/messages');
      setMessages(data || []);
      if (selectedMessage) {
        const updated = (data || []).find((m) => m.id === selectedMessage.id);
        if (updated) setSelectedMessage(updated);
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id: number) => {
    try {
      const updated = await adminFetch<Message>(`/messages/${id}/read`, { method: 'PATCH' });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: updated.isRead } : m)));
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, isRead: updated.isRead } : null));
      }
      showToast(updated.isRead ? 'Marked as read' : 'Marked as unread', 'info');
    } catch (error: any) {
      showToast(error.message || 'Failed to update message status', 'error');
    }
  };

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    // Automatically mark unread message as read on click
    if (!msg.isRead) {
      handleToggleRead(msg.id);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/messages/${deleteId}`, { method: 'DELETE' });
      showToast('Message deleted', 'success');
      setMessages((prev) => prev.filter((m) => m.id !== deleteId));
      if (selectedMessage?.id === deleteId) {
        setSelectedMessage(null);
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to delete message', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const filteredMessages = filter === 'unread' ? messages.filter((m) => !m.isRead) : messages;

  if (loading && messages.length === 0) {
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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Messages</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-gray-400 mt-1 text-sm">Inbox for submissions from the contact form</p>
        </div>

        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-medium border border-gray-700 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Inbox
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="glass-card p-12 text-center border border-gray-800">
          <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-white mb-1">No Messages Yet</h3>
          <p className="text-gray-400 text-sm">When visitors submit inquiries through your portfolio contact form, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages list */}
          <div className="glass-card p-4 lg:col-span-1 border border-gray-800 flex flex-col h-[700px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    filter === 'all' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    filter === 'unread' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? 'bg-green-500/15 border-green-500/40 shadow-sm'
                        : msg.isRead
                        ? 'bg-white/[0.02] border-gray-800/80 hover:bg-white/5'
                        : 'bg-green-950/20 border-green-500/30 hover:bg-green-950/30'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                          )}
                          <p className="font-semibold text-white text-sm truncate">{msg.name}</p>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                      </div>
                      <span className="text-[10px] text-gray-500 flex-shrink-0">
                        {new Date(msg.receivedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message view details */}
          <div className="glass-card p-6 lg:col-span-2 border border-gray-800 h-[700px] flex flex-col justify-between">
            {selectedMessage ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-800">
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">{selectedMessage.name}</h2>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-green-400 text-sm hover:underline font-mono inline-block mt-0.5"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleRead(selectedMessage.id)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs transition inline-flex items-center gap-1.5"
                        title={selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        {selectedMessage.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4 text-green-400" />}
                        <span className="hidden sm:inline">{selectedMessage.isRead ? 'Mark Unread' : 'Mark Read'}</span>
                      </button>
                      <button
                        onClick={() => setDeleteId(selectedMessage.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 my-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Sent: {new Date(selectedMessage.receivedAt).toLocaleString()}</span>
                  </div>

                  <div className="bg-black/50 border border-gray-800/80 rounded-2xl p-5 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      `Re: Message from ${selectedMessage.name}`
                    )}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium text-sm hover:shadow-lg transition cursor-pointer"
                  >
                    <Reply className="w-4 h-4" />
                    Reply via Email Client
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Mail className="w-12 h-12 text-gray-600 mb-3 opacity-40" />
                <p className="text-gray-400 text-sm">Select a message from the left to read full contents.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Contact Message"
        message="Are you sure you want to delete this message? This action is permanent."
        confirmText="Delete Message"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}