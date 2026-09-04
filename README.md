# Pearl Gate Elite Real Estate LLC — UAE Real Estate Website

A premium, full-stack UAE real estate web platform built with **Next.js 15**, **PostgreSQL**, **Prisma**, **Tailwind CSS**, and **Cloudinary**.

## Features

### Public Website
- Premium homepage with hero, featured properties, stats, agents, testimonials
- Advanced property search and filters (buy/rent, type, location, bedrooms, price, etc.)
- Property listing with infinite scroll/pagination and premium cards
- Property detail pages with gallery, floor plans, video, map, enquiry form
- Dynamic location and community pages
- Developer listing and profiles
- Agent listing and profiles
- Contact page with map and office locations
- Blog/articles with rich content
- WhatsApp integration (general, property-specific, agent-specific)
- Fully responsive (desktop, tablet, mobile)
- SEO optimized with structured data, sitemap, Open Graph

### Admin Dashboard (`/admin`)
- Secure authentication (email + password)
- Dashboard overview with key stats
- Complete property CMS (add/edit/delete, image upload, drag-and-drop reorder, publish/draft)
- Location and community management
- Developer management
- Agent management
- Lead/enquiry management with status tracking
- Blog CMS with rich text editor
- Testimonials, FAQs, office locations management
- Homepage content editor
- Site settings (company name, logo, phones, WhatsApp, email, social links)
- Media library

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | NextAuth v5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Images | Cloudinary |
| Email | Resend |
| Animations | Framer Motion |

## Getting Started

### Prerequisites
- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database (free tier)
- A [Cloudinary](https://cloudinary.com) account (free tier)
- A [Resend](https://resend.com) account (free tier)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd pearl-gate-realestate
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials.

### 3. Set up the database

```bash
# Push schema to your database
npx prisma db push

# Seed with initial data (admin user + site settings)
npx prisma db seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

**Default admin credentials (change after first login):**
- Email: `admin@pearlgateelite.com`
- Password: `Admin@123456`

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── (public)/        # Public website pages
│   ├── (admin)/admin/   # Admin dashboard pages
│   └── api/             # API routes
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── public/          # Public website components
│   └── admin/           # Admin dashboard components
├── lib/                 # Utilities (db, auth, cloudinary, email)
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
└── types/               # TypeScript types
```

## Contact

Pearl Gate Elite Real Estate LLC
- Phone: Available in admin settings
- WhatsApp: Available in admin settings
