"use client"

import { cn } from "@/lib/utils"

interface ParagraphSectionProps {
    content: {
        text: string
        alignment: "left" | "center" | "right"
    }
}

export default function ParagraphSection({ content }: ParagraphSectionProps) {
    return (
        <section className="py-4 px-4 w-full">
            <div className="container mx-auto max-w-4xl">
                <p
                    className={cn(
                        "text-lg text-gray-600 dark:text-gray-300 leading-relaxed",
                        content.alignment === 'center' && 'text-center',
                        content.alignment === 'right' && 'text-right',
                        content.alignment === 'left' && 'text-left'
                    )}
                >
                    {content.text}
                </p>
            </div>
        </section>
    )
}
