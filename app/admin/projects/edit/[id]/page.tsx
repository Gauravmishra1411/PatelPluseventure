"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FolderOpen, Save, UploadCloud, Tag, Layers, Calendar, User, Lightbulb, ArrowLeft, Edit } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { db, auth } from "@/lib/firebase"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"

export default function EditProjectPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: "",
        tagline: "",
        description: "",
        category: "",
    })

    // Image states
    const [mainImageFile, setMainImageFile] = useState<File | null>(null)
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)

    // Gallery states (simplified for edit: currently just appending new ones or keeping existing list logic is complex without a robust UI)
    // For this version, we will allow replacing the gallery or adding to it could be tricky. 
    // Let's allow uploading NEW gallery images which will REPLACE the old ones or APPEND? 
    // 'AddProject' replaces the whole array. Let's try to keep it simple: View existing, and if new selected, replace or append.
    // Actually, standard Edit usually allows adding/removing. 
    // To keep it safe: We will just allow updating the MAIN image for now to avoid complexity, 
    // or simple "replace all gallery" if files selected.
    const [galleryFiles, setGalleryFiles] = useState<File[]>([])
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
    const [existingGallery, setExistingGallery] = useState<string[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!id) return;
                const docRef = doc(db, "projects", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        title: data.title || "",
                        tagline: data.tagline || "",
                        description: data.description || "",
                        category: data.category || "",
                    });

                    if (data.mainImage) {
                        setMainImagePreview(data.mainImage);
                    }
                    if (data.gallery && Array.isArray(data.gallery)) {
                        setExistingGallery(data.gallery);
                    }

                } else {
                    toast.error("Project not found");
                    router.push("/admin/projects");
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                toast.error("Failed to fetch project details");
            } finally {
                setIsFetching(false);
            }
        };

        fetchProject();
    }, [id, router]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setMainImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setMainImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setGalleryFiles(prev => [...prev, ...files]);
            const previews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...previews]);
        }
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error(`Failed to upload ${file.name}`);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const currentUser = auth.currentUser
        if (!currentUser) {
            toast.error("You must be logged in to edit a project.")
            setIsLoading(false)
            return
        }

        try {
            let mainImageUrl = mainImagePreview || ""
            if (mainImageFile) {
                mainImageUrl = await uploadImage(mainImageFile) || mainImageUrl
            }

            let galleryImageUrls = [...existingGallery]
            if (galleryFiles.length > 0) {
                // If new files selected, we append them or replace? 
                // Let's decide to APPEND for now, unless user cleared previews? 
                // Actually, 'existingGallery' holds the old ones. 'galleryPreviews' shows new ones.
                // Let's upload new ones and add to database.
                const uploadPromises = galleryFiles.map(file => uploadImage(file));
                const urls = await Promise.all(uploadPromises);
                const newUrls = urls.filter((url): url is string => url !== null);
                galleryImageUrls = [...galleryImageUrls, ...newUrls];
            }

            // Note: A real implementation would allow deleting individual existing images.
            // We will skip that UI complexity for now unless requested.

            const docRef = doc(db, "projects", id);
            await updateDoc(docRef, {
                ...formData,
                mainImage: mainImageUrl,
                gallery: galleryImageUrls,
                updatedAt: serverTimestamp(),
            })

            toast.success("Project updated successfully!")
            router.push("/admin/projects")
        } catch (error) {
            console.error("Error updating project:", error)
            toast.error("Failed to update project. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
                </Button>
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center">
                            <Edit className="w-6 h-6 mr-2 text-primary" />
                            Edit Project
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Update the details for this project.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Basic Info */}
                            <div className="space-y-4 p-4 border border-border rounded-lg">
                                <h3 className="text-lg font-semibold text-primary">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-foreground">Project Title *</Label>
                                        <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required className="bg-input border-border" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tagline" className="text-foreground">Tagline</Label>
                                        <Input id="tagline" value={formData.tagline} onChange={(e) => handleInputChange("tagline", e.target.value)} className="bg-input border-border" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-foreground">Description *</Label>
                                    <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} required rows={4} className="bg-input border-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-foreground">Category</Label>
                                    <Input id="category" value={formData.category} onChange={(e) => handleInputChange("category", e.target.value)} className="bg-input border-border" />
                                </div>
                            </div>

                            {/* Media */}
                            <div className="space-y-4 p-4 border border-border rounded-lg">
                                <h3 className="text-lg font-semibold text-primary">Media</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="mainImage" className="text-foreground">Main Project Image</Label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {mainImagePreview ? <Image src={mainImagePreview} alt="Main preview" width={200} height={150} className="mx-auto h-32 w-auto object-contain rounded-md" /> : <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />}
                                            <div className="flex text-sm text-gray-400"><label htmlFor="mainImage" className="relative cursor-pointer bg-secondary rounded-md font-medium text-primary hover:text-primary/90 px-2 py-1"><span>Change main image</span><Input id="mainImage" name="mainImage" type="file" className="sr-only" onChange={handleMainImageChange} accept="image/*" /></label></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gallery" className="text-foreground">Image Gallery (New images will be appended)</Label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {/* Show existing gallery */}
                                            {existingGallery.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-xs text-muted-foreground mb-2">Existing Gallery:</p>
                                                    <div className="flex flex-wrap gap-2 justify-center">
                                                        {existingGallery.map((src, idx) => <Image key={`existing-${idx}`} src={src} alt={`Gallery existing ${idx + 1}`} width={100} height={80} className="h-20 w-auto object-contain rounded-md border border-border" />)}
                                                    </div>
                                                </div>
                                            )}
                                            {/* Show new previews */}
                                            {galleryPreviews.length > 0 && (
                                                <div className="mb-2">
                                                    <p className="text-xs text-muted-foreground mb-2">New Uploads:</p>
                                                    <div className="flex flex-wrap gap-2 justify-center">
                                                        {galleryPreviews.map((src, idx) => <img key={`new-${idx}`} src={src} alt={`Gallery new ${idx + 1}`} width={100} height={80} className="h-20 w-auto object-contain rounded-md border border-primary/50" />)}
                                                    </div>
                                                </div>
                                            )}

                                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <div className="flex text-sm text-gray-400"><label htmlFor="gallery" className="relative cursor-pointer bg-secondary rounded-md font-medium text-primary hover:text-primary/90 px-2 py-1"><span>Upload more images</span><Input id="gallery" name="gallery" type="file" multiple className="sr-only" onChange={handleGalleryChange} accept="image/*" /></label></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details and Links removed */}
                            <div className="flex items-center justify-end space-x-4 pt-6">
                                <Button type="button" variant="outline" onClick={() => router.back()} className="border-border text-muted-foreground hover:bg-secondary">Cancel</Button>
                                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                                    {isLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>Updating...</>) : (<><Save className="w-4 h-4 mr-2" />Save Changes</>)}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
