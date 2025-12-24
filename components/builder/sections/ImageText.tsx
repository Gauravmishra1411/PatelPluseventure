"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface ImageTextSectionProps {
    content: {
        heading: string
        text: string
        image: string
        imagePosition: "left" | "right"
    }
}

export default function ImageTextSection({ content }: ImageTextSectionProps) {
    return (
        <section className="py-16 px-4 w-full overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <div className={cn(
                    "flex flex-col gap-12 items-center",
                    content.imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'
                )}>
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            {content.heading}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {content.text}
                        </p>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={content.image || "/placeholder.svg"}
                                alt={content.heading}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
