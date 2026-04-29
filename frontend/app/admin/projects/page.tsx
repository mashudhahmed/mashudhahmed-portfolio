'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { FaGithub } from 'react-icons/fa';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  liveUrl: string | null;
  views: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchProjects(token);
  }, [router]);

  const fetchProjects = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    const url = editingProject
      ? `${process.env.NEXT_PUBLIC_API_URL}/projects/${editingProject.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/projects`;
    const method = editingProject ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          technologies: form.technologies.split(',').map(t => t.trim()),
        }),
      });

      if (res.ok) {
        fetchProjects(token!);
        setShowModal(false);
        setEditingProject(null);
        setForm({ title: '', description: '', technologies: '', imageUrl: '', githubUrl: '', liveUrl: '' });
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchProjects(token!);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      imageUrl: project.imageUrl,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl || '',
    });
    setShowModal(true);
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
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setForm({ title: '', description: '', technologies: '', imageUrl: '', githubUrl: '', liveUrl: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="glass-card p-5 group">
            <div className="relative h-40 rounded-lg overflow-hidden mb-3">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a href={project.githubUrl} target="_blank" className="p-2 rounded-full bg-white/10 hover:bg-green-600 transition">
                  <FaGithub className="w-4 h-4 text-white" />
                </a>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" className="p-2 rounded-full bg-white/10 hover:bg-green-600 transition">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {project.technologies.slice(0, 2).map(tech => (
                <span key={tech} className="px-1.5 py-0.5 text-xs rounded bg-green-500/10 text-green-400">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 2 && (
                <span className="px-1.5 py-0.5 text-xs rounded bg-gray-700 text-gray-300">
                  +{project.technologies.length - 2}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-800">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="w-3 h-3" />
                {project.views}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(project)} className="p-1.5 rounded hover:bg-yellow-500/20 text-yellow-400 transition">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal with Image Upload */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-4">{editingProject ? 'Edit Project' : 'Add Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                placeholder="Technologies (comma separated)"
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              
              {/* ✅ Image Upload Component instead of URL input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project Image</label>
                <ImageUpload
                  onUpload={(url) => setForm({ ...form, imageUrl: url })}
                  currentImage={form.imageUrl}
                  folder="projects"
                />
              </div>
              
              <input
                type="url"
                placeholder="GitHub URL"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="url"
                placeholder="Live URL (optional)"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white"
              />
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting} className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50">
                  {submitting ? 'Saving...' : editingProject ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}