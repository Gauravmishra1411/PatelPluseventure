
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot, DocumentData, collection, query, orderBy, getDoc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CheckCircle, Clock, Code, CreditCard, Download, ExternalLink, FileText, Flag, HelpCircle, Key, Layers, ListChecks, Lock, MessageSquare, Palette, Shield, ShoppingCart, Star, Target, User, Youtube as YoutubeIcon, BookOpen, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";

interface ProductDetails {
    longDesc: string;
    features: string[];
    techSpecs: string[];
    whatsIncluded: string[];
    howToUse: string;
    license: string;
    youtubeLink?: string;
}

export default function UserOrderDetailPage() {
    const params = useParams();
    const { id } = params;
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [order, setOrder] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

    const [instructions, setInstructions] = useState<any[]>([]);
    const [credentials, setCredentials] = useState<any[]>([]);
    const [downloads, setDownloads] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (!id || !user) return;
        const orderId = id as string;

        const docRef = doc(db, "marketplace_orders", orderId);
        const unsubscribe = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists() && docSnap.data().userId === user.uid) {
                const orderData = docSnap.data();
                setOrder(orderData);

                if (orderData.items && orderData.items.length > 0) {
                    const firstProductId = orderData.items[0].productId;
                    const productRef = doc(db, "marketplace_products", firstProductId);
                    const productSnap = await getDoc(productRef);
                    if (productSnap.exists()) {
                        setProductDetails(productSnap.data() as ProductDetails);
                    }
                }
            } else {
                toast.error("Order not found or you do not have permission to view it.");
                router.push('/marketplace/orders');
            }
            setLoading(false);
        });
        
        const topLevelOrderRef = doc(db, "marketplace_orders", orderId);
        const collections = {
            instructions: setInstructions,
            credentials: setCredentials,
            downloads: setDownloads,
            messages: setMessages,
        };

        const unsubscribers = Object.entries(collections).map(([key, setter]) => {
            const q = query(collection(topLevelOrderRef, key), orderBy(key === 'messages' ? 'timestamp' : 'createdAt'));
            return onSnapshot(q, (snapshot) => {
                setter(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
            });
        });

        return () => {
            unsubscribe();
            unsubscribers.forEach(unsub => unsub());
        };
    }, [id, user, router]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user || !id) return;
        const orderId = id as string;

        try {
            await addDoc(collection(db, "marketplace_orders", orderId, "messages"), {
                text: newMessage,
                isAdmin: false,
                timestamp: serverTimestamp(),
                userId: user.uid,
                name: user.displayName || user.email,
            });

            await addDoc(collection(db, "notifications"), {
                type: 'new_message',
                message: `New message on order #${orderId.slice(0, 7)} from ${user.displayName || user.email}`,
                link: `/admin/marketplace/orders/${orderId}`,
                isRead: false,
                createdAt: serverTimestamp(),
                senderInfo: {
                    name: user.displayName || user.email,
                    email: user.email,
                }
            });

            const orderRef = doc(db, "marketplace_orders", orderId);
            await updateDoc(orderRef, { hasUnreadAdminMessage: true });

            setNewMessage("");
            toast.success("Message sent!");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message.");
        }
    };

     const getYoutubeEmbedUrl = (url: string) => {
        let videoId;
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);
        if (match) {
            videoId = match[1];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    const embedUrl = productDetails?.youtubeLink ? getYoutubeEmbedUrl(productDetails.youtubeLink) : null;
    
    const isOrderReady = order && ['Confirmed', 'Fulfilled', 'Delivered'].includes(order.status);


    if (loading || authLoading) {
        return <div className="p-8"><Skeleton className="h-96 w-full" /></div>
    }

    if (!order) {
        return <div className="p-8 text-center">Order not found.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
             <Button variant="outline" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2"/> Back to Orders
             </Button>

             <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl">Order #{id.slice(0,7)}</CardTitle>
                    <CardDescription>
                        Purchased on {new Date(order.createdAt.toDate()).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
             </Card>
             
             {!isOrderReady ? (
                  <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Order {order.status}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Clock className="w-16 h-16 mx-auto text-yellow-500 mb-4"/>
                        <p>Your order is currently being processed. Please check back later for updates.</p>
                        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
                    </CardContent>
                </Card>
             ) : (
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="about">About Product</TabsTrigger>
                        <TabsTrigger value="instructions">Instructions</TabsTrigger>
                        <TabsTrigger value="credentials">Credentials</TabsTrigger>
                        <TabsTrigger value="downloads">Downloads</TabsTrigger>
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-4">
                        <Card><CardHeader>
                            <CardTitle className="flex items-center gap-2"><ShoppingCart/> Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="flex justify-between"><span className="text-muted-foreground">Status</span> <Badge>{order.status}</Badge></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Total</span> <span>₹{order.total.toFixed(2)}</span></div>
                        <div>
                            <h4 className="font-semibold mb-2">Items</h4>
                            {order.items.map((item:any) => (
                                <div key={item.productId} className="flex items-center gap-4 p-2 rounded-md bg-muted/50">
                                    <Image src={item.imageUrl} alt={item.title} width={48} height={48} className="rounded-md"/>
                                    <span>{item.title}</span>
                                </div>
                            ))}
                        </div>
                        </CardContent></Card>
                    </TabsContent>
                    <TabsContent value="about" className="py-4 space-y-4">
                        {productDetails ? (
                            <>
                                <Card>
                                    <CardHeader><CardTitle>About: {order.items[0].title}</CardTitle></CardHeader>
                                    <CardContent>
                                        <p className="prose prose-invert max-w-none">{productDetails.longDesc}</p>
                                        {embedUrl && (
                                            <div className="mt-4">
                                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><YoutubeIcon className="text-red-500"/> Video</h3>
                                                <div className="relative aspect-video rounded-lg overflow-hidden border">
                                                    <iframe src={embedUrl} title="Product Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Card>
                                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle/> Features</CardTitle></CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-sm">{productDetails.features.map(f => <li key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/>{f}</li>)}</ul>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Layers/> What's Included</CardTitle></CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-sm">{productDetails.whatsIncluded.map(item => <li key={item} className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400"/>{item}</li>)}</ul>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Code/> Tech Specs</CardTitle></CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-sm">{productDetails.techSpecs.map(spec => <li key={spec}>{spec}</li>)}</ul>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen/> Usage Guide</CardTitle></CardHeader>
                                        <CardContent>
                                            <p className="text-sm">{productDetails.howToUse}</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="md:col-span-2">
                                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield/> License</CardTitle></CardHeader>
                                        <CardContent>
                                            <p className="text-xs prose-invert max-w-none">{productDetails.license}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        ) : <p>Loading product details...</p>}
                    </TabsContent>
                    <TabsContent value="instructions" className="mt-4">
                        <Card><CardHeader>
                            <CardTitle className="flex items-center gap-2"><ListChecks/> Instructions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {instructions.length > 0 ? (
                                <ul className="space-y-2 list-decimal list-inside">
                                    {instructions.map((item, index) => <li key={index}>{item.text}</li>)}
                                </ul>
                            ) : <p>Instructions will be provided here once available.</p>}
                        </CardContent></Card>
                    </TabsContent>
                    <TabsContent value="credentials" className="mt-4">
                        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Key/> Credentials</CardTitle></CardHeader>
                        <CardContent>
                            {credentials.length > 0 ? (
                                <div className="space-y-4">
                                    {credentials.map(cred => (
                                        <div key={cred.id} className="p-3 bg-muted rounded-lg">
                                            <p><strong>Service:</strong> {cred.service}</p>
                                            <p><strong>Username:</strong> {cred.username}</p>
                                            <p><strong>Password:</strong> {cred.password}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : <p>Credentials will be shared here securely.</p>}
                        </CardContent></Card>
                    </TabsContent>
                    <TabsContent value="downloads" className="mt-4">
                        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Download/> Downloads</CardTitle></CardHeader>
                        <CardContent>
                            {downloads.length > 0 ? (
                                <div className="space-y-4">
                                    {downloads.map(file => (
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80">
                                            <div>
                                                <p className="font-semibold text-primary">{file.title}</p>
                                                <p className="text-sm text-muted-foreground">{file.description}</p>
                                            </div>
                                            <Download className="w-5 h-5"/>
                                        </a>
                                    ))}
                                </div>
                            ) : <p>Downloadable files will appear here.</p>}
                        </CardContent></Card>
                    </TabsContent>
                    <TabsContent value="messages" className="mt-4">
                         <Card>
                            <CardHeader><CardTitle>Messages</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4 h-64 overflow-y-auto pr-2 mb-4 border rounded-md p-4 bg-muted/20">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex ${!msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`p-3 rounded-lg max-w-xs ${!msg.isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..."/>
                                    <Button type="submit"><Send className="w-4 h-4"/></Button>
                                </form>
                            </CardContent>
                         </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}

      