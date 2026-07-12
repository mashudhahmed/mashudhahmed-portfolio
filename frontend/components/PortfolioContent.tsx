'use client';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
import ProjectGrid from './ProjectGrid';
import { fallbackSkills } from '@/lib/fallbackData';

// ✅ Lazy load SkillItem component (industry standard)
const SkillItem = lazy(() => import('./SkillItem'));

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

export default function PortfolioContent({ projects }: PortfolioContentProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setSkills(data);
          } else {
            setSkills(fallbackSkills as Skill[]);
          }
        } else {
          setSkills(fallbackSkills as Skill[]);
        }
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
                <Suspense fallback={
                  <div className="col-span-full text-center py-4 text-gray-500">
                    Loading skills...
                  </div>
                }>
                  {(skillsByCategory[category] || []).map(skill => (
                    <SkillItem key={skill.id} skill={skill} />
                  ))}
                </Suspense>
              </div>
            </div>
          ))}
        </section>
      </ScrollReveal>

      {/* Projects Section */}
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