import TerminalButton from '@/components/TerminalButton';
import ContactForm from '@/components/ContactForm';
import Typewriter from '@/components/Typewriter';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import BackToTopButton from '@/components/BackToTopButton';
import FloatingIcons from '@/components/FloatingIcons';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';
import GitHubRepoCount from '@/components/GitHubRepoCount';
import PortfolioContent from '@/components/PortfolioContent';
import CountUp from '@/components/CountUp';
import MapWrapper from '@/components/MapWrapper';
import { Download, Calendar, GraduationCap, Award, Mail, MapPin } from 'lucide-react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

// Fallback projects (used only if backend is unreachable)
const fallbackProjects = [
  {
    id: 1,
    title: "SnapCart – E‑Commerce App",
    description: "Full-stack e-commerce backend with NestJS featuring JWT authentication, role-based access control, product management, cart system, and order handling.",
    technologies: ["TypeScript", "NestJS", "PostgreSQL", "JWT", "REST API"],
    imageUrl: "/snapcart.jpeg",
    githubUrl: "https://github.com/mashudhahmed/ecommerce-fullstack",
    liveUrl: "",
    views: 128,
  },
  {
    id: 2,
    title: "BloodLink – Blood Donation App",
    description: "Android mobile app in Kotlin connecting donors with recipients, featuring Firebase real-time database, authentication, and NestJS admin panel for push notifications.",
    technologies: ["Kotlin", "XML", "Firebase", "NestJS"],
    imageUrl: "/bloodlink.jpeg",
    githubUrl: "https://github.com/mashudhahmed/blood-donation-mobile-app",
    liveUrl: "",
    views: 89,
  },
  {
    id: 3,
    title: "QuickBite – Food Delivery App",
    description: "Food delivery REST API with 4 user roles, JWT authentication, TypeORM relationships, transactional emails, and full Swagger documentation.",
    technologies: ["TypeScript", "NestJS", "PostgreSQL", "TypeORM", "JWT"],
    imageUrl: "/quickbite.jpeg",
    githubUrl: "https://github.com/mashudhahmed/food-delivery-fullstack",
    liveUrl: "",
    views: 156,
  },
];

async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.warn('Backend unreachable, using fallback projects');
      return fallbackProjects;
    }
    const projects = await res.json();
    return projects.length > 0 ? projects : fallbackProjects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return fallbackProjects;
  }
}

export default async function Home() {
  const projects = await getProjects();
  const projectCount = projects.length;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-black/90 text-gray-200">
      <BackgroundCanvas />
      <Navbar />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_30%,_black_85%)] z-0" />

      {/* Hero Section */}
      <section className="relative z-10 h-screen flex items-center justify-center text-center px-4">
        <FloatingIcons />
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-black/50 border border-green-500/30 backdrop-blur-sm">
            <p className="text-green-400 font-mono text-sm"> /portfolio</p>
          </div>
          <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
            Mashudh Ahmed
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mt-6">
            <Typewriter /> <span className="inline-block w-1 h-6 bg-green-400 animate-pulse ml-1 align-middle"></span>
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <a href="#projects" className="px-8 py-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-950">
              View Work
            </a>
            <a href="#contact" className="px-8 py-3 rounded-full border-2 border-green-500 text-green-400 font-semibold hover:bg-green-500/10 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-950">
              Contact Me
            </a>
            <a href="/resume.pdf" download className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-950 inline-flex items-center gap-2">
              <Download className="w-5 h-5" />
              Resume
            </a>
          </div>
        </div>
      </section>

      {/* About + Education */}
      <ScrollReveal>
        <section id="about" className="relative z-10 py-24 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" delay={0.1}>
              <div className="space-y-8 relative">
                <div className="absolute -left-8 top-1/4 w-32 h-32 rounded-full bg-green-500/20 blur-2xl -z-10" />
                <div className="relative w-80 h-80 mx-auto rounded-2xl overflow-hidden border-4 border-green-500/50 shadow-2xl group">
                  <img src="/your-photo.jpg" alt="Mashudh Ahmed" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {/* Stats card */}
                <div className="glass-card p-6 text-center relative">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <div className="text-3xl font-bold text-green-400">
                        <CountUp end={3} suffix="+" />
                      </div>
                      <div className="text-xs text-gray-400">Years Coding</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">
                        <CountUp end={projectCount} suffix="+" />
                      </div>
                      <div className="text-xs text-gray-400">Projects</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">
                        <CountUp end={520} suffix="+" />
                      </div>
                      <div className="text-xs text-gray-400">GitHub Commits</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">
                        <GitHubRepoCount username="mashudhahmed" fallback={24} />
                      </div>
                      <div className="text-xs text-gray-400">GitHub Repos</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400 italic">“Code is poetry written in logic.”</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                    About Me
                  </h2>
                  <div className="w-20 h-1 bg-green-500 mt-3 mb-6 rounded-full" />
                  <p className="text-lg text-gray-300 leading-relaxed">
                    I'm <span className="text-green-400 font-semibold">Mashudh Ahmed</span>, a CSE student majoring in <strong className="text-green-300">Software Engineering</strong>. I build high‑performance web applications with Next.js, NestJS, and PostgreSQL. I love solving complex problems with clean, elegant code.
                  </p>
                </div>
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-7 h-7 text-green-400" />
                    <h3 className="text-2xl font-semibold">Education</h3>
                  </div>
                  <div className="space-y-3 pl-2">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                      <div>
                        <p className="font-bold">Bachelor of Science in Computer Science and Engineering</p>
                        <p className="text-gray-400">American International University - Bangladesh</p>
                        <p className="text-sm text-gray-500">Major: Software Engineering | 2022 – 2026</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                      <div>
                        <p className="font-bold">Relevant Coursework</p>
                        <p className="text-gray-400">Data Structures, Algorithms, Web Tech, Mobile Dev, Software Engineering, Advanced DB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      {/* Skills + Projects (client component) */}
      <PortfolioContent projects={projects} />

      {/* Contact Section – Compact with Taller Map */}
<ScrollReveal>
  <section id="contact" className="relative z-10 py-10 px-4 max-w-6xl mx-auto">
    <div className="text-center mb-5">
      <h2 className="text-3xl font-bold text-white">Get In Touch</h2>
      <div className="w-16 h-0.5 bg-green-500 mx-auto mt-2 rounded-full" />
      <p className="text-gray-400 text-xs max-w-xl mx-auto mt-2">
        Have a project? Let's connect and build something great.
      </p>
    </div>
    <div className="grid md:grid-cols-2 gap-5 items-stretch">
      {/* Contact Form – reduced internal padding via ContactForm component (optional) */}
      <div>
        <ContactForm />
      </div>
      {/* Info Card with Taller Map */}
      <div className="glass-card p-4 flex flex-col h-full">
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold text-white">Location</h3>
        </div>
        <MapWrapper />
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-700">
          <div className="flex items-center gap-1.5 text-gray-300 text-xs">
            <Mail className="w-3 h-3 text-green-400" />
            <a href="mailto:mashudh.ahmed@outlook.com" className="hover:text-green-400 transition truncate">
              mashudh.ahmed@outlook.com
            </a>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] border border-green-500/30">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Available
          </div>
        </div>
      </div>
    </div>
  </section>
</ScrollReveal>

      <TerminalButton />

      <footer className="relative z-10 border-t border-gray-800 py-10 text-center text-gray-500 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <a href="https://github.com/mashudhahmed" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
            <FaGithub className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/mashudhahmed" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
            <FaLinkedin className="w-6 h-6" />
          </a>
          <a href="mailto:mashudh.ahmed@outlook.com" className="hover:text-green-400 transition">
            <FaEnvelope className="w-6 h-6" />
          </a>
        </div>
        <p className="mb-2 text-gray-400">mashudh.ahmed@outlook.com</p>
        <p>© {new Date().getFullYear()} Mashudh Ahmed. Built with Next.js & NestJS.</p>
        <BackToTopButton />
      </footer>
    </main>
  );
}