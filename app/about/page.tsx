"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/5 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About SEWA Hospitality</h1>
            <p className="text-lg text-muted-foreground">
              Bridging Indian hospitality traditions with global standards of excellence
            </p>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Founded in the heart of Gurgaon, SEWA Hospitality Services emerged from a vision to redefine luxury
                  concierge services for India's most discerning clients.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  With deep roots in Indian hospitality traditions and expertise in global standards, we create
                  seamless, personalized experiences that transcend expectations.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we serve international travelers, expatriates, HNIs, and corporate clients across India with
                  unwavering commitment to discretion and excellence.
                </p>
              </div>
              <div
                className="w-full h-96 bg-cover bg-center rounded-lg shadow-lg"
                style={{
                  backgroundImage: "url('/--dest-image-.jpg')",
                }}
              />
            </div>
          </div>
        </section>

        {/* Vision & Philosophy */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="luxury-section-title text-center mb-12">Vision & Philosophy</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="p-8 border-border hover:border-primary/50 transition-all">
                <h3 className="text-4xl font-serif font-bold text-secondary mb-4">01</h3>
                <h4 className="font-serif font-bold text-lg mb-3 text-primary">Discretion</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your privacy is sacred. We operate with complete confidentiality and professional restraint in all our
                  engagements.
                </p>
              </Card>

              <Card className="p-8 border-border hover:border-primary/50 transition-all">
                <h3 className="text-4xl font-serif font-bold text-secondary mb-4">02</h3>
                <h4 className="font-serif font-bold text-lg mb-3 text-primary">Personalization</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No two clients are identical. Every service is meticulously customized to match your unique
                  preferences and lifestyle.
                </p>
              </Card>

              <Card className="p-8 border-border hover:border-primary/50 transition-all">
                <h3 className="text-4xl font-serif font-bold text-secondary mb-4">03</h3>
                <h4 className="font-serif font-bold text-lg mb-3 text-primary">Cultural Intelligence</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We bridge cultures with genuine understanding, ensuring you experience India authentically and
                  comfortably.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="luxury-section-title text-center mb-12">Our Leadership</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Priya Sharma",
                  title: "Founder & Director",
                  expertise: ["Concierge", "Hospitality", "Hindi, English"],
                },
                {
                  name: "Kenji Tanaka",
                  title: "Head of International Relations",
                  expertise: ["Travel", "Corporate", "Japanese, English"],
                },
                {
                  name: "Sophie Moreau",
                  title: "Director of Residential Services",
                  expertise: ["Properties", "Relocation", "French, English"],
                },
              ].map((member, idx) => (
                <Card key={idx} className="p-6 border-border text-center hover:border-primary/50 transition-all">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-white font-serif font-bold text-2xl">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-4">{member.title}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((exp, i) => (
                      <span key={i} className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                        {exp}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-serif font-bold mb-8">Our Core Values</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {["Discretion", "Excellence", "Integrity", "Innovation", "Compassion"].map((value, idx) => (
                <div key={idx} className="text-center">
                  <p className="font-serif text-lg font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
