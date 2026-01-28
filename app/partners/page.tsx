import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getPartners } from "@/lib/data/partners"
import { getPageMeta } from "@/lib/data/pages"

export async function generateMetadata(): Promise<Metadata> {
  const pageMeta = await getPageMeta("partners")

  return {
    title: pageMeta?.title || "Partners - SEWA Hospitality",
    description: pageMeta?.description || "Our trusted network of luxury hospitality and service partners",
    keywords: pageMeta?.meta_keywords || ["partners", "hospitality network", "luxury brands"],
    openGraph: {
      title: pageMeta?.title || "Partners - SEWA Hospitality",
      description: pageMeta?.description || "Our trusted network of luxury hospitality and service partners",
      images: pageMeta?.og_image ? [pageMeta.og_image] : [],
    },
  }
}

export default async function PartnersPage() {
  const partners = await getPartners()

  // Group partners by category
  const partnersByCategory = partners.reduce(
    (acc, partner) => {
      const category = partner.category || "other"
      if (!acc[category]) acc[category] = []
      acc[category].push(partner)
      return acc
    },
    {} as Record<string, typeof partners>,
  )

  const categoryLabels: Record<string, string> = {
    hotel: "Hotel & Resort Partners",
    transport: "Luxury Transport Partners",
    property: "Interior & Property Partners",
    legal: "Immigration & Legal Associates",
    wellness: "Wellness & Lifestyle Partners",
    other: "Other Partners",
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/luxury-hotel-partnership-handshake.jpg" alt="Partners" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>
          <div className="relative container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              Partners & Affiliations
            </h1>
            <p className="text-lg md:text-xl text-white/80">
              Authorized partnerships with India&apos;s most prestigious hospitality and service providers
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

        {/* Partners Grid - Database Driven */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            {Object.entries(partnersByCategory).map(([category, categoryPartners]) => (
              <div key={category} className="mb-16 last:mb-0">
                <h2 className="luxury-section-title mb-8">{categoryLabels[category] || category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPartners.map((partner) => (
                    <Card
                      key={partner.id}
                      className="p-6 border-border hover:border-primary/50 transition-all group relative"
                    >
                      <div className="h-20 mb-4 flex items-center justify-center">
                        {partner.logo_url ? (
                          <Image
                            src={partner.logo_url || "/placeholder.svg"}
                            alt={partner.name}
                            width={160}
                            height={60}
                            className="object-contain grayscale group-hover:grayscale-0 transition-all"
                          />
                        ) : (
                          <div className="h-16 w-full bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-muted-foreground text-sm font-medium font-serif">{partner.name}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-center mb-2">{partner.name}</h3>
                      {partner.description && (
                        <p className="text-xs text-muted-foreground text-center line-clamp-2">{partner.description}</p>
                      )}
                      {partner.website_url && (
                        <Link
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0"
                          aria-label={`Visit ${partner.name} website`}
                        />
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partnership Inquiry */}
        <section className="py-16 md:py-24 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Interested in Partnership?</h2>
            <p className="text-muted-foreground mb-8">
              We&apos;re always exploring new partnerships with premium service providers. Get in touch with our team.
            </p>
            <Link href="/contact?inquiry=partnership">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif">
                Partnership Inquiry
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
