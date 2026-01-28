import type { Metadata } from "next"

interface PageSeoProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  canonical?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  structuredData?: object
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image = "/og-image.jpg",
  canonical,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageSeoProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sewa-hospitality.com"

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : undefined,
    },
    openGraph: {
      title,
      description,
      type,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      images: [
        {
          url: image.startsWith("http") ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.startsWith("http") ? image : `${baseUrl}${image}`],
    },
  }
}

// Component for inline structured data
export function StructuredData({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

// FAQ Schema generator
export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// Breadcrumb Schema generator
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sewa-hospitality.com"

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}

// Service Schema generator
export function generateServiceSchema(service: {
  name: string
  description: string
  provider?: string
  areaServed?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: service.provider || "SEWA Hospitality",
    },
    areaServed: {
      "@type": "Country",
      name: service.areaServed || "India",
    },
  }
}
