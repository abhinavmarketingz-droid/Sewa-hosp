"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { MapPin, Utensils, Space as Spa, Plane } from "lucide-react"

const destinations = [
  {
    id: "delhi-ncr",
    name: "Delhi NCR",
    headline: "Business Hub of India",
    description: "Modern luxury meets ancient heritage in India's capital region",
    icon: Plane,
    services: ["Business facilities", "Urban luxury hotels", "Cultural experiences", "Fine dining", "Shopping"],
    highlights: [
      "Iconic monuments and museums",
      "World-class business infrastructure",
      "Michelin-starred restaurants",
      "Luxury shopping malls",
    ],
  },
  {
    id: "mumbai",
    name: "Mumbai",
    headline: "Cosmopolitan Coastal Paradise",
    description: "Bollywood glamour meets corporate sophistication",
    icon: Utensils,
    services: ["Coastal villas", "Fine dining", "Entertainment", "Shopping", "Business"],
    highlights: [
      "Gateway of India views",
      "Luxury beachfront properties",
      "Five-star dining experiences",
      "Entertainment & nightlife",
    ],
  },
  {
    id: "goa",
    name: "Goa",
    headline: "Tropical Leisure Escape",
    description: "Sun, sand, and serenity in India's premier beach destination",
    icon: Spa,
    services: ["Luxury villas", "Wellness retreats", "Water sports", "Fine dining", "Events"],
    highlights: ["Private beach access", "Wellness and yoga programs", "Yacht charters", "Sunset dining experiences"],
  },
  {
    id: "jaipur",
    name: "Jaipur",
    headline: "The Pink City Experience",
    description: "Royal heritage and cultural immersion in Rajasthan",
    icon: MapPin,
    services: ["Heritage tours", "Royal experiences", "Cultural immersion", "Fine dining", "Events"],
    highlights: [
      "City Palace tours",
      "Amber Fort experiences",
      "Traditional Rajasthani cuisine",
      "Cultural performances",
    ],
  },
  {
    id: "varanasi",
    name: "Varanasi",
    headline: "Spiritual Awakening",
    description: "The world's oldest living city and holiest Hindu pilgrimage site",
    icon: Spa,
    services: ["Spiritual concierge", "Private ghat access", "Cultural tours", "Meditation", "Wellness"],
    highlights: ["Private ghat experiences", "Spiritual guidance", "Traditional ceremonies", "Cultural education"],
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    headline: "Yoga & Wellness Capital",
    description: "Gateway to the Himalayas and center of spiritual wellness",
    icon: Spa,
    services: ["Yoga retreats", "Wellness programs", "Adventure activities", "Meditation", "Ayurveda"],
    highlights: ["World-class yoga programs", "Ayurvedic treatments", "Adventure activities", "Meditation & wellness"],
  },
  {
    id: "south-india",
    name: "South India",
    headline: "Tropical Splendor",
    description: "Backwaters, beaches, and ancient temples across Kerala, Tamil Nadu, and beyond",
    icon: Utensils,
    services: ["Backwater cruises", "Temple tours", "Beach resorts", "Spice route", "Ayurveda"],
    highlights: ["Backwater houseboats", "Ancient temple tours", "Spice plantation visits", "Traditional cuisine"],
  },
]

export default function DestinationsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/5 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Curated Destinations Across India</h1>
            <p className="text-lg text-muted-foreground">
              Experience India's most luxurious destinations with our personalized concierge services
            </p>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {destinations.map((dest, idx) => {
                const Icon = dest.icon
                return (
                  <div key={dest.id} id={dest.id} className="scroll-mt-20">
                    <Card className="p-8 md:p-12 border-border hover:border-primary/50 transition-all">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Content */}
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-3 mb-4">
                            <Icon className="h-8 w-8 text-secondary" />
                            <span className="text-sm font-medium text-primary">{dest.headline}</span>
                          </div>
                          <h2 className="text-3xl font-serif font-bold mb-4">{dest.name}</h2>
                          <p className="text-muted-foreground mb-6 leading-relaxed">{dest.description}</p>

                          {/* Services */}
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

                          {/* Highlights */}
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
                        </div>

                        {/* Image */}
                        <div
                          className="w-full h-64 md:h-80 bg-cover bg-center rounded-lg shadow-md"
                          style={{
                            backgroundImage: "url('/--dest-image-.jpg')",
                          }}
                        />
                      </div>
                    </Card>
                  </div>
                )
              })}
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
            <a
              href="/contact"
              className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif px-8 py-3 rounded-md transition-colors"
            >
              Request Destination Consultation
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
