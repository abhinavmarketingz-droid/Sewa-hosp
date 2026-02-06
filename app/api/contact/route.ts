import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { getSupabaseAdminClient } from "@/lib/supabase-server"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120, "Name is too long"),
  email: z.string().trim().email("Invalid email format").max(254, "Email is too long"),
  nationality: z.string().trim().max(120, "Nationality is too long").optional().or(z.literal("")),
  serviceInterest: z
    .string()
    .trim()
    .min(2, "Service interest is required")
    .max(120, "Service interest is too long"),
  preferredLanguage: z.string().trim().max(10, "Preferred language is too long").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message is too short").max(2000, "Message is too long"),
  website: z
    .string()
    .optional()
    .refine((value) => !value || value.trim().length === 0, "Spam detected"),
})

interface ContactFormData {
  name: string
  email: string
  nationality: string
  serviceInterest: string
  preferredLanguage: string
  message: string
  website?: string
}

interface ConciergeRequestRecord {
  name: string
  email: string
  nationality: string | null
  service_interest: string
  preferred_language: string | null
  message: string
  submitted_at: string
  ip_address: string | null
  user_agent: string | null
}

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")

async function sendEmail(data: ContactFormData) {
  try {
    const safeName = escapeHtml(data.name)
    const safeEmail = escapeHtml(data.email)
    const safeNationality = escapeHtml(data.nationality || "Not specified")
    const safeService = escapeHtml(data.serviceInterest)
    const safeLanguage = escapeHtml(data.preferredLanguage || "Not specified")
    const safeMessage = escapeHtml(data.message)

    const response = await resend.emails.send({
      from: "concierge@sewa-hospitality.com",
      to: "concierge@sewa-hospitality.com",
      replyTo: data.email,
      subject: `SEWA Hospitality Concierge Request - ${safeService}`,
      text: `New Concierge Request

Name: ${safeName}
Email: ${safeEmail}
Nationality: ${safeNationality}
Service Interest: ${safeService}
Preferred Language: ${safeLanguage}

Message:
${safeMessage}
`,
      html: `
        <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a4d2e; font-size: 24px; margin-bottom: 20px;">New Concierge Request</h2>
          
          <div style="background-color: #f5f5f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 8px 0;"><strong>Nationality:</strong> ${safeNationality}</p>
            <p style="margin: 8px 0;"><strong>Service Interest:</strong> ${safeService}</p>
            <p style="margin: 8px 0;"><strong>Preferred Language:</strong> ${safeLanguage}</p>
          </div>
          
          <h3 style="color: #1a4d2e; margin-bottom: 10px;">Message:</h3>
          <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #999;">
            <p>This is an automated message from SEWA Hospitality website.</p>
          </div>
        </div>
      `,
    })

    // Also send confirmation to client
    if (response.data?.id) {
      await resend.emails.send({
        from: "concierge@sewa-hospitality.com",
        to: data.email,
        subject: "Thank You - SEWA Hospitality Concierge Request Received",
        text: `Dear ${safeName},

Thank you for reaching out to SEWA Hospitality. We have received your concierge request and greatly appreciate your interest in our services.

Our dedicated concierge team will review your requirements and contact you within 24 hours to discuss how we can best serve you.

Your Request Details:
Service: ${safeService}
Preferred Language: ${safeLanguage}

In the meantime, if you have any urgent questions, please feel free to reach out to our concierge desk directly.

Best regards,
SEWA Hospitality Concierge Team
`,
        html: `
          <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a4d2e; font-size: 24px; margin-bottom: 20px;">Request Received</h2>
            
            <p style="color: #333; line-height: 1.6;">Dear ${safeName},</p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              Thank you for reaching out to SEWA Hospitality. We have received your concierge request and greatly appreciate your interest in our services.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              Our dedicated concierge team will review your requirements and contact you within 24 hours to discuss how we can best serve you.
            </p>
            
            <div style="background-color: #f5f5f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #1a4d2e;">Your Request Details:</p>
              <p style="margin: 8px 0; font-size: 14px;">Service: ${safeService}</p>
              <p style="margin: 8px 0; font-size: 14px;">Preferred Language: ${safeLanguage}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              In the meantime, if you have any urgent questions, please feel free to reach out to our concierge desk directly.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Best regards,<br/>
              <strong>SEWA Hospitality Concierge Team</strong>
            </p>
            
            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #999;">
              <p style="margin: 0;">SEWA Hospitality Services Pvt. Ltd.</p>
              <p style="margin: 4px 0;">Gurgaon, India</p>
            </div>
          </div>
        `,
      })
    }

    return {
      success: true,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return {
      success: false,
      message: "Failed to send email",
    }
  }
}

async function storeSubmission(data: ContactFormData, request: NextRequest) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    throw new Error("Supabase is not configured")
  }

  const forwardedFor = request.headers.get("x-forwarded-for")
  const ipAddress = forwardedFor ? forwardedFor.split(",")[0]?.trim() : null
  const userAgent = request.headers.get("user-agent")

  const record: ConciergeRequestRecord = {
    name: data.name,
    email: data.email,
    nationality: data.nationality || null,
    service_interest: data.serviceInterest,
    preferred_language: data.preferredLanguage || null,
    message: data.message,
    submitted_at: new Date().toISOString(),
    ip_address: ipAddress,
    user_agent: userAgent,
  }

  const { error } = await supabase.from("concierge_requests").insert([record])

  if (error) {
    throw new Error(error.message)
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const parsed = contactSchema.safeParse(data)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request" }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service is not configured" }, { status: 503 })
    }

    const parsedData = parsed.data

    if (parsedData.website) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    try {
      await storeSubmission(parsedData, request)
    } catch (error) {
      console.error("Submission storage error:", error)
      return NextResponse.json({ error: "Unable to store your request right now." }, { status: 503 })
    }

    const emailResult = await sendEmail(parsedData)

    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    // Return success response
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
