
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./product-card";
import type { EmblaOptionsType } from "embla-carousel";

export default function ProductSlider({
  title,
  products,
  icon: Icon,
  loop = true,
  autoplay = false,
}: {
  title: string;
  products: any[];
  icon: React.ElementType;
  loop?: boolean;
  autoplay?: boolean;
}) {
  const options: EmblaOptionsType = {
      align: "start",
      loop,
  };
  
  return (
    <section className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          {Icon && <Icon className="w-7 h-7 text-primary dark:text-[#B6F500]" />}
          {title}
        </h2>
        <Link
          href="#"
          className="flex items-center text-sm font-medium text-primary/80 dark:text-[#B6F500] hover:text-primary dark:hover:text-[#00FF88] transition-colors"
        >
          See All <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <Carousel opts={options}>
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}
