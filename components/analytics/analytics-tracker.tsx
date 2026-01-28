"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackPageView, updatePageDuration } from "@/lib/actions/analytics"

// Get or create visitor ID
function getVisitorId(): string {
  if (typeof window === "undefined") return ""

  let visitorId = localStorage.getItem("sewa_visitor_id")
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    localStorage.setItem("sewa_visitor_id", visitorId)
  }
  return visitorId
}

// Get or create session ID
function getSessionId(): string {
  if (typeof window === "undefined") return ""

  let sessionId = sessionStorage.getItem("sewa_session_id")
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem("sewa_session_id", sessionId)
  }
  return sessionId
}

// Get device info
function getDeviceInfo() {
  if (typeof window === "undefined") {
    return { deviceType: "unknown", browser: "unknown", os: "unknown", screenResolution: "unknown" }
  }

  const ua = navigator.userAgent
  let deviceType = "desktop"
  if (/mobile/i.test(ua)) deviceType = "mobile"
  else if (/tablet|ipad/i.test(ua)) deviceType = "tablet"

  let browser = "unknown"
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) browser = "Chrome"
  else if (/firefox/i.test(ua)) browser = "Firefox"
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari"
  else if (/edge/i.test(ua)) browser = "Edge"

  let os = "unknown"
  if (/windows/i.test(ua)) os = "Windows"
  else if (/mac/i.test(ua)) os = "macOS"
  else if (/linux/i.test(ua)) os = "Linux"
  else if (/android/i.test(ua)) os = "Android"
  else if (/ios|iphone|ipad/i.test(ua)) os = "iOS"

  const screenResolution = `${window.screen.width}x${window.screen.height}`

  return { deviceType, browser, os, screenResolution }
}

// Get UTM parameters
function getUtmParams() {
  if (typeof window === "undefined") return {}

  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
    gclid: params.get("gclid") || undefined,
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageStartTime = useRef<number>(Date.now())
  const lastPathname = useRef<string>("")

  useEffect(() => {
    // Track page view
    const trackView = async () => {
      if (pathname === lastPathname.current) return
      lastPathname.current = pathname

      const visitorId = getVisitorId()
      const sessionId = getSessionId()
      const deviceInfo = getDeviceInfo()
      const utmParams = getUtmParams()

      pageStartTime.current = Date.now()

      await trackPageView({
        visitorId,
        sessionId,
        pagePath: pathname,
        pageTitle: document.title,
        referrer: document.referrer || undefined,
        ...utmParams,
        ...deviceInfo,
        language: navigator.language,
      })
    }

    trackView()

    // Track duration when leaving page
    return () => {
      const duration = Math.floor((Date.now() - pageStartTime.current) / 1000)
      if (duration > 0 && lastPathname.current) {
        updatePageDuration(getSessionId(), lastPathname.current, duration)
      }
    }
  }, [pathname, searchParams])

  // Track duration on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - pageStartTime.current) / 1000)
      if (duration > 0) {
        // Use sendBeacon for reliable tracking on unload
        const data = JSON.stringify({
          sessionId: getSessionId(),
          pagePath: pathname,
          duration,
        })
        navigator.sendBeacon("/api/analytics/duration", data)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [pathname])

  return null
}
