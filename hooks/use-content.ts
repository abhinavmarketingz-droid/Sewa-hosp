"use client"

import { useEffect, useState } from "react"
import { defaultDestinations, defaultServices, type DestinationContent, type ServiceContent } from "@/lib/content"

type ContentPayload = {
  services: ServiceContent[]
  destinations: DestinationContent[]
}

const fallbackContent: ContentPayload = {
  services: defaultServices,
  destinations: defaultDestinations,
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
        if (Array.isArray(data?.services) && Array.isArray(data?.destinations)) {
          setContent({
            services: data.services.length ? data.services : defaultServices,
            destinations: data.destinations.length ? data.destinations : defaultDestinations,
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
