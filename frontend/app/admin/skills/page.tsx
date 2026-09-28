'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Code2, Loader2, X, Check, Eye, EyeOff } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import { useToast } from '@/components/Toast';
import { adminFetch, revalidatePortfolio } from '@/lib/adminApi';

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

const commonIcons = [
  'SiJavascript', 'SiTypescript', 'SiReact', 'SiNextdotjs', 'SiTailwindcss', 'SiHtml5', 'SiCss3',
  'SiNestjs', 'SiNodedotjs', 'SiExpress', 'SiSwagger', 'SiDocker', 'SiGit', 'SiPostgresql', 'SiMongodb',
  'SiFirebase', 'SiRedis', 'SiKotlin', 'SiPython', 'SiCplusplus', 'SiJsonwebtokens', 'SiTypeorm',
  'SiPostman', 'SiGithub', 'SiLinux', 'SiFigma', 'SiVercel', 'SiAmazonaws', 'SiGraphql'
];

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    icon: 'SiReact',
    level: 'INTERMEDIATE',
    category: 'Frontend',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await adminFetch<Skill[]>('/skills');
      setSkills(data || []);
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const endpoint = editingSkill ? `/skills/${editingSkill.id}` : '/skills';
    const method = editingSkill ? 'PATCH' : 'POST';

    try {
      await adminFetch(endpoint, {
        method,
        body: JSON.stringify({
          name: form.name.trim(),
          icon: form.icon.trim(),
          level: form.level,
          category: form.category,
          isActive: form.isActive,
        }),
      });

      showToast(
        editingSkill ? 'Skill updated successfully' : 'Skill created successfully',
        'success'
      );

      await revalidatePortfolio(['skills']);
      setShowModal(false);
      setEditingSkill(null);
      setForm({ name: '', icon: 'SiReact', level: 'INTERMEDIATE', category: 'Frontend', isActive: true });
      fetchSkills();
    } catch (error: any) {
      showToast(error.message || 'Failed to save skill', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (skill: Skill) => {
    try {
      await adminFetch(`/skills/${skill.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !skill.isActive }),
      });
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, isActive: !skill.isActive } : s))
      );
      showToast(`${skill.name} is now ${!skill.isActive ? 'visible' : 'hidden'} on portfolio`, 'info');
      await revalidatePortfolio(['skills']);
    } catch (error: any) {
      showToast(error.message || 'Failed to update status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/skills/${deleteId}`, { method: 'DELETE' });
      showToast('Skill deleted successfully', 'success');
      setSkills((prev) => prev.filter((s) => s.id !== deleteId));
      await revalidatePortfolio(['skills']);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete skill', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'ADVANCED':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'INTERMEDIATE':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const skillsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

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
          <h1 className="text-3xl font-bold text-white tracking-tight">Skills</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your technical expertise and categories</p>
        </div>
        <button
          onClick={() => {
            setEditingSkill(null);
            setForm({ name: '', icon: 'SiReact', level: 'INTERMEDIATE', category: 'Frontend', isActive: true });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:shadow-lg transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Skills by Category */}
      {categories.map((category) => {
        const catSkills = skillsByCategory[category] || [];
        return (
          <div key={category} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-white">{category}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 font-mono">
                {catSkills.length}
              </span>
            </div>

            {catSkills.length === 0 ? (
              <p className="text-gray-500 text-xs italic mb-4">No skills added in this category.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {catSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`glass-card p-4 rounded-xl border flex items-center justify-between group transition-all duration-200 ${
                      skill.isActive ? 'border-gray-800/80 hover:border-green-500/40' : 'border-gray-800/40 opacity-60 bg-gray-950/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-green-500/10 text-green-400 flex-shrink-0">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate">{skill.name}</p>
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-md border font-medium mt-1 ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleToggleActive(skill)}
                        className={`p-1.5 rounded-lg transition ${
                          skill.isActive ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-green-400'
                        }`}
                        title={skill.isActive ? 'Hide on portfolio' : 'Show on portfolio'}
                      >
                        {skill.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingSkill(skill);
                          setForm({
                            name: skill.name,
                            icon: skill.icon,
                            level: skill.level,
                            category: skill.category,
                            isActive: skill.isActive,
                          });
                          setShowModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-yellow-500/10 text-yellow-400 transition"
                        title="Edit skill"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(skill.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Docker, Python"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Proficiency Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl} className="bg-gray-900">
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Icon Identifier</label>
                  <input
                    type="text"
                    list="icons-list"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="e.g. SiReact"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <datalist id="icons-list">
                    {commonIcons.map((ic) => (
                      <option key={ic} value={ic} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="isActive" className="text-xs text-gray-300">
                  Visible on public portfolio
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : editingSkill ? 'Save Changes' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? It will be removed from your portfolio."
        confirmText="Delete Skill"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}