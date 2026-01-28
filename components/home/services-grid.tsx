import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { ArrowRight, Plane, Briefcase, Home, MapPin, FileText, Sparkles } from "lucide-react"
import type { Service } from "@/lib/supabase/types"

interface ServicesGridSectionProps {
  services: Service[]
}

// Icon mapping for services
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  plane: Plane,
  briefcase: Briefcase,
  home: Home,
  "map-pin": MapPin,
  "file-text": FileText,
  sparkles: Sparkles,
}

export function ServicesGridSection({ services }: ServicesGridSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="luxury-section-title">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive luxury services tailored to your every need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon || "sparkles"] || Sparkles

            return (
              <Link key={service.id} href={`/services#${service.slug}`}>
                <Card className="h-full border-border hover:border-primary/50 transition-all hover:shadow-lg group overflow-hidden">
                  {/* Service Image */}
                  {service.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={service.image_url || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {!service.image_url && (
                      <IconComponent className="h-10 w-10 text-primary mb-4 group-hover:text-secondary transition-colors" />
                    )}
                    <h3 className="font-serif font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{service.description}</p>

                    {/* Service Items Preview */}
                    {service.items && service.items.length > 0 && (
                      <ul className="text-xs text-muted-foreground mb-4 space-y-1">
                        {service.items.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                        {service.items.length > 3 && <li className="text-primary">+{service.items.length - 3} more</li>}
                      </ul>
                    )}

                    <div className="flex items-center text-primary text-sm font-medium">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
