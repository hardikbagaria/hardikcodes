import { Hero } from '@/components/ui/hero'
import { About } from '@/components/ui/about'
import { Projects } from '@/components/ui/projects'
import { Skills } from '@/components/ui/skills'
import Link from 'next/link'
import { ArrowRight, Rocket, Mail } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black">

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. About Me Section */}
      <About />

      {/* 3. Skills / Tech Stack */}
      <Skills />

      {/* 4. Projects Showcase */}
      <Projects />

      {/* 5. Call to Action */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
            <Rocket className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-400">
              Actively Learning and Building with Java and Spring Boot
            </span>
          </div>

          <h2 className="mb-6 text-4xl font-bold md:text-5xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="mb-10 text-xl text-zinc-400 max-w-2xl mx-auto">
            I'm open to junior Java backend roles, internships, and opportunities
            to learn and grow as a developer. Feel free to reach out!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hardikbagaria0@gmail.com"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-lg font-bold text-white transition-all hover:from-orange-600 hover:to-amber-600 hover:scale-105"
            >
              <Mail className="h-5 w-5" />
              Get in Touch
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </a>

            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-8 py-4 text-lg font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
            >
              Read the Blog
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
