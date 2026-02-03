import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // Hardcode for production
    const rootDomain = 'hardikcodes.com'
    const currentHost = hostname.replace(`.${rootDomain}`, '').replace('hardikcodes.com', '')

    // Handle "blog" subdomain -> redirect to hardikcodes.com/blog
    // This ensures all blog traffic goes to the main domain /blog path
    if (currentHost === 'blog') {
        const newUrl = new URL(request.url)
        newUrl.hostname = rootDomain
        // Add /blog prefix to the path
        // Example: /my-post on subdomain -> /blog/my-post on main domain
        // Example: / on subdomain -> /blog on main domain
        newUrl.pathname = `/blog${url.pathname === '/' ? '' : url.pathname}`
        return NextResponse.redirect(newUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        '/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)',
    ],
}
