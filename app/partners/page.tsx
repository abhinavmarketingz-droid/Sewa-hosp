"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export default function PartnersPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/5 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Partners & Affiliations</h1>
            <p className="text-lg text-muted-foreground">
              Authorized partnerships with India's most prestigious hospitality and service providers
            </p>
          </div>
        </section>

        {/* Trust Note */}
        <section className="py-12 md:py-16 bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <p className="text-sm text-muted-foreground italic">
              SEWA operates as an authorized service facilitator and partner with all listed organizations. Our
              partnerships are built on shared commitment to luxury, discretion, and client satisfaction.
            </p>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            {/* Hotel Partners */}
            <div className="mb-16">
              <h2 className="luxury-section-title mb-8">Hotel & Resort Partners</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Five-Star Luxury Chains",
                  "Boutique Heritage Hotels",
                  "Luxury Resort Groups",
                  "Beach & Mountain Resorts",
                  "City Palace Hotels",
                  "Wellness Retreat Centers",
                ].map((partner, idx) => (
                  <Card key={idx} className="p-6 border-border hover:border-primary/50 transition-all text-center">
                    <div className="h-16 bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-muted-foreground text-sm font-medium">Logo</div>
                    </div>
                    <h3 className="font-serif font-bold text-sm">{partner}</h3>
                  </Card>
                ))}
              </div>
            </div>

            {/* Transport Partners */}
            <div className="mb-16">
              <h2 className="luxury-section-title mb-8">Luxury Transport Partners</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Premium Chauffeur Services",
                  "Luxury Car Rental Agencies",
                  "Private Jet Companies",
                  "Yacht Charter Services",
                  "Helicopter Services",
                  "Airport VIP Services",
                ].map((partner, idx) => (
                  <Card key={idx} className="p-6 border-border hover:border-primary/50 transition-all text-center">
                    <div className="h-16 bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-muted-foreground text-sm font-medium">Logo</div>
                    </div>
                    <h3 className="font-serif font-bold text-sm">{partner}</h3>
                  </Card>
                ))}
              </div>
            </div>

            {/* Property Partners */}
            <div className="mb-16">
              <h2 className="luxury-section-title mb-8">Interior & Property Partners</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Luxury Real Estate Firms",
                  "Interior Design Studios",
                  "Property Management Companies",
                  "Luxury Furnishing Suppliers",
                  "Home Automation Specialists",
                  "Security & Smart Home Systems",
                ].map((partner, idx) => (
                  <Card key={idx} className="p-6 border-border hover:border-primary/50 transition-all text-center">
                    <div className="h-16 bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-muted-foreground text-sm font-medium">Logo</div>
                    </div>
                    <h3 className="font-serif font-bold text-sm">{partner}</h3>
                  </Card>
                ))}
              </div>
            </div>

            {/* Legal & Immigration Partners */}
            <div>
              <h2 className="luxury-section-title mb-8">Immigration & Legal Associates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Immigration Law Firms",
                  "Visa Consultants",
                  "Corporate Law Firms",
                  "Tax & Compliance Advisors",
                  "HR Consultancy Services",
                  "Business Registration Services",
                ].map((partner, idx) => (
                  <Card key={idx} className="p-6 border-border hover:border-primary/50 transition-all text-center">
                    <div className="h-16 bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-muted-foreground text-sm font-medium">Logo</div>
                    </div>
                    <h3 className="font-serif font-bold text-sm">{partner}</h3>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Inquiry */}
        <section className="py-16 md:py-24 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Interested in Partnership?</h2>
            <p className="text-muted-foreground mb-8">
              We're always exploring new partnerships with premium service providers. Get in touch with our team.
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-serif px-8 py-3 rounded-md transition-colors"
            >
              Partnership Inquiry
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
