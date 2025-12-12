"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, UploadCloud, Edit } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { db, auth } from "@/lib/firebase"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"

export default function EditTestimonialPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        company: "",
        content: "",
        rating: "5",
    })

    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const fetchTestimonial = async () => {
            try {
                if (!id) return;
                const docRef = doc(db, "testimonials", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        name: data.name || "",
                        role: data.role || "",
                        company: data.company || "",
                        content: data.content || "",
                        rating: data.rating ? String(data.rating) : "5",
                    });
                    if (data.avatar) {
                        setAvatarPreview(data.avatar);
                    }
                } else {
                    toast.error("Testimonial not found");
                    router.push("/admin/testimonials");
                }
            } catch (error) {
                console.error("Error fetching testimonial:", error);
                toast.error("Failed to fetch testimonial details");
            } finally {
                setIsFetching(false);
            }
        };

        fetchTestimonial();
    }, [id, router]);


    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const currentUser = auth.currentUser
        if (!currentUser) {
            toast.error("You must be logged in to edit a testimonial.")
            setIsLoading(false)
            return
        }

        try {
            let avatarUrl = avatarPreview || ""

            if (avatarFile) {
                const formData = new FormData();
                formData.append('file', avatarFile);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const data = await response.json();
                avatarUrl = data.url;
            }

            const docRef = doc(db, "testimonials", id);
            await updateDoc(docRef, {
                ...formData,
                rating: Number(formData.rating),
                avatar: avatarUrl,
                updatedAt: serverTimestamp(),
            })

            toast.success("Testimonial updated successfully!")
            router.push("/admin/testimonials")
        } catch (error) {
            console.error("Error updating testimonial:", error)
            toast.error("Failed to update testimonial. Please try again.")
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
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Testimonials
                </Button>
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center">
                            <Edit className="w-6 h-6 mr-2 text-primary" />
                            Edit Testimonial
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Update the details for this testimonial.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div className="space-y-4 p-4 border border-border rounded-lg">
                                <h3 className="text-lg font-semibold text-primary">Client Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-foreground">Client Name *</Label>
                                        <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required className="bg-input border-border" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-foreground">Role / Job Title *</Label>
                                        <Input id="role" value={formData.role} onChange={(e) => handleInputChange("role", e.target.value)} required className="bg-input border-border" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company" className="text-foreground">Company *</Label>
                                        <Input id="company" value={formData.company} onChange={(e) => handleInputChange("company", e.target.value)} required className="bg-input border-border" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rating" className="text-foreground">Rating (1-5)</Label>
                                        <Input id="rating" type="number" min="1" max="5" value={formData.rating} onChange={(e) => handleInputChange("rating", e.target.value)} required className="bg-input border-border" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-foreground">Testimonial Content *</Label>
                                    <Textarea id="content" value={formData.content} onChange={(e) => handleInputChange("content", e.target.value)} required rows={4} className="bg-input border-border" />
                                </div>
                            </div>

                            <div className="space-y-4 p-4 border border-border rounded-lg">
                                <h3 className="text-lg font-semibold text-primary">Avatar</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="avatar" className="text-foreground">Client Avatar</Label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {avatarPreview ? <Image src={avatarPreview} alt="Avatar preview" width={64} height={64} className="mx-auto h-16 w-16 object-cover rounded-full" /> : <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />}
                                            <div className="flex text-sm text-gray-400"><label htmlFor="avatar" className="relative cursor-pointer bg-secondary rounded-md font-medium text-primary hover:text-primary/90 px-2 py-1"><span>Upload avatar</span><Input id="avatar" name="avatar" type="file" className="sr-only" onChange={handleAvatarChange} accept="image/*" /></label></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
