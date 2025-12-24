"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CTASectionProps {
    content: {
        heading: string
        subheading: string
        buttonText: string
        buttonLink: string
    }
}

export default function CTASection({ content }: CTASectionProps) {
    return (
        <section className="py-24 px-4 w-full bg-primary text-primary-foreground text-center">
            <div className="container mx-auto max-w-3xl space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    {content.heading}
                </h2>
                <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                    {content.subheading}
                </p>
                <Link href={content.buttonLink || "#"}>
                    <Button size="lg" variant="secondary" className="font-semibold text-lg px-8 py-6 h-auto">
                        {content.buttonText}
                    </Button>
                </Link>
            </div>
        </section>
    )
}
