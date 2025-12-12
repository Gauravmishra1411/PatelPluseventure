
"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, Save, UploadCloud, User, Briefcase, Building, MessageSquare, Award, ThumbsUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { db, auth } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"
import { useAuth } from "@/hooks/useAuth"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"

export default function LeaveReviewPage() {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    company: "",
    quote: "",
    project: "",
    results: "",
    rating: 5,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }
      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error(`Failed to upload ${file.name}`)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("You must be logged in to leave a review.");
      return;
    }
    setIsLoading(true)

    try {
      let imageUrl = ""
      if (imageFile) {
        imageUrl = (await uploadImage(imageFile)) || ""
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userName = userDoc.exists() ? userDoc.data().name : "Anonymous";

      const testimonialData = {
        ...formData,
        rating: formData.rating,
        src: imageUrl,
        name: userName,
        role: 'Client', // Or get this from user profile
        email: user.email,
        userId: user.uid,
        status: 'pending' as const,
        createdAt: serverTimestamp(),
      };

      const testimonialDocRef = await addDoc(collection(db, "testimonials"), testimonialData);

      await addDoc(collection(db, "notifications"), {
        type: 'new_testimonial',
        message: `New testimonial from ${userName} for project: ${formData.project}`,
        link: `/admin/testimonials`,
        isRead: false,
        createdAt: serverTimestamp(),
        senderInfo: {
          name: userName,
          email: user.email,
        }
      });

      toast.success("Review submitted! Thank you for your feedback.")
      router.push("/marketplace/profile")
    } catch (error) {
      console.error("Error creating testimonial:", error)
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <ThumbsUp className="w-6 h-6 mr-2 text-primary" />
                Leave a Review
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Share your experience to help others and us improve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating" className="flex items-center">
                        <Star className="w-4 h-4 mr-2" /> Your Rating *
                      </Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-7 h-7 cursor-pointer transition-colors ${formData.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                            onClick={() => handleInputChange('rating', star)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center">
                        <Building className="w-4 h-4 mr-2" /> Company Name *
                      </Label>
                      <Input id="company" value={formData.company} onChange={(e) => handleInputChange("company", e.target.value)} required className="bg-background/50 border-input" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project" className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" /> Project Name *
                      </Label>
                      <Input id="project" value={formData.project} onChange={(e) => handleInputChange("project", e.target.value)} required className="bg-background/50 border-input" />
                    </div>
                    <div className="space-y-2">
                      <Label>Your Image</Label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <Image src={imagePreview} alt="Client preview" width={100} height={100} className="mx-auto h-24 w-24 object-cover rounded-full" />
                          ) : (<UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />)}
                          <div className="flex text-sm text-muted-foreground">
                            <label htmlFor="image" className="relative cursor-pointer bg-secondary/10 rounded-md font-medium text-primary hover:text-primary/80 px-2 py-1">
                              <span>Upload image</span>
                              <Input id="image" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="quote" className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" /> Your Quote *
                      </Label>
                      <Textarea id="quote" value={formData.quote} onChange={(e) => handleInputChange("quote", e.target.value)} required rows={6} className="bg-background/50 border-input" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="results" className="flex items-center">
                        <Award className="w-4 h-4 mr-2" /> Project Results *
                      </Label>
                      <Textarea id="results" value={formData.results} onChange={(e) => handleInputChange("results", e.target.value)} required rows={4} className="bg-background/50 border-input" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6">
                  <Button type="button" variant="outline" onClick={() => router.back()} className="border-border text-muted-foreground hover:bg-secondary">Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {isLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>Submitting...</>) : (<><Save className="w-4 h-4 mr-2" />Submit Review</>)}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
