'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { LoginButton } from '@/components/auth/LoginButton'
import { Trash2, Edit, Plus, ExternalLink, Briefcase, FileText } from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types
interface Post {
    id: string
    title: string
    slug: string
    created_at: string
    published: boolean
}

interface Project {
    id: string
    title: string
    slug: string
    created_at: string
    tags: string[]
}

export default function AdminDashboard() {
    const router = useRouter()
    const [session, setSession] = useState<any>(null)

    // Tab State: 'posts' | 'projects'
    const [activeTab, setActiveTab] = useState<'posts' | 'projects'>('posts')

    // Data State
    const [posts, setPosts] = useState<Post[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [fetching, setFetching] = useState(true)
    const [loading, setLoading] = useState(false)

    // Editor State
    const [isEditing, setIsEditing] = useState(false)
    const [currentId, setCurrentId] = useState<string | null>(null)

    // Unified Form Data (Fields used by both)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '', // Used as description for projects
        cover_image: '', // image_url for projects
        tags: '', // Comma separated string for UI
        demo_link: '',
        github_link: ''
    })

    // Auth Check
    useEffect(() => {
        if (window.location.hash && window.location.hash.includes('access_token')) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) setSession(session)
                window.history.replaceState(null, '', window.location.pathname)
            })
        } else {
            supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
        return () => subscription.unsubscribe()
    }, [])

    // Fetch Data on Tab Change
    useEffect(() => {
        if (session) fetchData()
    }, [session, activeTab])

    async function fetchData() {
        setFetching(true)
        if (activeTab === 'posts') {
            const { data } = await supabase.from('posts').select('id, title, slug, created_at, published').order('created_at', { ascending: false })
            if (data) setPosts(data)
        } else {
            const { data } = await supabase.from('projects').select('id, title, slug, created_at, tags').order('created_at', { ascending: false })
            if (data) setProjects(data)
        }
        setFetching(false)
    }

    // Auto-generate slug
    useEffect(() => {
        if (!isEditing && formData.title) {
            setFormData(prev => ({
                ...prev,
                slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }))
        }
    }, [formData.title, isEditing])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        if (!session) return

        let error;
        const commonData = {
            title: formData.title,
            slug: formData.slug,
            content: formData.content, // Body or Readme
        }

        if (activeTab === 'posts') {
            const payload = {
                ...commonData,
                excerpt: formData.excerpt,
                cover_image: formData.cover_image,
                published: true,
            }
            if (isEditing && currentId) {
                const res = await supabase.from('posts').update(payload).eq('id', currentId)
                error = res.error
            } else {
                const res = await supabase.from('posts').insert([payload])
                error = res.error
            }
        } else {
            // Projects
            const payload = {
                ...commonData,
                description: formData.excerpt, // Reuse excerpt field as description
                image_url: formData.cover_image, // Reuse cover_image field
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                demo_link: formData.demo_link,
                github_link: formData.github_link
            }
            if (isEditing && currentId) {
                const res = await supabase.from('projects').update(payload).eq('id', currentId)
                error = res.error
            } else {
                const res = await supabase.from('projects').insert([payload])
                error = res.error
            }
        }

        if (error) {
            alert('Error: ' + error.message)
        } else {
            alert(`${activeTab === 'posts' ? 'Post' : 'Project'} saved!`)
            resetForm()
            fetchData()
        }
        setLoading(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure?')) return
        const table = activeTab === 'posts' ? 'posts' : 'projects'
        const { error } = await supabase.from(table).delete().eq('id', id)
        if (error) alert(error.message)
        else fetchData()
    }

    async function handleEdit(id: string) {
        const table = activeTab === 'posts' ? 'posts' : 'projects'
        const { data } = await supabase.from(table).select('*').eq('id', id).single()

        if (data) {
            if (activeTab === 'posts') {
                setFormData({
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    excerpt: data.excerpt || '',
                    cover_image: data.cover_image || '',
                    tags: '',
                    demo_link: '',
                    github_link: ''
                })
            } else {
                setFormData({
                    title: data.title,
                    slug: data.slug,
                    content: data.content || '',
                    excerpt: data.description || '',
                    cover_image: data.image_url || '',
                    tags: data.tags ? data.tags.join(', ') : '',
                    demo_link: data.demo_link || '',
                    github_link: data.github_link || ''
                })
            }
            setCurrentId(id)
            setIsEditing(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    function resetForm() {
        setFormData({ title: '', slug: '', content: '', excerpt: '', cover_image: '', tags: '', demo_link: '', github_link: '' })
        setIsEditing(false)
        setCurrentId(null)
    }

    if (!session) {
        return (
            <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-24 text-center">
                <h1 className="mb-4 text-3xl font-bold">Admin Access Required</h1>
                <LoginButton />
            </div>
        )
    }

    if (session.user.email !== 'hardikbagaria0@gmail.com') {
        return (
            <div className="container mx-auto py-24 text-center"><h1 className="text-destructive font-bold">Unauthorized</h1></div>
        )
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-12">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Manage your content</p>
                </div>

                <div className="flex gap-2 rounded-lg border border-border bg-card p-1">
                    <button
                        onClick={() => { setActiveTab('posts'); resetForm(); }}
                        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'posts' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                    >
                        <FileText className="h-4 w-4" /> Blog Posts
                    </button>
                    <button
                        onClick={() => { setActiveTab('projects'); resetForm(); }}
                        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                    >
                        <Briefcase className="h-4 w-4" /> Projects
                    </button>
                </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1fr_300px]">

                {/* EDITOR */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {isEditing ? 'Edit' : 'Create New'} {activeTab === 'posts' ? 'Post' : 'Project'}
                        </h2>
                        {isEditing && (
                            <button onClick={resetForm} className="text-sm text-red-500 hover:underline">Cancel</button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">

                        {/* Common Fields */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold">Title</label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-input bg-background px-4 py-2"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold">Slug</label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-input bg-background px-4 py-2 text-muted-foreground"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Project Specific Fields */}
                        {activeTab === 'projects' && (
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="Next.js, Supabase, AI"
                                        className="w-full rounded-md border border-input bg-background px-4 py-2"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold">Demo Link</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full rounded-md border border-input bg-background px-4 py-2"
                                        value={formData.demo_link}
                                        onChange={(e) => setFormData({ ...formData, demo_link: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold">GitHub Link</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full rounded-md border border-input bg-background px-4 py-2"
                                        value={formData.github_link}
                                        onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Image Upload */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                {activeTab === 'posts' ? 'Cover Image' : 'Project Thumbnail'}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    onChange={async (e) => {
                                        if (!e.target.files || e.target.files.length === 0) return;
                                        const file = e.target.files[0];
                                        const ext = file.name.split('.').pop();
                                        const path = `${Math.random()}.${ext}`;
                                        setLoading(true);
                                        const { error } = await supabase.storage.from('blog-images').upload(path, file);
                                        if (!error) {
                                            const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(path);
                                            setFormData(prev => ({ ...prev, cover_image: publicUrl }));
                                        }
                                        setLoading(false);
                                    }}
                                />
                            </div>
                            {formData.cover_image && (
                                <img src={formData.cover_image} className="mt-2 h-32 rounded-md object-cover" />
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                {activeTab === 'posts' ? 'Excerpt' : 'Short Description'}
                            </label>
                            <textarea
                                rows={3}
                                className="w-full rounded-md border border-input bg-background px-4 py-2"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-semibold">
                                    {activeTab === 'posts' ? 'Content (Markdown)' : 'README / Details (Markdown)'}
                                </label>
                            </div>
                            <textarea
                                rows={10}
                                placeholder={activeTab === 'posts' ? "# Blog Content..." : "# Project Readme..."}
                                className="w-full rounded-md border border-input bg-background px-4 py-2 font-mono text-sm leading-relaxed"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-md bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90"
                        >
                            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                        </button>
                    </form>
                </div>

                {/* LIST */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Your {activeTab === 'posts' ? 'Posts' : 'Projects'}</h2>
                    {fetching ? <p>Loading...</p> : (
                        <div className="space-y-4">
                            {(activeTab === 'posts' ? posts : projects).map((item: any) => (
                                <div key={item.id} className="relative rounded-lg border border-border bg-card p-4 hover:shadow-md">
                                    <h3 className="line-clamp-1 font-semibold">{item.title}</h3>
                                    <p className="mb-3 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEdit(item.id)} className="rounded bg-secondary px-2 py-1 text-xs hover:bg-secondary/80">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="rounded bg-destructive/10 px-2 py-1 text-xs text-destructive hover:bg-destructive/20">
                                            <Trash2 className="mr-1 h-3 w-3" /> Delete
                                        </button>
                                        <Link
                                            href={activeTab === 'posts' ? `/blog/${item.slug}` : `/project/${item.slug}`}
                                            target="_blank"
                                            className="ml-auto text-muted-foreground hover:text-primary flex items-center gap-1 text-xs"
                                        >
                                            <ExternalLink className="h-3 w-3" /> Open
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
