
"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
    id: string;
    name: string;
    iconUrl: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "marketplace_categories"), orderBy("name"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
            setCategories(cats);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching categories: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">Explore Categories</h1>
                <p className="text-lg text-muted-foreground">Find the perfect digital assets for your next project.</p>
            </div>
            {loading ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({length: 8}).map((_, index) => (
                        <Card key={index} className="group h-full">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                                <Skeleton className="w-24 h-24 mb-4 rounded-2xl" />
                                <Skeleton className="h-6 w-3/4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : categories.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <Link href={`/marketplace/categories/${category.id}`}>
                                <Card className="group hover:border-primary transition-colors duration-300 h-full">
                                    <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                                        <div className="relative w-24 h-24 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Image src={category.iconUrl} alt={category.name} width={96} height={96} className="object-contain rounded-2xl border border-border"/>
                                        </div>
                                        <h3 className="text-lg font-semibold truncate w-full">{category.name}</h3>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-12">No categories found.</div>
            )}
        </div>
    );
}
