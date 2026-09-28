'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  Code2,
  User,
  Mail,
  MessageSquare,
  Share2,
  Settings,
  LogOut,
  Shield,
  FileText,
  ExternalLink,
  Menu,
  X,
  Briefcase,
} from 'lucide-react';
import { ToastProvider } from '@/components/Toast';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { name: 'Skills', href: '/admin/skills', icon: Code2 },
  { name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'About', href: '/admin/about', icon: User },
  { name: 'Contact Info', href: '/admin/contact', icon: Mail },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Social Links', href: '/admin/social', icon: Share2 },
  { name: 'Resume', href: '/admin/resume', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) {
      router.push('/admin/login');
    } else {
      setToken(storedToken);
    }
  }, [router, isLoginPage]);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (!token) {
    return null;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 flex flex-col md:flex-row">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-black/60 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="font-bold text-white text-sm">Portfolio Admin</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-gray-800/80 text-gray-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Backdrop for mobile */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-in fade-in"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-black/70 backdrop-blur-xl border-r border-gray-800/80 z-50 flex flex-col justify-between transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-white font-bold text-base tracking-wide">Admin Panel</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? 'bg-green-500/15 text-green-400 border border-green-500/30 shadow-sm shadow-green-950/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-5 border-t border-gray-800/80 space-y-2">
            <a
              href="https://mashudhahmed.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-gray-400 hover:text-green-400 hover:bg-white/5 transition"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Live Portfolio
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-mono">↗</span>
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3.5 py-2 w-full rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}