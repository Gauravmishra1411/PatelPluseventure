
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Package } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Product {
    id: string;
    title: string;
}

interface SectionData {
    title: string;
    layout: 'slider' | 'grid';
    loop: boolean;
    autoplay: boolean;
    products: string[];
}

export default function EditSectionPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const sectionId = id as string;

    const [section, setSection] = useState<Partial<SectionData>>({});
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!sectionId) return;
        
        // Fetch the section data
        const sectionRef = doc(db, "marketplace_sections", sectionId);
        const unsubSection = onSnapshot(sectionRef, (docSnap) => {
            if (docSnap.exists()) {
                setSection(docSnap.data() as SectionData);
            } else {
                toast.error("Section not found.");
                router.push('/admin/marketplace/customize');
            }
            setLoading(false);
        });

        // Fetch all products
        const productsRef = collection(db, "marketplace_products");
        const unsubProducts = onSnapshot(productsRef, (snapshot) => {
            const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title }));
            setAllProducts(fetchedProducts);
        });

        return () => {
            unsubSection();
            unsubProducts();
        };

    }, [sectionId, router]);

    const handleProductSelection = (productId: string, checked: boolean) => {
        setSection(prev => {
            const currentProducts = prev?.products || [];
            if (checked) {
                return { ...prev, products: [...currentProducts, productId] };
            } else {
                return { ...prev, products: currentProducts.filter(id => id !== productId) };
            }
        });
    }

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const sectionRef = doc(db, "marketplace_sections", sectionId);
            await updateDoc(sectionRef, {
                ...section,
                updatedAt: serverTimestamp()
            });
            toast.success("Section updated successfully!");
        } catch (error) {
            toast.error("Failed to update section.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    if (loading) {
        return <div className="p-8">Loading section details...</div>
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4">
                <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2"/> Back to Customization</Button>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Section Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Section Title</Label>
                                <Input value={section.title || ''} onChange={e => setSection({...section, title: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Layout</Label>
                                <Select value={section.layout} onValueChange={(v: 'slider' | 'grid') => setSection({...section, layout: v})}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="slider">Slider</SelectItem>
                                        <SelectItem value="grid">Grid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {section.layout === 'slider' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Slider Options</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between"><Label>Loop</Label><Switch checked={section.loop} onCheckedChange={c => setSection({...section, loop: c})} /></div>
                                <div className="flex items-center justify-between"><Label>Autoplay</Label><Switch checked={section.autoplay} onCheckedChange={c => setSection({...section, autoplay: c})} /></div>
                            </CardContent>
                        </Card>
                    )}
                     <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4 mr-2"/>}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
                
                {/* Right Column - Product Selection */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Package/> Select Products</CardTitle>
                            <CardDescription>Choose which products to display in this section.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-96 w-full rounded-md border p-4">
                                <div className="space-y-2">
                                    {allProducts.map(product => (
                                        <div key={product.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                                            <Checkbox 
                                                id={`product-${product.id}`}
                                                checked={section.products?.includes(product.id)}
                                                onCheckedChange={c => handleProductSelection(product.id, c as boolean)}
                                            />
                                            <Label htmlFor={`product-${product.id}`} className="font-normal">{product.title}</Label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

