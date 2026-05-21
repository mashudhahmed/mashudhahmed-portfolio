# Mashudh Ahmed – Full-Stack Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<div align="center">

<img width="1200" alt="Portfolio Preview" src="https://github.com/user-attachments/assets/aa5cf034-debe-45bb-a85f-33530105461a" />

</div>

---

# About This Project

A full-stack, terminal-style portfolio that combines a modern glassmorphic UI with an interactive command-line interface. Built from scratch using Next.js, NestJS, PostgreSQL, and TypeScript, this portfolio serves as both a creative showcase and a complete content management system.

The project includes:
- Interactive terminal-based portfolio interface
- Full admin dashboard for content management
- RESTful backend API
- PostgreSQL database integration
- Real-time analytics and visitor tracking
- Responsive UI with animations and modern design patterns

**Live Demo:** [mashudhahmed.vercel.app](https://mashudhahmed.vercel.app)

---

# Architecture

```text
Next.js Frontend
        ↓
NestJS REST API
        ↓
PostgreSQL Database
```

---

# Project Structure

```text
root/
├── frontend/    # Next.js frontend application
├── backend/     # NestJS backend API
└── README.md
```

---

# Technology Stack

| Category | Technologies |
|----------|--------------|
| Frontend | Next.js 16, TypeScript, TailwindCSS, Framer Motion |
| Backend | NestJS, TypeORM, PostgreSQL, class-validator |
| Database | Neon PostgreSQL |
| Image Hosting | Cloudinary |
| Maps | Leaflet, React Leaflet |
| Icons | Lucide Icons, React Icons |
| Deployment | Vercel (Frontend), Render (Backend) |

---

# Key Features

## Interactive Terminal

- Terminal-style command interface
- Commands including:
  - `help`
  - `about`
  - `skills`
  - `projects`
  - `contact`
  - `social`
  - `resume`
  - `clear`
- Tab completion for commands
- Real-time project filtering
- Live GitHub statistics

---

## Complete Admin Dashboard

### Projects Management
- Create, update, and delete projects
- Cloudinary image uploads
- View tracking

### Skills Management
- Skill categories
- Experience levels
- Dynamic skill rendering

### About Section
- Bio editor
- Education details
- Coursework management
- Profile photo update

### Contact Management
- Contact information editor
- Social links management
- Contact form message inbox

### Portfolio Settings
- Typewriter phrases
- Footer customization
- Resume upload and management

---

## Modern UI and UX

- Glassmorphic card design
- Scroll-triggered animations
- Responsive layouts
- Dark terminal aesthetic
- Animated backgrounds
- Floating technology icons
- Typewriter animations

---

## Real-Time Features

- GitHub repository counter
- Visitor analytics
- Project view tracking
- Dynamic API data fetching
- Fallback data system

---

## Additional Features

- Interactive location map using Leaflet
- Direct Cloudinary uploads
- Rate-limited contact form
- Bearer token protected admin routes
- RESTful API architecture

---

# Screenshots

| Hero Section | Terminal Interface | Admin Dashboard |
|---|---|---|
| <img width="400" alt="Hero Section" src="https://github.com/user-attachments/assets/b9677924-fd00-49eb-8e86-38b36fe1b0bd" /> | <img width="400" alt="Terminal Interface" src="https://github.com/user-attachments/assets/4ee6986e-59fe-4c13-ac4c-1ec1776ceac7" /> | <img width="400" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/bf5c8c23-4781-452a-8f24-b4122d0d58a7" /> |

---

# Local Development

## Clone Repository

```bash
git clone https://github.com/mashudhahmed/your-repository-name.git
cd your-repository-name
```

---

## Frontend Setup

```bash
cd frontend

npm install

cp .env.local.example .env.local

npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Backend Setup

```bash
cd backend

npm install

cp .env.example .env

npm run start:dev
```

Backend runs on:

```text
http://localhost:4000
```

---

# Environment Variables

## Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## Backend

```env
DATABASE_URL=your_postgresql_connection_string
ADMIN_TOKEN=your_secure_admin_token
PORT=4000
NODE_ENV=development
```

---

# Deployment

## Frontend Deployment

The frontend is deployed on Vercel with automatic deployments from the `main` branch.

### Deploy Frontend

```bash
npm install -g vercel

vercel --prod
```

---

## Backend Deployment

The backend is deployed on Render with automatic deployments from GitHub.

### Deployment Requirements

- PostgreSQL database
- Environment variables
- Cloudinary credentials
- Render web service

---

# Browser Support

| Browser | Version |
|----------|----------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |

---

# Contributing

This is a personal portfolio project, but suggestions and feedback are welcome.

You can:
- Open issues
- Suggest improvements
- Submit pull requests
- Report bugs

---

# Contact

## Mashudh Ahmed

| Platform | Link |
|---|---|
| Portfolio | [mashudhahmed.vercel.app](https://mashudhahmed.vercel.app) |
| GitHub | [@mashudhahmed](https://github.com/mashudhahmed) |
| LinkedIn | [linkedin.com/in/mashudhahmed](https://linkedin.com/in/mashudhahmed) |
| Email | [mashudh.ahmed@outlook.com](mailto:mashudh.ahmed@outlook.com) |

---

# Acknowledgments

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| NestJS | Backend framework |
| TailwindCSS | Styling system |
| Framer Motion | Animations |
| Cloudinary | Media hosting |
| Leaflet | Interactive maps |
| Neon | PostgreSQL hosting |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

# License

This project is licensed under the MIT License.
