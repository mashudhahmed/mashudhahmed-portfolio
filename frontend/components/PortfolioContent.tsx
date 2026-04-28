'use client';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
import ProjectGrid from './ProjectGrid';
import {
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiHtml5,
  SiNestjs,
  SiSwagger,
  SiDocker,
  SiNodedotjs,
  SiPostgresql,
  SiFirebase,
  SiKotlin,
  SiCplusplus,
  SiJsonwebtokens,
  SiTypeorm,
  SiPostman,
} from 'react-icons/si';

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

interface PortfolioContentProps {
  projects: Project[];
}

const skillCategories = [
  {
    name: 'Frontend',
    skills: [
      { name: 'JavaScript', icon: SiJavascript, level: 'Advanced', tech: 'JavaScript' },
      { name: 'TypeScript', icon: SiTypescript, level: 'Advanced', tech: 'TypeScript' },
      { name: 'React/Next.js', icon: SiNextdotjs, level: 'Advanced', tech: 'React' },
      { name: 'TailwindCSS', icon: SiTailwindcss, level: 'Advanced', tech: 'TailwindCSS' },
      { name: 'HTML5', icon: SiHtml5, level: 'Advanced', tech: 'HTML5' },
    ],
  },
  {
    name: 'Backend & DevOps',
    skills: [
      { name: 'Node.js/NestJS', icon: SiNestjs, level: 'Advanced', tech: 'NestJS' },
      { name: 'REST APIs', icon: SiSwagger, level: 'Advanced', tech: 'REST' },
      { name: 'JWT', icon: SiJsonwebtokens, level: 'Advanced', tech: 'JWT' },
      { name: 'Docker', icon: SiDocker, level: 'Intermediate', tech: 'Docker' },
      { name: 'Git/GitHub', icon: SiNodedotjs, level: 'Advanced', tech: 'Git' },
      { name: 'Postman', icon: SiPostman, level: 'Advanced', tech: 'Postman' },
      { name: 'Swagger UI', icon: SiSwagger, level: 'Advanced', tech: 'Swagger' },
    ],
  },
  {
    name: 'Database & Tools',
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql, level: 'Intermediate', tech: 'PostgreSQL' },
      { name: 'TypeORM', icon: SiTypeorm, level: 'Advanced', tech: 'TypeORM' },
      { name: 'Firebase', icon: SiFirebase, level: 'Intermediate', tech: 'Firebase' },
    ],
  },
  {
    name: 'Languages',
    skills: [
      { name: 'C++', icon: SiCplusplus, level: 'Intermediate', tech: 'C++' },
      { name: 'Kotlin', icon: SiKotlin, level: 'Intermediate', tech: 'Kotlin' },
    ],
  },
];

// Animated progress bar component with reduced-motion support
const SkillBar = ({ level }: { level: string }) => {
  const [width, setWidth] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const target = level === 'Advanced' ? 90 : 60;

  useEffect(() => {
    if (inView) {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setWidth(target); // instant, no animation
      } else {
        const timer = setTimeout(() => setWidth(target), 100);
        return () => clearTimeout(timer);
      }
    }
  }, [inView, target]);

  return (
    <div ref={ref} className="w-full bg-gray-700 rounded-full h-1.5 mt-2 overflow-hidden">
      <div
        className="bg-gradient-to-r from-green-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default function PortfolioContent({ projects }: PortfolioContentProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const filteredProjects = selectedTech
    ? projects.filter(project =>
        project.technologies.some(tech =>
          tech.toLowerCase().includes(selectedTech.toLowerCase())
        )
      )
    : projects;

  const handleSkillClick = (tech: string) => {
    setSelectedTech(prev => (prev === tech ? null : tech));
  };

  return (
    <>
      {/* Skills Section */}
      <ScrollReveal>
        <section id="skills" className="relative z-10 py-24 px-4 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Technical Skills</h2>
          {skillCategories.map(category => (
            <div key={category.name} className="mb-12">
              <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-500 rounded-full"></span> {category.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.skills.map(skill => (
                  <div
                    key={skill.name}
                    onClick={() => handleSkillClick(skill.tech)}
                    className={`group relative glass-card p-3 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
                      selectedTech === skill.tech ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="mb-2 inline-block p-2 rounded-xl bg-white/5 group-hover:scale-105 transition-all duration-300">
                      <skill.icon className="w-7 h-7 text-gray-400 group-hover:text-green-400 transition" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-md font-semibold text-white">{skill.name}</h3>
                    <SkillBar level={skill.level} />
                    <p className="text-xs text-gray-400 mt-1">{skill.level}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {selectedTech && (
            <div className="text-center mt-4">
              <button
                onClick={() => setSelectedTech(null)}
                className="text-sm text-green-400 hover:text-green-300 transition"
              >
                ❌ Clear filter
              </button>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* Projects Section – filtered */}
      <ScrollReveal>
        <section id="projects" className="relative z-10 py-24 px-4 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Featured Projects</h2>
          {filteredProjects.length === 0 ? (
            <p className="text-center text-gray-400">No projects match the selected skill.</p>
          ) : (
            <ProjectGrid projects={filteredProjects} />
          )}
        </section>
      </ScrollReveal>
    </>
  );
}