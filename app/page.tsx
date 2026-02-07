"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WhoWeServeSection } from "@/components/home/who-we-serve"
import { ServicesGridSection } from "@/components/home/services-grid"
import { WhySewaSection } from "@/components/home/why-sewa"
import { DestinationsScrollSection } from "@/components/home/destinations-scroll"
import { FinalCtaSection } from "@/components/home/final-cta"
import { PromoBanner } from "@/components/home/promo-banner"
import { CustomSections } from "@/components/home/custom-sections"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <PromoBanner />
        <HeroSection />
        <WhoWeServeSection />
        <ServicesGridSection />
        <WhySewaSection />
        <DestinationsScrollSection />
        <CustomSections />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
