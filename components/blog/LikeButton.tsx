'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface LikeButtonProps {
    postId: string
}

export function LikeButton({ postId }: LikeButtonProps) {
    const [liked, setLiked] = useState(false)
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [session, setSession] = useState<any>(null)

    // Initial Fetch
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session))

        async function fetchLikes() {
            // Get total count
            const { count } = await supabase
                .from('likes')
                .select('id', { count: 'exact' })
                .eq('post_id', postId)

            setCount(count || 0)

            // Check if current user liked it
            const { data: { session: currentSession } } = await supabase.auth.getSession()
            if (currentSession) {
                const { data } = await supabase
                    .from('likes')
                    .select('id')
                    .eq('post_id', postId)
                    .eq('user_id', currentSession.user.id)
                    .single()

                if (data) setLiked(true)
            }
        }
        fetchLikes()
    }, [postId])

    async function toggleLike() {
        if (!session) {
            alert("Please login to like posts!")
            return
        }
        if (loading) return
        setLoading(true)

        if (liked) {
            // Unlike
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', session.user.id)

            if (!error) {
                setLiked(false)
                setCount(prev => prev - 1)
            }
        } else {
            // Like
            const { error } = await supabase
                .from('likes')
                .insert([{ post_id: postId, user_id: session.user.id }])

            if (!error) {
                setLiked(true)
                setCount(prev => prev + 1)
            }
        }
        setLoading(false)
    }

    return (
        <button
            onClick={toggleLike}
            disabled={loading}
            className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50",
                liked
                    ? "border-red-500/50 bg-red-500/10 text-red-500"
                    : "border-border bg-background hover:bg-accent"
            )}
        >
            <Heart className={cn("h-5 w-5", liked && "fill-current")} />
            <span className="font-medium">{count}</span>
            <span className="sr-only">Likes</span>
        </button>
    )
}
