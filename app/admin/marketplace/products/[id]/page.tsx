
"use client"
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Youtube, Link as LinkIcon, Plus, Trash2, Wand2, ArrowLeft, ImageIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, onSnapshot, collection, serverTimestamp, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";


type FormData = {
    title: string;
    shortDesc: string;
    longDesc: string;
    mainImageUrl?: string;
    galleryUrls?: string[];
    youtubeLink: string;
    category: string;
    regularPrice: string;
    salePrice: string;
    livePreviewLink: string;
    features: string;
    techSpecs: string;
    whatsIncluded: string;
    howToUse: string;
    license: string;
    sku: string;
    tags: string;
    status: 'draft' | 'published' | 'archived';
    relatedProducts: string[];
    moreFromCreator: string[];
    exploreCategories: string[];
    coupon?: string;
}

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    title: string;
}

interface Discount {
    id: string;
    code: string;
}

export default function AdminProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [formData, setFormData] = useState<FormData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (!id) return;
        const docRef = doc(db, "marketplace_products", id as string);
        const unsub = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    ...data,
                    features: Array.isArray(data.features) ? data.features.join(', ') : '',
                    techSpecs: Array.isArray(data.techSpecs) ? data.techSpecs.join(', ') : '',
                    whatsIncluded: Array.isArray(data.whatsIncluded) ? data.whatsIncluded.join(', ') : '',
                    tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
                    relatedProducts: data.relatedProducts || [],
                    moreFromCreator: data.moreFromCreator || [],
                    exploreCategories: data.exploreCategories || [],
                } as FormData);
            } else {
                toast.error("Product not found.");
                router.push('/admin/marketplace/products');
            }
            setLoading(false);
        });
        return () => unsub();
    }, [id, router]);

    useEffect(() => {
        const categoriesUnsub = onSnapshot(collection(db, "marketplace_categories"), (snapshot) => {
            setCategories(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
        });

        const discountsUnsub = onSnapshot(collection(db, "marketplace_discounts"), (snapshot) => {
            setDiscounts(snapshot.docs.map(doc => ({ id: doc.id, code: doc.data().code })));
        });

        const productsUnsub = onSnapshot(collection(db, "marketplace_products"), (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title })));
        });

        return () => {
            categoriesUnsub();
            discountsUnsub();
            productsUnsub();
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
    };

    const handleSelectChange = (name: keyof FormData, value: any) => {
        if (!formData) return;
        setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
    }

    const handleMultiSelectChange = (field: keyof FormData, id: string, checked: boolean) => {
        if (!formData) return;
        setFormData(prev => {
            if (!prev) return null;
            const currentValues = prev[field] as string[] || [];
            if (checked) {
                return { ...prev, [field]: [...currentValues, id] };
            } else {
                return { ...prev, [field]: currentValues.filter(val => val !== id) };
            }
        });
    }

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData || !id) return;
        setIsSaving(true);
        try {
            const productRef = doc(db, "marketplace_products", id as string);
            const dataToSave = {
                ...formData,
                features: formData.features.split(',').map(s => s.trim()),
                techSpecs: formData.techSpecs.split(',').map(s => s.trim()),
                whatsIncluded: formData.whatsIncluded.split(',').map(s => s.trim()),
                tags: formData.tags.split(',').map(s => s.trim()),
                updatedAt: serverTimestamp(),
            }
            await updateDoc(productRef, dataToSave);
            toast.success("Product updated successfully!");
        } catch (error) {
            toast.error("Failed to update product.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    const handleDeleteProduct = async () => {
        if (!window.confirm("Are you sure you want to delete this product permanently?")) return;
        try {
            await deleteDoc(doc(db, "marketplace_products", id as string));
            toast.success("Product deleted.");
            router.push("/admin/marketplace/products");
        } catch (error) {
            toast.error("Failed to delete product.");
        }
    }

    if (loading || !formData) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
            </Button>
            <form onSubmit={handleSaveChanges} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Product</CardTitle>
                                <CardDescription>Editing product: {formData.title}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label>Title</Label><Input name="title" value={formData.title} onChange={handleInputChange} /></div>
                                <div className="space-y-2"><Label>Short Description</Label><Textarea name="shortDesc" value={formData.shortDesc} onChange={handleInputChange} rows={2} /></div>
                                <div className="space-y-2"><Label>Long Description</Label><Textarea name="longDesc" value={formData.longDesc} onChange={handleInputChange} rows={6} /></div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Media</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Main Image</Label>
                                    {formData.mainImageUrl && <Image src={formData.mainImageUrl} alt="Main image" width={150} height={150} className="rounded-md border" />}
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-400"><label htmlFor="main-image" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-green-400 hover:text-green-500 px-2 py-1"><span>Upload new image</span><Input id="main-image" name="mainImage" type="file" className="sr-only" accept="image/*" /></label></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Image Gallery</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.galleryUrls?.map((url, i) => <Image key={i} src={url} alt={`Gallery ${i}`} width={100} height={100} className="rounded-md border" />)}
                                    </div>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-400"><label htmlFor="gallery" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-green-400 hover:text-green-500 px-2 py-1"><span>Upload gallery images</span><Input id="gallery" name="gallery" type="file" multiple className="sr-only" accept="image/*" /></label></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2"><Label>YouTube Video Link</Label><Input name="youtubeLink" value={formData.youtubeLink} onChange={handleInputChange} placeholder="https://youtube.com/watch?v=..." /></div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Features & Specs</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label>Features (comma-separated)</Label><Textarea name="features" value={formData.features} onChange={handleInputChange} /></div>
                                <div className="space-y-2"><Label>Tech Specs (comma-separated)</Label><Textarea name="techSpecs" value={formData.techSpecs} onChange={handleInputChange} /></div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Content & Usage</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label className="text-foreground">What&apos;s Included (comma-separated)</Label><Textarea name="whatsIncluded" value={formData.whatsIncluded} onChange={handleInputChange} className="bg-input border-input text-foreground" /></div>
                                <div className="space-y-2"><Label>How To Use / Installation</Label><Textarea name="howToUse" value={formData.howToUse} onChange={handleInputChange} /></div>
                                <div className="space-y-2"><Label>License</Label><Textarea name="license" value={formData.license} onChange={handleInputChange} /></div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Related Content</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="text-sm font-medium text-slate-300 mb-2 block">You Might Also Like</Label>
                                    <ScrollArea className="h-40 w-full rounded-md border border-slate-600 p-4">
                                        {products.filter(p => p.id !== id).map(p => (
                                            <div key={p.id} className="flex items-center space-x-2 mb-2">
                                                <Checkbox id={`related-${p.id}`} onCheckedChange={c => handleMultiSelectChange('relatedProducts', p.id, c as boolean)} checked={formData.relatedProducts.includes(p.id)} />
                                                <Label htmlFor={`related-${p.id}`} className="font-normal text-slate-300">{p.title}</Label>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-slate-300 mb-2 block">More from Patel Pulse Ventures Studios</Label>
                                    <ScrollArea className="h-40 w-full rounded-md border border-slate-600 p-4">
                                        {products.filter(p => p.id !== id).map(p => (
                                            <div key={p.id} className="flex items-center space-x-2 mb-2">
                                                <Checkbox id={`creator-${p.id}`} onCheckedChange={c => handleMultiSelectChange('moreFromCreator', p.id, c as boolean)} checked={formData.moreFromCreator.includes(p.id)} />
                                                <Label htmlFor={`creator-${p.id}`} className="font-normal text-slate-300">{p.title}</Label>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-slate-300 mb-2 block">More to Explore (Categories)</Label>
                                    <ScrollArea className="h-40 w-full rounded-md border border-slate-600 p-4">
                                        {categories.map(c => (
                                            <div key={c.id} className="flex items-center space-x-2 mb-2">
                                                <Checkbox id={`explore-${c.id}`} onCheckedChange={ch => handleMultiSelectChange('exploreCategories', c.id, ch as boolean)} checked={formData.exploreCategories.includes(c.id)} />
                                                <Label htmlFor={`explore-${c.id}`} className="font-normal text-slate-300">{c.name}</Label>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label>Regular Price (₹)</Label><Input name="regularPrice" value={formData.regularPrice} onChange={handleInputChange} type="number" /></div>
                                <div className="space-y-2"><Label>Discounted Price (₹)</Label><Input name="salePrice" value={formData.salePrice} onChange={handleInputChange} type="number" /></div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label>Category</Label>
                                    <Select name="category" value={formData.category} onValueChange={v => handleSelectChange('category', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2"><Label>Coupon</Label>
                                    <Select name="coupon" value={formData.coupon} onValueChange={v => handleSelectChange('coupon', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select a coupon" /></SelectTrigger>
                                        <SelectContent>{discounts.map(d => <SelectItem key={d.id} value={d.id}>{d.code}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input name="tags" value={formData.tags} onChange={handleInputChange} /></div>
                                <div className="space-y-2"><Label>SKU</Label><Input name="sku" value={formData.sku} onChange={handleInputChange} /></div>
                                <div className="space-y-2"><Label>Status</Label>
                                    <Select name="status" value={formData.status} onValueChange={v => handleSelectChange('status', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Links</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label>Live Preview Link</Label><Input name="livePreviewLink" value={formData.livePreviewLink} onChange={handleInputChange} placeholder="https://..." /></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="destructive" type="button" onClick={handleDeleteProduct}>Delete Product</Button>
                    <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
                </div>
            </form>
        </div>
    )
}
