"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function FinalCtaSection() {
  // ✅ SAFE CONTEXT ACCESS
  let t = (key: string) => key

  try {
    const ctx = useLanguage()
    t = ctx.t
  } catch {
    // LanguageProvider not mounted — fallback safely
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-wide">{t("cta.tagline")}</h2>
        <p className="text-lg mb-8 text-primary-foreground/90">
          Experience India with unparalleled luxury, discretion, and personalized attention
        </p>
        <Button
          size="lg"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif text-base px-10 py-6"
        >
          {t("cta.journey")}
        </Button>
      </div>
    </section>
  )
}
