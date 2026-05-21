# Portfolio Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-purple?logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

# About

Terminal-style portfolio frontend built with Next.js 16, TypeScript, and TailwindCSS. Features an interactive command-line interface, glassmorphic UI design, and a complete admin panel for content management.

**Live Demo:** [mashudhahmed.vercel.app](https://mashudhahmed.vercel.app)

---

# Preview

| Homepage | Projects Showcase |
|---|---|
| <img width="959" height="473" alt="image" src="https://github.com/user-attachments/assets/58c082ce-c7ce-45e8-ba2e-309797500e98" /> | <img width="959" height="475" alt="image" src="https://github.com/user-attachments/assets/cc145b07-626b-4ed7-9236-1d440b5bed96" /> |

| Admin Dashboard | Teeminal |
|---|---|
|<img width="959" height="475" alt="image" src="https://github.com/user-attachments/assets/c1a34580-638b-4c49-9dc0-5a0ddf579866" />| <img width="959" height="475" alt="image" src="https://github.com/user-attachments/assets/a8a982f1-41ec-49fb-b29d-86cb1917d655" /> |

---

# Folder Structure

```text
frontend/
├── app/
│   ├── admin/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── messages/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   └── page.tsx
│   │   ├── resume/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── skills/
│   │   │   └── page.tsx
│   │   ├── social/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── BackgroundCanvas.tsx
│   ├── BackToTopButton.tsx
│   ├── CommandList.ts
│   ├── CommandParser.ts
│   ├── ContactForm.tsx
│   ├── CountUp.tsx
│   ├── FloatingIcons.tsx
│   ├── GitHubRepoCount.tsx
│   ├── GitHubStreak.tsx
│   ├── ImageUpload.tsx
│   ├── MapComponent.tsx
│   ├── MapWrapper.tsx
│   ├── MotionWrapper.tsx
│   ├── Navbar.tsx
│   ├── ParticleBackground.tsx
│   ├── PortfolioContent.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectGrid.tsx
│   ├── ProjectShowcase.tsx
│   ├── ScrollReveal.tsx
│   ├── Terminal.tsx
│   ├── TerminalButton.tsx
│   ├── TerminalModal.tsx
│   ├── ThemeProvider.tsx
│   └── Typewriter.tsx
│
├── lib/
│   └── fallbackData.ts
│
├── public/
│   ├── fonts/
│   ├── images/
│   ├── screenshots/
│   │   ├── homepage.png
│   │   ├── projects.png
│   │   ├── admin-dashboard.png
│   │   └── mobile-view.png
│   └── resume.pdf
│
├── .env.local.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

# Features

## Public Interface

- Terminal-style command interface with commands:
  - `help`
  - `about`
  - `skills`
  - `projects`
  - `contact`
  - `social`
  - `system`
  - `resume`
  - `clear`

- Tab completion for terminal commands
- Interactive typewriter effect in hero section
- Glassmorphic card design with backdrop blur
- Scroll-triggered animations
- Responsive design for all screen sizes
- Animated background with particles and floating icons
- Interactive map using Leaflet
- Contact form with real-time validation

---

## Admin Panel

- Dashboard with analytics and statistics
- Projects CRUD with Cloudinary image upload
- Skills CRUD with category and level management
- About section editor
- Contact information editor
- Social links manager
- Messages inbox
- Settings editor
- Resume upload with PDF support

---

## Dynamic Features

- Live GitHub repository count
- GitHub streak tracking
- Visitor counter
- Project view tracking
- Real-time backend API integration
- Fallback data support

---

# Technology Stack

| Category | Technologies |
|----------|--------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | TailwindCSS |
| Animations | Framer Motion |
| Icons | Lucide Icons, React Icons |
| Maps | Leaflet, React Leaflet |
| Uploads | Cloudinary |
| HTTP Client | Native Fetch API |
| Deployment | Vercel |

---

# Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local

# Start development server
npm run dev

# Build application
npm run build

# Start production server
npm start
```

---

# Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| NEXT_PUBLIC_API_URL | Backend API URL | Yes |
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | Yes |

---

# Available Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production application |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

# Terminal Commands

| Command | Description |
|----------|-------------|
| `help` | Show available commands |
| `about` | Display about information |
| `skills` | Display technical skills |
| `projects` | Show projects showcase |
| `contact` | Open contact interface |
| `social` | Display social links |
| `system` | Show system information |
| `resume` | Download resume |
| `clear` | Clear terminal screen |

---

# Admin Panel Access

1. Navigate to `/admin/login`
2. Enter the admin token configured in the backend
3. Access the dashboard sidebar to manage portfolio content

---

# Component Architecture

## Core Components

| Component | Purpose |
|-----------|----------|
| `BackgroundCanvas` | Animated grid and particle background |
| `FloatingIcons` | Floating technology icon animations |
| `ScrollReveal` | Scroll-triggered animation wrapper |
| `CountUp` | Animated number counter |
| `Typewriter` | Rotating text typing effect |
| `Terminal` | Interactive terminal interface |

---

## Data Components

| Component | Purpose |
|-----------|----------|
| `GitHubRepoCount` | Displays GitHub repository count |
| `GitHubStreak` | Displays GitHub contribution streak |
| `PortfolioContent` | Renders projects and skills |
| `ContactForm` | Handles contact form submission |

---

# Styling

- TailwindCSS utility-first styling
- Glassmorphic UI design
- Custom animations and gradients
- JetBrains Mono terminal font
- Inter font for content text
- Responsive layout system
- Smooth scrolling experience

---

# Performance Optimizations

- Dynamic imports for Leaflet map
- SSR disabled for browser-only components
- Lazy loading where appropriate
- Optimized animation rendering
- Fallback API data handling

---

# Backend Integration

The frontend communicates with the NestJS backend API using RESTful endpoints for:

- Projects
- Skills
- Messages
- Social links
- Resume management
- Visitor tracking
- Analytics

---

# Deployment

The frontend is deployed on Vercel. Every push to the `main` branch triggers automatic deployment.

## Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy application
vercel --prod
```

---

# Required Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

---

# Browser Support

| Browser | Version |
|----------|----------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |

---

# Future Improvements

- Blog integration
- Dark/light theme switcher
- Multi-language support
- Project filtering system
- Markdown-powered project pages
- WebSocket-powered terminal interactions

---

# License

MIT License
