"use client"

import React from 'react'
import { Bot, Lightbulb, ShieldCheck, Zap, Briefcase, Rocket, Settings, Heart } from 'lucide-react'

export default function InnovationLab() {
    const innovations = [
        {
            icon: Bot,
            title: "Decentralized Ledger Technology",
            description: "Exploring novel applications of blockchain for secure, transparent, and efficient data management across industries."
        },
        {
            icon: Lightbulb,
            title: "AI-Driven Drug Discovery",
            description: "Utilizing machine learning models to accelerate the identification and development of new pharmaceuticals."
        },
        {
            icon: ShieldCheck,
            title: "Next-Gen IoT Security",
            description: "Building robust security protocols for the Internet of Things to protect against emerging cyber threats."
        },
        {
            icon: Zap,
            title: "100% Uptime Guarantee",
            description: "We just cannot be taken down by anyone."
        },
        {
            icon: Briefcase,
            title: "Multi-tenant Architecture",
            description: "You can simply share passwords instead of buying new seats."
        },
        {
            icon: Rocket,
            title: "24/7 Customer Support",
            description: "We are available 100% of the time. At least our AI Agents are."
        },
        {
            icon: Settings,
            title: "Money Back Guarantee",
            description: "If you don’t like our services, we will convince you to like us."
        },
        {
            icon: Heart,
            title: "And Everything Else",
            description: "We deliver on our promises and exceed expectations."
        }
    ]

    return (
        <section id="innovation" className="py-20 sm:py-28 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl text-foreground dark:text-white">
                    Innovation Lab
                </h2>
                <p className="mt-4 text-lg text-center text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
                    At the forefront of research and development, we explore emerging technologies that will shape tomorrow.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 mx-auto gap-4">
                    {innovations.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={index}
                                className="relative flex flex-col items-start justify-start py-10 px-8 rounded-2xl border border-gray-200 dark:border-primary/20 shadow-sm dark:shadow-none transition-all duration-300 bg-white dark:bg-[#112218] backdrop-blur-sm group hover:shadow-md hover:shadow-primary/10 dark:hover:shadow-[0_0_30px_rgba(142,217,104,0.15)] hover:border-primary dark:hover:border-accent/50 dark:hover:bg-white/10"
                            >
                                <div className="mb-5 relative z-10 p-3 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent shadow-inner">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="text-lg font-semibold mb-2 relative z-10 text-foreground dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors duration-300">
                                    {item.title}
                                </div>
                                <p className="text-sm text-muted-foreground dark:text-gray-400 relative z-10 leading-relaxed group-hover:text-foreground dark:group-hover:text-gray-300">
                                    {item.description}
                                </p>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 dark:from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
