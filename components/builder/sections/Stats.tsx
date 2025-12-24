"use client"

interface StatsSectionProps {
    content: {
        items: { value: string; label: string }[]
    }
}

export default function StatsSection({ content }: StatsSectionProps) {
    return (
        <section className="py-16 px-4 w-full bg-primary/5 border-y border-primary/10">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {content.items?.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="text-4xl md:text-5xl font-extrabold text-primary">
                                {item.value}
                            </div>
                            <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
