'use client'

import { Github, Linkedin, Mail, Phone, MapPin, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export function GlobalFooter() {
    const [emailCopied, setEmailCopied] = useState(false)
    const [phoneCopied, setPhoneCopied] = useState(false)

    const email = "hardikbagaria0@gmail.com"
    const phone = "+91 9967627909"

    const copyToClipboard = async (text: string, type: 'email' | 'phone') => {
        try {
            await navigator.clipboard.writeText(text)
            if (type === 'email') {
                setEmailCopied(true)
                toast.success('Email copied to clipboard!')
                setTimeout(() => setEmailCopied(false), 2000)
            } else {
                setPhoneCopied(true)
                toast.success('Phone number copied to clipboard!')
                setTimeout(() => setPhoneCopied(false), 2000)
            }
        } catch (err) {
            toast.error('Failed to copy')
        }
    }

    return (
        <footer className="border-t border-white/10 bg-zinc-950">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Brand & About */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                            Hardik Bagaria
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Junior Java Backend Developer focused on building practical
                            applications with Spring Boot. Currently learning and growing
                            through hands-on projects.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <a
                                href="https://github.com/hardikbagaria"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
                                title="GitHub"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/hardik-bagaria/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
                                title="LinkedIn"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
                            Quick Links
                        </h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/" className="text-zinc-400 hover:text-white transition-colors text-sm">
                                Home
                            </Link>
                            <Link href="/#about" className="text-zinc-400 hover:text-white transition-colors text-sm">
                                About Me
                            </Link>
                            <Link href="/project" className="text-zinc-400 hover:text-white transition-colors text-sm">
                                Projects
                            </Link>
                            <Link href="/blog" className="text-zinc-400 hover:text-white transition-colors text-sm">
                                Blog
                            </Link>
                            <a
                                href="/cv_hardik_2026.pdf"
                                target="_blank"
                                className="text-zinc-400 hover:text-white transition-colors text-sm"
                            >
                                Resume / CV
                            </a>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
                            Get In Touch
                        </h4>
                        <div className="space-y-3">
                            {/* Email with copy */}
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <a
                                        href={`mailto:${email}`}
                                        className="text-sm text-zinc-300 hover:text-white transition-colors"
                                    >
                                        {email}
                                    </a>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(email, 'email')}
                                    className="p-1.5 rounded-md bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all opacity-0 group-hover:opacity-100"
                                    title="Copy email"
                                >
                                    {emailCopied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                                </button>
                            </div>

                            {/* Phone with copy */}
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <a
                                        href={`tel:${phone.replace(/\s/g, '')}`}
                                        className="text-sm text-zinc-300 hover:text-white transition-colors"
                                    >
                                        {phone}
                                    </a>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(phone, 'phone')}
                                    className="p-1.5 rounded-md bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all opacity-0 group-hover:opacity-100"
                                    title="Copy phone"
                                >
                                    {phoneCopied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                                </button>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <span className="text-sm text-zinc-400">
                                    India
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-zinc-500">
                        © 2026 Hardik Bagaria. All rights reserved.
                    </p>
                    <p className="text-sm text-zinc-600 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Java Backend Developer — Learning & Building
                    </p>
                </div>
            </div>
        </footer>
    )
}
