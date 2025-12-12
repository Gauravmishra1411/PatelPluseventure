"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2, RotateCcw, Save } from "lucide-react"

interface ThemeColors {
    primary: string
    accent: string
    background: string
    secondaryBackground: string
}

interface ThemeConfig {
    light: ThemeColors
    dark: ThemeColors
}

// Default "Toxic Green" Theme
const defaultTheme: ThemeConfig = {
    light: {
        primary: "#1A532A",
        accent: "#8ED968",
        background: "#ffffff",
        secondaryBackground: "#f9fafb"
    },
    dark: {
        primary: "#1A532A",
        accent: "#8ED968",
        background: "#020617",
        secondaryBackground: "#1A532A" // Used for cards/overlays with opacity
    }
}

export default function SettingsPage() {
    const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchTheme()
    }, [])

    const fetchTheme = async () => {
        try {
            const docRef = doc(db, "settings", "theme")
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setTheme(docSnap.data() as ThemeConfig)
            }
        } catch (error) {
            console.error("Error fetching theme:", error)
            toast.error("Failed to load theme settings")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await setDoc(doc(db, "settings", "theme"), theme)
            toast.success("Theme updated successfully! Changes will reflect immediately.")
        } catch (error) {
            console.error("Error saving theme:", error)
            toast.error("Failed to save theme settings")
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        setTheme(defaultTheme)
        toast.info("Reset to default values. Click Save to apply.")
    }

    const updateColor = (mode: "light" | "dark", key: keyof ThemeColors, value: string) => {
        setTheme(prev => ({
            ...prev,
            [mode]: {
                ...prev[mode],
                [key]: value
            }
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Theme Customization</h1>
                <p className="text-muted-foreground">Customize the colors for Light and Dark mode across the entire application.</p>
            </div>

            <Tabs defaultValue="dark" className="w-full">
                <TabsList className="bg-secondary border-border text-muted-foreground">
                    <TabsTrigger value="dark">Dark Mode</TabsTrigger>
                    <TabsTrigger value="light">Light Mode</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    {["dark", "light"].map((mode) => (
                        <TabsContent key={mode} value={mode}>
                            <Card className="bg-card/40 border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground capitalize">{mode} Mode Colors</CardTitle>
                                    <CardDescription>
                                        Configure the color palette for {mode} mode.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-foreground">Primary Color</Label>
                                            <div className="flex gap-4">
                                                <Input
                                                    type="color"
                                                    value={theme[mode as "light" | "dark"].primary}
                                                    onChange={(e) => updateColor(mode as "light" | "dark", "primary", e.target.value)}
                                                    className="w-16 h-12 p-1 bg-transparent border-input"
                                                />
                                                <Input
                                                    type="text"
                                                    value={theme[mode as "light" | "dark"].primary}
                                                    onChange={(e) => updateColor(mode as "light" | "dark", "primary", e.target.value)}
                                                    className="bg-input border-input text-foreground"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Used for gradients, borders, and main accents.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-foreground">Accent/Highlight Color</Label>
                                            <div className="flex gap-4">
                                                <Input
                                                    type="color"
                                                    value={theme[mode as "light" | "dark"].accent}
                                                    onChange={(e) => updateColor(mode as "light" | "dark", "accent", e.target.value)}
                                                    className="w-16 h-12 p-1 bg-transparent border-input"
                                                />
                                                <Input
                                                    type="text"
                                                    value={theme[mode as "light" | "dark"].accent}
                                                    onChange={(e) => updateColor(mode as "light" | "dark", "accent", e.target.value)}
                                                    className="bg-input border-input text-foreground"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Used for text highlights, icons, and active states.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-foreground">Background Color</Label>
                                            <div className="flex gap-4">
                                                <Input
                                                    type="color"
                                                    value={theme[mode as "light" | "dark"].background}
                                                    onChange={(e) => updateColor(mode as "light" | "dark", "background", e.target.value)}
                                                    className="w-16 h-12 p-1 bg-transparent border-input"
                                                />
                                                <Input
                                                    type="text"
                                                    value={theme[mode as "light" | "dark"].background}
                                                    onChange={(e) => updateColor(mode as "light" | "dark", "background", e.target.value)}
                                                    className="bg-input border-input text-foreground"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Section */}
                                    <div className="mt-8 p-6 rounded-xl border border-dashed border-gray-700" style={{ backgroundColor: theme[mode as "light" | "dark"].background }}>
                                        <h4 className="mb-4 font-semibold" style={{ color: theme[mode as "light" | "dark"].accent }}>Preview</h4>
                                        <div className="flex gap-4 items-center">
                                            <button
                                                className="px-4 py-2 rounded-lg font-medium"
                                                style={{
                                                    background: `linear-gradient(to right, ${theme[mode as "light" | "dark"].primary}, ${theme[mode as "light" | "dark"].accent})`,
                                                    color: mode === 'dark' ? 'white' : 'black'
                                                }}
                                            >
                                                Gradient Button
                                            </button>
                                            <div
                                                className="p-4 rounded-lg border"
                                                style={{
                                                    borderColor: `${theme[mode as "light" | "dark"].accent}33`, // 20% opacity approx
                                                    backgroundColor: `${theme[mode as "light" | "dark"].primary}1A` // 10% opacity approx
                                                }}
                                            >
                                                <span style={{ color: theme[mode as "light" | "dark"].accent }}>Card Content</span>
                                            </div>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>

            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleReset} className="border-border text-foreground hover:bg-secondary">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Default
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>
        </div>
    )
}
