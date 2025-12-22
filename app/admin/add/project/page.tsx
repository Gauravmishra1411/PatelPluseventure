
"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FolderOpen, Save, Link as LinkIcon, UploadCloud, Tag, Layers, Calendar, User, BookOpen, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { db, auth } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth";


export default function AddProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    features: "",
    techStack: "",
    demoUrl: "",
    githubFrontend: "",
    githubBackend: "",
    timeline: "",
    role: "",
    learnings: "",
    tags: "",
    category: "",
  })

  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
      setGalleryFiles(files);

      const previews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(previews);
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

      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("You must be logged in to add a project.");
      setIsLoading(false);
      return;
    }

    try {
      let mainImageUrl = '';
      if (mainImageFile) {
        mainImageUrl = await uploadImage(mainImageFile);
        if (!mainImageUrl) {
          setIsLoading(false);
          return;
        }
      }

      let galleryImageUrls: string[] = [];
      if (galleryFiles.length > 0) {
        const uploadPromises = galleryFiles.map(file => uploadImage(file));
        const urls = await Promise.all(uploadPromises);
        galleryImageUrls = urls.filter((url): url is string => url !== null);

        if (galleryImageUrls.length !== galleryFiles.length) {
          toast.error("Some gallery images failed to upload. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      const projectsSnapshot = await getDocs(collection(db, "projects"));
      const currentCount = projectsSnapshot.size;

      await addDoc(collection(db, "projects"), {
        ...formData,
        mainImage: mainImageUrl,
        gallery: galleryImageUrls,
        features: formData.features.split(",").map((item) => item.trim()),
        techStack: formData.techStack.split(",").map((item) => item.trim()),
        learnings: formData.learnings.split(",").map((item) => item.trim()),
        tags: formData.tags.split(",").map((item) => item.trim()),
        order: currentCount,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      toast.success("Project created successfully!")
      router.push("/admin/projects")
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Failed to create project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FolderOpen className="w-6 h-6 mr-2 text-green-400" />
              Add New Project
            </CardTitle>
            <CardDescription className="text-gray-400">Fill in the details to add a new project to your portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Basic Info */}
              <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Project Title *</Label>
                    <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required className="bg-gray-700 border-gray-600" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="text-white">Tagline</Label>
                    <Input id="tagline" value={formData.tagline} onChange={(e) => handleInputChange("tagline", e.target.value)} className="bg-gray-700 border-gray-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} required rows={4} className="bg-gray-700 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Category</Label>
                  <Input id="category" value={formData.category} onChange={(e) => handleInputChange("category", e.target.value)} className="bg-gray-700 border-gray-600" />
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400">Media</h3>
                <div className="space-y-2">
                  <Label htmlFor="mainImage" className="text-white">Main Project Image</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {mainImagePreview ? <Image src={mainImagePreview} alt="Main preview" width={200} height={150} className="mx-auto h-24 w-auto object-contain rounded-md" /> : <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />}
                      <div className="flex text-sm text-gray-400"><label htmlFor="mainImage" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-green-400 hover:text-green-500 px-2 py-1"><span>Upload main image</span><Input id="mainImage" name="mainImage" type="file" className="sr-only" onChange={handleMainImageChange} accept="image/*" /></label></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gallery" className="text-white">Image Gallery</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {galleryPreviews.length > 0 ? (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {galleryPreviews.map((src, idx) => <Image key={idx} src={src} alt={`Gallery preview ${idx + 1}`} width={100} height={80} className="h-20 w-auto object-contain rounded-md" />)}
                        </div>
                      ) : <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />}
                      <div className="flex text-sm text-gray-400"><label htmlFor="gallery" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-green-400 hover:text-green-500 px-2 py-1"><span>Upload gallery images</span><Input id="gallery" name="gallery" type="file" multiple className="sr-only" onChange={handleGalleryChange} accept="image/*" /></label></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label htmlFor="features" className="text-white flex items-center"><Layers className="w-4 h-4 mr-2" />Features (comma-separated)</Label><Textarea id="features" value={formData.features} onChange={(e) => handleInputChange("features", e.target.value)} className="bg-gray-700 border-gray-600" /></div>
                  <div className="space-y-2"><Label htmlFor="techStack" className="text-white flex items-center"><Layers className="w-4 h-4 mr-2" />Tech Stack (comma-separated)</Label><Textarea id="techStack" value={formData.techStack} onChange={(e) => handleInputChange("techStack", e.target.value)} className="bg-gray-700 border-gray-600" /></div>
                  <div className="space-y-2"><Label htmlFor="timeline" className="text-white flex items-center"><Calendar className="w-4 h-4 mr-2" />Timeline</Label><Input id="timeline" value={formData.timeline} onChange={(e) => handleInputChange("timeline", e.target.value)} className="bg-gray-700 border-gray-600" /></div>
                  <div className="space-y-2"><Label htmlFor="role" className="text-white flex items-center"><User className="w-4 h-4 mr-2" />Role</Label><Input id="role" value={formData.role} onChange={(e) => handleInputChange("role", e.target.value)} className="bg-gray-700 border-gray-600" /></div>
                  <div className="space-y-2"><Label htmlFor="learnings" className="text-white flex items-center"><Lightbulb className="w-4 h-4 mr-2" />Learnings (comma-separated)</Label><Textarea id="learnings" value={formData.learnings} onChange={(e) => handleInputChange("learnings", e.target.value)} className="bg-gray-700 border-gray-600" /></div>
                  <div className="space-y-2"><Label htmlFor="tags" className="text-white flex items-center"><Tag className="w-4 h-4 mr-2" />Tags (comma-separated)</Label><Input id="tags" value={formData.tags} onChange={(e) => handleInputChange("tags", e.target.value)} className="bg-gray-700 border-gray-600" /></div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400">Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label htmlFor="demoUrl" className="text-white">Live Demo URL</Label><Input id="demoUrl" type="url" value={formData.demoUrl} onChange={(e) => handleInputChange("demoUrl", e.target.value)} className="bg-gray-700 border-gray-600" /></div>
                  <div className="space-y-2"><Label htmlFor="githubFrontend" className="text-white">GitHub Frontend</Label><Input id="githubFrontend" type="url" value={formData.githubFrontend} onChange={(e) => handleInputChange("githubFrontend", e.target.value)} className="bg-gray-700 border-gray-600" /></div>
                  <div className="space-y-2"><Label htmlFor="githubBackend" className="text-white">GitHub Backend</Label><Input id="githubBackend" type="url" value={formData.githubBackend} onChange={(e) => handleInputChange("githubBackend", e.target.value)} className="bg-gray-700 border-gray-600" /></div>
                </div>
              </div>


              <div className="flex items-center justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={() => router.back()} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
                <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  {isLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Creating...</>) : (<><Save className="w-4 h-4 mr-2" />Create Project</>)}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

