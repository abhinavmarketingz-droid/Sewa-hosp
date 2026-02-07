"use client"

import Link from "next/link"
import { useContent } from "@/hooks/use-content"
import { Card } from "@/components/ui/card"

export function CustomSections() {
  const { sections } = useContent()
  const activeSections = sections.filter((section) => section.active !== false)

  if (!activeSections.length) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeSections
            .slice()
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .map((section) => (
              <Card key={section.id} className="p-8 border-border hover:border-primary/50 transition-all">
                <div className="flex flex-col gap-4">
                  {section.imageUrl && (
                    <div
                      className="w-full h-40 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url('${section.imageUrl}')` }}
                    />
                  )}
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
                  </div>
                  {section.ctaLabel && section.ctaUrl && (
                    <Link href={section.ctaUrl} className="text-primary font-semibold underline underline-offset-4">
                      {section.ctaLabel}
                    </Link>
                  )}
                </div>
              </Card>
            ))}
        </div>
      </div>
    </section>
  )
}
