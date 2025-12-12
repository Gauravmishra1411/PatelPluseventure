"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wrench, Save, UploadCloud, Palette, ArrowLeft, Edit } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { db, auth } from "@/lib/firebase"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"

const gradients = [
    // Light Gradients
    "from-gray-100 to-gray-200", "from-red-100 to-red-200", "from-yellow-100 to-yellow-200",
    "from-green-100 to-green-200", "from-blue-100 to-blue-200", "from-indigo-100 to-indigo-200",
    "from-purple-100 to-purple-200", "from-pink-100 to-pink-200", "from-rose-100 to-rose-200",
    "from-sky-100 to-sky-200",
    // Mid-tone Gradients
    "from-gray-400 to-gray-500", "from-red-400 to-red-500", "from-yellow-400 to-yellow-500",
    "from-green-400 to-green-500", "from-blue-400 to-blue-500", "from-indigo-400 to-indigo-500",
    "from-purple-400 to-purple-500", "from-pink-400 to-pink-500", "from-rose-400 to-rose-500",
    "from-sky-400 to-sky-500",
    // Dark Gradients
    "from-gray-800 to-gray-900", "from-red-800 to-red-900", "from-yellow-800 to-yellow-900",
    "from-green-800 to-green-900", "from-blue-800 to-blue-900", "from-indigo-800 to-indigo-900",
    "from-purple-800 to-purple-900", "from-pink-800 to-pink-900", "from-rose-800 to-rose-900",
    "from-sky-800 to-sky-900"
];

export default function EditServicePage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        features: "",
        technologies: "",
        price: "",
        gradient: "",
    })

    const [iconFile, setIconFile] = useState<File | null>(null)
    const [iconPreview, setIconPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const fetchService = async () => {
            try {
                if (!id) return;
                const docRef = doc(db, "services", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        title: data.title || "",
                        description: data.description || "",
                        features: data.features ? data.features.join(", ") : "",
                        technologies: data.technologies ? data.technologies.join(", ") : "",
                        price: data.price || "",
                        gradient: data.gradient || "",
                    });
                    if (data.icon) {
                        setIconPreview(data.icon);
                    }
                } else {
                    toast.error("Service not found");
                    router.push("/admin/services");
                }
            } catch (error) {
                console.error("Error fetching service:", error);
                toast.error("Failed to fetch service details");
            } finally {
                setIsFetching(false);
            }
        };

        fetchService();
    }, [id, router]);


    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setIconFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setIconPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const currentUser = auth.currentUser
        if (!currentUser) {
            toast.error("You must be logged in to edit a service.")
            setIsLoading(false)
            return
        }

        try {
            let iconUrl = iconPreview || ""

            if (iconFile) {
                const formData = new FormData();
                formData.append('file', iconFile);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const data = await response.json();
                iconUrl = data.url;
            }

            const docRef = doc(db, "services", id);
            await updateDoc(docRef, {
                ...formData,
                icon: iconUrl,
                features: formData.features.split(",").map((item) => item.trim()),
                technologies: formData.technologies.split(",").map((item) => item.trim()),
                updatedAt: serverTimestamp(),
            })

            toast.success("Service updated successfully!")
            router.push("/admin/services")
        } catch (error) {
            console.error("Error updating service:", error)
            toast.error("Failed to update service. Please try again.")
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
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
                </Button>
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center">
                            <Edit className="w-6 h-6 mr-2 text-primary" />
                            Edit Service
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Update the details for this service.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div className="space-y-4 p-4 border border-border rounded-lg">
                                <h3 className="text-lg font-semibold text-primary">Service Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-foreground">Service Title *</Label>
                                        <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required className="bg-input border-border" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-foreground">Price Range</Label>
                                        <Input id="price" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} className="bg-input border-border" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-foreground">Short Description *</Label>
                                    <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} required rows={3} className="bg-input border-border" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="features" className="text-foreground">Features (comma-separated)</Label>
                                        <Textarea id="features" value={formData.features} onChange={(e) => handleInputChange("features", e.target.value)} className="bg-input border-border" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="technologies" className="text-foreground">Tech Stack (comma-separated)</Label>
                                        <Textarea id="technologies" value={formData.technologies} onChange={(e) => handleInputChange("technologies", e.target.value)} className="bg-input border-border" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 p-4 border border-border rounded-lg">
                                <h3 className="text-lg font-semibold text-primary">Appearance</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div className="space-y-2">
                                        <Label htmlFor="icon" className="text-foreground">Service Icon Image</Label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                {iconPreview ? <Image src={iconPreview} alt="Icon preview" width={64} height={64} className="mx-auto h-16 w-16 object-contain rounded-md" /> : <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />}
                                                <div className="flex text-sm text-gray-400"><label htmlFor="icon" className="relative cursor-pointer bg-secondary rounded-md font-medium text-primary hover:text-primary/90 px-2 py-1"><span>Upload icon</span><Input id="icon" name="icon" type="file" className="sr-only" onChange={handleIconChange} accept="image/*" /></label></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gradient" className="text-foreground flex items-center"><Palette className="w-4 h-4 mr-2" /> Hover Gradient</Label>
                                        <Select value={formData.gradient} onValueChange={(value) => handleInputChange("gradient", value)}>
                                            <SelectTrigger className="bg-input border-border">
                                                <SelectValue placeholder="Select a gradient" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-popover border-border max-h-60">
                                                {gradients.map(g => (
                                                    <SelectItem key={g} value={g} className="text-foreground hover:bg-secondary focus:bg-secondary">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${g}`} />
                                                            <span>{g}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
