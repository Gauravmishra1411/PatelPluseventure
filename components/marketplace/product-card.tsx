
"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function ProductCard({ product }: { product: any }) {
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user && product.id) {
        const userRef = doc(db, "users", user.uid);
        const unsub = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const wishlist = docSnap.data().wishlist || [];
                setIsLiked(wishlist.includes(product.id));
            }
        });
        return () => unsub();
    }
  }, [user, product.id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !product.id) {
        toast.error("Please log in to manage your wishlist.");
        return;
    }
    
    const userRef = doc(db, "users", user.uid);
    try {
        if (isLiked) {
            await setDoc(userRef, {
                wishlist: arrayRemove(product.id)
            }, { merge: true });
            toast.success("Removed from wishlist.");
        } else {
            await setDoc(userRef, {
                wishlist: arrayUnion(product.id)
            }, { merge: true });
            toast.success("Added to wishlist!");
        }
    } catch (error) {
        console.error("Wishlist error:", error);
        toast.error("Failed to update wishlist.");
    }
  };

  return (
    <Link href={`/marketplace/products/${product.id}`} className="group block">
      <div className="space-y-2">
        <div className="relative overflow-hidden aspect-square rounded-lg">
            <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={product.dataAiHint}
            />
            <Button 
                onClick={handleWishlistToggle}
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 bg-black/30 backdrop-blur-sm rounded-full text-white hover:text-red-500 hover:bg-black/50 transition-all"
            >
                <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-white/80'}`} />
            </Button>
        </div>
        <div className="pt-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-0.5 truncate">
              {product.name}
            </h3>
            <p className="text-md font-bold text-primary">
              ₹{product.price}
            </p>
        </div>
      </div>
    </Link>
  );
}
