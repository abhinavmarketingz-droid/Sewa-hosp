"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Quote, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import type { Testimonial } from "@/lib/supabase/types"

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

// Platform icons mapping
const platformIcons: Record<string, string> = {
  google: "/google-logo.png",
  tripadvisor: "/tripadvisor-logo.png",
  trustpilot: "/trustpilot-logo.png",
  yelp: "/yelp-logo.png",
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  if (testimonials.length === 0) {
    return null
  }

  const featuredTestimonial = testimonials[activeIndex]

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="luxury-section-title">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real experiences from discerning travelers who trusted us with their journeys
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-8 md:p-12 border-primary/20 bg-card relative overflow-hidden">
            <Quote className="absolute top-4 right-4 h-16 w-16 text-primary/10" />

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Client Image */}
              <div className="flex-shrink-0">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src={
                      featuredTestimonial.client_image_url ||
                      "/placeholder.svg?height=96&width=96&query=professional portrait"
                    }
                    alt={featuredTestimonial.client_name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < featuredTestimonial.rating ? "fill-secondary text-secondary" : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl font-serif leading-relaxed mb-6 text-foreground">
                  &ldquo;{featuredTestimonial.content}&rdquo;
                </blockquote>

                {/* Client Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-serif font-bold text-foreground">{featuredTestimonial.client_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {featuredTestimonial.client_title}
                      {featuredTestimonial.client_company && `, ${featuredTestimonial.client_company}`}
                    </p>
                    {featuredTestimonial.client_location && (
                      <p className="text-xs text-muted-foreground mt-1">{featuredTestimonial.client_location}</p>
                    )}
                  </div>

                  {/* Platform Link */}
                  {featuredTestimonial.platform && featuredTestimonial.platform_url && (
                    <Link
                      href={featuredTestimonial.platform_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Image
                        src={
                          platformIcons[featuredTestimonial.platform.toLowerCase()] ||
                          "/placeholder.svg?height=24&width=24&query=review platform"
                        }
                        alt={featuredTestimonial.platform}
                        width={20}
                        height={20}
                        className="rounded"
                      />
                      <span>View on {featuredTestimonial.platform}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {/* Service/Destination Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {featuredTestimonial.service_type && (
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {featuredTestimonial.service_type}
                    </span>
                  )}
                  {featuredTestimonial.destination && (
                    <span className="text-xs px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground">
                      {featuredTestimonial.destination}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="h-8 w-8 rounded-full bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="h-8 w-8 rounded-full bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Testimonial Grid Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, idx) => (
            <Card
              key={testimonial.id}
              className={`p-6 border-border hover:border-primary/50 transition-all cursor-pointer ${
                idx === activeIndex ? "ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setActiveIndex(idx)}
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating ? "fill-secondary text-secondary" : "text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.client_image_url || "/placeholder.svg?height=40&width=40&query=portrait"}
                    alt={testimonial.client_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{testimonial.client_name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.client_location}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
