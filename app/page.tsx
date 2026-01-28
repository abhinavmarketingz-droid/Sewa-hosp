import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WhoWeServeSection } from "@/components/home/who-we-serve"
import { ServicesGridSection } from "@/components/home/services-grid"
import { WhySewaSection } from "@/components/home/why-sewa"
import { DestinationsScrollSection } from "@/components/home/destinations-scroll"
import { PartnersSection } from "@/components/home/partners-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { FinalCtaSection } from "@/components/home/final-cta"
import { getServices } from "@/lib/data/services"
import { getDestinations } from "@/lib/data/destinations"
import { getPartners } from "@/lib/data/partners"
import { getTestimonials } from "@/lib/data/testimonials"

export default async function Home() {
  const [services, destinations, partners, testimonials] = await Promise.all([
    getServices({ featured: true, limit: 6 }),
    getDestinations({ featured: true, limit: 7 }),
    getPartners({ featured: true, limit: 8 }),
    getTestimonials({ featured: true, limit: 6 }),
  ])

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WhoWeServeSection />
        <ServicesGridSection services={services} />
        <WhySewaSection />
        <DestinationsScrollSection destinations={destinations} />
        <PartnersSection partners={partners} />
        <TestimonialsSection testimonials={testimonials} />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
