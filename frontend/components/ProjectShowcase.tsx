'use client';
import ProjectCard from './ProjectCard';

export default function ProjectShowcase({ projects }: { projects: any[] }) {
  if (!projects.length) {
    return <div className="text-center text-gray-500">No projects yet. Check back soon!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}