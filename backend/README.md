# Portfolio Backend API

[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3-orange?logo=typeorm)](https://typeorm.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

# About

RESTful API backend for the Mashudh Ahmed portfolio website. Built with NestJS, TypeORM, and PostgreSQL. Provides full CRUD operations for projects, skills, contact messages, social links, and portfolio settings.

---

# Folder Structure

```text
backend/
├── src/
│   ├── about/
│   │   ├── about.controller.ts
│   │   ├── about.entity.ts
│   │   ├── about.module.ts
│   │   ├── about.service.ts
│   │   └── dto/
│   │       └── update-about.dto.ts
│   │
│   ├── admin/
│   │   ├── admin.controller.ts
│   │   ├── admin.guard.ts
│   │   └── admin.module.ts
│   │
│   ├── contact/
│   │   ├── contact.controller.ts
│   │   ├── contact.module.ts
│   │   ├── contact.service.ts
│   │   └── message.entity.ts
│   │
│   ├── contact-info/
│   │   ├── contact-info.controller.ts
│   │   ├── contact-info.entity.ts
│   │   ├── contact-info.module.ts
│   │   ├── contact-info.service.ts
│   │   └── dto/
│   │       └── update-contact-info.dto.ts
│   │
│   ├── health/
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   │
│   ├── projects/
│   │   ├── projects.controller.ts
│   │   ├── projects.module.ts
│   │   ├── projects.service.ts
│   │   ├── project.entity.ts
│   │   └── dto/
│   │       └── create-project.dto.ts
│   │
│   ├── resume/
│   │   ├── resume.controller.ts
│   │   ├── resume.entity.ts
│   │   ├── resume.module.ts
│   │   ├── resume.service.ts
│   │   └── dto/
│   │       └── update-resume.dto.ts
│   │
│   ├── settings/
│   │   ├── settings.controller.ts
│   │   ├── settings.module.ts
│   │   ├── settings.service.ts
│   │   ├── setting.entity.ts
│   │   └── dto/
│   │       └── update-settings.dto.ts
│   │
│   ├── skills/
│   │   ├── skills.controller.ts
│   │   ├── skills.module.ts
│   │   ├── skills.service.ts
│   │   ├── skill.entity.ts
│   │   └── dto/
│   │       └── create-skill.dto.ts
│   │
│   ├── social/
│   │   ├── social.controller.ts
│   │   ├── social.module.ts
│   │   ├── social.service.ts
│   │   ├── social.entity.ts
│   │   └── dto/
│   │       └── create-social-link.dto.ts
│   │
│   ├── stats/
│   │   ├── stats.controller.ts
│   │   └── stats.module.ts
│   │
│   ├── visitor/
│   │   ├── visitor.controller.ts
│   │   ├── visitor.module.ts
│   │   ├── visitor.service.ts
│   │   ├── visitor.entity.ts
│   │   └── dto/
│   │       └── update-visitor.dto.ts
│   │
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

# Structure Overview

| Folder | Purpose |
|--------|---------|
| `about/` | Portfolio about/profile management |
| `admin/` | Admin authentication and route protection |
| `contact/` | Contact form message handling |
| `contact-info/` | Public contact information management |
| `health/` | Health check and monitoring endpoints |
| `projects/` | Portfolio project CRUD operations |
| `resume/` | Resume URL and file metadata management |
| `settings/` | Portfolio configuration/settings |
| `skills/` | Skills management system |
| `social/` | Social media links management |
| `stats/` | Portfolio analytics and statistics |
| `visitor/` | Visitor tracking and counter system |
| `dto/` | Data Transfer Objects for validation |
| `*.entity.ts` | TypeORM database entities |
| `*.service.ts` | Business logic layer |
| `*.controller.ts` | API route handlers |
| `*.module.ts` | NestJS module configuration |

---

# API Endpoints

## Public Routes (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Get all projects |
| GET | `/projects/:id` | Get single project (increments view count) |
| GET | `/skills` | Get all skills |
| GET | `/about` | Get about information |
| GET | `/contact-info` | Get contact information |
| GET | `/social-links` | Get all social links |
| GET | `/settings` | Get portfolio settings |
| POST | `/visitor` | Increment visitor count |
| GET | `/visitor` | Get current visitor count |
| POST | `/messages` | Submit contact form message |
| GET | `/resume` | Get resume download URL |
| GET | `/health` | Health check endpoint |

---

## Admin Routes (Bearer Token Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/verify` | Verify admin token |
| GET | `/admin/status` | Get server status |
| POST | `/projects` | Create new project |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| POST | `/skills` | Create new skill |
| PATCH | `/skills/:id` | Update skill |
| DELETE | `/skills/:id` | Delete skill |
| PUT | `/about` | Update about information |
| PUT | `/contact-info` | Update contact information |
| POST | `/social-links` | Create social link |
| PATCH | `/social-links/:id` | Update social link |
| DELETE | `/social-links/:id` | Delete social link |
| PUT | `/settings` | Update portfolio settings |
| GET | `/messages` | Get all contact messages |
| DELETE | `/messages/:id` | Delete contact message |
| PUT | `/resume` | Update resume URL |
| GET | `/stats/views` | Get total project views |

---

# Technology Stack

| Category | Technologies |
|----------|--------------|
| Framework | NestJS 10 |
| Language | TypeScript 5 |
| Database | PostgreSQL |
| ORM | TypeORM |
| Validation | class-validator, class-transformer |
| Security | Helmet, Rate Limiting, Bearer Token |
| Deployment | Render |

---

# Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

---

# Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| ADMIN_TOKEN | Bearer token for admin routes (min 6 characters) | Yes |
| NODE_ENV | Environment (development/production) | No |
| PORT | Server port (default: 4000) | No |
| CORS_ORIGINS | Comma-separated allowed origins | No |

---

# Database Schema

## Projects

- `id`
- `title`
- `description`
- `technologies` (array)
- `imageUrl`
- `githubUrl`
- `liveUrl`
- `views`
- `createdAt`
- `updatedAt`

## Skills

- `id`
- `name`
- `icon`
- `level` (`BEGINNER / INTERMEDIATE / ADVANCED / EXPERT`)
- `category`
- `isActive`
- `createdAt`
- `updatedAt`

## About

- `id`
- `bio`
- `photoUrl`
- `education`
- `university`
- `major`
- `yearStart`
- `yearEnd`
- `coursework`
- `updatedAt`

## Contact Info

- `id`
- `email`
- `location`
- `timezone`
- `workingHours`
- `responseTime`
- `availableForWork`
- `updatedAt`

## Social Links

- `id`
- `platform`
- `url`
- `isActive`
- `updatedAt`

## Messages

- `id`
- `name`
- `email`
- `message`
- `receivedAt`

## Settings

- `id`
- `key` (unique)
- `value` (JSON)
- `updatedAt`

## Resume

- `id`
- `url`
- `fileName`
- `updatedAt`

## Visitors

- `id`
- `count`
- `updatedAt`

---

# Security Features

- Helmet.js for secure HTTP headers
- Rate limiting (10 requests per minute globally)
- Stricter rate limiting for contact form (3 per minute)
- Admin routes protected with Bearer token
- Environment validation with Joi
- Input validation using class-validator

---

# Error Handling

All API endpoints return standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Validation error description",
  "error": "Bad Request"
}
```

---

# HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

# Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Global (all routes) | 10 requests | 1 minute |
| `/messages` (POST) | 3 requests | 1 minute |
| `/admin/verify` (POST) | 5 requests | 1 minute |

---

# Health Check

```http
GET /health
```

## Response

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  }
}
```

---

# Deployment

The backend is deployed on Render. Every push to the `main` branch triggers an automatic deployment.

## Deploy to Render

1. Push code to GitHub repository
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Render automatically builds and deploys

---

# Local Development with Frontend

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

- Backend runs on: `http://localhost:4000`
- Frontend runs on: `http://localhost:3000`

---

# License

MIT License
