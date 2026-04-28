export interface CommandOutput {
  type: 'text' | 'error' | 'command' | 'list' | 'clear' | 'contact_start' | 'ascii' | 'grid';
  content: string | string[] | any[];
}

export const commands: Record<string, string> = {
  help: 'Show available commands',
  about: 'About Mashudh',
  skills: 'Technical skills',
  projects: 'List projects (grid)',
  contact: 'Send a message',
  social: 'Social links',
  system: 'System info',
  resume: 'Download resume',
  clear: 'Clear terminal',
};

export async function parseCommand(input: string, visitorCount: number): Promise<CommandOutput> {
  const cmd = input.trim().split(' ')[0];
  switch (cmd) {
    case 'help':
      return { type: 'list', content: Object.entries(commands).map(([c, d]) => `  ${c.padEnd(12)} - ${d}`) };
    case 'about':
      return { type: 'text', content: "Hey, I'm Mashudh Ahmed – CSE student & full‑stack developer. Love building creative apps with Next.js, NestJS, and TypeScript." };
    case 'skills':
      return { type: 'list', content: ['• TypeScript/JavaScript', '• React/Next.js', '• Node.js/NestJS', '• PostgreSQL/TypeORM', '• TailwindCSS', '• Git/GitHub'] };
    case 'projects':
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
        const data = await res.json();
        if (!data.length) return { type: 'text', content: 'No projects yet. Add via admin panel.' };
        return { type: 'grid', content: data };
      } catch {
        return { type: 'error', content: 'Could not fetch projects. Backend down?' };
      }
    case 'contact':
      return { type: 'contact_start', content: '📬 Contact wizard started. Follow the prompts.' };
    case 'social':
      return { type: 'list', content: ['GitHub:   https://github.com/mashudh', 'LinkedIn: https://linkedin.com/in/mashudh', 'Twitter:  https://twitter.com/mashudh'] };
    case 'system':
      return { type: 'list', content: [`OS: ${navigator.platform}`, `Browser: ${navigator.userAgent.split(' ').slice(-2,-1)[0]}`, `Time: ${new Date().toLocaleString()}`, `Visitor #: ${visitorCount}`] };
    case 'resume':
      window.open('/resume.pdf', '_blank');
      return { type: 'text', content: 'Downloading resume...' };
    case 'clear':
      return { type: 'clear', content: '' };
    default:
      return { type: 'error', content: `Unknown command: ${input}. Type "help".` };
  }
}