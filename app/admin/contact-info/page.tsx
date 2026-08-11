"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Loader2 } from "lucide-react"

export default function AdminContactInfoPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [contactInfo, setContactInfo] = useState({
        email: "",
        phone: "",
        address: "",
        city_pin: "",
        workingHours: "",
        weekendStatus: ""
    })

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const docRef = doc(db, "settings", "contact_info")
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setContactInfo(docSnap.data() as any)
                } else {
                    // Pre-fill with existing hardcoded defaults if doc doesn't exist
                    setContactInfo({
                        email: "contact@patelpulseventures.com",
                        phone: "+91 7838130064, +91 1205106926",
                        address: "OC1125, 11th Floor, Gaur city center, sector 4",
                        city_pin: "Greater Noida West, 201318",
                        workingHours: "Mon - Fri, 10AM - 7PM IST",
                        weekendStatus: "Weekend Closed"
                    })
                }
            } catch (error) {
                console.error("Error fetching contact info:", error)
                toast.error("Failed to load contact information.")
            } finally {
                setLoading(false)
            }
        }

        fetchContactInfo()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setContactInfo((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await setDoc(doc(db, "settings", "contact_info"), contactInfo)
            toast.success("Contact information updated successfully!")
        } catch (error) {
            console.error("Error saving contact info:", error)
            toast.error("Failed to update contact information.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contact Information</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage the contact details displayed across the website (Contact Page, Footer, etc.).
                    </p>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle>Edit Details</CardTitle>
                        <CardDescription>Update your public-facing contact information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={contactInfo.email}
                                        onChange={handleInputChange}
                                        placeholder="contact@example.com"
                                        required
                                        className="bg-input border-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Numbers</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        value={contactInfo.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 1234567890, +91 0987654321"
                                        required
                                        className="bg-input border-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address (Line 1)</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={contactInfo.address}
                                        onChange={handleInputChange}
                                        placeholder="Office number, Building, Street"
                                        required
                                        className="bg-input border-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city_pin">City & PIN Code (Line 2)</Label>
                                    <Input
                                        id="city_pin"
                                        name="city_pin"
                                        type="text"
                                        value={contactInfo.city_pin}
                                        onChange={handleInputChange}
                                        placeholder="City, State, 123456"
                                        required
                                        className="bg-input border-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="workingHours">Working Hours</Label>
                                    <Input
                                        id="workingHours"
                                        name="workingHours"
                                        type="text"
                                        value={contactInfo.workingHours}
                                        onChange={handleInputChange}
                                        placeholder="Mon - Fri, 10AM - 7PM IST"
                                        required
                                        className="bg-input border-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weekendStatus">Weekend Status</Label>
                                    <Input
                                        id="weekendStatus"
                                        name="weekendStatus"
                                        type="text"
                                        value={contactInfo.weekendStatus}
                                        onChange={handleInputChange}
                                        placeholder="Weekend Closed"
                                        required
                                        className="bg-input border-input"
                                    />
                                </div>
                            </div>
                            
                            <Button 
                                type="submit" 
                                disabled={saving}
                                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Contact Information
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
