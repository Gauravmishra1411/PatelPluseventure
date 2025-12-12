
"use client";

import BannerCarousel from "@/components/marketplace/banner-carousel";
import CategorySlider from "@/components/marketplace/category-slider";
import ProductSlider from "@/components/marketplace/product-slider";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, getDocs, orderBy } from "firebase/firestore";
import ProductCard from "@/components/marketplace/product-card";
import { Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  title: string;
  salePrice: string;
  regularPrice: string;
  mainImageUrl: string;
}

interface ProductCardInfo {
    id: string;
    name: string;
    price: string;
    image: string;
    dataAiHint: string;
}

interface Section {
  id: string;
  title: string;
  layout: 'slider' | 'grid';
  loop: boolean;
  autoplay: boolean;
  products: string[]; // array of product IDs
  productData?: ProductCardInfo[];
}

const SectionRenderer = ({ section }: { section: Section }) => {
    if (section.layout === 'slider') {
        return <ProductSlider title={section.title} products={section.productData || []} icon={Flame} />;
    }
    if (section.layout === 'grid') {
        return (
            <section className="py-2">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-6">
                    <Flame className="w-7 h-7 text-primary dark:text-[#B6F500]" />
                    {section.title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(section.productData || []).map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </section>
        );
    }
    return null;
}


export default function MarketplacePage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sectionsQuery = query(collection(db, "marketplace_sections"), orderBy("order"));
        const unsubscribe = onSnapshot(sectionsQuery, async (snapshot) => {
            const fetchedSections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Section));
            
            const sectionsWithProducts = await Promise.all(fetchedSections.map(async (section) => {
                if (section.products && section.products.length > 0) {
                    const productsQuery = query(collection(db, 'marketplace_products'), where('__name__', 'in', section.products));
                    const productsSnapshot = await getDocs(productsQuery);
                    const productData = productsSnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            name: data.title,
                            price: data.salePrice || data.regularPrice,
                            image: data.mainImageUrl,
                            dataAiHint: data.title
                        }
                    });
                    // Reorder products to match the order in the section document
                    const orderedProductData = section.products.map(productId => productData.find(p => p.id === productId)).filter(p => p) as ProductCardInfo[];
                    return { ...section, productData: orderedProductData };
                }
                return { ...section, productData: [] };
            }));

            setSections(sectionsWithProducts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
        <CategorySlider />
      <BannerCarousel />
      {loading ? (
        <div className="space-y-8">
            <Skeleton className="h-10 w-48 mb-6"/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="h-64 w-full"/>
                <Skeleton className="h-64 w-full"/>
                <Skeleton className="h-64 w-full"/>
                <Skeleton className="h-64 w-full"/>
            </div>
        </div>
      ) : (
        sections.map(section => <SectionRenderer key={section.id} section={section} />)
      )}
    </div>
  );
}
