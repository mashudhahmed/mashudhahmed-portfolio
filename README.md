# 🖥️ Mashudh Ahmed – Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<div align="center">
  <img width="800" alt="portfolio" src="https://github.com/user-attachments/assets/fdb9f9e8-3481-4ad6-821e-40ee4bfa2ae2" />

</div>

## 🚀 About This Project

A **full‑stack, terminal‑style portfolio** that combines a modern glassmorphic UI with an interactive command‑line interface. Built from scratch with Next.js, NestJS, PostgreSQL, and TypeScript – this portfolio serves as both a creative showcase and a complete content management system.

**Live Demo:** [mashudhahmed.vercel.app](https://mashudhahmed.vercel.app)

---

## ✨ Key Features

### 🖥️ Interactive Terminal
- Type commands like `help`, `about`, `skills`, `projects`, `contact`
- Tab completion for commands
- Real‑time project filtering by skill
- Visitor counter and live GitHub stats

### 🛠️ Complete Admin Panel
- **Projects** – Add, edit, delete projects with image upload
- **Skills** – Manage skills with icons, levels, and categories
- **About** – Edit bio, photo, education, coursework
- **Contact Info** – Update email, location, working hours
- **Social Links** – Manage GitHub, LinkedIn, Email links
- **Messages** – View and delete contact form submissions
- **Settings** – Configure site title, typewriter phrases, footer text

### 🎨 Modern UI/UX
- Glassmorphic card design with backdrop blur
- Scroll‑triggered animations (left/right reveals)
- Dark theme only – consistent terminal aesthetic
- Fully responsive – works on all devices

### 📊 Real‑time Data
- Live GitHub repository count
- Visitor counter (stored in database)
- Project view tracking
- Fallback data when API is unavailable

### 🗺️ Additional Features
- Interactive map (Leaflet) showing location
- Direct image upload to Cloudinary
- Contact form with validation and rate limiting
- Typewriter effect with configurable phrases

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js 16, TypeScript, TailwindCSS, Framer Motion, Lucide Icons |
| **Backend** | NestJS, TypeORM, PostgreSQL, JWT (admin guard), class-validator |
| **Database** | Neon (PostgreSQL cloud) – free tier |
| **Image Hosting** | Cloudinary – free tier |
| **Maps** | Leaflet, React Leaflet |
| **Deployment** | Vercel (frontend), Render (backend) |
| **Icons** | Lucide Icons, React Icons (Simple Icons, Font Awesome) |

---

## 📁 Project Structure
```bash
portfolio/
├── backend/
│ ├── src/
│ │ ├── admin/ # Admin guard & verification
│ │ ├── contact/ # Messages API (contact form)
│ │ ├── contact-info/ # Contact details API
│ │ ├── projects/ # Projects CRUD
│ │ ├── skills/ # Skills CRUD
│ │ ├── about/ # About section CRUD
│ │ ├── social/ # Social links CRUD
│ │ ├── settings/ # Site settings CRUD
│ │ ├── visitor/ # Visitor counter
│ │ └── stats/ # Dashboard statistics
│ ├── .env.example
│ └── package.json
├── frontend/
│ ├── app/
│ │ ├── admin/ # Admin panel pages
│ │ ├── components/ # Reusable React components
│ │ └── page.tsx # Main portfolio page
│ ├── lib/
│ │ └── fallbackData.ts # Fallback data when API is down
│ ├── public/ # Static assets (images, resume.pdf)
│ ├── .env.local.example
│ └── package.json
└── README.md

```


---

## 📦 Installation & Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or Neon account for cloud)
- Cloudinary account (for image upload)
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/mashudhahmed/mashudhahmed-portfolio.git
cd mashudhahmed-portfolio/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_DATABASE=portfolio
# ADMIN_TOKEN=your-secure-token

# Run database migrations (auto-creates tables)
npm run start:dev
```

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Update .env.local with your backend URL
# NEXT_PUBLIC_API_URL=http://localhost:4000
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Start development server
npm run dev
```

### Admin Access
Visit http://localhost:3000/admin/login
```bash
1. Enter the ADMIN_TOKEN from your backend/.env file
2. Start managing your content
```
## 🚀 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```
### Set environment variables on Vercel:
- `NEXT_PUBLIC_API_URL` = your backend URL (Render)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = your Cloudinary cloud name
- `ADMIN_TOKEN` = your admin token
### Backend (Render)
```bash
Push your backend code to GitHub
```
1. Create a new Web Service on Render
- Connect your repository
- Set Root Directory to backend

#### Add environment variables:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `ADMIN_TOKEN`
- `NODE_ENV`=production
- `Deploy`

#### Database (Neon – Free)

1. Create account at Neon
- Create a new project
- Copy the connection string
- Add to Render environment variables (or use locally)


### Backend (Render)
1. Push your backend code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your repository
4. Set **Root Directory** to `backend`
5. Add environment variables:
   - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
   - `ADMIN_TOKEN`
   - `NODE_ENV=production`
6. Deploy

### Database (Neon – Free)
1. Create account at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to Render environment variables (or use locally)

---

## 🔧 Available Scripts

### Backend

| Command | Description |
|---|---|
| `npm run start:dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start:prod` | Production server |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |

---

## 📸 Screenshots

| Hero Section | Terminal Modal | Admin Dashboard |
|---|---|---|
| ![Hero](https://via.placeholder.com/300x200?text=Hero) | ![Terminal](https://via.placeholder.com/300x200?text=Terminal) | ![Admin](https://via.placeholder.com/300x200?text=Admin) |

---

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!
Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.



## 📞 Contact

**Mashudh Ahmed**

| Platform  | Link |
|---|---|
| 📧 Email | [mashudh.ahmed@outlook.com](mailto:mashudh.ahmed@outlook.com) |
| 🐙 GitHub | [@mashudhahmed](https://github.com/mashudhahmed) |
| 💼 LinkedIn | [in/mashudhahmed](https://linkedin.com/in/mashudhahmed) |
| 🌐 Portfolio | [mashudhahmed-portfolio.vercel.app](https://mashudhahmed.vercel.app) |

## 🙏 Acknowledgments

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org) | React framework |
| [NestJS](https://nestjs.com) | Node.js framework |
| [TailwindCSS](https://tailwindcss.com) | CSS framework |
| [Framer Motion](https://www.framer.com/motion) | Animations |
| [Lucide Icons](https://lucide.dev) | Icon library |
| [Cloudinary](https://cloudinary.com) | Image hosting |
| [Leaflet](https://leafletjs.com) | Interactive maps |
| [Neon](https://neon.tech) | Cloud PostgreSQL |
| [Vercel](https://vercel.com) | Frontend hosting |
| [Render](https://render.com) | Backend hosting |



