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
