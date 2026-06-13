
"use client"
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
  FileText,
  Link as LinkIcon,
  Download,
  MessageSquare,
  Clock,
  ListChecks,
  Key,
  Shield,
  BookOpen,
  HelpCircle,
  Star,
  Plus,
  Trash2,
  User,
  DollarSign
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRouter, useParams } from "next/navigation"
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, DocumentData, arrayUnion, collection, addDoc, serverTimestamp, deleteDoc, query, orderBy, setDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface DynamicListItem { id: string; [key: string]: any; }
interface DynamicListProps {
    items: DynamicListItem[];
    onAddItem: () => void;
    onRemoveItem: (id: string) => void;
    renderItem: (item: DynamicListItem, index: number) => React.ReactNode;
}

const DynamicList = ({ items, onAddItem, onRemoveItem, renderItem }: DynamicListProps) => {
    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">{renderItem(item, index)}</div>
                    <Button size="icon" variant="ghost" onClick={() => onRemoveItem(item.id)} className="text-destructive"><Trash2 className="w-4 h-4"/></Button>
                </div>
            ))}
            <Button onClick={onAddItem} variant="outline"><Plus className="w-4 h-4 mr-2"/> Add Item</Button>
        </div>
    );
};


export default function AdminOrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [order, setOrder] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  const [instructions, setInstructions] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  const orderId = id as string;

  useEffect(() => {
    if (!orderId) return;

    const markMessagesAsRead = async () => {
        const orderRef = doc(db, "marketplace_orders", orderId);
        await updateDoc(orderRef, { hasUnreadAdminMessage: false });
    };
    
    markMessagesAsRead();

    const docRef = doc(db, "marketplace_orders", orderId);
    const unsubscribeOrder = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            setOrder(docSnap.data());
        } else {
            toast.error("Order not found.");
        }
        setLoading(false);
    });
    
    const collections = {
        instructions: setInstructions,
        credentials: setCredentials,
        downloads: setDownloads,
    };

    const unsubscribers = Object.entries(collections).map(([key, setter]) => {
        const q = query(collection(db, "marketplace_orders", orderId, key), orderBy("createdAt"));
        return onSnapshot(q, (snapshot) => {
            setter(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        });
    });
    
    const messagesQuery = query(collection(db, "marketplace_orders", orderId, "messages"), orderBy("timestamp"));
    const unsubMessages = onSnapshot(messagesQuery, snapshot => {
        setMessages(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    });

    return () => {
        unsubscribeOrder();
        unsubscribers.forEach(unsub => unsub());
        unsubMessages();
    };
  }, [orderId]);
  
  const handleAddItem = async (collectionName: string, newItemData: any) => {
      await addDoc(collection(db, "marketplace_orders", orderId, collectionName), {
          ...newItemData,
          createdAt: serverTimestamp()
      });
  }

  const handleRemoveItem = async (collectionName: string, itemId: string) => {
      await deleteDoc(doc(db, "marketplace_orders", orderId, collectionName, itemId));
  }
  
  const handleSendMessage = async () => {
      if (newMessage.trim() === '') return;
      await addDoc(collection(db, "marketplace_orders", orderId, "messages"), {
          text: newMessage,
          isAdmin: true,
          timestamp: serverTimestamp(),
      });
      setNewMessage("");
  }


  if (loading) {
    return <div className="p-8"><Skeleton className="h-96 w-full" /></div>
  }
  
  if (!order) {
    return <div className="p-8 text-center">Order not found.</div>
  }
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Order Details</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Order ID: #{id}
                    </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                    <TabsTrigger value="credentials">Credentials</TabsTrigger>
                    <TabsTrigger value="downloads">Downloads</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader><CardTitle>Products</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full text-sm">
                                <thead className="border-b"><tr className="text-left"><th className="p-4 font-medium">Product</th><th className="p-4 font-medium text-center">Quantity</th><th className="p-4 font-medium text-right">Price</th></tr></thead>
                                <tbody>
                                    {order.items.map((item: any) => (
                                    <tr key={item.productId} className="border-b last:border-0">
                                            <td className="p-4"><div className="flex items-center gap-4"><Image src={item.imageUrl} alt={item.title} width={64} height={64} className="rounded-md border aspect-square object-cover"/><p className="font-medium">{item.title}</p></div></td>
                                            <td className="p-4 text-center">{item.quantity}</td>
                                            <td className="p-4 text-right">₹{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><User/>Customer</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p><strong>Name:</strong> {order.userName}</p>
                                <p><strong>Email:</strong> {order.userEmail}</p>
                                <p><strong>Address:</strong> {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign/>Pricing</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
                            <p><strong>Subtotal:</strong> ₹{order.subtotal.toFixed(2)}</p>
                            {order.discount && <p className="text-[#81f5fd]"><strong>Discount ({order.discount.code}):</strong> -₹{(order.subtotal - order.total + 10).toFixed(2)}</p>}
                            <p className="font-bold text-lg"><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="instructions">
                    <Card><CardHeader><CardTitle>Instructions to Start</CardTitle></CardHeader>
                    <CardContent>
                        <DynamicList
                            items={instructions}
                            onRemoveItem={(id) => handleRemoveItem('instructions', id)}
                            onAddItem={() => {
                                const text = prompt("Enter new instruction:");
                                if(text) handleAddItem('instructions', { text });
                            }}
                            renderItem={(item, index) => (
                                <div className="text-sm">{index+1}. {item.text}</div>
                            )}
                        />
                    </CardContent></Card>
                </TabsContent>
                <TabsContent value="credentials">
                    <Card><CardHeader><CardTitle>Credentials</CardTitle></CardHeader>
                    <CardContent>
                        <DynamicList
                            items={credentials}
                            onRemoveItem={(id) => handleRemoveItem('credentials', id)}
                            onAddItem={() => {
                                const service = prompt("Enter service name (e.g., 'Website Admin'):");
                                const username = prompt("Enter username/email:");
                                const password = prompt("Enter password:");
                                if(service && username && password) handleAddItem('credentials', { service, username, password });
                            }}
                            renderItem={(item) => (
                                <div className="text-sm">
                                    <p><strong>Service:</strong> {item.service}</p>
                                    <p><strong>Username:</strong> {item.username}</p>
                                    <p><strong>Password:</strong> ********</p>
                                </div>
                            )}
                        />
                    </CardContent></Card>
                </TabsContent>
                 <TabsContent value="downloads">
                    <Card><CardHeader><CardTitle>Downloadable Files</CardTitle></CardHeader>
                    <CardContent>
                        <DynamicList
                            items={downloads}
                            onRemoveItem={(id) => handleRemoveItem('downloads', id)}
                            onAddItem={() => {
                                const title = prompt("Enter file title:");
                                const url = prompt("Enter file URL:");
                                const description = prompt("Enter a short description (optional):");
                                if(title && url) handleAddItem('downloads', { title, url, description });
                            }}
                             renderItem={(item) => (
                                <div className="text-sm">
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">{item.title}</a>
                                    <p className="text-muted-foreground">{item.description || item.url}</p>
                                </div>
                            )}
                        />
                    </CardContent></Card>
                </TabsContent>
                 <TabsContent value="messages">
                     <Card><CardHeader><CardTitle>Messages</CardTitle></CardHeader>
                     <CardContent>
                         <div className="space-y-4 h-64 overflow-y-auto pr-2 mb-4 border rounded-md p-4 bg-muted/20">
                             {messages.map(msg => (
                                 <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                     <div className={`p-3 rounded-lg max-w-xs ${msg.isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        {msg.text}
                                     </div>
                                 </div>
                             ))}
                         </div>
                         <div className="flex gap-2">
                             <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..."/>
                             <Button onClick={handleSendMessage}>Send</Button>
                         </div>
                     </CardContent></Card>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}
