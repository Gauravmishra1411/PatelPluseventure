
"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PartyPopper, ShoppingCart, LayoutDashboard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center bg-card p-8 md:p-12 rounded-2xl border border-border/50 shadow-2xl max-w-2xl w-full"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                    className="mx-auto w-24 h-24 mb-6 bg-green-500/20 rounded-full flex items-center justify-center"
                >
                    <PartyPopper className="w-12 h-12 text-[#81f5fd]" />
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Thank You for Your Order!</h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Your purchase was successful. You can view your order details or continue shopping.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => router.push('/marketplace/orders')} size="lg" variant="outline">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        See All Orders
                    </Button>
                    <Button onClick={() => router.push('/marketplace/shop')} size="lg">
                        Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button onClick={() => router.push('/marketplace/profile')} size="lg" variant="secondary">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Go to Dashboard
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
