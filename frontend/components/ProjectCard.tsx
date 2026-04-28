'use client';
import { ExternalLink, Eye } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export default function ProjectCard({ project }: { project: any }) {
  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 cursor-pointer border border-gray-700 hover:border-green-500/50">
      {/* Image section - zooms on hover */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Dark overlay - appears on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <FaGithub className="w-4 h-4" />
            GitHub
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white line-clamp-1">{project.title}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            {project.views}
          </div>
        </div>
        <p className="text-gray-300 text-sm line-clamp-2 mb-3">{project.description}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech: string) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 border border-green-500/30 text-green-400 transition-all duration-200 group-hover:border-green-500/60 group-hover:bg-green-500/20"
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
      </div>
    </div>
  );
}