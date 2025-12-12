
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, doc, deleteDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

interface Address {
    id: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export default function AddressesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({ line1: '', city: '', state: '', zip: '', country: 'India' });

    useEffect(() => {
        if (!user && !authLoading) {
            router.push('/chat');
            return;
        }
        if (user) {
            const addressQuery = query(collection(db, "users", user.uid, "addresses"));
            const unsubscribe = onSnapshot(addressQuery, (snapshot) => {
                setAddresses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address)));
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user, authLoading, router]);

    const handleSaveAddress = async () => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'users', user.uid, 'addresses'), newAddress);
            toast.success("Address saved!");
            setIsAdding(false);
            setNewAddress({ line1: '', city: '', state: '', zip: '', country: 'India' });
        } catch (e) {
            toast.error("Failed to save address.");
        }
    };
    
    const handleDeleteAddress = async (addressId: string) => {
        if (!user || !window.confirm("Are you sure?")) return;
        try {
            await deleteDoc(doc(db, "users", user.uid, "addresses", addressId));
            toast.success("Address removed.");
        } catch (error) {
            toast.error("Failed to remove address.");
        }
    };

    if (loading || authLoading) {
        return <div className="container mx-auto px-4 py-8"><Skeleton className="h-64 w-full" /></div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Manage Addresses</CardTitle>
                    <CardDescription>Update your shipping and billing addresses.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {addresses.map(address => (
                        <Card key={address.id} className="p-4 flex justify-between items-start">
                            <p>{address.line1}, {address.city}, {address.state} - {address.zip}, {address.country}</p>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteAddress(address.id)}><Trash2 className="w-4 h-4 text-destructive"/></Button>
                        </Card>
                    ))}
                    {!isAdding && (
                        <Button variant="outline" onClick={() => setIsAdding(true)}><Plus className="w-4 h-4 mr-2"/>Add New Address</Button>
                    )}
                    <AnimatePresence>
                        {isAdding && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0, height: 0 }} 
                                className="space-y-4 overflow-hidden pt-4 border-t"
                            >
                                <h3 className="font-semibold">New Address</h3>
                                <div className="space-y-2"><Label>Address Line 1</Label><Input value={newAddress.line1} onChange={(e) => setNewAddress({...newAddress, line1: e.target.value})} /></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2"><Label>City</Label><Input value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} /></div>
                                    <div className="space-y-2"><Label>State</Label><Input value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} /></div>
                                    <div className="space-y-2"><Label>ZIP Code</Label><Input value={newAddress.zip} onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})} /></div>
                                </div>
                                <div className="flex gap-2">
                                     <Button onClick={handleSaveAddress}>Save Address</Button>
                                     <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}
