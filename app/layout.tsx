import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sewa-hospitality.com"),
  title: {
    default: "SEWA Hospitality - Luxury Concierge & Travel Services in India",
    template: "%s | SEWA Hospitality",
  },
  description:
    "Premier luxury concierge, travel, relocation, and lifestyle services for discerning clients in India. Multilingual support in Japanese, Korean, German, French, and more.",
  keywords: [
    "luxury concierge India",
    "luxury travel India",
    "expat relocation India",
    "corporate housing India",
    "luxury services Delhi",
    "luxury services Mumbai",
    "luxury services Goa",
    "concierge services",
    "premium hospitality India",
    "VIP services India",
    "日本語コンシェルジュ",
    "한국어 컨시어지",
    "Luxusreisen Indien",
  ],
  authors: [{ name: "SEWA Hospitality Services Pvt. Ltd." }],
  creator: "SEWA Hospitality",
  publisher: "SEWA Hospitality Services Pvt. Ltd.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      hi: "/?lang=hi",
      ja: "/?lang=ja",
      ko: "/?lang=ko",
      de: "/?lang=de",
      fr: "/?lang=fr",
      es: "/?lang=es",
      ru: "/?lang=ru",
      zh: "/?lang=zh",
      tr: "/?lang=tr",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["hi_IN", "ja_JP", "ko_KR", "de_DE", "fr_FR", "es_ES", "ru_RU", "zh_CN", "tr_TR"],
    url: "/",
    siteName: "SEWA Hospitality",
    title: "SEWA Hospitality - Luxury Concierge & Travel Services in India",
    description:
      "Premier luxury concierge, travel, relocation, and lifestyle services for discerning clients in India.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SEWA Hospitality - Luxury Services in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEWA Hospitality - Luxury Concierge & Travel Services",
    description: "Premier luxury concierge and travel services in India",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: "travel",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a4d2e" },
    { media: "(prefers-color-scheme: dark)", color: "#1a4d2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// JSON-LD Structured Data
function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SEWA Hospitality Services Pvt. Ltd.",
    alternateName: "SEWA Hospitality",
    url: "https://sewa-hospitality.com",
    logo: "https://sewa-hospitality.com/logo.png",
    description:
      "Premier luxury concierge, travel, relocation, and lifestyle services for discerning clients in India.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gurgaon",
      addressRegion: "Haryana",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-XXXX-XXXX-XXXX",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi", "Japanese", "Korean", "German", "French", "Spanish", "Russian"],
      },
    ],
    sameAs: [
      "https://www.facebook.com/sewahospitality",
      "https://www.instagram.com/sewahospitality",
      "https://www.linkedin.com/company/sewahospitality",
    ],
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "SEWA Hospitality",
    image: "https://sewa-hospitality.com/og-image.jpg",
    "@id": "https://sewa-hospitality.com",
    url: "https://sewa-hospitality.com",
    telephone: "+91-XXXX-XXXX-XXXX",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sector 29",
      addressLocality: "Gurgaon",
      addressRegion: "Haryana",
      postalCode: "122001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.4595,
      longitude: 77.0266,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    priceRange: "$$$",
    servesCuisine: "Luxury Hospitality Services",
  }

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Luxury Concierge Services",
    provider: {
      "@type": "Organization",
      name: "SEWA Hospitality",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Luxury Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Luxury Travel Planning",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Personal Concierge",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Corporate Relocation",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Premium Residences",
          },
        },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <JsonLd />
        {/* Google Ads / Tag Manager - Add your GTM ID */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `,
            }}
          />
        )}
      </head>
      <body className="font-sans antialiased">
        {/* GTM noscript */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
