"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingSectionProps {
    content: {
        heading: string
        plans: { name: string; price: string; features: string[]; buttonText: string }[]
    }
}

export default function PricingSection({ content }: PricingSectionProps) {
    return (
        <section className="py-20 px-4 w-full">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        {content.heading}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {content.plans?.map((plan: any, index: number) => (
                        <div key={index} className="flex flex-col p-8 rounded-3xl bg-card border border-border shadow-xl hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                            {index === 1 && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">
                                    POPULAR
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold mb-6">
                                {plan.price}
                                <span className="text-base font-normal text-muted-foreground">/mo</span>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features?.map((feature: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="p-1 bg-green-500/10 rounded-full text-[#81f5fd] mt-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button className={`w-full ${index === 1 ? 'bg-primary' : 'bg-secondary text-secondary-foreground'}`}>
                                {plan.buttonText}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
