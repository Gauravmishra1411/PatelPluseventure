"use client"

import React from 'react'
import { Code, Smartphone, GitBranch, ShoppingCart, Settings2, Search, Cloud, FlaskConical } from 'lucide-react'
import { Card } from "@/components/ui/card"

export default function DevelopmentStages() {
    return (
        <section className="py-6 md:py-12 lg:py-20 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-[#1A532A] via-[#8ED968] to-[#1A532A] bg-clip-text text-transparent">
                        Application Development stages
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mx-auto">
                    {/* Left Column */}
                    <div className="flex flex-col gap-8">
                        <StageCard
                            icon={Code}
                            title="Website Development"
                            description="We empower our clients with dynamic, responsive website builds using PHP, Java, .NET, Wordpress, React JS, React Native, Drupal, CMS, and more — ensuring seamless performance, scalability, and user engagement."
                        />
                        <StageCard
                            icon={Smartphone}
                            title="Mobile app Development"
                            description="We build high-performance Android and iOS apps with seamless user experiences, ensuring innovation and scalability for your business."
                        />
                        <StageCard
                            icon={GitBranch}
                            title="Software Development"
                            description="We deliver high-performance software solutions with seamless functionality, ensuring innovation and scalability for your business."
                        />
                        <StageCard
                            icon={ShoppingCart}
                            title="Digital marketing Services"
                            description="We craft high-impact digital marketing strategies with seamless execution, ensuring growth, visibility, and scalability for your business."
                        />
                    </div>

                    {/* Center Image */}
                    <div className="hidden lg:flex justify-center items-center h-full">
                        <div className="relative w-full aspect-square max-w-[400px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                            <img
                                alt="Development Lifecycle"
                                src="https://www.visvik.in/headphone.jpg"
                                className="w-full h-full object-contain relative z-10 drop-shadow-2xl transition-transform duration-300 hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-8">
                        <StageCard
                            icon={Settings2}
                            title="Affiliated Marketing Services"
                            description="We empower our clients with result-driven affiliate marketing strategies across SEO, PPC, social media, content, influencers, and more — ensuring seamless performance, scalability, and customer engagement."
                        />
                        <StageCard
                            icon={Search}
                            title="SEM/SEO"
                            description="We craft result-driven SEM strategies with seamless targeting, ensuring visibility, conversions, and measurable growth for your business."
                        />
                        <StageCard
                            icon={Cloud}
                            title="Cloud & DevOps"
                            description="We deliver scalable Cloud and DevOps solutions with seamless automation, ensuring innovation, agility, and growth for your business."
                        />
                        <StageCard
                            icon={FlaskConical}
                            title="Software Testing"
                            description="We deliver robust software testing solutions with seamless processes, ensuring reliability, quality, and scalability for your business."
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

function StageCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="h-full group">
            <div className="w-full h-full rounded-lg border border-gray-200 dark:border-primary/20 bg-white dark:bg-[#112218] backdrop-blur-sm shadow-sm dark:shadow-none hover:shadow-md hover:shadow-primary/10 dark:hover:shadow-[0_0_30px_rgba(142,217,104,0.1)] hover:border-primary dark:hover:border-accent/50 transition-all duration-300 cursor-pointer p-6">
                <div className="space-y-4">
                    <div className="flex flex-row items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                            <Icon className="w-6 h-6 text-primary dark:text-accent" />
                        </div>
                        <div className="tracking-tight text-foreground dark:text-white font-semibold text-lg group-hover:text-primary dark:group-hover:text-accent transition-colors">
                            {title}
                        </div>
                    </div>
                    <div>
                        <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
