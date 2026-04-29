'use client';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
import ProjectGrid from './ProjectGrid';
import { fallbackSkills } from '@/lib/fallbackData';
import * as Icons from 'react-icons/si';

interface Skill {
  id: number;
  name: string;
  icon: string;
  level: string;
  category: string;
  isActive: boolean;
}

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

const getLevelConfig = (level: string) => {
  switch (level) {
    case 'EXPERT':
      return { textColor: 'text-purple-400', barGradient: 'from-purple-500 to-pink-500', percentage: 98 };
    case 'ADVANCED':
      return { textColor: 'text-green-400', barGradient: 'from-green-500 to-emerald-500', percentage: 90 };
    case 'INTERMEDIATE':
      return { textColor: 'text-yellow-400', barGradient: 'from-yellow-500 to-amber-500', percentage: 65 };
    default:
      return { textColor: 'text-blue-400', barGradient: 'from-blue-500 to-cyan-500', percentage: 35 };
  }
};

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.SiCoder;
};

const SkillBar = ({ level, inView }: { level: string; inView: boolean }) => {
  const [width, setWidth] = useState(0);
  const { percentage, barGradient } = getLevelConfig(level);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setWidth(percentage), 100);
      return () => clearTimeout(timer);
    }
  }, [inView, percentage]);

  return (
    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2 overflow-hidden">
      <div
        className={`bg-gradient-to-r ${barGradient} h-1.5 rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

const SkillItem = ({ skill }: { skill: Skill }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { textColor } = getLevelConfig(skill.level);
  const IconComponent = getIconComponent(skill.icon);

  return (
    <div
      ref={ref}
      className="flex flex-col p-3 rounded-xl bg-gray-900/50 border border-gray-700 transition-all duration-200 hover:scale-105 hover:border-green-500/50 cursor-default"
    >
      <div className="flex items-center gap-3 mb-1">
        <IconComponent className="w-6 h-6 text-gray-400 group-hover:text-green-400 transition" />
        <span className="font-medium text-white text-sm">{skill.name}</span>
      </div>
      <SkillBar level={skill.level} inView={inView} />
      <span className={`text-xs font-medium mt-1 ${textColor}`}>{skill.level}</span>
    </div>
  );
};

export default function PortfolioContent({ projects }: PortfolioContentProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`);
        if (!res.ok) {
          setSkills(fallbackSkills as Skill[]);
          return;
        }
        const data = await res.json();
        setSkills(data.length > 0 ? data : fallbackSkills as Skill[]);
      } catch (error) {
        console.error('Failed to fetch skills, using fallback:', error);
        setSkills(fallbackSkills as Skill[]);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = ['Frontend', 'Backend & DevOps', 'Database & Tools', 'Languages'];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Skills Section */}
      <ScrollReveal>
        <section id="skills" className="relative z-10 py-24 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Technical Skills</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-3 rounded-full" />
            <p className="text-gray-400 text-sm max-w-xl mx-auto mt-4">
              Technologies I work with, from frontend to databases
            </p>
          </div>
          {categories.map(category => (
            <div key={category} className="mb-12">
              <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-500 rounded-full"></span> {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(skillsByCategory[category] || []).map(skill => (
                  <SkillItem key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </ScrollReveal>

      {/* Projects Section - Always show all projects */}
      <ScrollReveal>
        <section id="projects" className="relative z-10 py-24 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Featured Projects</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-3 rounded-full" />
            <p className="text-gray-400 text-sm max-w-xl mx-auto mt-4">
              Real-world applications I've built, from e-commerce to mobile apps
            </p>
          </div>
          <ProjectGrid projects={projects} />
        </section>
      </ScrollReveal>
    </>
  );
}