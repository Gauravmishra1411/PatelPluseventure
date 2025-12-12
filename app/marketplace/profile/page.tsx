
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    ShoppingCart, 
    Heart, 
    User, 
    Settings, 
    LogOut,
    Briefcase,
    FileText,
    CreditCard,
    Star,
    MessageSquare,
    Sparkles,
    Edit,
    MapPin,
    Package,
    Truck
} from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";

export default function CustomerProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/marketplace/auth'); // Redirect to the new marketplace auth page
            return;
        }

        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                toast.error("Could not find user data.");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading, router]);

    const handleLogout = async () => {
        await signOut(auth);
        toast.success("Logged out");
        router.push("/marketplace");
    }

    if (loading || authLoading || !user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-32 w-full mb-6"/>
                <div className="grid md:grid-cols-3 gap-6">
                    <Skeleton className="h-24 w-full"/>
                    <Skeleton className="h-24 w-full"/>
                    <Skeleton className="h-24 w-full"/>
                </div>
            </div>
        )
    }
    
    if (!userData) {
         return <div className="text-center p-8">No user data found.</div>
    }

    const menuItems = [
        { name: "Edit Profile", description: "Update name, email, avatar, etc.", href: "/marketplace/profile/edit", icon: Edit },
        { name: "Manage Addresses", description: "Update your billing & shipping info", href: "/marketplace/profile/addresses", icon: MapPin },
        { name: "My Purchases", description: "View and download your assets", href: "/marketplace/orders", icon: Package },
        { name: "Track Orders", description: "See the status of your deliveries", href: "/marketplace/orders", icon: Truck },
        { name: "Invoices & Receipts", description: "View and download your invoices", href: "/marketplace/billing", icon: FileText },
        { name: "My Wishlist", description: "Your saved and favorite items", href: "/marketplace/wishlist", icon: Heart },
        { name: "Leave a Review", description: "Share your feedback on products", href: "/leave-review", icon: Star },
        { name: "Ask for Support", description: "Contact our support team", href: "/chat", icon: MessageSquare },
        { name: "Request Custom Project", description: "Get a quote for a new project", href: "/onboarding", icon: Briefcase },
        { name: "AI Assistant Help", description: "Get instant help from our AI", href: "/chat", icon: Sparkles },
        { name: "Logout", description: "Sign out of your account", action: handleLogout, icon: LogOut },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={userData.avatarUrl} />
                        <AvatarFallback className="text-3xl">{userData.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{userData.name}</CardTitle>
                        <CardDescription>{userData.email}</CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => {
                    const cardContent = (
                        <Card 
                            className="group hover:bg-muted/50 cursor-pointer transition-colors h-full"
                        >
                            <CardContent className="p-6 flex items-start gap-4 h-full">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <item.icon className="w-6 h-6 text-primary"/>
                                </div>
                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                    
                    if (item.action) {
                        return <div key={item.name} onClick={item.action}>{cardContent}</div>
                    }

                    return (
                        <Link href={item.href!} key={item.name}>
                            {cardContent}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
