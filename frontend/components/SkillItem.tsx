'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import * as Icons from 'react-icons/si';

interface Skill {
  id: number;
  name: string;
  icon: string;
  level: string;
  category: string;
  isActive: boolean;
}

const getIconColor = (skillName: string): string => {
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

export default function SkillItem({ skill }: { skill: Skill }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { textColor } = getLevelConfig(skill.level);
  const iconColor = getIconColor(skill.name);
  const IconComponent = getIconComponent(skill.icon);

  return (
    <div
      ref={ref}
      className="flex flex-col p-3 rounded-xl bg-gray-900/50 border border-gray-700 transition-all duration-200 hover:scale-105 hover:border-green-500/50 cursor-default"
      style={{ willChange: 'transform' }}
    >
      <div className="flex items-center gap-3 mb-1">
        <IconComponent 
          className="w-6 h-6" 
          style={{ color: iconColor }}
          aria-hidden="true"
          focusable="false"
          role="presentation"
        />
        <span className="font-medium text-white text-sm">{skill.name}</span>
      </div>
      <SkillBar level={skill.level} inView={inView} />
      <span className={`text-xs font-medium mt-1 ${textColor}`}>{skill.level}</span>
    </div>
  );
}