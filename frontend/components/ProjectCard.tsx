'use client';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Eye, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export default function ProjectCard({ project }: { project: any }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="group relative glass-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white line-clamp-1">{project.title}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Eye className="w-3 h-3" />
            {project.views}
          </div>
        </div>
        <p className="text-gray-300 text-sm line-clamp-2 mb-3">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech: string) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 border border-green-500/30 text-green-400 group-hover:border-green-500/60 transition-colors"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <div className="flex gap-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-green-400 transition"
          >
            <FaGithub className="w-4 h-4" />
            <span>Code</span>
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-300 hover:text-green-400 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live</span>
            </a>
          )}
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-blue-500/20 blur-xl" />
      </div>
    </motion.div>
  );
}