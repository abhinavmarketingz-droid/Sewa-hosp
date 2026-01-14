import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  nationality: string
  serviceInterest: string
  preferredLanguage: string
  message: string
}

async function sendEmail(data: ContactFormData) {
  try {
    const response = await resend.emails.send({
      from: "concierge@sewa-hospitality.com",
      to: "concierge@sewa-hospitality.com",
      replyTo: data.email,
      subject: `SEWA Hospitality Concierge Request - ${data.serviceInterest}`,
      html: `
        <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a4d2e; font-size: 24px; margin-bottom: 20px;">New Concierge Request</h2>
          
          <div style="background-color: #f5f5f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 8px 0;"><strong>Nationality:</strong> ${data.nationality || "Not specified"}</p>
            <p style="margin: 8px 0;"><strong>Service Interest:</strong> ${data.serviceInterest}</p>
            <p style="margin: 8px 0;"><strong>Preferred Language:</strong> ${data.preferredLanguage}</p>
          </div>
          
          <h3 style="color: #1a4d2e; margin-bottom: 10px;">Message:</h3>
          <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          
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
        html: `
          <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a4d2e; font-size: 24px; margin-bottom: 20px;">Request Received</h2>
            
            <p style="color: #333; line-height: 1.6;">Dear ${data.name},</p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              Thank you for reaching out to SEWA Hospitality. We have received your concierge request and greatly appreciate your interest in our services.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              Our dedicated concierge team will review your requirements and contact you within 24 hours to discuss how we can best serve you.
            </p>
            
            <div style="background-color: #f5f5f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #1a4d2e;">Your Request Details:</p>
              <p style="margin: 8px 0; font-size: 14px;">Service: ${data.serviceInterest}</p>
              <p style="margin: 8px 0; font-size: 14px;">Preferred Language: ${data.preferredLanguage}</p>
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

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Send email
    const emailResult = await sendEmail(data)

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
