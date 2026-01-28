import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getTeamMembers } from "@/lib/data/team"
import { getPageMeta } from "@/lib/data/pages"

export async function generateMetadata(): Promise<Metadata> {
  const pageMeta = await getPageMeta("about")

  return {
    title: pageMeta?.title || "About Us - SEWA Hospitality",
    description: pageMeta?.description || "Bridging Indian hospitality traditions with global standards of excellence",
    keywords: pageMeta?.meta_keywords || ["about sewa", "luxury hospitality", "India concierge"],
    openGraph: {
      title: pageMeta?.title || "About Us - SEWA Hospitality",
      description: pageMeta?.description || "Bridging Indian hospitality traditions with global standards",
      images: pageMeta?.og_image ? [pageMeta.og_image] : [],
    },
  }
}

export default async function AboutPage() {
  const teamMembers = await getTeamMembers({ leadership: true })

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/luxury-indian-palace-interior.jpg" alt="About SEWA Hospitality" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>
          <div className="relative container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              About SEWA Hospitality
            </h1>
            <p className="text-lg md:text-xl text-white/80">
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
                  concierge services for India&apos;s most discerning clients.
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
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                <Image src="/luxury-indian-hospitality-team.jpg" alt="SEWA team" fill className="object-cover" />
              </div>
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

        {/* Team Section - Database Driven */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="luxury-section-title text-center mb-12">Our Leadership</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member) => (
                <Card key={member.id} className="overflow-hidden border-border hover:border-primary/50 transition-all">
                  <div className="relative h-64">
                    <Image
                      src={member.image_url || `/placeholder.svg?height=256&width=300&query=professional portrait`}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-serif font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-4">{member.title}</p>
                    {member.bio && <p className="text-xs text-muted-foreground mb-4 line-clamp-3">{member.bio}</p>}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.expertise?.slice(0, 3).map((exp, i) => (
                        <span key={i} className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                          {exp}
                        </span>
                      ))}
                    </div>
                    {member.languages && member.languages.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-3">Languages: {member.languages.join(", ")}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-serif font-bold mb-8">Our Core Values</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              {["Discretion", "Excellence", "Integrity", "Innovation", "Compassion"].map((value, idx) => (
                <div key={idx} className="text-center">
                  <p className="font-serif text-lg font-bold">{value}</p>
                </div>
              ))}
            </div>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif px-10"
              >
                Start Your Journey With Us
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
