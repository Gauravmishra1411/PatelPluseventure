
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
    id: string;
    name: string;
    iconUrl: string;
}

export default function CategorySlider() {
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

    if (loading) {
        return (
            <div className="py-4">
                 <Carousel opts={{ align: "start", dragFree: true }}>
                    <CarouselContent className="-ml-2">
                        {Array.from({length: 10}).map((_, index) => (
                             <CarouselItem key={index} className="basis-1/5 sm:basis-1/6 md:basis-1/8 lg:basis-1/10 xl:basis-1/12 pl-2">
                                <div className="group flex flex-col items-center gap-2">
                                    <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-2xl" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                 </Carousel>
            </div>
        )
    }
    
    if (categories.length === 0) {
        return null; // Don't show the slider if there are no categories
    }

  return (
    <section className="py-4">
      <Carousel opts={{ align: "start", dragFree: true }}>
        <CarouselContent className="-ml-2">
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/5 sm:basis-1/6 md:basis-1/8 lg:basis-1/10 xl:basis-1/12 pl-2"
            >
              <Link href={`/marketplace/categories/${category.id}`} className="group flex flex-col items-center gap-2 cursor-pointer">
                <div
                  className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <Image src={category.iconUrl} alt={category.name} width={80} height={80} className="object-contain rounded-2xl border border-border" />
                </div>
                <p className="text-xs md:text-sm font-medium text-center text-gray-300 group-hover:text-white transition-colors truncate w-20">
                  {category.name}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
