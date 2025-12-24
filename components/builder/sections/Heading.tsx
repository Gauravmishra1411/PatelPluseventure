"use client"

import { cn } from "@/lib/utils"

interface HeadingSectionProps {
    content: {
        text: string
        level: "h1" | "h2" | "h3"
        alignment: "left" | "center" | "right"
    }
}

export default function HeadingSection({ content }: HeadingSectionProps) {
    const Tag = content.level as keyof JSX.IntrinsicElements

    const sizeClasses = {
        h1: "text-4xl md:text-5xl font-extrabold mb-6",
        h2: "text-3xl md:text-4xl font-bold mb-4",
        h3: "text-2xl md:text-3xl font-semibold mb-3",
    }

    return (
        <section className="py-8 px-4 w-full">
            <div className="container mx-auto">
                <Tag
                    className={cn(
                        sizeClasses[content.level],
                        "text-gray-900 dark:text-white tracking-tight",
                        content.alignment === 'center' && 'text-center',
                        content.alignment === 'right' && 'text-right',
                        content.alignment === 'left' && 'text-left'
                    )}
                >
                    {content.text}
                </Tag>
            </div>
        </section>
    )
}
