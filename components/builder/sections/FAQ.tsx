"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQSectionProps {
    content: {
        heading: string
        items: { question: string; answer: string }[]
    }
}

export default function FAQSection({ content }: FAQSectionProps) {
    return (
        <section className="py-20 px-4 w-full bg-gray-50/50 dark:bg-background">
            <div className="container mx-auto max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-12">{content.heading}</h2>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {content.items?.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-card px-4 rounded-lg border">
                            <AccordionTrigger className="text-left font-medium text-lg py-4 hover:no-underline">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pb-4">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
