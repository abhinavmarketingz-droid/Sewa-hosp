"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useContent } from "@/hooks/use-content"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export function ServicesGridSection() {
  // ✅ SAFE CONTEXT ACCESS
  let t = (key: string) => key

  try {
    const ctx = useLanguage()
    t = ctx.t
  } catch {
    // LanguageProvider not mounted — fallback safely
  }

  const { services } = useContent()

  const getTitle = (title: string, titleKey?: string) => (titleKey ? t(titleKey) : title)

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="luxury-section-title text-center mb-12">{t("services.title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link key={service.id} href={`/services#${service.slug}`}>
              <Card className="p-8 h-full border-border hover:border-primary/50 transition-all hover:shadow-lg hover:bg-primary/5 cursor-pointer group">
                <h3 className="font-serif font-bold text-xl mb-4 group-hover:text-primary transition-colors">
                  {getTitle(service.title, service.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Discover our premium {getTitle(service.title, service.titleKey).toLowerCase()} offerings
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
