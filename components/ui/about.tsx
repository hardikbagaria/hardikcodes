'use client'

import { motion } from 'framer-motion'
import { BookOpen, Code, Database, FileText, Rocket, Target } from 'lucide-react'

const highlights = [
    {
        icon: Code,
        title: "Spring Boot Development",
        description: "Building REST APIs and backend services with Spring Boot, learning best practices along the way."
    },
    {
        icon: Database,
        title: "Database Integration",
        description: "Working with MySQL and PostgreSQL using Spring Data JPA and Hibernate for data persistence."
    },
    {
        icon: FileText,
        title: "PDF & Report Generation",
        description: "Generating invoices and PDF documents using iText library in Java applications."
    },
    {
        icon: BookOpen,
        title: "Continuous Learning",
        description: "Actively improving my skills through hands-on projects and studying backend architecture patterns."
    }
]

export function About() {
    return (
        <section id="about" className="py-24 px-4 md:px-8 bg-gradient-to-b from-zinc-900/20 to-black/20">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                        About Me
                    </h2>
                    <p className="text-zinc-400 max-w-lg mx-auto">
                        A bit about my journey and what I'm working on
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                            <p className="text-zinc-300 leading-relaxed mb-4">
                                Hi, I'm <span className="text-orange-400 font-semibold">Hardik</span> — a Java backend developer who is still learning and growing.
                                I focus on understanding how backend systems work and building practical applications
                                that solve real problems.
                            </p>
                            <p className="text-zinc-400 leading-relaxed mb-4">
                                My current focus is on <span className="text-zinc-200">Spring Boot</span>, creating REST APIs,
                                and working with relational databases. I believe in learning by doing, so I spend most of
                                my time building projects that help me understand backend workflows better.
                            </p>
                            <p className="text-zinc-400 leading-relaxed">
                                I've worked on projects involving <span className="text-zinc-200">invoice and PDF generation</span>,
                                CRUD applications, and database-driven backends. Each project teaches me something new
                                about writing cleaner code and designing better APIs.
                            </p>
                        </div>

                        {/* Current Focus */}
                        <div className="flex items-start gap-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <Target className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-emerald-400 mb-1">Currently Working On</h4>
                                <p className="text-zinc-400 text-sm">
                                    Deepening my Spring Boot knowledge, learning about API security,
                                    and building more complex backend systems.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Highlights Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {highlights.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                                className="group p-5 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-orange-500/30 transition-all"
                            >
                                <div className="p-2 rounded-lg bg-orange-500/10 w-fit mb-3 group-hover:bg-orange-500/20 transition-colors">
                                    <item.icon className="h-5 w-5 text-orange-400" />
                                </div>
                                <h3 className="font-semibold text-zinc-200 mb-2">{item.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
