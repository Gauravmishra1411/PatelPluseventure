"use client"

import Image from "next/image"

interface TestimonialsSectionProps {
    content: {
        heading: string
        items: { name: string; role: string; quote: string; avatar: string }[]
    }
}

export default function TestimonialsSection({ content }: TestimonialsSectionProps) {
    return (
        <section className="py-24 px-4 w-full bg-gray-900 text-white overflow-hidden">
            <div className="container mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">{content.heading}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.items?.map((item, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 relative">
                            <div className="absolute -top-4 -left-4 text-6xl text-primary opacity-30 font-serif">"</div>
                            <p className="text-lg text-gray-300 mb-8 relative z-10 leading-relaxed">
                                {item.quote}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                                    <Image
                                        src={item.avatar || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold">{item.name}</div>
                                    <div className="text-sm text-gray-400">{item.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
