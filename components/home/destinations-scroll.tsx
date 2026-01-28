import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import type { Destination } from "@/lib/supabase/types"

interface DestinationsScrollSectionProps {
  destinations: Destination[]
}

export function DestinationsScrollSection({ destinations }: DestinationsScrollSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="luxury-section-title">Destinations We Curate</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover India&apos;s most exquisite locations with our expert guidance
          </p>
        </div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-6 min-w-min">
            {destinations.map((dest) => (
              <Link key={dest.id} href={`/destinations#${dest.slug}`}>
                <Card className="w-72 h-96 overflow-hidden border-border hover:border-primary/50 transition-all hover:shadow-xl group cursor-pointer">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={dest.image_url || `/placeholder.svg?height=224&width=288&query=${dest.name} India luxury`}
                      alt={dest.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Destination Icon */}
                    {dest.icon && (
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                    )}

                    {/* Featured Badge */}
                    {dest.is_featured && (
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col justify-between h-40">
                    <div>
                      <h3 className="font-serif font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                        {dest.name}
                      </h3>
                      {dest.headline && <p className="text-sm text-muted-foreground line-clamp-2">{dest.headline}</p>}
                    </div>

                    {/* Services Available */}
                    {dest.services && dest.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dest.services.slice(0, 2).map((service, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {service}
                          </span>
                        ))}
                        {dest.services.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{dest.services.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/destinations">
            <Button variant="outline" className="font-serif bg-transparent">
              Explore All Destinations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
