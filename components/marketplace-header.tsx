
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import NextImage from "next/image";
import { Logo } from "@/components/logo";
import { useTheme } from "next-themes";

import {
  ChevronLeft, 
  Minus, 
  Plus,
  Search,
  ShoppingBag,
  Sun,
  Moon,
  X,
  User,
  Heart,
  Lock
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from "./ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface CartItem {
    id: string;
    productId: string;
    title: string;
    price: string;
    imageUrl: string;
    quantity: number;
}

const navLinks = [
  { name: "Home", href: "/marketplace" },
  { name: "Shop", href: "/marketplace/shop"},
  { name: "Wishlist", href: "/marketplace/wishlist"},
  { name: "Profile", href: "/marketplace/profile" },
  { name: "Categories", href: "/marketplace/categories"},
  { name: "Orders", href: "/marketplace/orders" },
];

export default function MarketplaceHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  
  useEffect(() => {
    if (user) {
        const cartQuery = query(collection(db, "users", user.uid, "cart"));
        const unsubCart = onSnapshot(cartQuery, (snapshot: any) => {
            const items = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as CartItem));
            setCartItems(items);
        });
        return () => unsubCart();
    } else {
        setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRemoveFromCart = async (cartItemId: string) => {
    if (!user) return;
    const cartItemRef = doc(db, "users", user.uid, "cart", cartItemId);
    await deleteDoc(cartItemRef);
  };

  return (
    <Sheet>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border/20"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Desktop Logo & Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Logo size="md" href="/marketplace" />
              <nav className="flex items-center gap-1">
                  {navLinks.map(link => (
                    <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md">{link.name}</Link>
                  ))}
              </nav>
            </div>
            
            {/* Mobile Logo */}
            <div className="md:hidden">
                 <Logo size="sm" href="/marketplace" />
            </div>

            <div className="flex items-center flex-1 justify-end md:justify-center">
                <div className="relative w-full max-w-xs lg:w-[20vw]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full h-10 md:h-12 pl-12 pr-4 rounded-full bg-background/50 border border-border/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
              </Button>
              <div className="hidden md:flex items-center gap-2">
                <Link href="/marketplace/wishlist"><Button variant="ghost" size="icon"><Heart className="h-6 w-6" /></Button></Link>
                <Link href="/marketplace/profile"><Button variant="ghost" size="icon"><User className="h-6 w-6" /></Button></Link>
              </div>

              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ShoppingBag className="h-6 w-6" />
                   {cartItems.length > 0 }
                </Button>
              </SheetTrigger>
            </div>
          </div>
        </div>
      </motion.header>
      <SheetContent className="flex flex-col w-full sm:w-[380px] md:w-[400px] bg-white text-black border-l border-gray-200">
    <SheetHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
            <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="w-5 h-5 text-black" />
                </Button>
            </SheetClose>
            <SheetTitle className="text-lg font-semibold text-black">Cart</SheetTitle>
        </div>
    </SheetHeader>

    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {cartItems.length > 0 ? cartItems.map(item => (
            <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                <div className="relative">
                    <NextImage 
                        src={item.imageUrl} 
                        alt={item.title} 
                        width={60} 
                        height={60} 
                        className="rounded-lg object-cover bg-gray-50" 
                    />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-200 hover:bg-gray-300 p-0"
                    >
                        <X className="w-3 h-3 text-gray-600"/>
                    </Button>
                </div>
                
                <div className="flex-1 space-y-2">
                    <h4 className="font-medium text-sm text-black leading-tight uppercase tracking-wide">
                        {item.title}
                    </h4>
                    <p className="text-lg font-semibold text-black">
                        ${item.price}
                    </p>
                    

                </div>
            </div>
        )) : (
            <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
                <ShoppingBag className="w-12 h-12 text-gray-400"/>
                <p className="text-gray-500">Your cart is empty</p>
            </div>
        )}
    </div>

    {cartItems.length > 0 && (
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
            <div className="space-y-3 mb-4">
                
                <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-base font-semibold">
                        <span className="text-black">Total</span>
                        <span className="text-black">${(cartSubtotal).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <Link href="/marketplace/checkout" className="w-full">
                <Button 
                    className="w-full h-12 bg-black text-white hover:bg-black/90 rounded-full font-medium text-base" 
                    disabled={cartItems.length === 0}
                >
                    CHECKOUT
                </Button>
            </Link>
        </div>
    )}
</SheetContent>
    </Sheet>
  );
}
