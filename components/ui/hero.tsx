'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail, FileText, Code2, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export function Hero() {
    const [emailCopied, setEmailCopied] = useState(false)
    const email = "hardikbagaria0@gmail.com"

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email)
            setEmailCopied(true)
            toast.success('Email copied to clipboard!')
            setTimeout(() => setEmailCopied(false), 2000)
        } catch (err) {
            // If copy fails, fallback to opening email client
            window.location.href = `mailto:${email}`
        }
    }

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center md:px-8">
            {/* Background Gradient - warm orange/amber tones for Java theme */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#f97316_100%)] opacity-40" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl"
            >
                {/* Status Badge */}
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Open to Junior Java Backend Roles & Internships
                </span>

                {/* Main Title */}
                <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
                    Java Backend <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                        Developer
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mb-4 text-lg text-zinc-300 md:text-xl font-medium">
                    Learning and building practical applications with Spring Boot
                </p>

                {/* Introduction */}
                <p className="mb-8 text-base text-zinc-400 md:text-lg max-w-2xl mx-auto">
                    I'm Hardik — focused on backend development, building REST APIs,
                    working with databases, and improving my Java skills through hands-on projects.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="#about"
                        className="group flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-medium text-white transition-all hover:from-orange-600 hover:to-amber-600 hover:scale-105"
                    >
                        Learn More About Me
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                        href="/blog"
                        className="group flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
                    >
                        <Code2 className="mr-2 h-4 w-4" />
                        Read My Blog
                    </Link>
                </div>

                {/* Social Links */}
                <div className="mt-8 flex justify-center gap-3">
                    <a
                        href="https://github.com/hardikbagaria"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-400 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
                        title="GitHub"
                    >
                        <Github className="h-5 w-5" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/hardik-bagaria/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-400 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
                        title="LinkedIn"
                    >
                        <Linkedin className="h-5 w-5" />
                    </a>
                    <button
                        onClick={copyEmail}
                        className="group relative rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-400 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
                        title="Copy Email / Send Email"
                    >
                        {emailCopied ? (
                            <Check className="h-5 w-5 text-green-400" />
                        ) : (
                            <>
                                <Mail className="h-5 w-5" />
                                <Copy className="h-3 w-3 absolute -bottom-1 -right-1 bg-zinc-800 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </>
                        )}
                    </button>
                    <a
                        href="/cv_hardik_2026.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-400 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
                        title="View Resume"
                    >
                        <FileText className="h-5 w-5" />
                    </a>
                </div>
            </motion.div>
        </section>
    )
}
