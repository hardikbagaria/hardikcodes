'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, User, Home, BookOpen, FolderKanban } from 'lucide-react'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function GlobalHeader() {
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        // Check for session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        // Listen to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    // Don't show header on the main landing page
    if (pathname === '/') return null



    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                {/* Left: Navigation */}
                <nav className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        <span className="hidden sm:inline">HardikCodes</span>
                    </Link>

                    <div className="flex items-center gap-4 text-sm">
                        <Link
                            href="/blog"
                            className={`flex items-center gap-1 transition-colors hover:text-foreground ${pathname.startsWith('/blog')
                                ? 'text-foreground font-medium'
                                : 'text-muted-foreground'
                                }`}
                        >
                            <BookOpen className="h-4 w-4" />
                            <span>Blog</span>
                        </Link>

                        <Link
                            href="/project"
                            className={`flex items-center gap-1 transition-colors hover:text-foreground ${pathname.startsWith('/project')
                                ? 'text-foreground font-medium'
                                : 'text-muted-foreground'
                                }`}
                        >
                            <FolderKanban className="h-4 w-4" />
                            <span>Projects</span>
                        </Link>
                    </div>
                </nav>

                {/* Right: User Actions */}
                <div className="flex items-center gap-3">
                    {loading ? (
                        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                    ) : session ? (
                        <div className="flex items-center gap-3">
                            {/* User Avatar */}
                            <div className="flex items-center gap-2">
                                {session.user.user_metadata?.avatar_url ? (
                                    <img
                                        src={session.user.user_metadata.avatar_url}
                                        alt={session.user.user_metadata?.full_name || 'User'}
                                        className="h-8 w-8 rounded-full border border-border"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <User className="h-4 w-4" />
                                    </div>
                                )}
                                <span className="hidden text-sm font-medium sm:inline">
                                    {session.user.user_metadata?.full_name?.split(' ')[0] || 'User'}
                                </span>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 rounded-md bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                                title="Sign out"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    )
}
