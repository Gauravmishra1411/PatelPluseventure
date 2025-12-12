
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ShoppingCart, UserPlus, Star, MessageSquare, Check, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
    id: string;
    type: 'new_order' | 'new_client' | 'new_testimonial' | 'new_review' | 'new_message' | 'new_asset';
    message: string;
    link: string;
    isRead: boolean;
    createdAt: any;
    senderInfo?: {
        name: string;
        email: string;
    };
}

const notificationIcons = {
    new_order: <ShoppingCart className="w-5 h-5" />,
    new_client: <UserPlus className="w-5 h-5" />,
    new_testimonial: <Star className="w-5 h-5" />,
    new_review: <Star className="w-5 h-5" />,
    new_message: <MessageSquare className="w-5 h-5" />,
    new_asset: <UserPlus className="w-5 h-5" />,
};

const notificationColors = {
    new_order: 'bg-blue-500/20 text-blue-300',
    new_client: 'bg-green-500/20 text-green-300',
    new_testimonial: 'bg-yellow-500/20 text-yellow-300',
    new_review: 'bg-yellow-500/20 text-yellow-300',
    new_message: 'bg-purple-500/20 text-purple-300',
    new_asset: 'bg-cyan-500/20 text-cyan-300',
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
    const router = useRouter();

    useEffect(() => {
        const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
            setNotifications(notifs);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to load notifications.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        const notifRef = doc(db, "notifications", id);
        try {
            await updateDoc(notifRef, { isRead: true });
            toast.success("Notification marked as read.");
        } catch (error) {
            toast.error("Failed to update notification.");
        }
    };
    
    const handleSeeNow = (link: string) => {
        router.push(link);
    }

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'read') return notif.isRead;
        if (filter === 'unread') return !notif.isRead;
        return true;
    });

    if(loading) {
        return (
            <div className="p-8 space-y-4">
                {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell/> Notifications</CardTitle>
                    <CardDescription>All your recent updates in one place.</CardDescription>
                    <div className="flex gap-2 pt-4">
                        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
                        <Button variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')}>Unread</Button>
                        <Button variant={filter === 'read' ? 'default' : 'outline'} onClick={() => setFilter('read')}>Read</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {filteredNotifications.length > 0 ? filteredNotifications.map(notif => (
                        <Card key={notif.id} className={`p-4 ${notif.isRead ? 'opacity-60' : ''}`}>
                            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full ${notificationColors[notif.type]}`}>
                                        {notificationIcons[notif.type]}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{notif.message}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(notif.createdAt?.toDate()).toLocaleString()}</p>
                                        {notif.senderInfo && (
                                            <p className="text-xs text-muted-foreground">From: {notif.senderInfo.name} ({notif.senderInfo.email})</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex sm:flex-col gap-2 self-start sm:self-center">
                                    <Button size="sm" variant="outline" onClick={() => handleSeeNow(notif.link)}><Eye className="w-4 h-4 mr-2"/> See Now</Button>
                                    {!notif.isRead && (
                                        <Button size="sm" onClick={() => handleMarkAsRead(notif.id)}><Check className="w-4 h-4 mr-2"/> Mark as Read</Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )) : (
                        <p className="text-center py-10 text-muted-foreground">No notifications for this filter.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
