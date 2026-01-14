"use client"

import { Card } from "@/components/ui/card"
import { Globe, Zap, MapPin, Clock } from "lucide-react"

const whySewaData = [
  {
    icon: Globe,
    title: "Multilingual Concierge",
    description: "Fluent in Japanese, Korean, and European languages for seamless communication",
  },
  {
    icon: Zap,
    title: "Single-Window Solutions",
    description: "All your luxury needs fulfilled through one trusted partnership",
  },
  {
    icon: MapPin,
    title: "India-wide Premium Network",
    description: "Exclusive partnerships with finest services across all major cities",
  },
  {
    icon: Clock,
    title: "24×7 Relationship Manager",
    description: "Dedicated personal attention available anytime, anywhere",
  },
]

export function WhySewaSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="luxury-section-title text-center mb-12">Why Choose SEWA</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {whySewaData.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card key={idx} className="p-8 border-border hover:border-primary/50 transition-all">
                <div className="flex items-start gap-6">
                  <Icon className="h-12 w-12 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
