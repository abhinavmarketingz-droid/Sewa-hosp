"use client"
import { Card } from "@/components/ui/card"
import { Users, Briefcase, Crown, Globe } from "lucide-react"

const whoWeServeData = [
  {
    icon: Globe,
    title: "International Travelers",
    description: "Seamless luxury experiences worldwide",
  },
  {
    icon: Users,
    title: "Expatriates & Executives",
    description: "Dedicated relocation and lifestyle support",
  },
  {
    icon: Crown,
    title: "HNIs & Business Families",
    description: "Personalized wealth & property management",
  },
  {
    icon: Briefcase,
    title: "Corporate & Diplomatic Clients",
    description: "Comprehensive executive services",
  },
]

export function WhoWeServeSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="luxury-section-title text-center mb-12">Who We Serve</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whoWeServeData.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card
                key={idx}
                className="p-6 border-border hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <Icon className="h-10 w-10 text-primary mb-4 group-hover:text-secondary transition-colors" />
                <h3 className="font-serif font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
