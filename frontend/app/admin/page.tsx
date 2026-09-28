'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderGit2,
  Code2,
  Eye,
  Users,
  MessageSquare,
  Activity,
  Plus,
  ArrowRight,
  Loader2,
  Server,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminApi';

interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalViews: number;
  totalVisitors: number;
  totalMessages: number;
  unreadMessages: number;
  recentProjects: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalSkills: 0,
    totalViews: 0,
    totalVisitors: 0,
    totalMessages: 0,
    unreadMessages: 0,
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Parallel fetch with error resilience
      const [projects, skills, visitorData, messages] = await Promise.all([
        adminFetch('/projects').catch(() => []),
        adminFetch('/skills').catch(() => []),
        adminFetch('/visitor').catch(() => ({ count: 0 })),
        adminFetch('/messages').catch(() => []),
      ]);

      const projectList = Array.isArray(projects) ? projects : [];
      const skillList = Array.isArray(skills) ? skills : [];
      const messageList = Array.isArray(messages) ? messages : [];

      const totalViews = projectList.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
      const unreadCount = messageList.filter((m: any) => !m.isRead).length;

      setStats({
        totalProjects: projectList.length,
        totalSkills: skillList.length,
        totalViews,
        totalVisitors: visitorData?.count || 0,
        totalMessages: messageList.length,
        unreadMessages: unreadCount,
        recentProjects: projectList.slice(0, 5),
      });
    } catch (err: any) {
      console.error('Failed to fetch dashboard stats:', err);
      setError(err?.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderGit2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      href: '/admin/projects',
    },
    {
      title: 'Skills Listed',
      value: stats.totalSkills,
      icon: Code2,
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
      href: '/admin/skills',
    },
    {
      title: 'Project Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      href: '/admin/projects',
    },
    {
      title: 'Unique Visitors',
      value: stats.totalVisitors,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      href: '/admin',
    },
    {
      title: 'Inbound Messages',
      value: stats.totalMessages,
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : null,
      icon: MessageSquare,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      href: '/admin/messages',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center border border-red-500/30 rounded-2xl max-w-lg mx-auto">
        <p className="text-red-400 mb-4 text-sm">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchStats();
          }}
          className="px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">Real-time metrics, analytics, and content management summary</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>Backend Connected (Port 4000)</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className={`glass-card p-5 rounded-2xl border ${stat.bg} hover:scale-[1.02] transition-all duration-200 block group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-xs font-medium">{stat.title}</span>
              <div className={`p-2 rounded-xl bg-black/40 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
              {stat.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-semibold">
                  {stat.badge}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="glass-card p-6 border border-gray-800 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              <h2 className="text-base font-bold text-white">Recent Projects</h2>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {stats.recentProjects.length > 0 ? (
              stats.recentProjects.map((project: any) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-gray-800/80 hover:border-gray-700 transition"
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-white font-semibold text-sm truncate">{project.title}</p>
                    <p className="text-gray-500 text-xs truncate mt-0.5">
                      {project.technologies?.slice(0, 3).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    <span className="text-gray-400 flex items-center gap-1 font-mono">
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      {project.views || 0}
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No projects added yet. Click &quot;Add Project&quot; below to get started.
              </div>
            )}
          </div>
        </div>

        {/* Quick Launch Actions */}
        <div className="glass-card p-6 border border-gray-800 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-white pb-3 border-b border-gray-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            Quick Actions
          </h2>

          <div className="space-y-2">
            <Link
              href="/admin/projects"
              className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gray-800 hover:border-green-500/40 text-gray-200 hover:text-white text-xs font-medium transition group"
            >
              <span className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-green-400" />
                Add New Project
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-green-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/admin/skills"
              className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gray-800 hover:border-green-500/40 text-gray-200 hover:text-white text-xs font-medium transition group"
            >
              <span className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-green-400" />
                Add / Edit Skills
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-green-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/admin/resume"
              className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gray-800 hover:border-green-500/40 text-gray-200 hover:text-white text-xs font-medium transition group"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-green-400" />
                Update Resume PDF
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-green-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/admin/messages"
              className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gray-800 hover:border-green-500/40 text-gray-200 hover:text-white text-xs font-medium transition group"
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-green-400" />
                Check Messages
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-mono">
                {stats.unreadMessages}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}