"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, doc, getDoc, updateDoc, addDoc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Save, Plus } from "lucide-react"
import Image from "next/image"

export default function AdminTendersPage() {
    const [loading, setLoading] = useState(true)

    // Header State
    const [headerData, setHeaderData] = useState({ heading: "", subheading: "", description: "", image: "" })
    const [headerImageFile, setHeaderImageFile] = useState<File | null>(null)
    const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(null)

    // Tenders List State
    const [tendersList, setTendersList] = useState<any[]>([])
    const [currentTender, setCurrentTender] = useState<{
        id: string | null;
        title: string;
        url: string;
        category: string;
        bulletPoints: string;
    }>({ id: null, title: "", url: "", category: "Government Tenders", bulletPoints: "" })
    const [isEditingTender, setIsEditingTender] = useState(false)

    // Fetch data
    useEffect(() => {
        setLoading(true);
        const unsubscribers: (() => void)[] = [];

        const fetchAndSubscribe = async () => {
            try {
                // Fetch Header Data
                const headerDoc = await getDoc(doc(db, "tenders_header", "main"));
                if (headerDoc.exists()) {
                    const data = headerDoc.data();
                    setHeaderData({
                        heading: data.heading || "",
                        subheading: data.subheading || "",
                        description: data.description || "",
                        image: data.image || ""
                    });
                    setHeaderImagePreview(data.image || null);
                }

                // Subscribe to Tenders List
                const listUnsub = onSnapshot(collection(db, "tenders_list"), (snapshot) => {
                    setTendersList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                });
                unsubscribers.push(listUnsub);

            } catch (error) {
                console.error("Error fetching tenders data:", error);
                toast.error("Failed to load tenders data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAndSubscribe();

        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, []);

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error(`Failed to upload ${file.name}`);
            return null;
        }
    };

    const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeaderImageFile(file);
            setHeaderImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveHeader = async () => {
        try {
            let imageUrl = headerData.image;
            if (headerImageFile) {
                const uploadedUrl = await uploadImage(headerImageFile);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }
            await setDoc(doc(db, "tenders_header", "main"), { ...headerData, image: imageUrl }, { merge: true });
            toast.success("Header updated successfully!");
            
            // Update local state with the new image URL just in case
            if (imageUrl !== headerData.image) {
                setHeaderData(prev => ({...prev, image: imageUrl}))
            }

        } catch (error) {
            toast.error("Failed to update header.");
            console.error(error);
        }
    };

    const handleTenderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const bulletPointsArray = typeof currentTender.bulletPoints === 'string' 
                ? currentTender.bulletPoints.split('\\n').filter(p => p.trim() !== '')
                : currentTender.bulletPoints;

            if (isEditingTender && currentTender.id) {
                const { id, ...tenderData } = { ...currentTender, bulletPoints: bulletPointsArray };
                await updateDoc(doc(db, "tenders_list", currentTender.id), tenderData);
                toast.success("Tender updated successfully!");
            } else {
                const { id, ...tenderData } = { ...currentTender, bulletPoints: bulletPointsArray };
                await addDoc(collection(db, "tenders_list"), tenderData);
                toast.success("Tender added successfully!");
            }

            setCurrentTender({ id: null, title: "", url: "", category: "Government Tenders", bulletPoints: "" });
            setIsEditingTender(false);
        } catch (error) {
            console.error("Error saving tender:", error);
            toast.error(`Failed to ${isEditingTender ? 'update' : 'add'} tender.`);
        }
    };

    const handleEditTender = (tender: any) => {
        setCurrentTender({ 
            ...tender, 
            bulletPoints: Array.isArray(tender.bulletPoints) ? tender.bulletPoints.join('\\n') : tender.bulletPoints || "" 
        });
        setIsEditingTender(true);
    };

    const handleDeleteTender = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this tender?")) {
            await deleteDoc(doc(db, "tenders_list", id));
            toast.success("Tender deleted.");
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading Tenders Data...</div>
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-center">Manage Tenders & Procurement Page</h1>


                {/* Tenders List Section */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle>Tenders List</CardTitle>
                        <CardDescription className="text-muted-foreground">Manage links for Government and Private tenders.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">{isEditingTender ? 'Edit' : 'Add'} Tender Link</h3>
                            <form onSubmit={handleTenderSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tender-category" className="text-foreground">Category</Label>
                                    <Select value={currentTender.category} onValueChange={(val) => setCurrentTender(p => ({ ...p, category: val }))}>
                                        <SelectTrigger className="bg-input border-input text-foreground"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="Government Tenders" className="text-foreground hover:bg-secondary">Government Tenders</SelectItem>
                                            <SelectItem value="Private Tenders" className="text-foreground hover:bg-secondary">Private Tenders</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tender-title" className="text-foreground">Title</Label>
                                    <Input id="tender-title" value={currentTender.title} onChange={e => setCurrentTender(p => ({ ...p, title: e.target.value }))} required className="bg-input border-input text-foreground" placeholder="e.g., GeM (Government e-Marketplace)" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tender-url" className="text-foreground">URL</Label>
                                    <Input id="tender-url" type="url" value={currentTender.url} onChange={e => setCurrentTender(p => ({ ...p, url: e.target.value }))} className="bg-input border-input text-foreground" placeholder="https://" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tender-bulletPoints" className="text-foreground">Bullet Points (One per line)</Label>
                                    <Textarea id="tender-bulletPoints" value={currentTender.bulletPoints} onChange={e => setCurrentTender(p => ({ ...p, bulletPoints: e.target.value }))} rows={4} className="bg-input border-input text-foreground" placeholder="Products aur services ke government orders.&#10;Bid aur reverse auction dono milte hain." />
                                </div>
                                
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">{isEditingTender ? 'Update' : 'Add'} Tender</Button>
                                {isEditingTender && <Button type="button" variant="ghost" className="text-muted-foreground hover:text-foreground ml-2" onClick={() => { setIsEditingTender(false); setCurrentTender({ id: null, title: "", url: "", category: "Government Tenders", bulletPoints: "" }); }}>Cancel</Button>}
                            </form>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Existing Tenders</h3>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {["Government Tenders", "Private Tenders"].map(category => {
                                    const items = tendersList.filter(t => t.category === category);
                                    if (items.length === 0) return null;
                                    
                                    return (
                                        <div key={category} className="space-y-2">
                                            <h4 className="font-bold text-primary">{category}</h4>
                                            {items.map(tender => (
                                                <div key={tender.id} className="flex flex-col p-3 bg-secondary/50 rounded-md gap-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-semibold text-foreground">{tender.title}</p>
                                                            {tender.url && <a href={tender.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">{tender.url}</a>}
                                                        </div>
                                                        <div className="space-x-1 shrink-0">
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleEditTender(tender)}><Edit className="w-4 h-4" /></Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive/90" onClick={() => handleDeleteTender(tender.id)}><Trash2 className="w-4 h-4" /></Button>
                                                        </div>
                                                    </div>
                                                    {tender.bulletPoints && tender.bulletPoints.length > 0 && (
                                                        <ul className="list-disc pl-4 text-sm text-muted-foreground">
                                                            {tender.bulletPoints.map((bp: string, i: number) => (
                                                                <li key={i}>{bp}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                })}
                                {tendersList.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No tenders added yet.</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
