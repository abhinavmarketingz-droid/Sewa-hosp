"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  // ✅ SAFE CONTEXT ACCESS
  let t = (key: string) => key

  try {
    const ctx = useLanguage()
    t = ctx.t
  } catch {
    // LanguageProvider not mounted — fallback safely
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/luxury-india-hotel-spa-infinity-pool.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        <h1 className="luxury-hero text-white mb-6 leading-tight">
          {t("hero.headline")}
        </h1>
        <p className="luxury-subheading text-white/90 mb-12">
          {t("hero.subline")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif text-base px-8"
          >
            {t("hero.cta1")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 font-serif text-base px-8 bg-transparent"
          >
            {t("hero.cta2")}
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="text-white/60 text-xs">Scroll to explore</div>
        <svg
          className="w-5 h-5 mx-auto text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
