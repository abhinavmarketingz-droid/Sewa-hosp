import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getPageMeta } from "@/lib/data/pages"
import { getServices } from "@/lib/data/services"
import { CheckCircle, Building2, Users, Car, Home } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const pageMeta = await getPageMeta("corporate")

  return {
    title: pageMeta?.title || "Corporate Solutions - SEWA Hospitality",
    description:
      pageMeta?.description || "Seamless relocation and lifestyle management for your global workforce in India",
    keywords: pageMeta?.meta_keywords || ["corporate relocation", "expat services", "corporate housing"],
    openGraph: {
      title: pageMeta?.title || "Corporate Solutions - SEWA Hospitality",
      description:
        pageMeta?.description || "Seamless relocation and lifestyle management for your global workforce in India",
      images: pageMeta?.og_image ? [pageMeta.og_image] : [],
    },
  }
}

const corporateServices = [
  {
    icon: Building2,
    title: "Executive Relocation",
    items: [
      "Complete relocation planning",
      "Housing selection & negotiation",
      "Family orientation programs",
      "School placement assistance",
      "Cultural training",
    ],
  },
  {
    icon: Home,
    title: "Corporate Housing",
    items: [
      "Serviced apartments for executives",
      "Furnished & unfurnished options",
      "Flexible lease terms",
      "Move-in ready properties",
      "Premium amenities",
    ],
  },
  {
    icon: Users,
    title: "Long-Stay Solutions",
    items: [
      "Extended stay accommodations",
      "Monthly flexibility",
      "Premium maintenance services",
      "24/7 support teams",
      "Concierge integration",
    ],
  },
  {
    icon: Car,
    title: "Fleet & Transport",
    items: [
      "Chauffeur-driven vehicles",
      "Fleet management services",
      "Airport transfers",
      "Executive travel",
      "24/7 availability",
    ],
  },
]

export default async function CorporatePage() {
  const services = await getServices({ limit: 4 })

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/corporate-office-building-india.jpg" alt="Corporate solutions" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>
          <div className="relative container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              Corporate & Expat Solutions
            </h1>
            <p className="text-lg md:text-xl text-white/80">
              Seamless relocation and lifestyle management for your global workforce
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              {corporateServices.map((service, idx) => {
                const Icon = service.icon
                return (
                  <Card key={idx} className="p-8 border-border hover:border-primary/50 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                      <h3 className="font-serif font-bold text-xl text-primary">{service.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {service.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto py-12 border-y border-border my-12">
              <div className="text-center">
                <p className="text-4xl font-serif font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Relocations Managed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Corporate Clients</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif font-bold text-primary">15+</p>
                <p className="text-sm text-muted-foreground">Countries Served</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">Client Satisfaction</p>
              </div>
            </div>

            {/* CTA */}
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">Corporate Engagement Desk</h2>
              <p className="text-muted-foreground mb-8">
                Connect with our corporate solutions team to discuss employee relocation and corporate housing programs
              </p>
              <Link href="/contact?inquiry=corporate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif">
                  Request Corporate Consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
