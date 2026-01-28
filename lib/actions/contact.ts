"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

interface ContactFormData {
  name: string
  email: string
  phone?: string
  nationality?: string
  serviceInterest?: string
  preferredLanguage?: string
  message: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const supabase = await createClient()
    const headersList = await headers()

    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown"
    const userAgent = headersList.get("user-agent") || ""
    const referrer = headersList.get("referer") || null

    const { data: submission, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        nationality: data.nationality || null,
        service_interest: data.serviceInterest || null,
        preferred_language: data.preferredLanguage || "en",
        message: data.message,
        status: "new",
        ip_address: ip,
        user_agent: userAgent,
        referrer,
        utm_source: data.utmSource || null,
        utm_medium: data.utmMedium || null,
        utm_campaign: data.utmCampaign || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error submitting contact form:", error.message)
      return { success: false, error: "Failed to submit form. Please try again." }
    }

    return { success: true, submission }
  } catch (error) {
    console.error("[v0] Exception submitting contact form:", error instanceof Error ? error.message : String(error))
    return { success: false, error: "An unexpected error occurred. Please try again later." }
  }
}

export async function getContactSubmission(id: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("[v0] Error fetching contact submission:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.error("[v0] Exception fetching contact submission:", error instanceof Error ? error.message : String(error))
    return null
  }
}
