"use client"

interface DividerSectionProps {
    content: {
        style: "solid" | "dashed" | "dotted"
    }
}

export default function DividerSection({ content }: DividerSectionProps) {
    return (
        <div className="py-8 w-full px-4">
            <div className="container mx-auto">
                <hr
                    className="border-t-2 border-border w-full"
                    style={{ borderStyle: content.style || 'solid' }}
                />
            </div>
        </div>
    )
}
