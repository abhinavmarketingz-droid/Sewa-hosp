import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  phone?: string
  nationality?: string
  serviceInterest: string
  preferredLanguage: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()
    const headersList = await headers()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Get request metadata
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown"
    const userAgent = headersList.get("user-agent") || ""
    const referrer = headersList.get("referer") || ""

    // Get UTM params from referrer URL
    let utmSource: string | null = null
    let utmMedium: string | null = null
    let utmCampaign: string | null = null

    try {
      const refUrl = new URL(referrer)
      utmSource = refUrl.searchParams.get("utm_source")
      utmMedium = refUrl.searchParams.get("utm_medium")
      utmCampaign = refUrl.searchParams.get("utm_campaign")
    } catch {
      // Invalid referrer URL, ignore
    }

    const supabase = await createClient()
    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      nationality: data.nationality || null,
      service_interest: data.serviceInterest,
      preferred_language: data.preferredLanguage,
      message: data.message,
      status: "new",
      ip_address: ip,
      user_agent: userAgent,
      referrer: referrer || null,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      // Continue even if DB fails - email is more important
    }

    // Send email notification
    try {
      await resend.emails.send({
        from: "SEWA Hospitality <noreply@resend.dev>",
        to: "concierge@sewa-hospitality.com",
        replyTo: data.email,
        subject: `SEWA Concierge Request - ${data.serviceInterest}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a4d2e; font-size: 24px; margin-bottom: 20px;">New Concierge Request</h2>
            
            <div style="background-color: #f5f5f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
              <p style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
              <p style="margin: 8px 0;"><strong>Nationality:</strong> ${data.nationality || "Not specified"}</p>
              <p style="margin: 8px 0;"><strong>Service Interest:</strong> ${data.serviceInterest}</p>
              <p style="margin: 8px 0;"><strong>Preferred Language:</strong> ${data.preferredLanguage}</p>
            </div>
            
            <h3 style="color: #1a4d2e; margin-bottom: 10px;">Message:</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
            
            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #999;">
              <p>IP: ${ip}</p>
              <p>Referrer: ${referrer || "Direct"}</p>
              ${utmSource ? `<p>UTM Source: ${utmSource}</p>` : ""}
            </div>
          </div>
        `,
      })

      // Send confirmation to client
      await resend.emails.send({
        from: "SEWA Hospitality <noreply@resend.dev>",
        to: data.email,
        subject: "Thank You - SEWA Hospitality Request Received",
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a4d2e; font-size: 24px; margin-bottom: 20px;">Request Received</h2>
            
            <p style="color: #333; line-height: 1.6;">Dear ${data.name},</p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              Thank you for reaching out to SEWA Hospitality. We have received your concierge request.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              Our dedicated team will review your requirements and contact you within 24 hours.
            </p>
            
            <div style="background-color: #f5f5f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #1a4d2e;">Your Request:</p>
              <p style="margin: 8px 0; font-size: 14px;">Service: ${data.serviceInterest}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Best regards,<br/>
              <strong>SEWA Hospitality Concierge Team</strong>
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email error:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your request has been received. We will contact you shortly.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
