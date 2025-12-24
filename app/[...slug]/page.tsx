"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { collection, query, where, getDocs, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Page } from "@/types/page-builder"
import PageRenderer from "@/components/builder/PageRenderer"
import { Loader2 } from "lucide-react"

export default function DynamicPage() {
    const params = useParams()
    const slugArray = params.slug as string[]
    const slug = slugArray.join("/")

    const [page, setPage] = useState<Page | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const q = query(
                    collection(db, "pages"),
                    where("slug", "==", slug),
                    where("isPublished", "==", true),
                    limit(1)
                )
                const querySnapshot = await getDocs(q)

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0]
                    setPage({ id: doc.id, ...doc.data() } as Page)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error("Error fetching page:", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchPage()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !page) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-8">Page not found</p>
                <a href="/" className="text-primary hover:underline">Return Home</a>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <PageRenderer sections={page.sections} />
        </main>
    )
}
