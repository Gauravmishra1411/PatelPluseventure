
"use client"
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Eye, Search, ShoppingCart, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Customer {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    location?: string;
    phone?: string;
    orderCount: number;
    totalSpent: number;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
            // In a real app, you would aggregate orderCount and totalSpent here
            // For now, we will use mock data or fields if they exist.
            const mappedCustomers = users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                location: user.location,
                phone: user.phone,
                orderCount: user.orderCount || 0,
                totalSpent: user.totalSpent || 0,
            }));
            setCustomers(mappedCustomers);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to load customers.");
            console.error(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredCustomers = customers.filter(customer => 
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Marketplace Customers</CardTitle>
          <CardDescription>View and manage your marketplace customer base.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                    placeholder="Search customers by name or email..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map(customer => (
                    <Card key={customer.id} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={customer.avatarUrl} />
                                <AvatarFallback>{customer.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg">{customer.name}</CardTitle>
                                <CardDescription>{customer.email}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
                            {customer.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4"/> {customer.phone}</div>}
                            {customer.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {customer.location}</div>}
                            <div className="flex justify-between pt-2 border-t mt-2">
                                <span className="flex items-center gap-1"><ShoppingCart className="w-4 h-4"/> Orders: <strong>{customer.orderCount}</strong></span>
                                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4"/> Spent: <strong>₹{customer.totalSpent.toFixed(2)}</strong></span>
                            </div>
                        </CardContent>
                        <div className="p-4 border-t">
                             <Button className="w-full" onClick={() => router.push(`/admin/marketplace/customers/${customer.id}`)}><Eye className="w-4 h-4 mr-2"/>View Details</Button>
                        </div>
                    </Card>
                ))}
            </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
