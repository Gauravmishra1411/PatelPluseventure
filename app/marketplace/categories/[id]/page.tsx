
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from "@/components/marketplace/product-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface Product {
    id: string;
    title: string;
    salePrice: string;
    regularPrice: string;
    mainImageUrl: string;
    status: string;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (categoryId) {
        const fetchCategory = async () => {
            setLoadingCategory(true);
            try {
                const docRef = doc(db, "marketplace_categories", categoryId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCategoryName(docSnap.data().name);
                } else {
                    const slugName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' ');
                    setCategoryName(slugName);
                }
            } catch (e) {
                 const slugName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' ');
                 setCategoryName(slugName);
            } finally {
                setLoadingCategory(false);
            }
        };
        fetchCategory();

        const q = query(collection(db, "marketplace_products"), where("category", "==", categoryId), where("status", "==", "published"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(prods);
            setLoadingProducts(false);
        });
        return () => unsubscribe();
    }
  }, [categoryId]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/marketplace">Marketplace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/marketplace/categories">Categories</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{loadingCategory ? <Skeleton className="h-4 w-24"/> : categoryName}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">{loadingCategory ? <Skeleton className="h-10 w-48"/> : categoryName}</h1>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Showing {products.length} products</span>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
         {loadingProducts ? (
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
