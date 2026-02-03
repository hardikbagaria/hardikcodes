'use client'

import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function LoginButton() {
    const handleLogin = async () => {
        // Determine the base URL
        let redirectUrl = window.location.href

        if (typeof window !== 'undefined') {
            // Redirect back to the CURRENT page on production domain
            const currentPath = window.location.pathname
            redirectUrl = `https://hardikcodes.com${currentPath}`
        }

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
            },
        })
    }

    return (
        <button
            onClick={handleLogin}
            className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700"
        >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign in with Google
        </button>
    )
}
