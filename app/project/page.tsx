'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ArrowRight, Calendar, Code2, Sparkles } from 'lucide-react'
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

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProjects() {
            const { data } = await supabase
                .from('projects')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false })
            if (data) setProjects(data)
            setLoading(false)
        }
        fetchProjects()
    }, [])

    // Get all unique tags
    const allTags = Array.from(new Set(projects.flatMap(p => p.tags || [])))

    // Filter projects by selected tag
    const filteredProjects = selectedTag
        ? projects.filter(p => p.tags?.includes(selectedTag))
        : projects

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                <div className="container relative mx-auto max-w-6xl px-4 py-24 md:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                            <Code2 className="h-4 w-4" />
                            <span>My Work</span>
                        </div>

                        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                            <span className="bg-gradient-to-r from-foreground via-primary to-purple-400 bg-clip-text text-transparent">
                                Projects & Experiments
                            </span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                            A collection of applications, tools, and creative experiments
                            I've built. Each project represents a learning journey and a step forward.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter Tags */}
            {allTags.length > 0 && (
                <section className="border-b border-border/40 bg-muted/30">
                    <div className="container mx-auto max-w-6xl px-4 py-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap items-center justify-center gap-3"
                        >
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedTag === null
                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                    }`}
                            >
                                All Projects
                            </button>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedTag === tag
                                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Projects Grid */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto max-w-6xl px-4">
                    {loading ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-6">
                                    <div className="mb-4 h-48 rounded-xl bg-muted" />
                                    <div className="mb-3 h-6 w-3/4 rounded bg-muted" />
                                    <div className="mb-2 h-4 rounded bg-muted" />
                                    <div className="h-4 w-2/3 rounded bg-muted" />
                                </div>
                            ))}
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center"
                        >
                            <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mb-2 text-xl font-semibold">No Projects Yet</h3>
                            <p className="text-muted-foreground">
                                {selectedTag
                                    ? `No projects found with "${selectedTag}" tag. Try another filter!`
                                    : "I'm working on some exciting projects. Check back soon!"
                                }
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                                >
                                    {/* Image */}
                                    <Link href={`/project/${project.slug}`} className="relative block overflow-hidden">
                                        <div className="relative h-52 w-full overflow-hidden bg-muted">
                                            {project.image_url ? (
                                                <img
                                                    src={project.image_url}
                                                    alt={project.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                                                    <Code2 className="h-16 w-16 text-muted-foreground/30" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                                        </div>
                                    </Link>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col p-6">
                                        {/* Date */}
                                        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span>{new Date(project.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}</span>
                                        </div>

                                        {/* Title */}
                                        <Link href={`/project/${project.slug}`} className="mb-2 block">
                                            <h3 className="text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                                                {project.title}
                                            </h3>
                                        </Link>

                                        {/* Description */}
                                        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                            {project.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="mb-5 flex flex-wrap gap-2">
                                            {project.tags?.slice(0, 3).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {project.tags?.length > 3 && (
                                                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                                    +{project.tags.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                                            <div className="flex gap-3">
                                                {project.demo_link && (
                                                    <a
                                                        href={project.demo_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                                                        title="Live Demo"
                                                    >
                                                        <ExternalLink size={16} />
                                                        <span className="hidden sm:inline">Demo</span>
                                                    </a>
                                                )}
                                                {project.github_link && (
                                                    <a
                                                        href={project.github_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                                                        title="View Code"
                                                    >
                                                        <Github size={16} />
                                                        <span className="hidden sm:inline">Code</span>
                                                    </a>
                                                )}
                                            </div>
                                            <Link
                                                href={`/project/${project.slug}`}
                                                className="flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
                                            >
                                                Details
                                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            {projects.length > 0 && (
                <section className="border-t border-border/40 bg-muted/20 py-16">
                    <div className="container mx-auto max-w-6xl px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid gap-8 md:grid-cols-3"
                        >
                            <div className="text-center">
                                <div className="mb-2 text-4xl font-bold text-primary">{projects.length}</div>
                                <div className="text-muted-foreground">Total Projects</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-2 text-4xl font-bold text-primary">{allTags.length}</div>
                                <div className="text-muted-foreground">Technologies Used</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-2 text-4xl font-bold text-primary">
                                    {projects.filter(p => p.demo_link).length}
                                </div>
                                <div className="text-muted-foreground">Live Demos</div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}
        </div>
    )
}
