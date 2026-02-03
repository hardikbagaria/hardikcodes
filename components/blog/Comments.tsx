'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { LoginButton } from '@/components/auth/LoginButton'
import { User, Trash2, Heart, MessageCircle, Reply } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Comment {
    id: string
    content: string
    created_at: string
    user_id: string
    parent_id: string | null
    profiles: {
        full_name: string | null
        avatar_url: string | null
    } | null
    likes_count?: number
    user_has_liked?: boolean
}

export function Comments({ postId }: { postId: string }) {
    const [session, setSession] = useState<any>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState<string | null>(null) // Comment ID we are replying to
    const [loading, setLoading] = useState(false)

    const isAdmin = session?.user?.email === 'hardikbagaria0@gmail.com'

    useEffect(() => {
        // Handle OAuth hash token (implicit flow)
        if (window.location.hash && window.location.hash.includes('access_token')) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) setSession(session)
                // Clean up URL
                window.history.replaceState(null, '', window.location.pathname)
            })
        } else {
            supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))

        fetchComments()

        const channel = supabase
            .channel('public:comments')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
                () => fetchComments()
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
            supabase.removeChannel(channel)
        }
    }, [postId])

    async function fetchComments() {
        // Fetch comments
        const { data: commentsData } = await supabase
            .from('comments')
            .select('*, profiles(full_name, avatar_url)')
            .eq('post_id', postId)
            .order('created_at', { ascending: true }) // Oldest first for threads usually better, or handle client side

        if (!commentsData) return

        // Fetch user likes for these comments if logged in
        let userLikes = new Set<string>()
        if (session) {
            const { data: likesData } = await supabase
                .from('comment_likes')
                .select('comment_id')
                .eq('user_id', session.user.id)
            likesData?.forEach((l: any) => userLikes.add(l.comment_id))
        }

        // Fetch like counts
        const { data: countsData } = await supabase
            .from('comment_likes') // This requires a join or a view for efficiency, but for now strict client fetching:
            .select('comment_id')

        // Count locally (inefficient for large scale, ok for portfolio)
        const counts: Record<string, number> = {}
        countsData?.forEach((l: any) => {
            counts[l.comment_id] = (counts[l.comment_id] || 0) + 1
        })

        const formattedComments = commentsData.map((c: any) => ({
            ...c,
            likes_count: counts[c.id] || 0,
            user_has_liked: session ? userLikes.has(c.id) : false
        }))

        setComments(formattedComments)
    }

    async function handleSubmit(e: React.FormEvent, parentId: string | null = null) {
        e.preventDefault()
        if (!newComment.trim() || !session) return

        setLoading(true)
        const { error } = await supabase.from('comments').insert([{
            post_id: postId,
            user_id: session.user.id,
            content: newComment,
            parent_id: parentId
        }])

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Comment posted!')
            setNewComment('')
            setReplyingTo(null)
            fetchComments()
        }
        setLoading(false)
    }

    async function toggleLike(commentId: string, currentLikeStatus: boolean) {
        if (!session) {
            toast.error("Please login to like comments")
            return
        }

        // Optimistic Update
        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                return {
                    ...c,
                    user_has_liked: !currentLikeStatus,
                    likes_count: (c.likes_count || 0) + (currentLikeStatus ? -1 : 1)
                }
            }
            return c
        }))

        if (currentLikeStatus) {
            await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', session.user.id)
        } else {
            await supabase.from('comment_likes').insert([{ comment_id: commentId, user_id: session.user.id }])
        }
        // Background fetch to sync
        fetchComments()
    }

    async function handleDelete(commentId: string) {
        if (!confirm('Delete this comment?')) return
        await supabase.from('comments').delete().eq('id', commentId)
        toast.success("Comment deleted")
        fetchComments()
    }

    // Recursive rendering helper
    const renderComment = (comment: Comment, depth = 0) => {
        const isReplying = replyingTo === comment.id

        return (
            <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-4", depth > 0 && "ml-12 mt-4")}
            >
                <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground overflow-hidden border border-border">
                        {comment.profiles?.avatar_url ? (
                            <img src={comment.profiles.avatar_url} alt={comment.profiles.full_name || 'User'} className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-5 w-5" />
                        )}
                    </div>
                    {/* Thread line */}
                    {comments.some(c => c.parent_id === comment.id) && (
                        <div className="w-px flex-1 bg-border my-2"></div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <div className="rounded-2xl bg-card border border-border px-4 py-3">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm hover:underline cursor-pointer">
                                    {comment.profiles?.full_name || 'Anonymous User'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            {isAdmin && (
                                <button onClick={() => handleDelete(comment.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-300">{comment.content}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 px-2">
                        <button
                            onClick={() => toggleLike(comment.id, !!comment.user_has_liked)}
                            className={cn(
                                "flex items-center gap-1 text-xs font-medium transition-colors",
                                comment.user_has_liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                            )}
                        >
                            <Heart className={cn("h-3.5 w-3.5", comment.user_has_liked && "fill-current")} />
                            {comment.likes_count || 0}
                        </button>

                        <button
                            onClick={() => {
                                if (!session) return toast.error("Login to reply")
                                setReplyingTo(isReplying ? null : comment.id)
                                setNewComment('') // Reset text when opening reply
                            }}
                            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Reply
                        </button>
                    </div>

                    {/* Reply Form */}
                    <AnimatePresence>
                        {isReplying && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={(e) => handleSubmit(e, comment.id)}
                                className="mt-2"
                            >
                                <textarea
                                    autoFocus
                                    className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-primary mb-2"
                                    placeholder={`Reply to ${comment.profiles?.full_name}...`}
                                    rows={2}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setReplyingTo(null)}
                                        className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-md font-medium"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Nested Comments (Recursion) */}
                    <div className="space-y-4 pt-2">
                        {comments.filter(c => c.parent_id === comment.id).map(c => renderComment(c, depth + 1))}
                    </div>
                </div>
            </motion.div>
        )
    }

    const rootComments = comments.filter(c => !c.parent_id)

    return (
        <div className="mt-16 max-w-2xl mx-auto">
            <h3 className="mb-8 text-2xl font-bold flex items-center gap-2">
                Discussion <span className="text-muted-foreground text-lg font-normal">({comments.length})</span>
            </h3>

            {/* Main Input */}
            {session ? (
                <div className="mb-10 flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-accent overflow-hidden">
                        {session.user.user_metadata.avatar_url ? (
                            <img src={session.user.user_metadata.avatar_url} className="h-full w-full object-cover" />
                        ) : <User className="h-full w-full p-2" />}
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)} className="flex-1">
                        <textarea
                            className="w-full rounded-xl border border-input bg-background/50 p-4 text-sm focus:ring-2 focus:ring-primary min-h-[100px] mb-2"
                            placeholder="What are your thoughts?"
                            value={replyingTo === null ? newComment : ''} // Bind only if not replying
                            onChange={(e) => {
                                setReplyingTo(null)
                                setNewComment(e.target.value)
                            }}
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading || (replyingTo === null && !newComment.trim())}
                                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="mb-10 rounded-xl border border-dashed border-white/10 bg-zinc-900/20 p-8 text-center">
                    <p className="text-muted-foreground mb-4">Log in to like posts and join the conversation.</p>
                    <LoginButton />
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
                {rootComments.length === 0 ? (
                    <p className="text-muted-foreground text-center italic py-8">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    rootComments.map(comment => renderComment(comment))
                )}
            </div>
        </div>
    )
}
