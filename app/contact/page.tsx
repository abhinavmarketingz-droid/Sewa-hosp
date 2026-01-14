"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ConciergeForm } from "@/components/contact/concierge-form"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/5 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Contact SEWA Hospitality</h1>
            <p className="text-lg text-muted-foreground">
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
                          href="mailto:concierge@sewa-hospitality.com"
                          className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                          concierge@sewa-hospitality.com
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Phone</p>
                        <a
                          href="tel:+911234567890"
                          className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                          +91 XXXX-XXXX-XXXX
                        </a>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex gap-3">
                      <MessageCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">WhatsApp</p>
                        <a
                          href="https://wa.me/911234567890"
                          className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                          +91 XXXX-XXXX-XXXX
                        </a>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Office</p>
                        <p className="text-foreground font-medium text-sm">Gurgaon, India</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Hours */}
                <Card className="p-6 border-border">
                  <h3 className="font-serif font-bold text-lg mb-4">Hours of Operation</h3>
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

        {/* Map Placeholder Section */}
        <section className="py-12 md:py-16 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Location map coming soon</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
