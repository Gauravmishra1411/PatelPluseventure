
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Phone, MapPin, ShoppingCart, DollarSign, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Customer {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    location?: string;
    phone?: string;
    createdAt: any;
}

interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: any;
}

export default function AdminCustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        
        const customerRef = doc(db, "users", id as string);
        const unsubCustomer = onSnapshot(customerRef, (docSnap) => {
            if (docSnap.exists()) {
                setCustomer({ id: docSnap.id, ...docSnap.data() } as Customer);
            } else {
                toast.error("Customer not found.");
            }
            setLoading(false);
        });

        const ordersQuery = query(collection(db, "marketplace_orders"), where("userId", "==", id));
        const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
            const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(fetchedOrders);
        });

        return () => {
            unsubCustomer();
            unsubOrders();
        };
    }, [id]);

    const totalSpent = orders
        .filter(o => o.status === 'Fulfilled' || o.status === 'Delivered')
        .reduce((sum, o) => sum + o.total, 0);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Fulfilled':
            case 'Delivered': return 'bg-green-500/20 text-[#81f5fd]';
            case 'Cancelled': return 'bg-red-500/20 text-red-400';
            default: return 'bg-yellow-500/20 text-yellow-400';
        }
    };
    
    if (loading) {
        return <div className="p-8"><Skeleton className="h-96 w-full" /></div>
    }

    if (!customer) {
        return <div className="p-8 text-center">Customer could not be loaded.</div>
    }


    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4">
                <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2"/> Back to Customers</Button>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Customer Details */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage src={customer.avatarUrl}/>
                                <AvatarFallback className="text-4xl">{customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{customer.name}</CardTitle>
                            <CardDescription>Member Since: {new Date(customer.createdAt.toDate()).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground"/> {customer.email}</div>
                            {customer.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground"/> {customer.phone}</div>}
                            {customer.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground"/> {customer.location}</div>}
                        </CardContent>
                         <div className="p-4 border-t">
                            <Button className="w-full"><Edit className="w-4 h-4 mr-2"/> Edit Customer</Button>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Customer Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Total Orders</span>
                                <span className="font-bold text-lg flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> {orders.length}</span>
                             </div>
                             <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Total Spent</span>
                                <span className="font-bold text-lg flex items-center gap-2"><DollarSign className="w-5 h-5"/> ₹{totalSpent.toFixed(2)}</span>
                             </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Right Column - Order History */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order History</CardTitle>
                            <CardDescription>A list of all purchases made by this customer.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{order.id}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(order.createdAt.toDate()).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">₹{order.total.toFixed(2)}</p>
                                            <Badge variant="outline" className={getStatusVariant(order.status)}>{order.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
