"use client"

import { useEffect, useState } from "react"
import {
  defaultBanners,
  defaultCustomSections,
  defaultDestinations,
  defaultServices,
  type BannerContent,
  type CustomSectionContent,
  type DestinationContent,
  type ServiceContent,
} from "@/lib/content"

type ContentPayload = {
  services: ServiceContent[]
  destinations: DestinationContent[]
  banners: BannerContent[]
  sections: CustomSectionContent[]
}

const fallbackContent: ContentPayload = {
  services: defaultServices,
  destinations: defaultDestinations,
  banners: defaultBanners,
  sections: defaultCustomSections,
}

export const useContent = () => {
  const [content, setContent] = useState<ContentPayload>(fallbackContent)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const response = await fetch("/api/content", { cache: "no-store" })
        if (!response.ok) {
          return
        }
        const data = (await response.json()) as ContentPayload
        if (!isMounted) {
          return
        }
        if (
          Array.isArray(data?.services) &&
          Array.isArray(data?.destinations) &&
          Array.isArray(data?.banners) &&
          Array.isArray(data?.sections)
        ) {
          setContent({
            services: data.services.length ? data.services : defaultServices,
            destinations: data.destinations.length ? data.destinations : defaultDestinations,
            banners: data.banners.length ? data.banners : defaultBanners,
            sections: data.sections.length ? data.sections : defaultCustomSections,
          })
        }
      } catch {
        // Ignore fetch errors and keep defaults.
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  return content
}
