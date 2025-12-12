"use client"

import React from 'react'

export default function Integrations() {
    return (
        <section className="py-24 overflow-hidden bg-background">
            <div className="relative container mx-auto px-6 text-center">
                <span className="inline-block px-3 py-1 mb-4 text-sm rounded-full border border-border/50 dark:border-primary/20 bg-secondary/20 dark:bg-primary/10 text-primary dark:text-accent">
                    ⚡ Integrations
                </span>
                <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground dark:text-white">
                    Integrate with favorite tools
                </h2>
                <p className="mt-4 text-lg text-muted-foreground dark:text-gray-400 max-w-xl mx-auto mb-12">
                    250+ top apps are available to integrate seamlessly with your workflow.
                </p>

                <div className="mt-12 overflow-hidden relative pb-2">
                    {/* Scroll Left */}
                    <div className="flex gap-10 whitespace-nowrap animate-scroll-left hover:pause">
                        {/* Set 1 */}
                        <IntegrationIconsSet1 />
                        {/* Set 2 (Duplicate for infinite scroll) */}
                        <IntegrationIconsSet1 />
                    </div>

                    {/* Scroll Right */}
                    <div className="flex gap-10 whitespace-nowrap mt-6 animate-scroll-right hover:pause">
                        {/* Set 1 */}
                        <IntegrationIconsSet2 />
                        {/* Set 2 (Duplicate for infinite scroll) */}
                        <IntegrationIconsSet2 />
                    </div>

                    {/* Fade Edges */}
                    <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
                    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
                </div>
            </div>
        </section>
    )
}

function IntegrationIconsSet1() {
    return (
        <>
            <IconCard src="https://cdn-icons-png.flaticon.com/512/5968/5968854.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732221.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/733/733609.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732084.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/733/733585.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/281/281763.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888879.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/5968/5968854.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732221.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/733/733609.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732084.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/733/733585.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/281/281763.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888879.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/5968/5968854.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732221.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/733/733609.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732084.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/733/733585.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/281/281763.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888879.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/5968/5968854.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732221.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/733/733609.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732084.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/733/733585.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/281/281763.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888879.png" />
        </>
    )
}

function IntegrationIconsSet2() {
    return (
        <>
            <IconCard src="https://cdn-icons-png.flaticon.com/512/174/174857.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/906/906324.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888841.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/5968/5968875.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/906/906361.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732190.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888847.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/174/174857.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/906/906324.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888841.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/5968/5968875.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/906/906361.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732190.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888847.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/174/174857.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/906/906324.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888841.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/5968/5968875.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/906/906361.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732190.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888847.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/174/174857.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/906/906324.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888841.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/5968/5968875.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/906/906361.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/732/732190.png" />
            <IconCard src="https://cdn-icons-png.flaticon.com/512/888/888847.png" />
        </>
    )
}

function IconCard({ src }: { src: string }) {
    return (
        <div className="h-16 w-16 flex-shrink-0 rounded-full bg-card dark:bg-white/5 backdrop-blur-sm shadow-sm dark:shadow-lg flex items-center justify-center border border-border/50 dark:border-primary/20 hover:border-primary/50 dark:hover:border-accent/50 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(142,217,104,0.2)] hover:bg-primary/5 dark:hover:bg-white/10 transition-all duration-300">
            <img src={src} alt="tool icon" className="h-8 w-8 object-contain opacity-100 dark:opacity-80 dark:hover:opacity-100 transition-opacity" loading="lazy" />
        </div>
    )
}
