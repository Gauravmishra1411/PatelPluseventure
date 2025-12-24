"use client"

import { Section } from "@/types/page-builder"
import HeroSection from "./sections/Hero"
import HeadingSection from "./sections/Heading"
import ParagraphSection from "./sections/Paragraph"
import GallerySection from "./sections/Gallery"
import ImageTextSection from "./sections/ImageText"
import FeaturesSection from "./sections/Features"
import CTASection from "./sections/CTA"
import FAQSection from "./sections/FAQ"
import VideoSection from "./sections/Video"
import PricingSection from "./sections/Pricing"
import StatsSection from "./sections/Stats"
import SpacerSection from "./sections/Spacer"
import DividerSection from "./sections/Divider"
import TestimonialsSection from "./sections/Testimonials"

interface PageRendererProps {
    sections: Section[]
}

export default function PageRenderer({ sections }: PageRendererProps) {
    if (!sections || sections.length === 0) {
        return null
    }

    return (
        <div className="flex flex-col w-full">
            {sections.map((section) => {
                switch (section.type) {
                    case "hero":
                        return <HeroSection key={section.id} content={section.content} />
                    case "heading":
                        return <HeadingSection key={section.id} content={section.content} />
                    case "paragraph":
                        return <ParagraphSection key={section.id} content={section.content} />
                    case "gallery":
                        return <GallerySection key={section.id} content={section.content} />
                    case "image-text":
                        return <ImageTextSection key={section.id} content={section.content} />
                    case "features":
                        return <FeaturesSection key={section.id} content={section.content} />
                    case "cta":
                        return <CTASection key={section.id} content={section.content} />
                    case "faq":
                        return <FAQSection key={section.id} content={section.content} />
                    case "video":
                        return <VideoSection key={section.id} content={section.content} />
                    case "pricing":
                        return <PricingSection key={section.id} content={section.content} />
                    case "stats":
                        return <StatsSection key={section.id} content={section.content} />
                    case "spacer":
                        return <SpacerSection key={section.id} content={section.content} />
                    case "divider":
                        return <DividerSection key={section.id} content={section.content} />
                    case "testimonials":
                        return <TestimonialsSection key={section.id} content={section.content} />
                    default:
                        return null
                }
            })}
        </div>
    )
}
