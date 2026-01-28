"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

interface AnalyticsData {
  visitorId: string
  sessionId: string
  pagePath: string
  pageTitle?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
  deviceType?: string
  browser?: string
  os?: string
  screenResolution?: string
  language?: string
  durationSeconds?: number
}

export async function trackPageView(data: AnalyticsData) {
  try {
    const supabase = await createClient()
    const headersList = await headers()

    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown"

    // Get geo data from IP (in production, use a service like MaxMind or ipinfo)
    const country = null
    const region = null
    const city = null

    const { error } = await supabase.from("visitor_analytics").insert({
      visitor_id: data.visitorId,
      session_id: data.sessionId,
      page_path: data.pagePath,
      page_title: data.pageTitle || null,
      referrer: data.referrer || null,
      utm_source: data.utmSource || null,
      utm_medium: data.utmMedium || null,
      utm_campaign: data.utmCampaign || null,
      utm_term: data.utmTerm || null,
      utm_content: data.utmContent || null,
      gclid: data.gclid || null,
      ip_address: ip,
      country,
      region,
      city,
      device_type: data.deviceType || null,
      browser: data.browser || null,
      os: data.os || null,
      screen_resolution: data.screenResolution || null,
      language: data.language || null,
      duration_seconds: data.durationSeconds || 0,
    })

    if (error) {
      console.error("[v0] Error tracking page view:", error.message)
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Exception tracking page view:", error instanceof Error ? error.message : String(error))
    // Return success anyway to not break page loads
    return { success: true }
  }
}

export async function updatePageDuration(sessionId: string, pagePath: string, duration: number) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("visitor_analytics")
      .update({ duration_seconds: duration })
      .eq("session_id", sessionId)
      .eq("page_path", pagePath)

    if (error) {
      console.error("[v0] Error updating page duration:", error.message)
    }
  } catch (error) {
    console.error("[v0] Exception updating page duration:", error instanceof Error ? error.message : String(error))
  }
}
