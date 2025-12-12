"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Edit, Percent } from "lucide-react"
import { toast } from "sonner"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, serverTimestamp, collection, onSnapshot } from "firebase/firestore"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Product { id: string; title: string; }
interface Category { id: string; name: string; }
interface Discount {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    appliesTo: 'all' | 'category' | 'product';
    applicableIds?: string[];
    startDate?: string;
    endDate?: string;
    usageLimit?: number;
    onePerCustomer?: boolean;
}

export default function EditDiscountPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState<Partial<Discount>>({
        code: '',
        type: 'percentage',
        value: 0,
        appliesTo: 'all',
        applicableIds: [],
        onePerCustomer: false,
        startDate: '',
        endDate: ''
    })

    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        // Fetch Products and Categories for selection
        const unsubProducts = onSnapshot(collection(db, "marketplace_products"), (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title })));
        });
        const unsubCategories = onSnapshot(collection(db, "marketplace_categories"), (snapshot) => {
            setCategories(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
        });

        const fetchDiscount = async () => {
            try {
                if (!id) return;
                const docRef = doc(db, "marketplace_discounts", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        code: data.code || "",
                        type: data.type || "percentage",
                        value: data.value || 0,
                        appliesTo: data.appliesTo || "all",
                        applicableIds: data.applicableIds || [],
                        onePerCustomer: data.onePerCustomer || false,
                        startDate: data.startDate || "",
                        endDate: data.endDate || "",
                        usageLimit: data.usageLimit || undefined
                    });
                } else {
                    toast.error("Discount not found");
                    router.push("/admin/marketplace/discounts");
                }
            } catch (error) {
                console.error("Error fetching discount:", error);
                toast.error("Failed to fetch discount details");
            } finally {
                setIsFetching(false);
            }
        };

        fetchDiscount();

        return () => {
            unsubProducts();
            unsubCategories();
        };
    }, [id, router]);

    const handleApplicableIdChange = (id: string, checked: boolean) => {
        setFormData(prev => {
            const currentIds = prev.applicableIds || [];
            if (checked) {
                return { ...prev, applicableIds: [...currentIds, id] };
            } else {
                return { ...prev, applicableIds: currentIds.filter(val => val !== id) };
            }
        });
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const docRef = doc(db, "marketplace_discounts", id);
            await updateDoc(docRef, {
                ...formData,
                updatedAt: serverTimestamp(),
            })

            toast.success("Discount updated successfully!")
            router.push("/admin/marketplace/discounts")
        } catch (error) {
            console.error("Error updating discount:", error)
            toast.error("Failed to update discount. Please try again.")
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
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Discounts
                </Button>
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center">
                            <Percent className="w-6 h-6 mr-2 text-primary" />
                            Edit Discount
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Modify existing discount code.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code" className="text-foreground">Discount Code</Label>
                                    <Input id="code" placeholder="e.g. SUMMER25" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="bg-input border-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-foreground">Discount Type</Label>
                                    <Select value={formData.type} onValueChange={(v: 'percentage' | 'fixed') => setFormData({ ...formData, type: v })}>
                                        <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                            <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="value" className="text-foreground">Value</Label>
                                <Input id="value" type="number" placeholder="e.g. 25 or 500" value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} className="bg-input border-border" />
                            </div>

                            <div>
                                <Label className="mb-2 block text-foreground">Applies to</Label>
                                <Select value={formData.appliesTo} onValueChange={(v: 'all' | 'category' | 'product') => setFormData({ ...formData, appliesTo: v, applicableIds: [] })}>
                                    <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="all">All Products</SelectItem>
                                        <SelectItem value="category">Specific Category</SelectItem>
                                        <SelectItem value="product">Specific Product(s)</SelectItem>
                                    </SelectContent>
                                </Select>

                                {formData.appliesTo === 'category' && (
                                    <ScrollArea className="mt-4 h-32 w-full rounded-md border border-border p-4">
                                        {categories.map(c => <div key={c.id} className="flex items-center space-x-2 mb-2"><Checkbox id={`cat-${c.id}`} checked={formData.applicableIds?.includes(c.id)} onCheckedChange={ch => handleApplicableIdChange(c.id, ch as boolean)} /><Label htmlFor={`cat-${c.id}`} className="text-foreground">{c.name}</Label></div>)}
                                    </ScrollArea>
                                )}

                                {formData.appliesTo === 'product' && (
                                    <ScrollArea className="mt-4 h-32 w-full rounded-md border border-border p-4">
                                        {products.map(p => <div key={p.id} className="flex items-center space-x-2 mb-2"><Checkbox id={`prod-${p.id}`} checked={formData.applicableIds?.includes(p.id)} onCheckedChange={ch => handleApplicableIdChange(p.id, ch as boolean)} /><Label htmlFor={`prod-${p.id}`} className="text-foreground">{p.title}</Label></div>)}
                                    </ScrollArea>
                                )}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="start-date" className="text-foreground">Start Date</Label><Input id="start-date" type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="bg-input border-border" /></div>
                                <div className="space-y-2"><Label htmlFor="end-date" className="text-foreground">End Date (optional)</Label><Input id="end-date" type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="bg-input border-border" /></div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-foreground">Usage Limits</Label>
                                <div className="flex items-center space-x-2"><Checkbox id="limit-customer" checked={formData.onePerCustomer} onCheckedChange={c => setFormData({ ...formData, onePerCustomer: c as boolean })} /><Label htmlFor="limit-customer" className="text-sm font-normal text-muted-foreground">Limit to one use per customer</Label></div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <Label htmlFor="usage-limit" className="text-sm font-normal text-muted-foreground w-32">Total Usages Limit:</Label>
                                    <Input id="usage-limit" type="number" placeholder="Unlimited" value={formData.usageLimit || ''} onChange={e => setFormData({ ...formData, usageLimit: e.target.value ? Number(e.target.value) : undefined })} className="bg-input border-border w-40 h-8" />
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
