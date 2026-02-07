export type ServiceContent = {
  id: string
  slug: string
  title: string
  titleKey?: string
  description: string
  items: string[]
}

export type DestinationContent = {
  id: string
  slug: string
  name: string
  headline: string
  description: string
  services: string[]
  highlights: string[]
  imageUrl?: string
}

export type BannerContent = {
  id: string
  slug: string
  message: string
  ctaLabel?: string
  ctaUrl?: string
  variant?: "primary" | "secondary" | "neutral"
  active?: boolean
}

export type CustomSectionContent = {
  id: string
  slug: string
  title: string
  body: string
  imageUrl?: string
  ctaLabel?: string
  ctaUrl?: string
  position?: number
  active?: boolean
}

type DbDestination = DestinationContent & { image_url?: string | null }
type DbBanner = BannerContent & { cta_label?: string | null; cta_url?: string | null }
type DbSection = CustomSectionContent & { image_url?: string | null; cta_label?: string | null; cta_url?: string | null }

export const mapDbDestinationToContent = (dbDestination: DbDestination): DestinationContent => {
  const { image_url, ...rest } = dbDestination
  return {
    ...rest,
    imageUrl: image_url ?? dbDestination.imageUrl ?? undefined,
  }
}

export const mapDbBannerToContent = (dbBanner: DbBanner): BannerContent => {
  const { cta_label, cta_url, ...rest } = dbBanner
  return {
    ...rest,
    ctaLabel: cta_label ?? dbBanner.ctaLabel ?? undefined,
    ctaUrl: cta_url ?? dbBanner.ctaUrl ?? undefined,
  }
}

export const mapDbSectionToContent = (dbSection: DbSection): CustomSectionContent => {
  const { image_url, cta_label, cta_url, ...rest } = dbSection
  return {
    ...rest,
    imageUrl: image_url ?? dbSection.imageUrl ?? undefined,
    ctaLabel: cta_label ?? dbSection.ctaLabel ?? undefined,
    ctaUrl: cta_url ?? dbSection.ctaUrl ?? undefined,
  }
}

export const defaultServices: ServiceContent[] = [
  {
    id: "service-travel",
    slug: "travel",
    title: "Luxury Travel & Mobility",
    titleKey: "services.travel",
    description: "Experience the world in absolute comfort with our curated travel solutions",
    items: [
      "First/Business Class bookings",
      "Luxury hotels & resorts",
      "Chauffeur-driven cars",
      "Airport VIP services",
      "Private jet arrangements",
      "Yacht charters",
    ],
  },
  {
    id: "service-concierge",
    slug: "concierge",
    title: "Concierge & Lifestyle",
    titleKey: "services.concierge",
    description: "Your dedicated team ready to fulfill your every desire",
    items: [
      "24/7 personal concierge",
      "Fine dining reservations",
      "Shopping assistance",
      "Private chef services",
      "Wellness & spa arrangements",
      "Event planning",
    ],
  },
  {
    id: "service-residences",
    slug: "residences",
    title: "Premium Residences",
    titleKey: "services.residences",
    description: "Your perfect home away from home with full-service luxury",
    items: [
      "Luxury serviced apartments",
      "Full housekeeping services",
      "Private chef on request",
      "Butler & household staff",
      "Premium security systems",
      "Concierge within residence",
    ],
  },
  {
    id: "service-relocation",
    slug: "relocation",
    title: "Relocation & Immigration",
    titleKey: "services.relocation",
    description: "Seamless transition to your new home in India",
    items: [
      "Visa & FRRO assistance",
      "Cultural orientation programs",
      "School admissions support",
      "Settling-in arrangements",
      "Property search & selection",
      "Move management",
    ],
  },
  {
    id: "service-immigration",
    slug: "immigration",
    title: "Immigration Advisory",
    titleKey: "services.immigration",
    description: "Expert guidance through every immigration step",
    items: [
      "Visa consultation & application",
      "FRRO registration support",
      "Legal documentation",
      "Compliance assistance",
      "Work permit support",
      "Family visa processing",
    ],
  },
  {
    id: "service-experiences",
    slug: "experiences",
    title: "Curated Experiences",
    titleKey: "services.experiences",
    description: "Unforgettable moments tailored to your interests",
    items: [
      "Private cultural tours",
      "Invite-only experiences",
      "Corporate team building",
      "CSR event planning",
      "Heritage walks",
      "Wellness retreats",
    ],
  },
]

export const defaultDestinations: DestinationContent[] = [
  {
    id: "dest-delhi-ncr",
    slug: "delhi-ncr",
    name: "Delhi NCR",
    headline: "Business Hub of India",
    description: "Modern luxury meets ancient heritage in India's capital region",
    services: ["Business facilities", "Urban luxury hotels", "Cultural experiences", "Fine dining", "Shopping"],
    highlights: [
      "Iconic monuments and museums",
      "World-class business infrastructure",
      "Michelin-starred restaurants",
      "Luxury shopping malls",
    ],
    imageUrl: "/--dest-image-.jpg",
  },
  {
    id: "dest-mumbai",
    slug: "mumbai",
    name: "Mumbai",
    headline: "Cosmopolitan Coastal Paradise",
    description: "Bollywood glamour meets corporate sophistication",
    services: ["Coastal villas", "Fine dining", "Entertainment", "Shopping", "Business"],
    highlights: [
      "Gateway of India views",
      "Luxury beachfront properties",
      "Five-star dining experiences",
      "Entertainment & nightlife",
    ],
    imageUrl: "/--dest-image-.jpg",
  },
  {
    id: "dest-goa",
    slug: "goa",
    name: "Goa",
    headline: "Tropical Leisure Escape",
    description: "Sun, sand, and serenity in India's premier beach destination",
    services: ["Luxury villas", "Wellness retreats", "Water sports", "Fine dining", "Events"],
    highlights: ["Private beach access", "Wellness and yoga programs", "Yacht charters", "Sunset dining experiences"],
    imageUrl: "/--dest-image-.jpg",
  },
  {
    id: "dest-jaipur",
    slug: "jaipur",
    name: "Jaipur",
    headline: "The Pink City Experience",
    description: "Royal heritage and cultural immersion in Rajasthan",
    services: ["Heritage tours", "Royal experiences", "Cultural immersion", "Fine dining", "Events"],
    highlights: [
      "City Palace tours",
      "Amber Fort experiences",
      "Traditional Rajasthani cuisine",
      "Cultural performances",
    ],
    imageUrl: "/--dest-image-.jpg",
  },
  {
    id: "dest-varanasi",
    slug: "varanasi",
    name: "Varanasi",
    headline: "Spiritual Awakening",
    description: "The world's oldest living city and holiest Hindu pilgrimage site",
    services: ["Spiritual concierge", "Private ghat access", "Cultural tours", "Meditation", "Wellness"],
    highlights: ["Private ghat experiences", "Spiritual guidance", "Traditional ceremonies", "Cultural education"],
    imageUrl: "/--dest-image-.jpg",
  },
  {
    id: "dest-rishikesh",
    slug: "rishikesh",
    name: "Rishikesh",
    headline: "Yoga & Wellness Capital",
    description: "Gateway to the Himalayas and center of spiritual wellness",
    services: ["Yoga retreats", "Wellness programs", "Adventure activities", "Meditation", "Ayurveda"],
    highlights: ["World-class yoga programs", "Ayurvedic treatments", "Adventure activities", "Meditation & wellness"],
    imageUrl: "/--dest-image-.jpg",
  },
  {
    id: "dest-south-india",
    slug: "south-india",
    name: "South India",
    headline: "Tropical Splendor",
    description: "Backwaters, beaches, and ancient temples across Kerala, Tamil Nadu, and beyond",
    services: ["Backwater cruises", "Temple tours", "Beach resorts", "Spice route", "Ayurveda"],
    highlights: ["Backwater houseboats", "Ancient temple tours", "Spice plantation visits", "Traditional cuisine"],
    imageUrl: "/--dest-image-.jpg",
  },
]

export const defaultBanners: BannerContent[] = [
  {
    id: "banner-founders",
    slug: "founders-message",
    message: "Now accepting bespoke concierge memberships for 2026 — limited availability.",
    ctaLabel: "Request Membership",
    ctaUrl: "/contact",
    variant: "primary",
    active: true,
  },
]

export const defaultCustomSections: CustomSectionContent[] = [
  {
    id: "section-membership",
    slug: "membership",
    title: "Membership Experiences",
    body: "Access private tastings, curated wellness retreats, and invite-only cultural immersions through our membership program.",
    ctaLabel: "Explore Membership",
    ctaUrl: "/contact",
    imageUrl: "/--dest-image-.jpg",
    position: 0,
    active: true,
  },
]
