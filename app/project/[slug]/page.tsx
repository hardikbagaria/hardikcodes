import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Calendar, User, Github, ExternalLink, ArrowRight, Home } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface PageProps {
    params: Promise<{ slug: string }>
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!project) notFound()

    return (
        <article className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">

            {/* Header / Hero */}
            <div className="relative border-b border-white/10 bg-zinc-900/50 pt-24 pb-12">
                <div className="container mx-auto max-w-5xl px-4">
                    <Link
                        href="/"
                        className="mb-8 inline-flex items-center text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>

                    <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                                {project.title}
                            </h1>
                            <p className="mb-6 text-xl text-zinc-400 max-w-2xl">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {project.tags && project.tags.map((tag: string) => (
                                    <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white border border-white/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                {project.demo_link && (
                                    <a
                                        href={project.demo_link}
                                        target="_blank"
                                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                                    >
                                        <ExternalLink size={18} /> Live Demo
                                    </a>
                                )}
                                {project.github_link && (
                                    <a
                                        href={project.github_link}
                                        target="_blank"
                                        className="inline-flex items-center gap-2 rounded-full bg-zinc-800 px-6 py-2.5 font-semibold text-white hover:bg-zinc-700 transition-colors"
                                    >
                                        <Github size={18} /> View Code
                                    </a>
                                )}
                            </div>
                        </div>

                        {project.image_url && (
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full max-w-md rounded-xl border border-white/10 shadow-2xl md:w-1/3 object-cover aspect-video"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Content / Readme */}
            <div className="container mx-auto max-w-4xl px-4 py-16">
                {project.content ? (
                    <div className="mx-auto">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ ...props }) => <h1 className="mt-12 mb-6 text-3xl font-bold text-white border-b border-white/10 pb-2" {...props} />,
                                h2: ({ ...props }) => <h2 className="mt-10 mb-4 text-2xl font-semibold text-white" {...props} />,
                                h3: ({ ...props }) => <h3 className="mt-8 mb-3 text-xl font-semibold text-white" {...props} />,
                                p: ({ ...props }) => <p className="mb-6 leading-7 text-zinc-300" {...props} />,
                                ul: ({ ...props }) => <ul className="mb-6 ml-6 list-disc text-zinc-300" {...props} />,
                                ol: ({ ...props }) => <ol className="mb-6 ml-6 list-decimal text-zinc-300" {...props} />,
                                li: ({ ...props }) => <li className="mb-2" {...props} />,
                                a: ({ ...props }) => <a className="text-primary underline hover:text-primary/80" {...props} />,
                                blockquote: ({ ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic text-zinc-400 my-6" {...props} />,
                                code: ({ ...props }) => <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-zinc-200" {...props} />,
                                pre: ({ ...props }) => <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 mb-6 border border-white/10" {...props} />,
                                img: ({ ...props }) => <img className="rounded-lg border border-white/10 my-8 w-full" {...props} />,
                            }}
                        >
                            {project.content}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="text-center py-20 text-zinc-500">
                        <p>No additional details provided for this project.</p>
                    </div>
                )}
            </div>

            <div className="border-t border-white/10 py-12 text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <Home size={16} /> Back to Portfolio
                </Link>
            </div>

        </article>
    )
}
