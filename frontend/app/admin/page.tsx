'use client';
import { useState, useEffect } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  liveUrl: string | null;
  views: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState('');

  // Fetch projects when token changes
  useEffect(() => {
    if (!token) return;
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        const data = await res.json();
        setProjects(data);
        setStatus('');
      } catch (err: unknown) {
        console.error('Fetch error:', err);
        setStatus(`❌ Failed to load projects: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    fetchProjects();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');
    const url = editingId
      ? `${process.env.NEXT_PUBLIC_API_URL}/projects/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/projects`;
    const method = editingId ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          technologies: form.technologies.split(',').map((t) => t.trim()),
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      setStatus(editingId ? '✅ Project updated!' : '✅ Project added!');
      setForm({ title: '', description: '', technologies: '', imageUrl: '', githubUrl: '', liveUrl: '' });
      setEditingId(null);
      // Refresh the list
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshed = await refreshRes.json();
      setProjects(refreshed);
    } catch (err: unknown) {
      console.error('Submit error:', err);
      setStatus(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setStatus('Deleting...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('✅ Project deleted.');
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshed = await refreshRes.json();
      setProjects(refreshed);
    } catch (err: unknown) {
      console.error('Delete error:', err);
      setStatus(`❌ Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      imageUrl: project.imageUrl,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl || '',
    });
    setStatus('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', description: '', technologies: '', imageUrl: '', githubUrl: '', liveUrl: '' });
    setStatus('');
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Token input */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Admin Token</label>
        <input
          type="password"
          placeholder="Enter your admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />
        <p className="text-xs text-gray-500 mt-1">
          Your token from <code className="bg-gray-100 dark:bg-gray-800 px-1">backend/.env</code>
        </p>
      </div>

      {/* Status message */}
      {status && (
        <div className="mb-4 p-2 rounded bg-gray-100 dark:bg-gray-800 text-sm">{status}</div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4 mb-8">
        <h2 className="text-xl font-bold">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-800"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-800"
          required
        />
        <input
          type="text"
          placeholder="Technologies (comma separated)"
          value={form.technologies}
          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-800"
          required
        />
        <input
          type="url"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-800"
          required
        />
        <input
          type="url"
          placeholder="GitHub URL"
          value={form.githubUrl}
          onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-800"
          required
        />
        <input
          type="url"
          placeholder="Live URL (optional)"
          value={form.liveUrl}
          onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-800"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!token}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {editingId ? 'Update Project' : 'Add Project'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Project list */}
      {token && projects.length === 0 && <p className="text-gray-500">No projects yet. Add your first one above.</p>}
      {projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="border rounded p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{project.description.substring(0, 80)}…</p>
                  <p className="text-xs text-gray-500">Views: {project.views}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-yellow-500 text-white rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="px-3 py-1 bg-red-500 text-white rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}