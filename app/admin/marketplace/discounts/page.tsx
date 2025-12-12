
"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Percent, Edit, Trash2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

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

export default function AdminDiscountsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
        code: '',
        type: 'percentage',
        value: 0,
        appliesTo: 'all',
        applicableIds: [],
        onePerCustomer: false,
    });

    useEffect(() => {
        const unsubProducts = onSnapshot(collection(db, "marketplace_products"), (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title })));
        });
        const unsubCategories = onSnapshot(collection(db, "marketplace_categories"), (snapshot) => {
            setCategories(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
        });
        const unsubDiscounts = onSnapshot(collection(db, "marketplace_discounts"), (snapshot) => {
            setDiscounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Discount)));
            setLoading(false);
        });

        return () => {
            unsubProducts();
            unsubCategories();
            unsubDiscounts();
        };
    }, []);

    const handleApplicableIdChange = (id: string, checked: boolean) => {
        setNewDiscount(prev => {
            const currentIds = prev.applicableIds || [];
            if (checked) {
                return { ...prev, applicableIds: [...currentIds, id] };
            } else {
                return { ...prev, applicableIds: currentIds.filter(val => val !== id) };
            }
        });
    }

    const handleAddDiscount = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "marketplace_discounts"), {
                ...newDiscount,
                createdAt: serverTimestamp(),
            });
            toast.success("Discount created successfully!");
            setNewDiscount({ code: '', type: 'percentage', value: 0, appliesTo: 'all', applicableIds: [] });
        } catch (error) {
            toast.error("Failed to create discount.");
            console.error(error);
        }
    };

    const handleDeleteDiscount = async (id: string) => {
        if (window.confirm("Are you sure?")) {
            await deleteDoc(doc(db, "marketplace_discounts", id));
            toast.success("Discount deleted.");
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Percent /> Marketplace Discounts</CardTitle>
                    <CardDescription>Create and manage discount codes for your products.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="font-semibold mb-4 text-lg">Add New Discount</h3>
                            <form onSubmit={handleAddDiscount} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Discount Code</Label>
                                        <Input id="code" placeholder="e.g. SUMMER25" value={newDiscount.code} onChange={e => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Discount Type</Label>
                                        <Select value={newDiscount.type} onValueChange={(v: 'percentage' | 'fixed') => setNewDiscount({ ...newDiscount, type: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="value">Value</Label>
                                    <Input id="value" type="number" placeholder="e.g. 25 or 500" value={newDiscount.value} onChange={e => setNewDiscount({ ...newDiscount, value: Number(e.target.value) })} />
                                </div>

                                <div>
                                    <Label className="mb-2 block">Applies to</Label>
                                    <Select value={newDiscount.appliesTo} onValueChange={(v: 'all' | 'category' | 'product') => setNewDiscount({ ...newDiscount, appliesTo: v, applicableIds: [] })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Products</SelectItem>
                                            <SelectItem value="category">Specific Category</SelectItem>
                                            <SelectItem value="product">Specific Product(s)</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {newDiscount.appliesTo === 'category' && (
                                        <ScrollArea className="mt-4 h-32 w-full rounded-md border p-4">
                                            {categories.map(c => <div key={c.id} className="flex items-center space-x-2 mb-2"><Checkbox id={`cat-${c.id}`} onCheckedChange={ch => handleApplicableIdChange(c.id, ch as boolean)} /><Label htmlFor={`cat-${c.id}`}>{c.name}</Label></div>)}
                                        </ScrollArea>
                                    )}

                                    {newDiscount.appliesTo === 'product' && (
                                        <ScrollArea className="mt-4 h-32 w-full rounded-md border p-4">
                                            {products.map(p => <div key={p.id} className="flex items-center space-x-2 mb-2"><Checkbox id={`prod-${p.id}`} onCheckedChange={ch => handleApplicableIdChange(p.id, ch as boolean)} /><Label htmlFor={`prod-${p.id}`}>{p.title}</Label></div>)}
                                        </ScrollArea>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label htmlFor="start-date">Start Date</Label><Input id="start-date" type="date" value={newDiscount.startDate} onChange={e => setNewDiscount({ ...newDiscount, startDate: e.target.value })} /></div>
                                    <div className="space-y-2"><Label htmlFor="end-date">End Date (optional)</Label><Input id="end-date" type="date" value={newDiscount.endDate} onChange={e => setNewDiscount({ ...newDiscount, endDate: e.target.value })} /></div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Usage Limits</Label>
                                    <div className="flex items-center space-x-2"><Checkbox id="limit-customer" checked={newDiscount.onePerCustomer} onCheckedChange={c => setNewDiscount({ ...newDiscount, onePerCustomer: c as boolean })} /><Label htmlFor="limit-customer" className="text-sm font-normal">Limit to one use per customer</Label></div>
                                </div>

                                <Button type="submit">Add Discount</Button>
                            </form>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-lg">Existing Discounts</h3>
                            <div className="space-y-2">
                                {loading ? <p>Loading...</p> : discounts.map(d => (
                                    <div key={d.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                                        <div>
                                            <p className="font-bold text-primary">{d.code}</p>
                                            <p className="text-sm text-muted-foreground">{d.type === 'percentage' ? `${d.value}% off` : `₹${d.value} off`} {d.appliesTo}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => router.push(`/admin/marketplace/discounts/edit/${d.id}`)}><Edit className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="destructive" onClick={() => handleDeleteDiscount(d.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
