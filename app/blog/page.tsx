import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

// SEO Metadata for the blog index
export const metadata: Metadata = {
    title: 'Blog | HardikCodes',
    description: 'Thoughts on coding, IoT, and building cool things. Read technical guides and follow my learning journey.',
    openGraph: {
        title: 'Blog | HardikCodes',
        description: 'Thoughts on coding, IoT, and building cool things.',
        url: 'https://hardikcodes.com/blog',
        siteName: 'HardikCodes',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog | HardikCodes',
        description: 'Thoughts on coding, IoT, and building cool things.',
    },
}

// Server-side client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 60 // ISR: Revalidate every 60 seconds

export default async function BlogIndex() {
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })

    return (
        <div className="container mx-auto min-h-screen max-w-5xl px-4 py-24">
            <div className="mb-16 text-center">
                <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                    The <span className="text-primary">Blog</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Thoughts on coding, IoT, and building cool things.
                </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts?.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                    >
                        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                            {/* <span className="mx-1">•</span>
              <Clock className="h-3 w-3" />
              <span>5 min read</span> */}
                        </div>

                        <h2 className="mb-2 text-xl font-bold tracking-tight group-hover:text-primary">
                            {post.title}
                        </h2>

                        <p className="mb-6 flex-1 line-clamp-3 text-sm text-muted-foreground">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center text-sm font-medium text-primary">
                            Read Article
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
                {(!posts || posts.length === 0) && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No posts found yet. Check back soon for new content!
                    </div>
                )}
            </div>
        </div>
    )
}
