import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getDestinations } from "@/lib/data/destinations"
import { getPageMeta } from "@/lib/data/pages"
import { MapPin } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const pageMeta = await getPageMeta("destinations")

  return {
    title: pageMeta?.title || "Destinations - SEWA Hospitality",
    description:
      pageMeta?.description || "Experience India's most luxurious destinations with our personalized services",
    keywords: pageMeta?.meta_keywords || ["India destinations", "luxury travel", "Delhi", "Mumbai", "Goa"],
    openGraph: {
      title: pageMeta?.title || "Destinations - SEWA Hospitality",
      description:
        pageMeta?.description || "Experience India's most luxurious destinations with our personalized services",
      images: pageMeta?.og_image ? [pageMeta.og_image] : [],
    },
  }
}

export default async function DestinationsPage() {
  const destinations = await getDestinations()

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/india-travel-landscape-taj-mahal.jpg" alt="India destinations" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>
          <div className="relative container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              Curated Destinations Across India
            </h1>
            <p className="text-lg md:text-xl text-white/80">
              Experience India&apos;s most luxurious destinations with our personalized concierge services
            </p>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {destinations.map((dest) => (
                <div key={dest.id} id={dest.slug} className="scroll-mt-20">
                  <Card className="overflow-hidden border-border hover:border-primary/50 transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      {/* Content */}
                      <div className="md:col-span-2 p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin className="h-6 w-6 text-secondary" />
                          <span className="text-sm font-medium text-primary">{dest.headline}</span>
                        </div>
                        <h2 className="text-3xl font-serif font-bold mb-4">{dest.name}</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">{dest.description}</p>

                        {/* Services */}
                        {dest.services && dest.services.length > 0 && (
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
                        )}

                        {/* Highlights */}
                        {dest.highlights && dest.highlights.length > 0 && (
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
                        )}

                        <Link href={`/contact?destination=${dest.slug}`} className="inline-block mt-6">
                          <Button variant="outline" className="font-serif bg-transparent">
                            Plan Your {dest.name} Experience
                          </Button>
                        </Link>
                      </div>

                      {/* Image */}
                      <div className="relative h-64 md:h-auto">
                        <Image
                          src={
                            dest.image_url || `/placeholder.svg?height=400&width=400&query=${dest.name} India luxury`
                          }
                          alt={dest.name}
                          fill
                          className="object-cover"
                        />
                        {dest.is_featured && (
                          <div className="absolute top-4 left-4">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
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
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif px-10"
              >
                Request Destination Consultation
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
