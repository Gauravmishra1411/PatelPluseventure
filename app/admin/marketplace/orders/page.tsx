
"use client"

import { useState, useEffect } from "react"
import {
    File,
    ListFilter,
    MoreHorizontal,
    Search,
    ArrowUpRight,
    DollarSign,
    Circle
} from "lucide-react"
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
];

interface Order {
    id: string;
    userName: string;
    userEmail: string;
    status: string;
    createdAt: any;
    total: number;
    items: { title: string; imageUrl: string }[];
    hasUnreadAdminMessage?: boolean;
}

export default function AdminOrdersPage() {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "marketplace_orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Order));
            setOrders(fetchedOrders);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch orders: ", error);
            toast.error("Could not load orders.");
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (orderId: string, status: string) => {
        const orderRef = doc(db, "marketplace_orders", orderId);
        try {
            await updateDoc(orderRef, { status });
            toast.success(`Order status updated to ${status}`);
        } catch (error) {
            toast.error("Failed to update order status.");
            console.error("Error updating status: ", error);
        }
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Fulfilled':
            case 'Delivered':
                return 'text-[#81f5fd] border-[#81f5fd]/50 bg-green-500/10 hover:bg-green-500/20';
            case 'Confirmed':
                return 'text-blue-400 border-blue-400/50 bg-blue-500/10 hover:bg-blue-500/20';
            case 'Cancelled':
                return 'text-red-400 border-red-400/50 bg-red-500/10 hover:bg-red-500/20';
            case 'Processing':
                return 'text-purple-400 border-purple-400/50 bg-purple-500/10 hover:bg-purple-500/20';
            default:
                return 'text-yellow-400 border-yellow-400/50 bg-yellow-500/10 hover:bg-yellow-500/20';
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>A look at your recent sales performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#888888" />
                            <YAxis stroke="#888888" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31, 31, 46, 0.95)',
                                    border: '1px solid hsl(var(--primary))',
                                    borderRadius: '12px',
                                }}
                            />
                            <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>Manage your orders and view their sales information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input placeholder="Search orders..." className="pl-10 bg-background" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Filter
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>Fulfilled</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Unfulfilled</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {orders.map(order => (
                                <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                    <Card className="hover:bg-secondary/20 transition-colors relative">
                                        {order.hasUnreadAdminMessage && (
                                            <div className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                                        )}
                                        <CardHeader className="flex flex-row justify-between items-start pb-2">
                                            <div>
                                                <CardTitle className="text-lg">#{order.id.slice(0, 7)}</CardTitle>
                                                <CardDescription>{new Date(order.createdAt?.toDate()).toLocaleDateString()}</CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className={`w-32 justify-center ${getStatusVariant(order.status)}`}>
                                                        {order.status}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Pending')}>Pending</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Confirmed')}>Confirmed</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Processing')}>Processing</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Fulfilled')}>Fulfilled</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Delivered')}>Delivered</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Cancelled')} className="text-red-400">Cancelled</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div>
                                                <p className="font-semibold">{order.userName}</p>
                                                <p className="text-sm text-muted-foreground">{order.userEmail}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {order.items.slice(0, 3).map(item => (
                                                    <Image key={item.title} src={item.imageUrl} alt={item.title} width={24} height={24} className="rounded-full" />
                                                ))}
                                                {order.items.length > 3 && <span className="text-xs text-muted-foreground">+{order.items.length - 3} more</span>}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center">
                                            <p className="font-bold text-lg">₹{order.total.toFixed(2)}</p>
                                            <Button size="sm" onClick={() => router.push(`/admin/marketplace/orders/${order.id}`)}>
                                                View Details
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>{orders.length}</strong> of <strong>{orders.length}</strong>{" "}
                        orders
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
