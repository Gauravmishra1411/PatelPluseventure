"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Edit, User } from "lucide-react"
import { toast } from "sonner"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"

export default function EditUserPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        role: "User",
        status: "Active",
    })

    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!id) return;
                const docRef = doc(db, "users", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        location: data.location || "",
                        role: data.role || "User",
                        status: data.status || "Active",
                    });
                } else {
                    toast.error("User not found");
                    router.push("/admin/users");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                toast.error("Failed to fetch user details");
            } finally {
                setIsFetching(false);
            }
        };

        fetchUser();
    }, [id, router]);


    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const docRef = doc(db, "users", id);
            await updateDoc(docRef, {
                ...formData,
                updatedAt: serverTimestamp(),
            })

            toast.success("User updated successfully!")
            router.push("/admin/users")
        } catch (error) {
            console.error("Error updating user:", error)
            toast.error("Failed to update user. Please try again.")
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
            <div className="max-w-2xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
                </Button>
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center">
                            <Edit className="w-6 h-6 mr-2 text-primary" />
                            Edit User
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Update profile details for this user.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                                    <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required className="bg-input border-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required className="bg-input border-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="bg-input border-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-foreground">Location</Label>
                                    <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} className="bg-input border-border" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-foreground">Role</Label>
                                        <Select value={formData.role} onValueChange={(val) => handleInputChange("role", val)}>
                                            <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-popover border-border">
                                                <SelectItem value="User">User</SelectItem>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                                <SelectItem value="Editor">Editor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-foreground">Status</Label>
                                        <Select value={formData.status} onValueChange={(val) => handleInputChange("status", val)}>
                                            <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-popover border-border">
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-4">
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
