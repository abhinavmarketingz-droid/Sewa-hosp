"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function CorporatePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/5 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Corporate & Expat Solutions</h1>
            <p className="text-lg text-muted-foreground">
              Seamless relocation and lifestyle management for your global workforce
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              <Card className="p-8 border-border hover:border-primary/50 transition-all">
                <h3 className="font-serif font-bold text-xl mb-4 text-primary">Executive Relocation</h3>
                <ul className="space-y-3">
                  {[
                    "Complete relocation planning",
                    "Housing selection & negotiation",
                    "Family orientation programs",
                    "School placement assistance",
                    "Cultural training",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-8 border-border hover:border-primary/50 transition-all">
                <h3 className="font-serif font-bold text-xl mb-4 text-primary">Corporate Housing</h3>
                <ul className="space-y-3">
                  {[
                    "Serviced apartments for executives",
                    "Furnished & unfurnished options",
                    "Flexible lease terms",
                    "Move-in ready properties",
                    "Flexible lease terms",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-8 border-border hover:border-primary/50 transition-all">
                <h3 className="font-serif font-bold text-xl mb-4 text-primary">Long-Stay Solutions</h3>
                <ul className="space-y-3">
                  {[
                    "Extended stay accommodations",
                    "Monthly flexibility",
                    "Premium maintenance services",
                    "24/7 support teams",
                    "Concierge integration",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-8 border-border hover:border-primary/50 transition-all">
                <h3 className="font-serif font-bold text-xl mb-4 text-primary">Fleet & Transport</h3>
                <ul className="space-y-3">
                  {[
                    "Chauffeur-driven vehicles",
                    "Fleet management services",
                    "Airport transfers",
                    "Executive travel",
                    "24/7 availability",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* CTA */}
            <div className="border-t border-border pt-12 mt-12">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-serif font-bold mb-4">Corporate Engagement Desk</h2>
                <p className="text-muted-foreground mb-8">
                  Connect with our corporate solutions team to discuss employee relocation and corporate housing
                  programs
                </p>
                <Link href="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif">
                    Request Corporate Consultation
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
