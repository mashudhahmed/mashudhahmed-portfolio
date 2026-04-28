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
  SiGit,
  SiPostgresql,
  SiFirebase,
  SiKotlin,
  SiCplusplus,
  SiJsonwebtokens,
  SiTypeorm,
  SiPostman,
  SiReact,
  SiFramer,
  SiGithub,
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

// Get level color and bar gradient
const getLevelConfig = (level: string) => {
  switch (level) {
    case 'EXPERT':
      return {
        textColor: 'text-purple-400',
        barGradient: 'from-purple-500 to-pink-500',
        percentage: 98,
      };
    case 'ADVANCED':
      return {
        textColor: 'text-green-400',
        barGradient: 'from-green-500 to-emerald-500',
        percentage: 90,
      };
    case 'INTERMEDIATE':
      return {
        textColor: 'text-yellow-400',
        barGradient: 'from-yellow-500 to-amber-500',
        percentage: 65,
      };
    case 'BEGINNER':
      return {
        textColor: 'text-blue-400',
        barGradient: 'from-blue-500 to-cyan-500',
        percentage: 35,
      };
    default:
      return {
        textColor: 'text-gray-400',
        barGradient: 'from-gray-500 to-gray-400',
        percentage: 50,
      };
  }
};

// Get original brand color for each icon
const getIconColor = (skillName: string) => {
  const colors: Record<string, string> = {
    JavaScript: '#F7DF1E',
    TypeScript: '#3178C6',
    React: '#61DAFB',
    'Next.js': '#ffffff',
    TailwindCSS: '#38BDF8',
    HTML5: '#E34F26',
    'Framer Motion': '#0055FF',
    'Node.js/NestJS': '#E0234E',
    'REST APIs': '#85EA2D',
    JWT: '#000000',
    Docker: '#2496ED',
    'Git/GitHub': '#181717',
    Postman: '#FF6C37',
    'Swagger UI': '#85EA2D',
    PostgreSQL: '#4169E1',
    TypeORM: '#FE0903',
    Firebase: '#FFCA28',
    'C++': '#00599C',
    Kotlin: '#7F52FF',
  };
  return colors[skillName] || '#4ade80';
};

// Skill bar component with animation
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

// Individual skill item component
const SkillItem = ({ skill, onSelect, isSelected }: any) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { textColor } = getLevelConfig(skill.level);
  const iconColor = getIconColor(skill.name);

  const getIcon = () => {
    if (skill.name === 'Git/GitHub') return SiGithub;
    return skill.icon;
  };

  const IconComponent = getIcon();

  return (
    <div
      ref={ref}
      onClick={() => onSelect(skill.name)}
      className={`flex flex-col p-3 rounded-xl bg-gray-900/50 border transition-all duration-200 cursor-pointer hover:scale-105 hover:border-green-500/50 ${
        isSelected ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-700'
      }`}
    >
      <div className="flex items-center gap-3 mb-1">
        <IconComponent className="w-6 h-6" style={{ color: iconColor }} />
        <span className="font-medium text-white text-sm">{skill.name}</span>
      </div>
      <SkillBar level={skill.level} inView={inView} />
      <span className={`text-xs font-medium mt-1 ${textColor}`}>{skill.level}</span>
    </div>
  );
};

const skillCategories = [
  {
    name: 'Frontend',
    skills: [
      { name: 'JavaScript', icon: SiJavascript, level: 'ADVANCED' },
      { name: 'TypeScript', icon: SiTypescript, level: 'ADVANCED' },
      { name: 'React', icon: SiReact, level: 'ADVANCED' },
      { name: 'Next.js', icon: SiNextdotjs, level: 'INTERMEDIATE' },
      { name: 'TailwindCSS', icon: SiTailwindcss, level: 'ADVANCED' },
      { name: 'HTML5', icon: SiHtml5, level: 'EXPERT' },
      { name: 'Framer Motion', icon: SiFramer, level: 'INTERMEDIATE' },
    ],
  },
  {
    name: 'Backend & DevOps',
    skills: [
      { name: 'Node.js/NestJS', icon: SiNestjs, level: 'ADVANCED' },
      { name: 'REST APIs', icon: SiSwagger, level: 'ADVANCED' },
      { name: 'JWT', icon: SiJsonwebtokens, level: 'ADVANCED' },
      { name: 'Docker', icon: SiDocker, level: 'INTERMEDIATE' },
      { name: 'Git/GitHub', icon: SiGit, level: 'ADVANCED' },
      { name: 'Postman', icon: SiPostman, level: 'ADVANCED' },
      { name: 'Swagger UI', icon: SiSwagger, level: 'ADVANCED' },
    ],
  },
  {
    name: 'Database & Tools',
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql, level: 'INTERMEDIATE' },
      { name: 'TypeORM', icon: SiTypeorm, level: 'ADVANCED' },
      { name: 'Firebase', icon: SiFirebase, level: 'INTERMEDIATE' },
    ],
  },
  {
    name: 'Languages',
    skills: [
      { name: 'C++', icon: SiCplusplus, level: 'INTERMEDIATE' },
      { name: 'Kotlin', icon: SiKotlin, level: 'INTERMEDIATE' },
    ],
  },
];

export default function PortfolioContent({ projects }: PortfolioContentProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const filteredProjects = selectedTech
    ? projects.filter(project =>
        project.technologies.some(tech =>
          tech.toLowerCase().includes(selectedTech.toLowerCase())
        )
      )
    : projects;

  const handleSkillClick = (techName: string) => {
    setSelectedTech(prev => (prev === techName ? null : techName));
  };

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
          {skillCategories.map(category => (
            <div key={category.name} className="mb-12">
              <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-500 rounded-full"></span> {category.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.skills.map(skill => (
                  <SkillItem
                    key={skill.name}
                    skill={skill}
                    onSelect={handleSkillClick}
                    isSelected={selectedTech === skill.name}
                  />
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