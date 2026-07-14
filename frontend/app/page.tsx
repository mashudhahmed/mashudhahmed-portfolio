export const revalidate = 3600;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { Suspense } from 'react';
import Image from 'next/image';
import TerminalButton from '@/components/TerminalButton';
import ContactForm from '@/components/ContactForm';
import Typewriter from '@/components/Typewriter';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import BackToTopButton from '@/components/BackToTopButton';
import FloatingIcons from '@/components/FloatingIcons';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';
import GitHubRepoCount from '@/components/GitHubRepoCount';
import GitHubStreak from '@/components/GitHubStreak';
import PortfolioContent from '@/components/PortfolioContent';
import CountUp from '@/components/CountUp';
import MapWrapper from '@/components/MapWrapper';
import { Download, Calendar, GraduationCap, Award, Mail, MapPin, Clock, Zap } from 'lucide-react';
import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter, FaInstagram, FaYoutube, FaDiscord, FaDev, FaMedium } from 'react-icons/fa';
import {
  fallbackProjects,
  fallbackAbout,
  fallbackContact,
  fallbackSettings,
  fallbackSocialLinks,
} from '@/lib/fallbackData';

// ✅ Industry standard blur placeholder for hero image
const BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';

// Icon mapping for social platforms
const socialIcons: Record<string, any> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: FaEnvelope,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  discord: FaDiscord,
  devto: FaDev,
  medium: FaMedium,
};

// ✅ Updated fetch functions with ISR
async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, { 
      next: { revalidate: 3600, tags: ['projects'] }
    });
    if (!res.ok) return fallbackProjects;
    const data = await res.json();
    return data.length > 0 ? data : fallbackProjects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return fallbackProjects;
  }
}

async function getAbout() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about`, { 
      next: { revalidate: 3600, tags: ['about'] }
    });
    if (!res.ok) return fallbackAbout;
    const data = await res.json();
    return data || fallbackAbout;
  } catch (error) {
    console.error('Failed to fetch about:', error);
    return fallbackAbout;
  }
}

async function getContactInfo() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact-info`, { 
      next: { revalidate: 3600, tags: ['contact'] }
    });
    if (!res.ok) return fallbackContact;
    const data = await res.json();
    return data || fallbackContact;
  } catch (error) {
    console.error('Failed to fetch contact info:', error);
    return fallbackContact;
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, { 
      next: { revalidate: 3600, tags: ['settings'] }
    });
    if (!res.ok) return fallbackSettings;
    const data = await res.json();
    return data || fallbackSettings;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return fallbackSettings;
  }
}

async function getVisitorCount() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visitor`, { 
      next: { revalidate: 3600, tags: ['visitor'] }
    });
    if (!res.ok) return { count: 0 };
    return res.json();
  } catch {
    return { count: 0 };
  }
}

async function getResume() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume`, { 
      next: { revalidate: 3600, tags: ['resume'] }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch resume:', error);
  }
  return { url: '/resume.pdf', fileName: 'Mashudh_Ahmed_Resume.pdf' };
}

async function getSocialLinks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social-links`, { 
      next: { revalidate: 3600, tags: ['social'] }
    });
    if (!res.ok) return fallbackSocialLinks;
    const data = await res.json();
    return data.length > 0 ? data : fallbackSocialLinks;
  } catch (error) {
    console.error('Failed to fetch social links:', error);
    return fallbackSocialLinks;
  }
}

// ✅ Main page component with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-green-400 text-xl animate-pulse">Loading portfolio...</div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}

// ✅ PageContent component with all data fetching
async function PageContent() {
  const [projects, about, contactInfo, settings, visitorData, resume, socialLinks] = await Promise.all([
    getProjects(),
    getAbout(),
    getContactInfo(),
    getSettings(),
    getVisitorCount(),
    getResume(),
    getSocialLinks(),
  ]);

  const projectCount = projects.length;
  const typewriterPhrases = settings.typewriterPhrases || fallbackSettings.typewriterPhrases;
  const activeSocialLinks = socialLinks.filter((link: any) => link.isActive);

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
            <Typewriter phrases={typewriterPhrases} /> <span className="inline-block w-1 h-6 bg-green-400 animate-pulse ml-1 align-middle"></span>
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <a href="#projects" className="px-8 py-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-950">
              View Work
            </a>
            <a href="#contact" className="px-8 py-3 rounded-full border-2 border-green-500 text-green-400 font-semibold hover:bg-green-500/10 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-950">
              Contact Me
            </a>
            <a 
              href={resume.url} 
              download 
              className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-950 inline-flex items-center gap-2"
            >
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
                  <Image
                    src={about.photoUrl}
                    alt="Mashudh Ahmed - Full-Stack Developer"
                    fill
                    priority
                    fetchPriority="high"
                    loading="eager"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={75}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    suppressHydrationWarning
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 right-3 z-10">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border backdrop-blur-sm ${
                      contactInfo.availableForWork 
                        ? 'bg-green-500/80 text-white border-green-400' 
                        : 'bg-red-500/80 text-white border-red-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${contactInfo.availableForWork ? 'bg-white animate-pulse' : 'bg-white'}`} />
                      {contactInfo.availableForWork ? 'Available' : 'Not Available'}
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6 text-center relative">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div><div className="text-3xl font-bold text-green-400"><CountUp end={3} suffix="+" /></div><div className="text-xs text-gray-400">Years Coding</div></div>
                    <div><div className="text-3xl font-bold text-green-400"><CountUp end={projectCount} suffix="+" /></div><div className="text-xs text-gray-400">Projects</div></div>
                    <div><div className="text-3xl font-bold text-green-400"><GitHubStreak username="mashudhahmed" fallback={7} /></div><div className="text-xs text-gray-400">Longest Streak</div></div>
                    <div><div className="text-3xl font-bold text-green-400"><GitHubRepoCount username="mashudhahmed" fallback={24} /></div><div className="text-xs text-gray-400">GitHub Repos</div></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400 italic">"Code is poetry written in logic."</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">About Me</h2>
                  <div className="w-20 h-1 bg-green-500 mt-3 mb-6 rounded-full" />
                  <p className="text-lg text-gray-300 leading-relaxed">{about.bio}</p>
                </div>
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-3"><GraduationCap className="w-7 h-7 text-green-400" /><h3 className="text-2xl font-semibold">Education</h3></div>
                  <div className="space-y-3 pl-2">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                      <div>
                        <p className="font-bold">{about.education}</p>
                        <p className="text-gray-400">{about.university}</p>
                        <p className="text-sm text-gray-500">Major: {about.major} | {about.yearStart} – {about.yearEnd}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                      <div>
                        <p className="font-bold">Relevant Coursework</p>
                        <p className="text-gray-400">{about.coursework}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      <PortfolioContent projects={projects} />

      {/* Contact Section */}
      <ScrollReveal>
        <section id="contact" className="relative z-10 py-8 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-white">Get In Touch</h2>
            <div className="w-12 h-0.5 bg-green-500 mx-auto mt-1.5 rounded-full" />
            <p className="text-gray-400 text-xs max-w-xl mx-auto mt-1.5">Have a project? Let's connect.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 items-stretch">
            <div className="h-full">
              <ContactForm />
            </div>
            <div className="glass-card p-3 flex flex-col h-full">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-green-400" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wide">Location</h3>
              </div>
              <div className="w-full h-[300px] rounded-lg overflow-hidden">
                <MapWrapper />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3 h-3 text-green-400" />
                    <span>Working Hours</span>
                  </div>
                  <span className="text-gray-300">{contactInfo.workingHours}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Zap className="w-3 h-3 text-green-400" />
                    <span>Response Time</span>
                  </div>
                  <span className="text-gray-300">{contactInfo.responseTime}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <a 
                  href={`mailto:${contactInfo.email}`} 
                  className="text-green-400 hover:text-green-300 transition text-sm break-all bg-gray-800/50 p-2 rounded-lg text-center block"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <TerminalButton />

      {/* ✅ Fixed: Added aria-label to all social links */}
      <footer className="relative z-10 border-t border-gray-800 py-10 text-center text-gray-500 text-sm">
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          {activeSocialLinks.length > 0 ? (
            activeSocialLinks.map((link: any) => {
              const IconComponent = socialIcons[link.platform?.toLowerCase()];
              if (!IconComponent) return null;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition transform hover:scale-110 duration-200"
                  aria-label={`${link.platform} profile`}
                >
                  <IconComponent 
                    className="w-6 h-6" 
                    aria-hidden="true"
                    focusable="false"
                  />
                </a>
              );
            })
          ) : (
            <>
              <a 
                href="https://github.com/mashudhahmed" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-green-400 transition"
                aria-label="GitHub profile"
              >
                <FaGithub className="w-6 h-6" aria-hidden="true" focusable="false" />
              </a>
              <a 
                href="https://www.linkedin.com/in/mashudhahmed" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-green-400 transition"
                aria-label="LinkedIn profile"
              >
                <FaLinkedin className="w-6 h-6" aria-hidden="true" focusable="false" />
              </a>
              <a 
                href="mailto:mashudh.ahmed@outlook.com" 
                className="hover:text-green-400 transition"
                aria-label="Email contact"
              >
                <FaEnvelope className="w-6 h-6" aria-hidden="true" focusable="false" />
              </a>
            </>
          )}
        </div>
        <p>© {new Date().getFullYear()} Mashudh Ahmed. {settings.footerText || fallbackSettings.footerText}</p>
        <BackToTopButton />
      </footer>
    </main>
  );
}