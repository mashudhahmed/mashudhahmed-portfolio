'use client';
import { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle,
  Database,
} from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/components/Toast';
import { adminFetch, revalidatePortfolio } from '@/lib/adminApi';
import { Experience, fallbackExperiences } from '@/lib/fallbackData';

interface ExperienceFormData {
  company: string;
  position: string;
  companyLogo: string;
  companyUrl: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
  order: number;
}

const defaultFormData: ExperienceFormData = {
  company: '',
  position: '',
  companyLogo: '',
  companyUrl: '',
  employmentType: 'Full-time',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  technologies: [],
  order: 0,
};

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Remote',
];

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [formData, setFormData] = useState<ExperienceFormData>(defaultFormData);
  const { showToast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await adminFetch<Experience[]>('/experience');
      // Sort by order ascending
      const sorted = (data || []).sort((a, b) => a.order - b.order);
      setExperiences(sorted);
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch experiences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingExperience(null);
    setFormData({
      ...defaultFormData,
      order: experiences.length + 1,
    });
    setTechInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData({
      company: exp.company || '',
      position: exp.position || '',
      companyLogo: exp.companyLogo || '',
      companyUrl: exp.companyUrl || '',
      employmentType: exp.employmentType || 'Full-time',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent ?? false,
      description: exp.description || '',
      technologies: exp.technologies ? [...exp.technologies] : [],
      order: exp.order ?? 0,
    });
    setTechInput('');
    setShowModal(true);
  };

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (!trimmed) return;

    // Support comma-separated tags paste
    const tags = trimmed.split(',').map((t) => t.trim()).filter(Boolean);
    const updated = Array.from(new Set([...formData.technologies, ...tags]));
    setFormData({ ...formData, technologies: updated });
    setTechInput('');
  };

  const handleRemoveTech = (index: number) => {
    const updated = formData.technologies.filter((_, i) => i !== index);
    setFormData({ ...formData, technologies: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company.trim() || !formData.position.trim()) {
      showToast('Company name and Position are required.', 'error');
      return;
    }
    if (!formData.startDate.trim()) {
      showToast('Start date is required.', 'error');
      return;
    }

    setSubmitting(true);
    const endpoint = editingExperience ? `/experience/${editingExperience.id}` : '/experience';
    const method = editingExperience ? 'PATCH' : 'POST';

    const payload = {
      company: formData.company.trim(),
      position: formData.position.trim(),
      companyLogo: formData.companyLogo.trim(),
      companyUrl: formData.companyUrl.trim(),
      employmentType: formData.employmentType,
      location: formData.location.trim(),
      startDate: formData.startDate.trim(),
      endDate: formData.isCurrent ? '' : formData.endDate.trim(),
      isCurrent: Boolean(formData.isCurrent),
      description: formData.description.trim(),
      technologies: formData.technologies,
      order: Number(formData.order) || 0,
    };

    try {
      await adminFetch(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      showToast(
        editingExperience ? 'Experience updated successfully' : 'Experience added successfully',
        'success'
      );

      await revalidatePortfolio(['experience']);
      setShowModal(false);
      setEditingExperience(null);
      fetchExperiences();
    } catch (error: any) {
      showToast(error.message || 'Failed to save experience', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await adminFetch(`/experience/${deleteId}`, {
        method: 'DELETE',
      });
      showToast('Experience deleted successfully', 'success');
      await revalidatePortfolio(['experience']);
      setDeleteId(null);
      fetchExperiences();
    } catch (error: any) {
      showToast(error.message || 'Failed to delete experience', 'error');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const currentExp = experiences[index];
    const targetExp = experiences[targetIndex];

    try {
      // Swap order numbers
      await adminFetch(`/experience/${currentExp.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ order: targetExp.order }),
      });
      await adminFetch(`/experience/${targetExp.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ order: currentExp.order }),
      });

      showToast('Order updated', 'success');
      await revalidatePortfolio(['experience']);
      fetchExperiences();
    } catch (error: any) {
      showToast(error.message || 'Failed to reorder experiences', 'error');
    }
  };

  const handleSeedDefaults = async () => {
    try {
      setLoading(true);
      for (const item of fallbackExperiences) {
        const { id, ...data } = item;
        await adminFetch('/experience', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
      showToast('Default experiences seeded into database successfully', 'success');
      await revalidatePortfolio(['experience']);
      fetchExperiences();
    } catch (error: any) {
      showToast(error.message || 'Failed to seed default experiences', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-900/60 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Work Experience</h1>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5">
              Manage your career history, company logos, roles, and tech stack tags.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {experiences.length === 0 && !loading && (
            <button
              onClick={handleSeedDefaults}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-sm font-medium transition inline-flex items-center gap-2"
              title="Populate database with default experiences"
            >
              <Database className="w-4 h-4 text-green-400" />
              <span>Seed Defaults</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-green-950/40 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        </div>
      </div>

      {/* Experience List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-gray-900/30 rounded-2xl border border-gray-800/80">
          <Loader2 className="w-8 h-8 animate-spin text-green-400" />
          <p className="text-gray-400 text-sm">Loading experiences...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/40 border border-dashed border-gray-800 rounded-2xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No experiences recorded</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mt-1">
              Add your current or past work roles, internships, and freelance history to showcase on your portfolio.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleSeedDefaults}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium border border-gray-700 transition inline-flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-green-400" />
              Seed Default Data
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Role
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="bg-gray-900/50 hover:bg-gray-900/80 border border-gray-800/90 hover:border-green-500/30 rounded-2xl p-5 md:p-6 transition-all duration-200 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Logo or monogram */}
                <div className="w-14 h-14 rounded-xl bg-gray-800/80 border border-gray-700/80 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {exp.companyLogo ? (
                    <img
                      src={exp.companyLogo}
                      alt={exp.company}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="font-mono font-bold text-green-400 text-base">
                      {exp.company?.slice(0, 2).toUpperCase() || 'EX'}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white tracking-tight truncate">
                      {exp.position}
                    </h3>
                    {exp.isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-green-400" />
                        Current
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-gray-300 border border-white/10">
                      Order: #{exp.order}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-400 mt-1">
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 font-semibold inline-flex items-center gap-1"
                      >
                        <span>{exp.company}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-green-400 font-semibold">{exp.company}</span>
                    )}

                    <span>•</span>
                    <span>{exp.employmentType}</span>

                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-mono text-gray-300">
                      <Calendar className="w-3 h-3 text-green-400" />
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                    </span>

                    {exp.location && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-gray-400">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      </>
                    )}
                  </div>

                  {exp.description && (
                    <p className="text-gray-400 text-xs mt-2.5 line-clamp-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 text-green-300 border border-gray-700/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Right */}
              <div className="flex items-center gap-2 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-gray-800 w-full md:w-auto justify-end">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-gray-800">
                  <button
                    onClick={() => handleReorder(index, 'up')}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(index, 'down')}
                    disabled={index === experiences.length - 1}
                    title="Move Down"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit */}
                <button
                  onClick={() => handleOpenEdit(exp)}
                  title="Edit Experience"
                  className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteId(exp.id)}
                  title="Delete Experience"
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Experience Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {editingExperience
                      ? 'Update role information, logo, or timeline'
                      : 'Provide position details and company credentials'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Company & Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">
                    Position / Role Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Full-Stack Software Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Techneea"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Company Logo Upload */}
              <div className="bg-black/30 border border-gray-800 p-4 rounded-xl space-y-2">
                <label className="block text-xs font-mono text-gray-300">
                  Company Logo (Upload or URL)
                </label>
                <ImageUpload
                  folder="companies"
                  label="Upload Company Logo"
                  currentImage={formData.companyLogo}
                  onUpload={(url) => setFormData({ ...formData, companyLogo: url })}
                  allowUrlInput={true}
                />
              </div>

              {/* Company URL & Location & Employment Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">
                    Company Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.companyUrl}
                    onChange={(e) => setFormData({ ...formData, companyUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {employmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Dhaka, Bangladesh / Remote"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Dates & Current Role Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="e.g. 2024 or Jan 2024"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={formData.isCurrent}
                    value={formData.isCurrent ? 'Present' : formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="e.g. 2025 or Dec 2024"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formData.isCurrent ? 'opacity-50 cursor-not-allowed text-green-400 font-semibold' : ''
                    }`}
                  />
                </div>

                <div className="pb-1.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.isCurrent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isCurrent: e.target.checked,
                          endDate: e.target.checked ? '' : formData.endDate,
                        })
                      }
                      className="w-4 h-4 rounded text-green-500 bg-gray-800 border-gray-700 focus:ring-green-500 focus:ring-offset-gray-900"
                    />
                    <span>Currently working here</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">
                  Role Description & Achievements
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail key responsibilities, architecture design decisions, and measurable outcomes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 leading-relaxed"
                />
              </div>

              {/* Technologies Tag Input */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">
                  Technologies / Stack (Press Enter or Add)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="e.g. Next.js, TypeScript, PostgreSQL (comma-separated or single)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-medium transition"
                  >
                    Add Tag
                  </button>
                </div>

                {formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-green-500/10 text-green-300 border border-green-500/25 flex items-center gap-1.5"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(idx)}
                          className="hover:text-red-400 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Display Order */}
              <div className="w-36">
                <label className="block text-xs font-mono text-gray-300 mb-1.5">
                  Display Order #
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-green-950/40 transition disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingExperience ? 'Update Experience' : 'Save Experience'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Experience"
        message="Are you sure you want to delete this experience record? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
