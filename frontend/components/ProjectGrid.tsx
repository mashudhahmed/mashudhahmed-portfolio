'use client';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

export default function ProjectGrid({ projects }: { projects: any[] }) {
  if (!projects.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No projects yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true, margin: '-50px' }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}