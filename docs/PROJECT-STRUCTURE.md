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
