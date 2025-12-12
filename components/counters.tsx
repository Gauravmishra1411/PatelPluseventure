"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView, useSpring, useMotionValue } from "framer-motion"

function Counter({ value, suffix = "" }: { value: number, suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 })
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    useEffect(() => {
        if (isInView) {
            motionValue.set(value)
        }
    }, [isInView, value, motionValue])

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString()
            }
        })
    }, [springValue])

    return <span ref={ref} />
}

export default function Counters() {
    const stats = [
        {
            value: 50,
            suffix: "+",
            label: "Projects Completed",
        },
        {
            value: 100,
            suffix: "%",
            label: "Client Satisfaction",
        },
        {
            value: 24,
            suffix: "/7",
            label: "Support Available",
        },
        {
            value: 10,
            suffix: "+",
            label: "Awards Won",
        },
    ]

    return (
        <section id="counters" className="py-20 bg-background border-t border-border/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-border/40">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center justify-center space-y-2"
                        >
                            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary flex items-center justify-center tracking-tight">
                                <Counter value={stat.value} />
                                <span>{stat.suffix}</span>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
