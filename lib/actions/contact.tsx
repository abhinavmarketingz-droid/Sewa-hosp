"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  phone?: string
  nationality?: string
  preferredLanguage?: string
  serviceInterest?: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  const supabase = await createClient()
  const headersList = await headers()

  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown"
  const userAgent = headersList.get("user-agent") || ""
  const referrer = headersList.get("referer") || ""

  // Get UTM parameters from referrer URL if present
  let utmSource = null
  let utmMedium = null
  let utmCampaign = null

  try {
    if (referrer) {
      const url = new URL(referrer)
      utmSource = url.searchParams.get("utm_source")
      utmMedium = url.searchParams.get("utm_medium")
      utmCampaign = url.searchParams.get("utm_campaign")
    }
  } catch {
    // Invalid URL, ignore
  }

  const { error } = await supabase.from("contact_submissions").insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    nationality: data.nationality || null,
    preferred_language: data.preferredLanguage || null,
    service_interest: data.serviceInterest || null,
    message: data.message,
    status: "new",
    ip_address: ip,
    user_agent: userAgent,
    referrer: referrer,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
  })

  if (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, error: "Failed to submit form" }
  }

  // Send email notification
  try {
    await resend.emails.send({
      from: "Sewa Hospitality <noreply@sewahospitality.com>",
      to: ["contact@sewahospitality.com"],
      subject: `New Contact Form: ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Nationality:</strong> ${data.nationality || "Not provided"}</p>
        <p><strong>Service Interest:</strong> ${data.serviceInterest || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    })
  } catch (emailError) {
    console.error("Error sending email notification:", emailError)
    // Don't fail the form submission if email fails
  }

  return { success: true }
}
