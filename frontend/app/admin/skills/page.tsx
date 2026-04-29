'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Code2 } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  icon: string;
  level: string;
  category: string;
  isActive: boolean;
}

const categories = ['Frontend', 'Backend & DevOps', 'Database & Tools', 'Languages'];
const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
const iconsList = [
  'SiJavascript', 'SiTypescript', 'SiReact', 'SiNextdotjs', 'SiTailwindcss', 'SiHtml5',
  'SiNestjs', 'SiSwagger', 'SiDocker', 'SiGit', 'SiPostgresql', 'SiFirebase',
  'SiKotlin', 'SiCplusplus', 'SiJsonwebtokens', 'SiTypeorm', 'SiPostman', 'SiGithub'
];

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [form, setForm] = useState({
    name: '',
    icon: 'SiReact',
    level: 'INTERMEDIATE',
    category: 'Frontend',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSkills(token);
  }, [router]);

  const fetchSkills = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    const url = editingSkill
      ? `${process.env.NEXT_PUBLIC_API_URL}/skills/${editingSkill.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/skills`;
    const method = editingSkill ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        fetchSkills(token!);
        setShowModal(false);
        setEditingSkill(null);
        setForm({ name: '', icon: 'SiReact', level: 'INTERMEDIATE', category: 'Frontend', isActive: true });
      }
    } catch (error) {
      console.error('Failed to save skill:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchSkills(token!);
      }
    } catch (error) {
      console.error('Failed to delete skill:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'EXPERT': return 'text-purple-400 bg-purple-500/10';
      case 'ADVANCED': return 'text-green-400 bg-green-500/10';
      case 'INTERMEDIATE': return 'text-yellow-400 bg-yellow-500/10';
      default: return 'text-blue-400 bg-blue-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const skillsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="text-gray-400 mt-1">Manage your technical skills</p>
        </div>
        <button
          onClick={() => {
            setEditingSkill(null);
            setForm({ name: '', icon: 'SiReact', level: 'INTERMEDIATE', category: 'Frontend', isActive: true });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Skills by Category */}
      {categories.map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold text-green-400 mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(skillsByCategory[category] || []).map((skill) => (
              <div key={skill.id} className="glass-card p-3 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Code2 className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">{skill.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => {
                    setEditingSkill(skill);
                    setForm({
                      name: skill.name,
                      icon: skill.icon,
                      level: skill.level,
                      category: skill.category,
                      isActive: skill.isActive,
                    });
                    setShowModal(true);
                  }} className="p-1.5 rounded hover:bg-yellow-500/20 text-yellow-400 transition">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-4">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Skill Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {iconsList.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting} className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50">
                  {submitting ? 'Saving...' : editingSkill ? 'Update' : 'Create'}
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