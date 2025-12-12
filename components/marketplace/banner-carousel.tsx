
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";

interface Banner {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

export default function BannerCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "marketplace_hero_banners"), (snapshot) => {
            const bannerData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
            setBanners(bannerData);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if(loading) {
        return (
            <section>
                <Skeleton className="w-full aspect-[2/1] rounded-3xl" />
            </section>
        )
    }

    if(banners.length === 0) return null;

  return (
    <section>
      <Carousel className="w-full" opts={{loop: true}}>
        <CarouselContent>
          {banners.map((item, index) => (
            <CarouselItem key={item.id}>
                <Link href={item.link || "#"}>
                  <div
                    className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden p-8 md:p-12 flex items-center group"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
                    <div className="relative z-10 w-full md:w-3/5">
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-2xl md:text-4xl font-bold text-white mb-3"
                      >
                        {item.title}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="text-md md:text-lg text-gray-200"
                      >
                        {item.description}
                      </motion.p>
                    </div>
                  </div>
                </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
