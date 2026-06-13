
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface OrderItem {
    id: string;
    title: string;
    price: string;
    imageUrl: string;
    quantity: number;
}

interface Order {
    id: string;
    createdAt: any;
    total: number;
    status: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const q = query(collection(db, "marketplace_orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(fetchedOrders);
                setLoading(false);
            });
            return () => unsubscribe();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Delivered':
            case 'Fulfilled':
                return 'bg-green-500/20 text-[#81f5fd] border-[#81f5fd]/30';
            case 'Pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'secondary';
        }
    };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">View your past purchases and download your assets.</p>
        </div>
        
        <div className="space-y-6">
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)
            ) : orders.length > 0 ? (
                orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="flex flex-row justify-between items-start bg-muted/50 p-4">
                            <div>
                                <CardTitle className="text-lg">Order: #{order.id}</CardTitle>
                                <CardDescription>{new Date(order.createdAt?.toDate()).toLocaleDateString()}</CardDescription>
                            </div>
                            <Badge variant="outline" className={getStatusVariant(order.status)}>
                                {order.status}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <Image src={item.imageUrl} alt={item.title} width={64} height={64} className="rounded-md border aspect-square object-cover" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">₹{item.price}</p>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex-col items-stretch p-4 bg-muted/50">
                            <Separator className="my-2"/>
                             <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-lg">₹{order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1" onClick={() => router.push(`/marketplace/orders/${order.id}`)}>View Details</Button>
                                <Button className="flex-1">Re-Order</Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <p className="text-center py-10 text-muted-foreground">You have no orders yet.</p>
            )}
        </div>
    </div>
  );
}
