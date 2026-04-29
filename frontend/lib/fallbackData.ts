// frontend/lib/fallbackData.ts
// Fallback data when backend is not available or returns empty

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  liveUrl: string | null;
  views: number;
  createdAt?: string;
}

export const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "SnapCart – E‑Commerce App",
    description: "Full-stack e-commerce backend with NestJS featuring JWT authentication, role-based access control, product management, cart system, and order handling. Built with clean architecture for real-world scalability.",
    technologies: ["TypeScript", "NestJS", "PostgreSQL", "JWT", "REST API"],
    imageUrl: "/snapcart.jpeg",
    githubUrl: "https://github.com/mashudhahmed/ecommerce-fullstack",
    liveUrl: "",
    views: 128,
  },
  {
    id: 2,
    title: "BloodLink – Blood Donation App",
    description: "Android mobile app in Kotlin connecting blood donors with recipients, featuring user registration and donor search functionality. Integrated Firebase for real-time database, authentication, and cloud storage.",
    technologies: ["Kotlin", "XML", "Firebase", "NestJS"],
    imageUrl: "/bloodlink.jpeg",
    githubUrl: "https://github.com/mashudhahmed/blood-donation-mobile-app",
    liveUrl: "",
    views: 89,
  },
  {
    id: 3,
    title: "QuickBite – Food Delivery App",
    description: "Food delivery REST API with 4 user roles (customer, restaurant owner, delivery agent, admin) with JWT authentication and role-based guards. Features TypeORM relationships, transactional emails, and full Swagger documentation.",
    technologies: ["TypeScript", "NestJS", "PostgreSQL", "TypeORM", "JWT"],
    imageUrl: "/quickbite.jpeg",
    githubUrl: "https://github.com/mashudhahmed/food-delivery-fullstack",
    liveUrl: "",
    views: 156,
  },
];

export interface Skill {
  id: number;
  name: string;
  icon: string;
  level: string;
  category: string;
  isActive: boolean;
}

export const fallbackSkills: Skill[] = [
  // Frontend
  { id: 1, name: 'JavaScript', icon: 'SiJavascript', level: 'ADVANCED', category: 'Frontend', isActive: true },
  { id: 2, name: 'TypeScript', icon: 'SiTypescript', level: 'ADVANCED', category: 'Frontend', isActive: true },
  { id: 3, name: 'React', icon: 'SiReact', level: 'ADVANCED', category: 'Frontend', isActive: true },
  { id: 4, name: 'Next.js', icon: 'SiNextdotjs', level: 'INTERMEDIATE', category: 'Frontend', isActive: true },
  { id: 5, name: 'TailwindCSS', icon: 'SiTailwindcss', level: 'ADVANCED', category: 'Frontend', isActive: true },
  { id: 6, name: 'HTML5', icon: 'SiHtml5', level: 'EXPERT', category: 'Frontend', isActive: true },
  { id: 7, name: 'Framer Motion', icon: 'SiFramer', level: 'INTERMEDIATE', category: 'Frontend', isActive: true },
  // Backend & DevOps
  { id: 8, name: 'Node.js/NestJS', icon: 'SiNestjs', level: 'ADVANCED', category: 'Backend & DevOps', isActive: true },
  { id: 9, name: 'REST APIs', icon: 'SiSwagger', level: 'ADVANCED', category: 'Backend & DevOps', isActive: true },
  { id: 10, name: 'JWT', icon: 'SiJsonwebtokens', level: 'ADVANCED', category: 'Backend & DevOps', isActive: true },
  { id: 11, name: 'Docker', icon: 'SiDocker', level: 'INTERMEDIATE', category: 'Backend & DevOps', isActive: true },
  { id: 12, name: 'Git/GitHub', icon: 'SiGit', level: 'ADVANCED', category: 'Backend & DevOps', isActive: true },
  { id: 13, name: 'Postman', icon: 'SiPostman', level: 'ADVANCED', category: 'Backend & DevOps', isActive: true },
  { id: 14, name: 'Swagger UI', icon: 'SiSwagger', level: 'ADVANCED', category: 'Backend & DevOps', isActive: true },
  // Database & Tools
  { id: 15, name: 'PostgreSQL', icon: 'SiPostgresql', level: 'INTERMEDIATE', category: 'Database & Tools', isActive: true },
  { id: 16, name: 'TypeORM', icon: 'SiTypeorm', level: 'ADVANCED', category: 'Database & Tools', isActive: true },
  { id: 17, name: 'Firebase', icon: 'SiFirebase', level: 'INTERMEDIATE', category: 'Database & Tools', isActive: true },
  // Languages
  { id: 18, name: 'C++', icon: 'SiCplusplus', level: 'INTERMEDIATE', category: 'Languages', isActive: true },
  { id: 19, name: 'Kotlin', icon: 'SiKotlin', level: 'INTERMEDIATE', category: 'Languages', isActive: true },
];

export interface AboutData {
  bio: string;
  photoUrl: string;
  education: string;
  university: string;
  major: string;
  yearStart: string;
  yearEnd: string;
  coursework: string;
}

export const fallbackAbout: AboutData = {
  bio: "I'm a passionate CSE student majoring in Software Engineering. I build high‑performance web applications with Next.js, NestJS, and PostgreSQL. I love solving complex problems with clean, elegant code. This portfolio is powered by a full-stack architecture with a terminal-inspired UI.",
  photoUrl: "/your-photo.jpg",
  education: "Bachelor of Science in Computer Science and Engineering",
  university: "American International University - Bangladesh",
  major: "Software Engineering",
  yearStart: "2022",
  yearEnd: "2026",
  coursework: "Data Structures, Algorithms, Advanced Programming in Web Technology, Mobile Application Development, Software Requirement Engineering, Advanced Database Management System",
};

export interface ContactData {
  email: string;
  location: string;
  timezone: string;
  workingHours: string;
  responseTime: string;
  availableForWork: boolean;
}

export const fallbackContact: ContactData = {
  email: "mashudh.ahmed@outlook.com",
  location: "Dhaka, Bangladesh",
  timezone: "UTC+6",
  workingHours: "Mon-Fri, 9AM-6PM UTC+6",
  responseTime: "Within 24 hours",
  availableForWork: true,
};

export interface SettingsData {
  siteTitle: string;
  typewriterPhrases: string[];
  footerText: string;
}

export const fallbackSettings: SettingsData = {
  siteTitle: "Mashudh Ahmed | Terminal Portfolio",
  typewriterPhrases: ["Full‑Stack Developer", "Problem Solver", "Tech Enthusiast", "Creative Technologist"],
  footerText: "Built with Next.js & NestJS",
};

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  isActive: boolean;
}

export const fallbackSocialLinks: SocialLink[] = [
  { id: 1, platform: "github", url: "https://github.com/mashudhahmed", isActive: true },
  { id: 2, platform: "linkedin", url: "https://www.linkedin.com/in/mashudhahmed", isActive: true },
  { id: 3, platform: "email", url: "mailto:mashudh.ahmed@outlook.com", isActive: true },
];

// Helper function to fetch with fallback (industry standard)
export async function fetchWithFallback<T>(
  url: string, 
  fallback: T, 
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return fallback;
    const data = await res.json();
    // Handle empty array or null/empty object
    if (Array.isArray(data) && data.length === 0) return fallback;
    if (data === null) return fallback;
    if (typeof data === 'object' && Object.keys(data).length === 0 && !Array.isArray(data)) return fallback;
    return data;
  } catch {
    return fallback;
  }
}