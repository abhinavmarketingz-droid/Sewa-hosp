"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { ServiceCard } from "@/components/home/service-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServicesPage() {
  // ✅ SAFE CONTEXT ACCESS
  let t = (key: string) => key

  try {
    const ctx = useLanguage()
    t = ctx.t
  } catch {
    // LanguageProvider not mounted — fallback safely
  }

  const services = [
    {
      id: "travel",
      title: t("services.travel"),
      items: [
        "First/Business Class bookings",
        "Luxury hotels & resorts",
        "Chauffeur-driven cars",
        "Airport VIP services",
        "Private jet arrangements",
        "Yacht charters",
      ],
      description: "Experience the world in absolute comfort with our curated travel solutions",
    },
    {
      id: "concierge",
      title: t("services.concierge"),
      items: [
        "24/7 personal concierge",
        "Fine dining reservations",
        "Shopping assistance",
        "Private chef services",
        "Wellness & spa arrangements",
        "Event planning",
      ],
      description: "Your dedicated team ready to fulfill your every desire",
    },
    {
      id: "residences",
      title: t("services.residences"),
      items: [
        "Luxury serviced apartments",
        "Full housekeeping services",
        "Private chef on request",
        "Butler & household staff",
        "Premium security systems",
        "Concierge within residence",
      ],
      description: "Your perfect home away from home with full-service luxury",
    },
    {
      id: "relocation",
      title: t("services.relocation"),
      items: [
        "Visa & FRRO assistance",
        "Cultural orientation programs",
        "School admissions support",
        "Settling-in arrangements",
        "Property search & selection",
        "Move management",
      ],
      description: "Seamless transition to your new home in India",
    },
    {
      id: "immigration",
      title: t("services.immigration"),
      items: [
        "Visa consultation & application",
        "FRRO registration support",
        "Legal documentation",
        "Compliance assistance",
        "Work permit support",
        "Family visa processing",
      ],
      description: "Expert guidance through every immigration step",
    },
    {
      id: "experiences",
      title: t("services.experiences"),
      items: [
        "Private cultural tours",
        "Invite-only experiences",
        "Corporate team building",
        "CSR event planning",
        "Heritage walks",
        "Wellness retreats",
      ],
      description: "Unforgettable moments tailored to your interests",
    },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/5 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Every Detail. Thoughtfully Managed.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover our comprehensive suite of luxury services designed specifically for discerning clients who
              expect nothing less than perfection.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {services.map((service) => (
                <div key={service.id} id={service.id}>
                  <ServiceCard title={service.title} items={service.items} description={service.description} />
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="border-t border-border pt-12 mt-12">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-serif font-bold mb-4">Ready to Experience SEWA?</h2>
                <p className="text-muted-foreground mb-8">
                  Contact our concierge desk to discuss which services are perfect for you
                </p>
                <Link href="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif">
                    Request Concierge Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
