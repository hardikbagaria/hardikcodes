'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Project {
    id: string
    title: string
    description: string
    slug: string
    created_at: string

    tags: string[]
    demo_link: string
    github_link: string
    image_url?: string | null
}

export function Projects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProjects() {
            const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
            if (data) setProjects(data)
            setLoading(false)
        }
        fetchProjects()
    }, [])

    return (
        <section className="py-24 px-4 md:px-8">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold md:text-5xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        Featured Projects
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        A selection of my recent work and experiments.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10 border border-dashed border-white/10 rounded-xl bg-zinc-900/20">
                        <p className="mb-2 text-xl font-semibold">No projects to show yet.</p>
                        <p>Check back soon, or visit the blog!</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 hover:border-primary/50 transition-colors"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Link href={`/project/${project.slug}`} className="cursor-pointer">
                                        {project.image_url ? (
                                            <img
                                                src={project.image_url}
                                                alt={project.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-600">No Image</div>
                                        )}
                                    </Link>
                                    <div className="absolute inset-0 pointer-events-none bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        {/* Links handled separately below */}
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    <Link href={`/project/${project.slug}`} className="mb-2 block">
                                        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-primary transition-colors">{project.title}</h3>
                                    </Link>

                                    <p className="mb-4 text-sm text-zinc-400 line-clamp-2 flex-1">{project.description}</p>

                                    <div className="mb-6 flex flex-wrap gap-2">
                                        {project.tags && project.tags.map(tag => (
                                            <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                                        <div className="flex gap-3">
                                            {project.demo_link && (
                                                <a href={project.demo_link} target="_blank" className="text-zinc-400 hover:text-white" title="Live Demo">
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                            {project.github_link && (
                                                <a href={project.github_link} target="_blank" className="text-zinc-400 hover:text-white" title="View Code">
                                                    <Github size={18} />
                                                </a>
                                            )}
                                        </div>
                                        <Link href={`/project/${project.slug}`} className="flex items-center text-sm font-medium text-primary hover:underline">
                                            Read More <ArrowRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
