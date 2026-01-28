"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

interface GoogleAdsTrackingProps {
  conversionId?: string
  conversionLabel?: string
}

export function GoogleAdsTracking({ conversionId, conversionLabel }: GoogleAdsTrackingProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views
  useEffect(() => {
    if (typeof window.gtag !== "function") return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
      page_path: url,
    })
  }, [pathname, searchParams])

  return null
}

// Conversion tracking helper
export function trackConversion(conversionId: string, conversionLabel: string, value?: number) {
  if (typeof window.gtag !== "function") return

  window.gtag("event", "conversion", {
    send_to: `${conversionId}/${conversionLabel}`,
    value: value || 0,
    currency: "USD",
  })
}

// Event tracking helper
export function trackEvent(
  eventName: string,
  params?: {
    category?: string
    label?: string
    value?: number
  },
) {
  if (typeof window.gtag !== "function") return

  window.gtag("event", eventName, {
    event_category: params?.category,
    event_label: params?.label,
    value: params?.value,
  })
}

// Lead form submission tracking
export function trackLeadSubmission(formName: string, service?: string) {
  trackEvent("generate_lead", {
    category: "form_submission",
    label: formName,
  })

  // Also track as conversion if configured
  if (process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID && process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL) {
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID, process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL)
  }
}

// Chat initiation tracking
export function trackChatInitiated() {
  trackEvent("begin_checkout", {
    category: "engagement",
    label: "chat_initiated",
  })
}
