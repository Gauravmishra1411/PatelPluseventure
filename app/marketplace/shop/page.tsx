"use client";

import { useState, useEffect } from 'react';
import ProductCard from "@/components/marketplace/product-card";
import CategorySlider from "@/components/marketplace/category-slider";
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface Product {
    id: string;
    title: string;
    salePrice: string;
    regularPrice: string;
    mainImageUrl: string;
    status?: string;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'marketplace_products'), (snapshot) => {
            const prods = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Product))
                .filter(p => p.status === 'published'); // Only show published products
            setProducts(prods);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-4 -mt-20 sm:mt-0 space-y-6">
            <CategorySlider />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index}>
                            <Skeleton className="aspect-square w-full" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>
                        </Card>
                    ))
                ) : (
                    products.map(product => {
                        const productData = {
                            id: product.id,
                            name: product.title,
                            price: product.salePrice || product.regularPrice,
                            image: product.mainImageUrl,
                            dataAiHint: product.title.toLowerCase().split(' ').slice(0,2).join(' '),
                        };
                        return <ProductCard key={product.id} product={productData} />;
                    })
                )}
            </div>
        </div>
    );
}
