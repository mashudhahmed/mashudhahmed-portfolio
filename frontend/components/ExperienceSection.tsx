'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Briefcase, Calendar, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { Experience } from '@/lib/fallbackData';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  // Sort experiences by order ascending, then by startDate descending
  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return (b.id || 0) - (a.id || 0);
  });

  return (
    <section id="experience" className="relative z-10 py-24 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <ScrollReveal>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>CAREER PATHWAY</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Work Experience
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mt-4">
            Proven track record in engineering scalable full-stack applications, distributed architectures, and modern web experiences.
          </p>
        </div>
      </ScrollReveal>

      {/* Timeline Container */}
      <div className="relative">
        {/* Glowing vertical line */}
        <div className="absolute left-4 md:left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-green-500 via-emerald-500/40 to-transparent" />

        <div className="space-y-12">
          {sortedExperiences.map((exp, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={exp.id || index}
                className="relative flex flex-col md:flex-row items-start group"
              >
                {/* Central Timeline Node / Badge */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gray-950 border-2 border-green-500 flex items-center justify-center shadow-lg shadow-green-500/20 z-20 group-hover:scale-110 group-hover:border-green-400 transition-all duration-300">
                  {exp.isCurrent ? (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80 group-hover:bg-green-300 transition-colors" />
                  )}
                </div>

                {/* Content Card Layout (Desktop alternating sides, Mobile single-column) */}
                <div
                  className={`w-full md:w-[calc(50%-2.5rem)] pl-12 md:pl-0 ${
                    isEven ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4'
                  }`}
                >
                  <ScrollReveal direction={isEven ? 'left' : 'right'} delay={index * 0.1}>
                    <div className="glass-card p-6 md:p-7 relative overflow-hidden border border-white/10 hover:border-green-500/40 transition-all duration-300 shadow-xl group-hover:shadow-green-950/30">
                      {/* Top current role accent glow */}
                      {exp.isCurrent && (
                        <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-green-500/30 to-transparent text-[11px] font-mono text-green-300 flex items-center gap-1 rounded-bl-xl border-l border-b border-green-500/30">
                          <Sparkles className="w-3 h-3 text-green-400 animate-pulse" />
                          <span>Current Role</span>
                        </div>
                      )}

                      {/* Header with Company Logo / Monogram + Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <CompanyLogo
                          logoUrl={exp.companyLogo}
                          companyName={exp.company}
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors tracking-tight">
                            {exp.position}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {exp.companyUrl ? (
                              <a
                                href={exp.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300 font-semibold text-sm inline-flex items-center gap-1 transition-colors"
                              >
                                <span>{exp.company}</span>
                                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover/link:opacity-100" />
                              </a>
                            ) : (
                              <span className="text-green-400 font-semibold text-sm">
                                {exp.company}
                              </span>
                            )}

                            {exp.employmentType && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-gray-300">
                                {exp.employmentType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Meta Information (Dates & Location) */}
                      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-gray-400 mb-4 pb-3 border-b border-white/5">
                        <div className="flex items-center gap-1.5 font-mono text-emerald-400/90">
                          <Calendar className="w-3.5 h-3.5 text-green-400" />
                          <span>
                            {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                          </span>
                        </div>

                        {exp.location && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-sm leading-relaxed mb-5 whitespace-pre-line">
                        {exp.description}
                      </p>

                      {/* Technologies Stack Pills */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div>
                          <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                            Key Technologies
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {exp.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-md text-xs font-mono bg-green-500/10 hover:bg-green-500/20 text-green-300 border border-green-500/20 transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Company Logo component with graceful image loading and monogram fallback
 */
function CompanyLogo({ logoUrl, companyName }: { logoUrl?: string; companyName: string }) {
  const [imgError, setImgError] = useState(false);

  // Generate monogram letters (first letter of up to 2 words, e.g. "Techneea" -> "T", "Open Source" -> "OS")
  const monogram = companyName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'C';

  if (!logoUrl || imgError) {
    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-green-500/20 via-emerald-600/15 to-transparent border border-green-500/30 shadow-md shadow-green-950/40 text-green-300 font-bold font-mono text-base select-none"
        title={companyName}
      >
        {monogram}
      </div>
    );
  }

  return (
    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10 p-1 flex items-center justify-center">
      <img
        src={logoUrl}
        alt={`${companyName} logo`}
        className="w-full h-full object-contain"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
