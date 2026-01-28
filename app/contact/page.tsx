import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ConciergeForm } from "@/components/contact/concierge-form"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react"
import { getPageMeta } from "@/lib/data/pages"
import { getSetting } from "@/lib/data/site-settings"

export async function generateMetadata(): Promise<Metadata> {
  const pageMeta = await getPageMeta("contact")

  return {
    title: pageMeta?.title || "Contact Us - SEWA Hospitality",
    description: pageMeta?.description || "Connect with our concierge desk and let us craft your perfect experience",
    keywords: pageMeta?.meta_keywords || ["contact sewa", "concierge India", "luxury service inquiry"],
    openGraph: {
      title: pageMeta?.title || "Contact Us - SEWA Hospitality",
      description: pageMeta?.description || "Connect with our concierge desk and let us craft your perfect experience",
      images: pageMeta?.og_image ? [pageMeta.og_image] : [],
    },
  }
}

export default async function ContactPage() {
  const contactInfo = (await getSetting("contact_info")) as Record<string, string> | null

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/luxury-hotel-reception-concierge.jpg" alt="Contact SEWA" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>
          <div className="relative container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              Contact SEWA Hospitality
            </h1>
            <p className="text-lg md:text-xl text-white/80">
              Connect with our concierge desk and let us craft your perfect experience
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
              {/* Form - Takes 2 columns on lg */}
              <div className="lg:col-span-2">
                <ConciergeForm
                  title="Concierge Request Form"
                  description="Submit your request and our team will respond within 24 hours"
                />
              </div>

              {/* Contact Info - Takes 1 column on lg */}
              <div className="space-y-6">
                {/* Direct Contact */}
                <Card className="p-6 border-border">
                  <h3 className="font-serif font-bold text-lg mb-4">Direct Contact</h3>
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex gap-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <a
                          href={`mailto:${contactInfo?.email || "concierge@sewa-hospitality.com"}`}
                          className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                          {contactInfo?.email || "concierge@sewa-hospitality.com"}
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Phone</p>
                        <a
                          href={`tel:${contactInfo?.phone || "+911234567890"}`}
                          className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                          {contactInfo?.phone || "+91 XXXX-XXXX-XXXX"}
                        </a>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex gap-3">
                      <MessageCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">WhatsApp</p>
                        <a
                          href={`https://wa.me/${contactInfo?.whatsapp || "911234567890"}`}
                          className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                          {contactInfo?.whatsapp || "+91 XXXX-XXXX-XXXX"}
                        </a>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Office</p>
                        <p className="text-foreground font-medium text-sm">
                          {contactInfo?.address || "Gurgaon, India"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Hours */}
                <Card className="p-6 border-border">
                  <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Hours of Operation
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday - Sunday</span>
                      <span className="font-medium">10:00 AM - 8:00 PM</span>
                    </div>
                    <div className="pt-4 border-t border-border mt-4">
                      <p className="text-xs text-muted-foreground">
                        Emergency services available 24/7 for existing clients
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Response Time */}
                <Card className="p-6 border-border bg-primary/5 border-primary/20">
                  <h3 className="font-serif font-bold text-lg mb-3 text-primary">Response Guarantee</h3>
                  <p className="text-sm text-foreground">
                    We guarantee a response to your inquiry within 24 hours during business hours.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 md:py-16 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
              <Image src="/map-gurgaon-india-location.jpg" alt="SEWA Location" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="text-center text-white">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-serif font-bold">Gurgaon, India</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
