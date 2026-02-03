import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

import { ArrowLeft, Calendar, User, Clock } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { Comments } from '@/components/blog/Comments'
import { LikeButton } from '@/components/blog/LikeButton'
import { ShareButton } from '@/components/blog/ShareButton'

// Type definition for params
// Params need to be awaited in Next.js 15
interface PageProps {
    params: Promise<{ slug: string }>
}

// Server-side client for fetching
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Generate dynamic metadata for SEO and social link previews
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params

    const { data: post } = await supabase
        .from('posts')
        .select('title, excerpt, cover_image')
        .eq('slug', slug)
        .single()

    if (!post) {
        return {
            title: 'Post Not Found | HardikCodes',
        }
    }

    const baseUrl = 'https://hardikcodes.com'

    return {
        title: `${post.title} | HardikCodes Blog`,
        description: post.excerpt || `Read ${post.title} on HardikCodes Blog`,
        authors: [{ name: 'Hardik Bagaria' }],
        openGraph: {
            title: post.title,
            description: post.excerpt || `Read ${post.title} on HardikCodes Blog`,
            url: `${baseUrl}/blog/${slug}`,
            siteName: 'HardikCodes',
            type: 'article',
            authors: ['Hardik Bagaria'],
            images: post.cover_image ? [
                {
                    url: post.cover_image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || `Read ${post.title} on HardikCodes Blog`,
            images: post.cover_image ? [post.cover_image] : undefined,
        },
    }
}

export default async function BlogPost({ params }: PageProps) {
    // Await params in Next.js 15
    const { slug } = await params

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!post) {
        // Fallback for demo purposes if DB is empty
        if (slug === 'hello-world') {
            return (
                <article className="container mx-auto min-h-screen max-w-3xl px-4 py-24">
                    <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-yellow-500">
                        This is a demo view. Content coming soon!
                    </div>
                    <Link
                        href="/"
                        className="mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>

                    <header className="mb-12 text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
                            Welcome to my Next-Gen Portfolio
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>Hardik Bagaria</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>February 1, 2026</span>
                            </div>
                        </div>
                    </header>

                    <div className="prose prose-invert prose-lg mx-auto">
                        <p className="lead">This is where the markdown content will be rendered...</p>
                        <p>
                            (Here we will eventually render the rich MDX content from Supabase.
                            For now, this is a placeholder to demonstrate the layout.)
                        </p>
                    </div>

                    <div className="mt-16 rounded-xl border border-border bg-card p-8">
                        <h3 className="mb-4 text-2xl font-bold">Comments</h3>
                        <p className="text-muted-foreground">Login with Google to join the discussion.</p>
                    </div>
                </article>
            )
        }
        notFound()
    }

    return (
        <article className="container mx-auto min-h-screen max-w-3xl px-4 py-24">
            <Link
                href="/blog"
                className="mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
            </Link>

            <header className="mb-12 text-center">
                <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
                    {post.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
                    <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Hardik Bagaria</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <LikeButton postId={post.id} />
                    <ShareButton title={post.title} slug={post.slug} />
                </div>
            </header>

            {post.cover_image && (
                <img
                    src={post.cover_image}
                    alt={post.title}
                    className="mb-10 w-full rounded-2xl border border-border"
                />
            )}

            <div className="mx-auto mb-16 max-w-3xl">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ ...props }) => <h1 className="mt-8 mb-4 text-3xl font-bold text-primary" {...props} />,
                        h2: ({ ...props }) => <h2 className="mt-6 mb-3 text-2xl font-semibold text-foreground" {...props} />,
                        h3: ({ ...props }) => <h3 className="mt-4 mb-2 text-xl font-semibold text-foreground" {...props} />,
                        p: ({ ...props }) => <p className="mb-4 leading-7 text-muted-foreground" {...props} />,
                        ul: ({ ...props }) => <ul className="mb-4 ml-6 list-disc text-muted-foreground" {...props} />,
                        ol: ({ ...props }) => <ol className="mb-4 ml-6 list-decimal text-muted-foreground" {...props} />,
                        li: ({ ...props }) => <li className="mb-1" {...props} />,
                        a: ({ ...props }) => <a className="text-primary underline hover:text-primary/80" {...props} />,
                        blockquote: ({ ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground" {...props} />,
                        code: ({ ...props }) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...props} />,
                        pre: ({ ...props }) => <pre className="overflow-x-auto rounded-lg bg-muted p-4 mb-4" {...props} />,
                        img: ({ ...props }) => <img className="rounded-lg border border-border my-6 w-full" {...props} />,
                    }}
                >
                    {post.content}
                </ReactMarkdown>
            </div>

            <Comments postId={post.id} />

        </article>
    )
}
