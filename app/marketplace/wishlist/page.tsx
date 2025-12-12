
"use client";

import ProductCard from "@/components/marketplace/product-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
    id: string;
    title: string;
    salePrice: string;
    regularPrice: string;
    mainImageUrl: string;
}

export default function WishlistPage() {
    const [user, setUser] = useState<User | null>(null);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userRef, async (docSnap) => {
                if (docSnap.exists()) {
                    const wishlistIds = docSnap.data().wishlist || [];
                    if (wishlistIds.length > 0) {
                        const productsQuery = query(collection(db, "marketplace_products"), where("__name__", "in", wishlistIds));
                        const productsSnap = await getDocs(productsQuery);
                        const wishlistProducts = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                        setWishlist(wishlistProducts);
                    } else {
                        setWishlist([]);
                    }
                }
                setLoading(false);
            }, (error) => {
                toast.error("Failed to load wishlist.");
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star className="text-yellow-400"/> My Wishlist</CardTitle>
                <CardDescription>The products you've saved for later.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-64 w-full"/>)}
                    </div>
                ) : wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {wishlist.map(product => {
                           const productData = {
                                id: product.id,
                                name: product.title,
                                price: product.salePrice || product.regularPrice,
                                image: product.mainImageUrl,
                                dataAiHint: product.title.toLowerCase().split(' ').slice(0,2).join(' '),
                            };
                           return <ProductCard key={product.id} product={productData} />
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <Star className="mx-auto h-12 w-12 mb-4" />
                        <p className="text-lg">Your wishlist is empty.</p>
                        <p className="text-sm">Start browsing to add items you love.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
