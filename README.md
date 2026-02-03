# HardikCodes – Personal Portfolio & Technical Blog

A personal portfolio and technical blog built to showcase projects, skills, and technical learnings.  
Designed with a clean UI, secure authentication, and a scalable backend using modern web technologies.

---

## 🧰 Tech Stack

<p align="left">
  <img src="https://skillicons.dev/icons?i=nextjs,typescript,tailwind,postgres,supabase,vercel" />
</p>

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Deployment**: Vercel

---

## ✨ Features

- **Portfolio Section** – Showcase of development projects
- **Blog Platform** – Markdown-based technical articles
- **Admin Panel** – Secure interface to manage posts and projects
- **Authentication** – Supabase Auth with protected routes
- **Responsive Design** – Optimized for desktop and mobile
- **SEO Optimized** – Metadata and OpenGraph configuration

---

## 🏗️ Project Structure

```bash
├── app/
│   ├── blog/            # Blog pages
│   ├── project/         # Portfolio projects
│   ├── auth/            # Supabase auth callbacks
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/          # Reusable UI components
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── middleware.ts        # Route protection
├── public/              # Static assets
└── supabase/            # Database schema & migrations
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm / bun

### Clone the Repository

```bash
git clone https://github.com/hardikbagaria/hardikcodes.git
cd hardikcodes
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🗄️ Database Setup

The `supabase/` directory contains SQL scripts for setting up:

- Core tables (posts, projects)
- User profiles and permissions
- Storage bucket policies

Run these scripts using the **Supabase SQL Editor**.

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication

Authentication is handled using **Supabase Auth**.  
The admin panel and sensitive routes are protected using middleware to ensure only authorized access.

---

## 🚀 Deployment

This project is optimized for deployment on **Vercel**:

1. Push the repository to GitHub
2. Import the project into Vercel
3. Configure environment variables
4. Deploy

---

## 🎯 Project Purpose

This project demonstrates:
- Full-stack application development using modern tooling
- Secure authentication and route protection
- Clean project structure and maintainable code
- Debugging and production readiness

---

## 📄 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this project with attribution.

---

*Built and verified using Antigravity*
