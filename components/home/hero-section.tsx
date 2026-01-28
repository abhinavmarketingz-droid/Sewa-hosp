"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  const ctx = useLanguage()
  let t = (key: string) => key

  if (ctx) {
    t = ctx.t
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src="/luxury-india-hotel-infinity-pool-spa-resort.jpg" alt="Luxury India hospitality" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        <div className="space-y-6">
          {/* Pre-headline */}
          <p className="text-secondary font-serif text-sm md:text-base tracking-[0.3em] uppercase">
            India&apos;s Premier Luxury Concierge
          </p>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight text-balance">
            {t("hero.headline")}
          </h1>

          {/* Subline */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">{t("hero.subline")}</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif text-base px-8 py-6"
            >
              {t("hero.cta1")}
            </Button>
          </Link>
          <Link href="/services">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-serif text-base px-8 py-6 bg-transparent"
            >
              {t("hero.cta2")}
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-secondary font-bold">15+</span> Years Experience
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary font-bold">5000+</span> Happy Clients
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary font-bold">10+</span> Languages Supported
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer"
      >
        <span className="text-xs tracking-wider uppercase">Scroll to explore</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  )
}
