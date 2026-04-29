'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderGit2,
  Code2,
  Eye,
  Users,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalViews: number;
  totalVisitors: number;
  recentProjects: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalSkills: 0,
    totalViews: 0,
    totalVisitors: 0,
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Fetch projects
      const projectsRes = await fetch(`${baseUrl}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const projects = projectsRes.ok ? await projectsRes.json() : [];
      
      // Fetch skills
      const skillsRes = await fetch(`${baseUrl}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const skills = skillsRes.ok ? await skillsRes.json() : [];
      
      // Calculate total views from projects
      const totalViews = projects.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
      
      // Fetch visitor count
      let totalVisitors = 0;
      try {
        const visitorsRes = await fetch(`${baseUrl}/visitor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (visitorsRes.ok) {
          const visitorsData = await visitorsRes.json();
          totalVisitors = visitorsData.count || 0;
        }
      } catch {
        totalVisitors = 0;
      }

      setStats({
        totalProjects: projects.length,
        totalSkills: skills.length,
        totalViews: totalViews,
        totalVisitors: totalVisitors,
        recentProjects: projects.slice(0, 5),
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load dashboard data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Projects', value: stats.totalProjects, icon: FolderGit2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Total Skills', value: stats.totalSkills, icon: Code2, color: 'text-green-400', bg: 'bg-green-500/10' },
    { title: 'Total Views', value: stats.totalViews, icon: Eye, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { title: 'Total Visitors', value: stats.totalVisitors, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.recentProjects.length > 0 ? (
              stats.recentProjects.map((project: any) => (
                <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">{project.title}</p>
                    <p className="text-gray-500 text-xs">{project.views} views</p>
                  </div>
                  <span className="text-xs text-green-400">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No projects yet. Add your first project!</p>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Tips</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-white text-sm">Keep your projects updated</p>
                <p className="text-gray-500 text-xs">Add new projects regularly to showcase your growth</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-white text-sm">Monitor your analytics</p>
                <p className="text-gray-500 text-xs">Track which projects get the most views</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-white text-sm">Keep your skills current</p>
                <p className="text-gray-500 text-xs">Update skill levels as you progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}