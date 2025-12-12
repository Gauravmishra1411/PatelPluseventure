
"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Mail, Phone, MapPin, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "active",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await addDoc(collection(db, "users"), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      toast.success("User created successfully!")

      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        status: "active",
      })

      setTimeout(() => {
        router.push("/admin/users")
      }, 1500)
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Failed to create user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                User Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                Fill in the details to create a new user account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                        Full Name *
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                        id="name"
                        type="text"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        required
                        />
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                        Email Address *
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        required
                        />
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                        Phone Number
                    </Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        />
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">
                        Location
                    </Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                        id="location"
                        type="text"
                        placeholder="Enter location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        />
                    </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="status" className="text-white">
                        Status
                    </Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="active" className="text-white hover:bg-gray-600">
                            Active
                        </SelectItem>
                        <SelectItem value="pending" className="text-white hover:bg-gray-600">
                            Pending
                        </SelectItem>
                        <SelectItem value="inactive" className="text-white hover:bg-gray-600">
                            Inactive
                        </SelectItem>
                        </SelectContent>
                    </Select>
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
                    <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                    {isLoading ? (
                        <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                        </>
                    ) : (
                        <>
                        <Save className="w-4 h-4 mr-2" />
                        Create User
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
