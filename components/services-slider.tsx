
"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features: string[];
  technologies: string[];
  gradient: string;
  createdAt: Timestamp;
}

export default function ServicesSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const servicesData: Service[] = [];
        querySnapshot.forEach((doc) => {
          servicesData.push({ id: doc.id, ...doc.data() } as Service);
        });
        setServices(servicesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-6 md:py-12 lg:py-20 relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-background dark:via-primary/20 dark:to-background" id="services">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.1]" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 dark:opacity-100" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-accent">Services</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We deliver cutting-edge solutions that drive growth and innovation for your business.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 pl-4">
                    <Card className="h-full bg-white/50 dark:bg-primary/30 border border-gray-200 dark:border-accent/20 backdrop-blur-sm hover:border-accent/50 transition-colors rounded-2xl p-6 flex flex-col group hover:shadow-lg dark:hover:shadow-accent/10">
                      <Skeleton className="w-16 h-16 rounded-2xl mb-6" />
                      <Skeleton className="h-8 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-6" />
                      <div className="space-y-2 mb-6">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <Skeleton className="h-10 w-full mt-auto" />
                    </Card>
                  </div>
                ))
              ) : (
                services.map((service, index) => (
                  <div key={service.id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 pl-4">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full"
                    >
                      <Card className="group relative p-8 h-full bg-white dark:bg-primary/30 backdrop-blur-sm border border-gray-200 dark:border-accent/20 rounded-2xl overflow-hidden flex flex-col shadow-sm dark:shadow-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}
                        />
                        <div className="relative z-10 flex flex-col flex-grow">
                          <motion.div
                            className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6 p-2`}
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {service.icon ? (
                              <Image src={service.icon} alt={`${service.title} icon`} width={48} height={48} className="object-contain" />
                            ) : null}
                          </motion.div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-grow line-clamp-3">{service.description}</p>

                          <div className="mb-6">
                            <ul className="space-y-2 mb-4">
                              {service.features?.slice(0, 2).map((feature, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                  <Check className="w-4 h-4 text-accent mr-2 mt-1 flex-shrink-0" />
                                  <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                                </li>
                              ))}
                              {service.features?.length > 2 && <li className="text-sm text-gray-500">... and more</li>}
                            </ul>

                            <div className="flex flex-wrap gap-2">
                              {service.technologies?.slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-[#020617]/50 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-accent/20 group-hover:border-accent/50 transition-colors">
                                  {tech}
                                </span>
                              ))}
                              {service.technologies?.length > 3 && (
                                <span className="px-2 py-1 bg-gray-600/20 rounded-lg text-xs text-gray-400">
                                  +{service.technologies.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          <Link href="/services" className="mt-auto">
                            <Button
                              className={`w-full bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300`}
                            >
                              Learn More
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
            <Button
              onClick={scrollPrev}
              variant="outline"
              size="icon"
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white/80 dark:bg-[#1A532A]/80 backdrop-blur-sm border border-gray-200 dark:border-[#8ED968]/20 rounded-full text-[#8ED968] hover:bg-[#8ED968]/10 disabled:opacity-50 disabled:cursor-not-allowed shadow-md dark:shadow-none"
              disabled={loading}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={scrollNext}
              variant="outline"
              size="icon"
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white/80 dark:bg-[#1A532A]/80 backdrop-blur-sm border border-gray-200 dark:border-[#8ED968]/20 rounded-full text-[#8ED968] hover:bg-[#8ED968]/10 disabled:opacity-50 disabled:cursor-not-allowed shadow-md dark:shadow-none"
              disabled={loading}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
