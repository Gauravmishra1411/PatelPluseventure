"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

interface HeroSectionProps {
    content: {
        heading: string
        subheading: string
        buttonText: string
        buttonLink?: string
        backgroundImage?: string
    }
}

export default function HeroSection({ content }: HeroSectionProps) {
    return (
        <section className="relative h-[500px] w-full flex items-center justify-center overflow-hidden bg-gray-900 text-white">
            {/* Background Image */}
            {content.backgroundImage && (
                <div
                    className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${content.backgroundImage})` }}
                />
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-0" />

            <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">
                        {content.heading}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        {content.subheading}
                    </p>
                </motion.div>

                {content.buttonText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Link href={content.buttonLink || "#"}>
                            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 font-semibold px-8">
                                {content.buttonText}
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
