"use client"

interface SpacerSectionProps {
    content: {
        height: number
    }
}

export default function SpacerSection({ content }: SpacerSectionProps) {
    return (
        <div style={{ height: `${content.height || 50}px` }} className="w-full" />
    )
}
