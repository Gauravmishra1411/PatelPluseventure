"use client"

import { CheckCircle2 } from "lucide-react"

interface FeaturesSectionProps {
    content: {
        heading: string
        items: { title: string; description: string }[]
    }
}

export default function FeaturesSection({ content }: FeaturesSectionProps) {
    return (
        <section className="py-20 px-4 w-full bg-white dark:bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">{content.heading}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {content.items?.map((item, index) => (
                        <div key={index} className="p-8 rounded-2xl bg-gray-50 dark:bg-card border border-gray-100 dark:border-border hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
