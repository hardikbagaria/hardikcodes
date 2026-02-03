'use client'

import { motion } from 'framer-motion'
import { Database, Server, Code, GitBranch, FileCode, Layers } from 'lucide-react'

// Java backend technologies only
const technologies = [
    { name: "Java", icon: "☕", category: "core" },
    { name: "Spring Boot", icon: "🍃", category: "core" },
    { name: "Spring MVC", icon: "🌐", category: "core" },
    { name: "Spring Data JPA", icon: "📊", category: "core" },
    { name: "Hibernate", icon: "💾", category: "core" },
    { name: "REST APIs", icon: "🔗", category: "core" },
    { name: "MySQL", icon: "🐬", category: "database" },
    { name: "PostgreSQL", icon: "🐘", category: "database" },
    { name: "SQL", icon: "📋", category: "database" },
    { name: "Maven", icon: "📦", category: "tools" },
    { name: "Git", icon: "🔀", category: "tools" },
    { name: "GitHub", icon: "🐙", category: "tools" },
    { name: "JUnit", icon: "✅", category: "tools" },
    { name: "iText", icon: "📄", category: "tools" },
]

const concepts = [
    "CRUD Operations",
    "MVC Architecture",
    "API Design",
    "Database Relationships",
    "Entity Mapping",
    "Repository Pattern"
]

export function Skills() {
    return (
        <section className="py-24 border-y border-white/5 bg-gradient-to-b from-black/20 to-zinc-900/20">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                        Tech Stack & Tools
                    </h2>
                    <p className="text-zinc-400 max-w-lg mx-auto">
                        Technologies I'm learning and using to build backend applications
                    </p>
                </motion.div>

                {/* Core Technologies */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Server className="h-5 w-5 text-orange-400" />
                        <h3 className="text-xl font-semibold text-zinc-200">Core Technologies</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {technologies.filter(t => t.category === "core").map((tech, index) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-orange-500/50 hover:bg-zinc-800/50 transition-all cursor-default"
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{tech.icon}</span>
                                <span className="text-sm font-medium text-zinc-300 text-center">{tech.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Databases */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Database className="h-5 w-5 text-blue-400" />
                        <h3 className="text-xl font-semibold text-zinc-200">Databases</h3>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-4 max-w-lg">
                        {technologies.filter(t => t.category === "database").map((tech, index) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all cursor-default"
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{tech.icon}</span>
                                <span className="text-sm font-medium text-zinc-300">{tech.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Tools */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <GitBranch className="h-5 w-5 text-green-400" />
                        <h3 className="text-xl font-semibold text-zinc-200">Tools & Libraries</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
                        {technologies.filter(t => t.category === "tools").map((tech, index) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-green-500/50 hover:bg-zinc-800/50 transition-all cursor-default"
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{tech.icon}</span>
                                <span className="text-sm font-medium text-zinc-300">{tech.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Concepts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Layers className="h-5 w-5 text-purple-400" />
                        <h3 className="text-xl font-semibold text-zinc-200">Concepts I'm Learning</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {concepts.map((concept, index) => (
                            <motion.span
                                key={concept}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800/50 text-sm text-zinc-300 hover:border-purple-500/50 hover:text-purple-300 transition-all cursor-default"
                            >
                                {concept}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
