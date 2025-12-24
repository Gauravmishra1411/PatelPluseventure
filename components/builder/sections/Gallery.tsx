"use client"

import Image from "next/image"

interface GallerySectionProps {
    content: {
        images: string[]
        columns: number
    }
}

export default function GallerySection({ content }: GallerySectionProps) {
    // Default placeholder images if none provided
    const images = content.images && content.images.length > 0
        ? content.images
        : [
            "/placeholder.svg",
            "/placeholder.svg",
            "/placeholder.svg"
        ]

    return (
        <section className="py-12 px-4 w-full bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((src, index) => (
                        <div key={index} className="relative aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <Image
                                src={src || "/placeholder.svg"}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
