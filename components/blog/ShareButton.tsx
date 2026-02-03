'use client'

import { useState } from 'react'
import { Share2, Check, Copy, Twitter, Linkedin } from 'lucide-react'

interface ShareButtonProps {
    title: string
    slug: string
}

export function ShareButton({ title, slug }: ShareButtonProps) {
    const [copied, setCopied] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : ''

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareData = {
        title: title,
        text: `Check out this post: ${title}`,
        url: url
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                console.log('Error sharing:', err)
                setIsOpen(!isOpen) // Fallback to custom menu
            }
        } else {
            setIsOpen(!isOpen)
        }
    }

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 transition-all hover:bg-accent"
            >
                <Share2 className="h-5 w-5" />
                <span className="font-medium">Share</span>
            </button>

            {/* Fallback Menu if Native Share not supported or explicitly opened */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 rounded-lg border border-border bg-card p-2 shadow-xl animate-in fade-in zoom-in-95 z-50">
                    <button
                        onClick={copyToClipboard}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy Link"}
                    </button>
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                    >
                        <Twitter className="h-4 w-4" /> Twitter
                    </a>
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                    >
                        <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                </div>
            )}
        </div>
    )
}
