import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'HardikCodes Blog Post'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Create supabase client for fetching post data
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Image generation
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // Fetch actual post title from database
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: post } = await supabase
        .from('posts')
        .select('title, excerpt')
        .eq('slug', slug)
        .single()

    const postTitle = post?.title || 'Blog Post'
    const postExcerpt = post?.excerpt || 'Read more on HardikCodes'

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0f172a', // dark blue/slate background
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '40px',
                        textAlign: 'center',
                    }}
                >
                    {/* Logo / Brand */}
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 30,
                            fontWeight: 800,
                            color: '#3b82f6', // blue-500
                            marginBottom: 40,
                        }}
                    >
                        hardikcodes.com/blog
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            fontSize: 70,
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: 1.1,
                            marginBottom: 20,
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        }}
                    >
                        {postTitle}
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: 30,
                            color: '#94a3b8', // slate-400
                        }}
                    >
                        Read more by Hardik Bagaria
                    </div>
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
