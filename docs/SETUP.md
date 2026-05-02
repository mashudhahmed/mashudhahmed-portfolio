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
