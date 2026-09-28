'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, ExternalLink, Loader2, X } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import ConfirmModal from '@/components/ConfirmModal';
import { useToast } from '@/components/Toast';
import { adminFetch, revalidatePortfolio } from '@/lib/adminApi';
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
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await adminFetch<Project[]>('/projects');
      setProjects(data || []);
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.imageUrl) {
      showToast('Please provide a project image (upload or enter URL)', 'error');
      return;
    }

    setSubmitting(true);
    const endpoint = editingProject ? `/projects/${editingProject.id}` : '/projects';
    const method = editingProject ? 'PATCH' : 'POST';

    const techArray = form.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await adminFetch(endpoint, {
        method,
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          technologies: techArray,
          imageUrl: form.imageUrl.trim(),
          githubUrl: form.githubUrl.trim(),
          liveUrl: form.liveUrl.trim() ? form.liveUrl.trim() : null,
        }),
      });

      showToast(
        editingProject ? 'Project updated successfully' : 'Project created successfully',
        'success'
      );

      // Instant cache revalidation
      await revalidatePortfolio(['projects']);

      setShowModal(false);
      setEditingProject(null);
      setForm({ title: '', description: '', technologies: '', imageUrl: '', githubUrl: '', liveUrl: '' });
      fetchProjects();
    } catch (error: any) {
      showToast(error.message || 'Failed to save project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/projects/${deleteId}`, { method: 'DELETE' });
      showToast('Project deleted successfully', 'success');
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      await revalidatePortfolio(['projects']);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete project', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      imageUrl: project.imageUrl || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
    });
    setShowModal(true);
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your portfolio project showcases</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setForm({ title: '', description: '', technologies: '', imageUrl: '', githubUrl: '', liveUrl: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center border border-gray-800">
          <p className="text-gray-400 text-sm">No projects added yet. Click &quot;Add Project&quot; to showcase your work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass-card p-5 group flex flex-col justify-between border border-gray-800/80 hover:border-green-500/40 transition-all duration-300">
              <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-3.5 bg-gray-900 border border-gray-800">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-white/10 hover:bg-green-600 text-white transition"
                      title="GitHub Repository"
                    >
                      <FaGithub className="w-4 h-4" />
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-white/10 hover:bg-green-600 text-white transition"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-1">{project.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 text-[11px] rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-0.5 text-[11px] rounded-md bg-gray-800 text-gray-400 border border-gray-700">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-800/80">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{project.views || 0} views</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 rounded-lg hover:bg-yellow-500/10 text-yellow-400 transition"
                    title="Edit project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(project.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. AI Portfolio Dashboard"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description *</label>
                <textarea
                  placeholder="Summary of the project, features, and architecture"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Technologies (comma-separated) *</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, TypeScript, TailwindCSS, PostgreSQL"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Project Screenshot *</label>
                <ImageUpload
                  onUpload={(url) => setForm({ ...form, imageUrl: url })}
                  currentImage={form.imageUrl}
                  folder="projects"
                  accept="image/*"
                  label="Upload Image"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">GitHub URL *</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Live URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://myproject.com"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete Project"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}