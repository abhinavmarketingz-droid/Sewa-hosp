import type React from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { getServices } from "@/lib/data/services"
import { getPageMeta } from "@/lib/data/pages"
import { Plane, Briefcase, Home, MapPin, FileText, Sparkles, Check } from "lucide-react"
import type { Service } from "@/lib/supabase/types"

export async function generateMetadata(): Promise<Metadata> {
  const pageMeta = await getPageMeta("services")

  return {
    title: pageMeta?.title || "Services - SEWA Hospitality",
    description: pageMeta?.description || "Comprehensive luxury services for discerning clients",
    keywords: pageMeta?.meta_keywords || ["luxury services", "concierge", "travel", "India"],
    openGraph: {
      title: pageMeta?.title || "Services - SEWA Hospitality",
      description: pageMeta?.description || "Comprehensive luxury services for discerning clients",
      images: pageMeta?.og_image ? [pageMeta.og_image] : [],
    },
  }
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  plane: Plane,
  briefcase: Briefcase,
  home: Home,
  "map-pin": MapPin,
  "file-text": FileText,
  sparkles: Sparkles,
}

function ServiceDetailCard({ service }: { service: Service }) {
  const IconComponent = iconMap[service.icon || "sparkles"] || Sparkles

  return (
    <Card className="overflow-hidden border-border hover:border-primary/50 transition-all" id={service.slug}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
        {/* Image */}
        <div className="relative md:col-span-2 h-64 md:h-auto">
          <Image
            src={service.image_url || `/placeholder.svg?height=400&width=400&query=${service.title} luxury service`}
            alt={service.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 md:bg-gradient-to-l" />
        </div>

        {/* Content */}
        <div className="p-8 md:col-span-3">
          <div className="flex items-center gap-3 mb-4">
            <IconComponent className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-serif font-bold">{service.title}</h2>
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>

          {/* Service Items */}
          {service.items && service.items.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {service.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          <Link href={`/contact?service=${service.slug}`}>
            <Button variant="outline" className="font-serif bg-transparent">
              Inquire About {service.title}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/luxury-hotel-lobby.png" alt="Luxury services" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>
          <div className="relative container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              Every Detail. Thoughtfully Managed.
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              Discover our comprehensive suite of luxury services designed specifically for discerning clients who
              expect nothing less than perfection.
            </p>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="space-y-8">
              {services.map((service) => (
                <ServiceDetailCard key={service.id} service={service} />
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
