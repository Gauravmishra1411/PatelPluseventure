"use client"

import { IconArrowLeft, IconArrowRight, IconStar } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"

type Testimonial = {
  quote: string
  name: string
  designation: string
  company: string
  src: string
  rating: number
  project: string
  results: string
}

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[]
  autoplay?: boolean
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [activeIndex, setActiveIndex] = useState(0)

  const handleSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const handlePrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", handleSelect)
    handleSelect() // Set initial active index
    return () => {
      emblaApi.off("select", handleSelect)
    }
  }, [emblaApi, handleSelect])

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 6000)
      return () => clearInterval(interval)
    }
  }, [autoplay, handleNext])

  return (
    <section className="py-8 bg-gradient-to-br from-white via-gray-50 to-white dark:from-background dark:via-primary/20 dark:to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl opacity-50 dark:opacity-100" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 font-sans antialiased md:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r  from-[#FFA800] to-[#FF8A00] bg-clip-text text-transparent">
              Client Success Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover how we&apos;ve transformed businesses with cutting-edge technology and innovative solutions
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          {/* Image Section */}
          <div className="order-1 md:order-1">
            <div className="overflow-hidden relative h-80 w-full max-w-sm mx-auto md:h-96 md:max-w-none" ref={emblaRef}>
              <div className="flex h-full">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="flex-shrink-0 w-full h-full relative">
                    <motion.div
                      key={testimonial.src}
                      animate={{
                        opacity: activeIndex === index ? 1 : 0.7,
                        scale: activeIndex === index ? 1 : 0.95,
                        zIndex: activeIndex === index ? 40 : testimonials.length + 2 - index,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 origin-bottom"
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={testimonial.src || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 500px"
                          draggable={false}
                          className="object-cover object-center rounded-3xl border-2 border-gray-200 dark:border-accent/20 shadow-2xl"
                        />
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-accent/10 via-transparent to-transparent" />

                        {/* Project Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold rounded-full">
                          {testimonial.project}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-between py-4 order-2 md:order-2 text-center md:text-left">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  exit={{
                    y: -20,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                >
                  {(() => {
                    const current = testimonials[activeIndex] || testimonials[0]
                    if (!current) return null
                    const rating = typeof current.rating === "number" && current.rating > 0 ? current.rating : 5
                    const quote = current.quote || ""
                    return (
                      <>
                        {/* Rating Stars */}
                        <div className="flex gap-1 mb-4 justify-center md:justify-start">
                          {[...Array(rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 * i, duration: 0.3 }}
                            >
                              <IconStar className="h-4 w-4 text-accent fill-current" />
                            </motion.div>
                          ))}
                        </div>

                        {/* Quote */}
                        <motion.p className="text-lg md:text-xl font-light text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          &quot;
                          {quote.split(" ").map((word, index) => (
                            <motion.span
                              key={index}
                              initial={{
                                filter: "blur(10px)",
                                opacity: 0,
                                y: 5,
                              }}
                              animate={{
                                filter: "blur(0px)",
                                opacity: 1,
                                y: 0,
                              }}
                              transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                                delay: 0.03 * index,
                              }}
                              className="inline-block"
                            >
                              {word}&nbsp;
                            </motion.span>
                          ))}
                          &quot;
                        </motion.p>

                        {/* Client Info */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {current.name || "Client"}
                          </h3>
                          <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">{current.designation || ""}</p>
                          <p className="text-accent font-medium">{current.company || ""}</p>
                        </div>

                        {current.results && (
                          <div className="bg-white dark:bg-gradient-to-r dark:from-background dark:to-primary p-4 rounded-xl border border-gray-200 dark:border-accent/20 mb-8 max-w-md mx-auto md:mx-0 shadow-sm dark:shadow-none">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project Results:</p>
                            <p className="text-accent font-semibold">{current.results}</p>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Navigation */}
            <div className="flex gap-4 items-center justify-center md:justify-start">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className={cn(
                  "group/button flex h-12 w-12 items-center justify-center rounded-full",
                  "bg-white dark:bg-gradient-to-r dark:from-primary dark:to-accent border border-gray-200 dark:border-accent/30",
                  "hover:border-accent hover:shadow-lg hover:shadow-accent/25",
                  "transition-all duration-300 shadow-md dark:shadow-none",
                )}
              >
                <IconArrowLeft className="h-6 w-6 text-primary dark:text-white transition-transform duration-300 group-hover/button:-translate-x-1" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className={cn(
                  "group/button flex h-12 w-12 items-center justify-center rounded-full",
                  "bg-white dark:bg-gradient-to-r dark:from-primary dark:to-accent border border-gray-200 dark:border-accent/30",
                  "hover:border-accent hover:shadow-lg hover:shadow-accent/25",
                  "transition-all duration-300 shadow-md dark:shadow-none",
                )}
              >
                <IconArrowRight className="h-6 w-6 text-primary dark:text-white transition-transform duration-300 group-hover/button:translate-x-1" />
              </button>

              {/* Dots Indicator */}
              <div className="hidden sm:flex gap-2 ml-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      activeIndex === index
                        ? "bg-accent scale-125 shadow-lg shadow-accent/50"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
