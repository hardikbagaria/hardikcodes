export default function DebugPage() {
    return (
        <div style={{ padding: 40, background: '#111', color: '#fff' }}>
            <h1>Debug Info</h1>
            <pre>
                NODE_ENV: {process.env.NODE_ENV}
                SITE_URL: {process.env.NEXT_PUBLIC_SITE_URL}
                SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
            </pre>
        </div>
    )
}