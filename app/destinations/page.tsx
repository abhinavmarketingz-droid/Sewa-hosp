"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { MapPin, Utensils, Space as Spa, Plane } from "lucide-react"
import { useContent } from "@/hooks/use-content"

export default function DestinationsPage() {
  const { destinations } = useContent()

  const iconBySlug: Record<string, typeof MapPin> = {
    "delhi-ncr": Plane,
    mumbai: Utensils,
    goa: Spa,
    jaipur: MapPin,
    bengaluru: Plane,
    hyderabad: Utensils,
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/5 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Curated Destinations Across India</h1>
            <p className="text-lg text-muted-foreground">
              Experience India's most luxurious destinations with our personalized concierge services
            </p>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {destinations.map((dest) => {
                const Icon = iconBySlug[dest.slug] ?? MapPin
                return (
                  <div key={dest.id} id={dest.slug} className="scroll-mt-20">
                    <Card className="p-8 md:p-12 border-border hover:border-primary/50 transition-all">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Content */}
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-3 mb-4">
                            <Icon className="h-8 w-8 text-secondary" />
                            <span className="text-sm font-medium text-primary">{dest.headline}</span>
                          </div>
                          <h2 className="text-3xl font-serif font-bold mb-4">{dest.name}</h2>
                          <p className="text-muted-foreground mb-6 leading-relaxed">{dest.description}</p>

                          {/* Services */}
                          <div className="mb-6">
                            <h4 className="font-serif font-bold mb-3 text-sm">Available Services</h4>
                            <div className="flex flex-wrap gap-2">
                              {dest.services.map((service, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Highlights */}
                          <div>
                            <h4 className="font-serif font-bold mb-3 text-sm">Highlights</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {dest.highlights.map((highlight, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-secondary mt-1">•</span>
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Image */}
                        <div
                          className="w-full h-64 md:h-80 bg-cover bg-center rounded-lg shadow-md"
                          style={{
                            backgroundImage: `url('${dest.imageUrl ?? "/--dest-image-.jpg"}')`,
                          }}
                        />
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-serif font-bold mb-4">Plan Your Journey</h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Let our destination experts curate the perfect experience for you
            </p>
            <a
              href="/contact"
              className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif px-8 py-3 rounded-md transition-colors"
            >
              Request Destination Consultation
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
