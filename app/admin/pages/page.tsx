"use client"

import { useState, useEffect } from "react"
import { Plus, Search, FileText, ExternalLink, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore"
import { Page } from "@/types/page-builder"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function PagesAdmin() {
    const [pages, setPages] = useState<Page[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const q = query(collection(db, "pages"), orderBy("updatedAt", "desc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const pagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Page))
            setPages(pagesData)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const handleDelete = async (id: string, title: string) => {
        try {
            await deleteDoc(doc(db, "pages", id))
            toast.success(`Page "${title}" deleted successfully`)
        } catch (error) {
            toast.error("Failed to delete page")
            console.error(error)
        }
    }

    const filteredPages = pages.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
                    <p className="text-muted-foreground mt-2">Create and manage custom landing pages and content.</p>
                </div>
                <Link href="/page-builder/new">
                    <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Page
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 bg-transparent flex-1"
                />
            </div>

            {filteredPages.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">No pages found</h3>
                    <p className="text-muted-foreground mt-1 mb-6">Get started by creating your first custom page.</p>
                    <Link href="/page-builder/new">
                        <Button variant="outline">Create Page</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPages.map((page) => (
                        <Card key={page.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <Badge variant={page.isPublished ? "default" : "secondary"} className={page.isPublished ? "bg-green-500/15 text-[#81f5fd] hover:bg-green-500/25 border-[#81f5fd]/20" : ""}>
                                        {page.isPublished ? "Published" : "Draft"}
                                    </Badge>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-1 truncate">{page.title}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <span className="truncate max-w-[200px]">/{page.slug}</span>
                                        <Link href={`/${page.slug}`} target="_blank" className="ml-2 hover:text-primary">
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link href={`/page-builder/${page.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:bg-primary/5">
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the page &quot;{page.title}&quot;.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(page.id, page.title)} className="bg-destructive hover:bg-destructive/90">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
