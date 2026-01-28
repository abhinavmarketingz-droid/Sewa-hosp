import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { Partner } from "@/lib/supabase/types"

interface PartnersSectionProps {
  partners: Partner[]
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  // Group partners by category
  const partnersByCategory = partners.reduce(
    (acc, partner) => {
      const category = partner.category || "other"
      if (!acc[category]) acc[category] = []
      acc[category].push(partner)
      return acc
    },
    {} as Record<string, Partner[]>,
  )

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="luxury-section-title">Our Trusted Partners</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We collaborate with world-class brands and institutions to deliver exceptional experiences
          </p>
        </div>

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center mb-12">
          {partners.slice(0, 8).map((partner) => (
            <div
              key={partner.id}
              className="group relative w-full max-w-[180px] h-20 flex items-center justify-center p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
            >
              {partner.logo_url ? (
                <Image
                  src={partner.logo_url || "/placeholder.svg"}
                  alt={partner.name}
                  width={140}
                  height={60}
                  className="object-contain grayscale group-hover:grayscale-0 transition-all"
                />
              ) : (
                <span className="text-sm font-serif font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  {partner.name}
                </span>
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
            </div>
          ))}
        </div>

        {/* Partner Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(partnersByCategory)
            .slice(0, 3)
            .map(([category, categoryPartners]) => (
              <div key={category} className="text-center p-6 rounded-lg bg-muted/30">
                <h3 className="font-serif font-bold text-lg mb-2 capitalize">{category.replace(/_/g, " ")}</h3>
                <p className="text-sm text-muted-foreground">
                  {categoryPartners.length} trusted partner{categoryPartners.length > 1 ? "s" : ""}
                </p>
              </div>
            ))}
        </div>

        <div className="text-center">
          <Link href="/partners">
            <Button variant="outline" className="font-serif bg-transparent">
              View All Partners
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
