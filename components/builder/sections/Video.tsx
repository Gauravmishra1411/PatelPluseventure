"use client"

interface VideoSectionProps {
    content: {
        url: string
        caption: string
    }
}

export default function VideoSection({ content }: VideoSectionProps) {
    // Simple helper to get embed URL from youtube watch URL
    const getEmbedUrl = (url: string) => {
        if (!url) return ""
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url
    }

    return (
        <section className="py-16 px-4 w-full">
            <div className="container mx-auto max-w-5xl">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
                    <iframe
                        width="100%"
                        height="100%"
                        src={getEmbedUrl(content.url)}
                        title="Video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                {content.caption && (
                    <p className="text-center text-muted-foreground mt-4 italic">
                        {content.caption}
                    </p>
                )}
            </div>
        </section>
    )
}
