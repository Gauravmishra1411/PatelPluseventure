
"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Save, UploadCloud, User, Briefcase, Building, MessageSquare, Award, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { db, auth } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function AddTestimonialPage() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    quote: "",
    project: "",
    results: "",
    rating: "5",
    category: "Web Development",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
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
    setIsLoading(true)

    const currentUser = auth.currentUser
    if (!currentUser) {
      toast.error("You must be logged in to add a testimonial.")
      setIsLoading(false)
      return
    }

    try {
      let imageUrl = ""
      if (imageFile) {
        imageUrl = (await uploadImage(imageFile)) || ""
      }

      await addDoc(collection(db, "testimonials"), {
        ...formData,
        rating: parseInt(formData.rating, 10),
        src: imageUrl,
        createdAt: serverTimestamp(),
      })

      toast.success("Testimonial created successfully!")
      router.push("/admin/testimonials")
    } catch (error) {
      console.error("Error creating testimonial:", error)
      toast.error("Failed to create testimonial. Please try again.")
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
              <Star className="w-6 h-6 mr-2 text-yellow-400" />
              Add New Testimonial
            </CardTitle>
            <CardDescription className="text-gray-400">
              Share a new client success story to feature on your site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center">
                      <User className="w-4 h-4 mr-2" /> Client Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" /> Role *
                    </Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center">
                      <Building className="w-4 h-4 mr-2" /> Company Name *
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center">
                      <Tag className="w-4 h-4 mr-2" /> Category *
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating" className="flex items-center">
                      <Star className="w-4 h-4 mr-2" /> Rating *
                    </Label>
                    <Select
                      value={formData.rating}
                      onValueChange={(value) => handleInputChange("rating", value)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <SelectItem key={r} value={String(r)} className="text-white hover:bg-gray-700">
                            <div className="flex items-center">
                              {r} {r > 1 ? "Stars" : "Star"}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Right Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quote" className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" /> Quote *
                    </Label>
                    <Textarea
                      id="quote"
                      value={formData.quote}
                      onChange={(e) => handleInputChange("quote", e.target.value)}
                      required
                      rows={4}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project" className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" /> Project Name *
                    </Label>
                     <Input
                      id="project"
                      value={formData.project}
                      onChange={(e) => handleInputChange("project", e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="results" className="flex items-center">
                      <Award className="w-4 h-4 mr-2" /> Project Results *
                    </Label>
                    <Textarea
                      id="results"
                      value={formData.results}
                      onChange={(e) => handleInputChange("results", e.target.value)}
                      required
                      rows={2}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Client Image</Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Client preview"
                            width={100}
                            height={100}
                            className="mx-auto h-24 w-24 object-cover rounded-full"
                          />
                        ) : (
                          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-400">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-yellow-400 hover:text-yellow-500 px-2 py-1"
                          >
                            <span>Upload image</span>
                            <Input
                              id="image"
                              name="image"
                              type="file"
                              className="sr-only"
                              onChange={handleImageChange}
                              accept="image/*"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-700">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Testimonial
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

    