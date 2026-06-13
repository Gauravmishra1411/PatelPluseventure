"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, setDoc, updateDoc, Timestamp, collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import AdminAuthGuard from "@/components/admin-auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, Monitor, Smartphone, Plus, Layers, X, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, List, MessageSquare, Play, DollarSign, BarChart, MoveVertical, Minus } from "lucide-react"
import { toast } from "sonner"
import { Page, Section, ComponentType, initialComponentData } from "@/types/page-builder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Components
import HeroSection from "@/components/builder/sections/Hero"
import HeadingSection from "@/components/builder/sections/Heading"
import ParagraphSection from "@/components/builder/sections/Paragraph"
import GallerySection from "@/components/builder/sections/Gallery"
import ImageTextSection from "@/components/builder/sections/ImageText"
import FeaturesSection from "@/components/builder/sections/Features"
import CTASection from "@/components/builder/sections/CTA"
import FAQSection from "@/components/builder/sections/FAQ"
import VideoSection from "@/components/builder/sections/Video"
import PricingSection from "@/components/builder/sections/Pricing"
import StatsSection from "@/components/builder/sections/Stats"
import SpacerSection from "@/components/builder/sections/Spacer"
import DividerSection from "@/components/builder/sections/Divider"
import TestimonialsSection from "@/components/builder/sections/Testimonials"

export default function PageBuilderPage() {
    const params = useParams()
    const router = useRouter()
    const pageId = params.id as string
    const isNew = pageId === "new"

    const [page, setPage] = useState<Page>({
        id: "",
        slug: "",
        title: "",
        sections: [],
        isPublished: false,
        createdAt: null,
        updatedAt: null,
    })
    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

    useEffect(() => {
        if (isNew) return

        const fetchPage = async () => {
            try {
                const docRef = doc(db, "pages", pageId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setPage({ id: docSnap.id, ...docSnap.data() } as Page)
                } else {
                    toast.error("Page not found")
                    router.push("/admin/pages")
                }
            } catch (error) {
                toast.error("Error loading page")
            } finally {
                setLoading(false)
            }
        }
        fetchPage()
    }, [pageId, isNew, router])

    const handleSave = async () => {
        if (!page.title || !page.slug) {
            toast.error("Please enter a title and slug")
            return
        }

        setSaving(true)
        try {
            const pageData = {
                ...page,
                updatedAt: Timestamp.now(),
            }

            if (isNew) {
                pageData.createdAt = Timestamp.now()
                const colRef = collection(db, "pages")
                const docRef = await addDoc(colRef, pageData)
                toast.success("Page created successfully")
                router.push(`/page-builder/${docRef.id}`)
            } else {
                await updateDoc(doc(db, "pages", pageId), {
                    title: page.title,
                    slug: page.slug,
                    sections: page.sections,
                    isPublished: page.isPublished,
                    updatedAt: Timestamp.now()
                })
                toast.success("Page saved successfully")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to save page")
        } finally {
            setSaving(false)
        }
    }

    const addSection = (type: ComponentType) => {
        const newSection: Section = {
            id: crypto.randomUUID(),
            type,
            // Deep copy initial data to avoid reference issues
            content: JSON.parse(JSON.stringify(initialComponentData[type])),
        }
        setPage(prev => ({ ...prev, sections: [...prev.sections, newSection] }))
        setSelectedSectionId(newSection.id)
    }

    const updateSection = (id: string, newContent: any) => {
        setPage(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === id ? { ...s, content: newContent } : s)
        }))
    }

    const deleteSection = (id: string) => {
        setPage(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== id)
        }))
        if (selectedSectionId === id) setSelectedSectionId(null)
    }

    const moveSection = (id: string, direction: 'up' | 'down') => {
        const index = page.sections.findIndex(s => s.id === id)
        if (index === -1) return

        const newSections = [...page.sections]
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]]
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
        }
        setPage(prev => ({ ...prev, sections: newSections }))
    }

    const selectedSection = page.sections.find(s => s.id === selectedSectionId)

    // Generic content editor that handles text/numbers/selects
    // For arrays/objects, we provide a textarea for JSON editing for power users
    // In a real app, we'd build custom form controls for each array type
    const renderPropertyEditor = (section: Section) => {
        const { content } = section

        return (
            <div className="space-y-4">
                {Object.keys(content).map((key) => {
                    const value = content[key]

                    // Skip rendering complex arrays in simple mode if we want, but for now we'll try JSON input
                    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                        return (
                            <div key={key} className="space-y-2">
                                <Label className="capitalize">{key} (JSON config)</Label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px]"
                                    value={JSON.stringify(value, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            const parsed = JSON.parse(e.target.value)
                                            updateSection(section.id, { ...content, [key]: parsed })
                                        } catch (err) {
                                            // Ignore parse errors while typing
                                        }
                                    }}
                                />
                                <p className="text-[10px] text-muted-foreground">Edit the items array as JSON.</p>
                            </div>
                        )
                    }

                    if (key === 'alignment' || key === 'imagePosition') {
                        return (
                            <div key={key} className="space-y-2">
                                <Label className="capitalize">{key}</Label>
                                <Select
                                    value={value}
                                    onValueChange={(val) => updateSection(section.id, { ...content, [key]: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="center">Center</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )
                    }

                    if (key === 'level') {
                        return (
                            <div key={key} className="space-y-2">
                                <Label className="capitalize">{key}</Label>
                                <Select
                                    value={value}
                                    onValueChange={(val) => updateSection(section.id, { ...content, [key]: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="h1">H1</SelectItem>
                                        <SelectItem value="h2">H2</SelectItem>
                                        <SelectItem value="h3">H3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )
                    }

                    if (key === 'style' && section.type === 'divider') {
                        return (
                            <div key={key} className="space-y-2">
                                <Label className="capitalize">{key}</Label>
                                <Select
                                    value={value}
                                    onValueChange={(val) => updateSection(section.id, { ...content, [key]: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="solid">Solid</SelectItem>
                                        <SelectItem value="dashed">Dashed</SelectItem>
                                        <SelectItem value="dotted">Dotted</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )
                    }

                    // Default text input
                    return (
                        <div key={key} className="space-y-2">
                            <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                            {key === 'text' && section.type === 'paragraph' ? (
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]"
                                    value={value}
                                    onChange={(e) => updateSection(section.id, { ...content, [key]: e.target.value })}
                                />
                            ) : (
                                <Input
                                    value={value}
                                    type={typeof value === 'number' ? 'number' : 'text'}
                                    onChange={(e) => updateSection(section.id, { ...content, [key]: typeof value === 'number' ? Number(e.target.value) : e.target.value })}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    if (loading) return <div>Loading...</div>

    return (
        <AdminAuthGuard>
            <div className="flex h-screen bg-muted/30 overflow-hidden flex-col">
                {/* Header */}
                <header className="h-16 border-b bg-background flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/pages")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex flex-col">
                            <Input
                                value={page.title}
                                onChange={e => setPage(p => ({ ...p, title: e.target.value }))}
                                placeholder="Page Title"
                                className="h-8 font-semibold text-lg border-none hover:bg-muted/50 px-2 -ml-2 w-64"
                            />
                            <div className="flex items-center text-xs text-muted-foreground ml-0.5">
                                <span>/</span>
                                <Input
                                    value={page.slug}
                                    onChange={e => setPage(p => ({ ...p, slug: e.target.value }))}
                                    placeholder="slug"
                                    className="h-6 text-xs border-none hover:bg-muted/50 px-1 w-40 p-0 shadow-none focus-visible:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center bg-muted/50 p-1 rounded-lg">
                        <Button
                            variant={viewMode === "desktop" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("desktop")}
                            className="h-8 px-3"
                        >
                            <Monitor className="h-4 w-4 mr-2" />
                            Desktop
                        </Button>
                        <Button
                            variant={viewMode === "mobile" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("mobile")}
                            className="h-8 px-3"
                        >
                            <Smartphone className="h-4 w-4 mr-2" />
                            Mobile
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 mr-4">
                            <Switch
                                checked={page.isPublished}
                                onCheckedChange={(checked) => setPage(p => ({ ...p, isPublished: checked }))}
                            />
                            <Label className="text-sm">Published</Label>
                        </div>
                        <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-accent">
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? "Saving..." : "Save Page"}
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar (Components) */}
                    <div className="w-80 bg-background border-r flex flex-col shrink-0">
                        <Tabs defaultValue="add" className="flex-1 flex flex-col min-h-0">
                            <div className="px-4 pt-4 pb-2">
                                <TabsList className="w-full">
                                    <TabsTrigger value="add" className="flex-1">Add</TabsTrigger>
                                    <TabsTrigger value="layers" className="flex-1">Layers</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="add" className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 mt-0">
                                <div className="space-y-4">
                                    <div className="text-sm font-medium text-muted-foreground">General</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('hero')}>
                                            <div className="p-2 bg-primary/10 rounded-md">
                                                <Layers className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="text-xs">Hero</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('heading')}>
                                            <div className="p-2 bg-accent/10 rounded-md">
                                                <ArrowUp className="h-5 w-5 text-accent" />
                                            </div>
                                            <span className="text-xs">Heading</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('paragraph')}>
                                            <div className="p-2 bg-blue-500/10 rounded-md">
                                                <List className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <span className="text-xs">Paragraph</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('image-text')}>
                                            <div className="p-2 bg-pink-500/10 rounded-md">
                                                <ImageIcon className="h-5 w-5 text-pink-500" />
                                            </div>
                                            <span className="text-xs">Image + Text</span>
                                        </Button>
                                    </div>

                                    <div className="text-sm font-medium text-muted-foreground mt-4">Content</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('features')}>
                                            <div className="p-2 bg-green-500/10 rounded-md">
                                                <List className="h-5 w-5 text-[#81f5fd]" />
                                            </div>
                                            <span className="text-xs">Features</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('cta')}>
                                            <div className="p-2 bg-purple-500/10 rounded-md">
                                                <MessageSquare className="h-5 w-5 text-purple-500" />
                                            </div>
                                            <span className="text-xs">Call to Action</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('gallery')}>
                                            <div className="p-2 bg-orange-500/10 rounded-md">
                                                <ImageIcon className="h-5 w-5 text-orange-500" />
                                            </div>
                                            <span className="text-xs">Gallery</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('testimonials')}>
                                            <div className="p-2 bg-yellow-500/10 rounded-md">
                                                <MessageSquare className="h-5 w-5 text-yellow-500" />
                                            </div>
                                            <span className="text-xs">Testimonials</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('pricing')}>
                                            <div className="p-2 bg-teal-500/10 rounded-md">
                                                <DollarSign className="h-5 w-5 text-teal-500" />
                                            </div>
                                            <span className="text-xs">Pricing</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('stats')}>
                                            <div className="p-2 bg-indigo-500/10 rounded-md">
                                                <BarChart className="h-5 w-5 text-indigo-500" />
                                            </div>
                                            <span className="text-xs">Stats</span>
                                        </Button>
                                    </div>

                                    <div className="text-sm font-medium text-muted-foreground mt-4">Media & Utility</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('video')}>
                                            <div className="p-2 bg-red-500/10 rounded-md">
                                                <Play className="h-5 w-5 text-red-500" />
                                            </div>
                                            <span className="text-xs">Video</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('faq')}>
                                            <div className="p-2 bg-gray-500/10 rounded-md">
                                                <MessageSquare className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <span className="text-xs">FAQ</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('spacer')}>
                                            <div className="p-2 bg-gray-300/10 rounded-md">
                                                <MoveVertical className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <span className="text-xs">Spacer</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => addSection('divider')}>
                                            <div className="p-2 bg-gray-300/10 rounded-md">
                                                <Minus className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <span className="text-xs">Divider</span>
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="layers" className="flex-1 overflow-y-auto p-4 min-h-0 mt-0">
                                <div className="space-y-2">
                                    {page.sections.map((section, index) => (
                                        <div
                                            key={section.id}
                                            className={`flex items-center justify-between p-3 rounded-md border text-sm cursor-pointer hover:bg-muted ${selectedSectionId === section.id ? 'border-primary bg-primary/5' : 'bg-background'}`}
                                            onClick={() => setSelectedSectionId(section.id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground opacity-50 font-mono text-xs">{index + 1}</span>
                                                <span className="capitalize font-medium">{section.type.replace('-', ' ')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}>
                                                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 bg-muted/30 overflow-y-auto p-8 flex justify-center" onClick={() => setSelectedSectionId(null)}>
                        <div
                            className={`bg-white dark:bg-black shadow-xl transition-all duration-300 ease-in-out relative ${viewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[1200px]'} min-h-[800px] pb-24`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {page.sections.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
                                    <Plus className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Add sections from the sidebar to get started</p>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {page.sections.map((section) => (
                                        <div
                                            key={section.id}
                                            className={`relative group border-2 border-transparent hover:border-primary/20 transition-all ${selectedSectionId === section.id ? '!border-primary ring-4 ring-primary/10 z-10' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setSelectedSectionId(section.id); }}
                                        >
                                            {/* Section Controls */}
                                            {selectedSectionId === section.id && (
                                                <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary text-primary-foreground rounded-md shadow-lg p-1 z-50">
                                                    <div className="px-2 text-xs font-bold uppercase tracking-wider opacity-80">{section.type.replace('-', ' ')}</div>
                                                    <div className="w-px h-3 bg-white/20 mx-1" />
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-primary-foreground/20 text-white" onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }}>
                                                        <ArrowUp className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-primary-foreground/20 text-white" onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }}>
                                                        <ArrowDown className="h-3 w-3" />
                                                    </Button>
                                                    <div className="w-px h-3 bg-white/20 mx-1" />
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-destructive hover:text-white text-white" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Component Renderer */}
                                            {section.type === 'hero' && <HeroSection content={section.content} />}
                                            {section.type === 'heading' && <HeadingSection content={section.content} />}
                                            {section.type === 'paragraph' && <ParagraphSection content={section.content} />}
                                            {section.type === 'gallery' && <GallerySection content={section.content} />}
                                            {section.type === 'image-text' && <ImageTextSection content={section.content} />}
                                            {section.type === 'features' && <FeaturesSection content={section.content} />}
                                            {section.type === 'cta' && <CTASection content={section.content} />}
                                            {section.type === 'faq' && <FAQSection content={section.content} />}
                                            {section.type === 'video' && <VideoSection content={section.content} />}
                                            {section.type === 'pricing' && <PricingSection content={section.content} />}
                                            {section.type === 'stats' && <StatsSection content={section.content} />}
                                            {section.type === 'spacer' && <SpacerSection content={section.content} />}
                                            {section.type === 'divider' && <DividerSection content={section.content} />}
                                            {section.type === 'testimonials' && <TestimonialsSection content={section.content} />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar (Properties) */}
                    {selectedSectionId && selectedSection && (
                        <div className="w-80 bg-background border-l flex flex-col shrink-0 overflow-y-auto">
                            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                                <span className="font-semibold capitalize">{selectedSection.type.replace('-', ' ')} Properties</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedSectionId(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="p-4">
                                {renderPropertyEditor(selectedSection)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminAuthGuard>
    )
}
