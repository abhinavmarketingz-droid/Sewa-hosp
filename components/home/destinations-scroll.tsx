"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useContent } from "@/hooks/use-content"

export function DestinationsScrollSection() {
  const { destinations } = useContent()

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="luxury-section-title text-center mb-12">Destinations We Curate</h2>

        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-6 min-w-min">
            {destinations.map((dest) => (
              <Link key={dest.id} href={`/destinations#${dest.slug}`}>
                <Card className="w-64 h-80 overflow-hidden border-border hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer">
                  <div
                    className="w-full h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url('${dest.imageUrl ?? "/--dest-image-.jpg"}')`,
                    }}
                  />
                  <div className="p-6 flex flex-col justify-between h-32">
                    <h3 className="font-serif font-bold text-lg group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Luxury Experiences Available</p>
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
