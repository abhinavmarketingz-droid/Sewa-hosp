# SEWA Hospitality Website - Email Integration Setup Guide

## Overview
The contact form is fully functional with server validation, Supabase storage, and Resend email delivery. Submissions are stored and visible in the admin dashboard once Supabase is configured.

## Email Service Integration Options

### Option 1: Resend (Recommended for Next.js)
1. Install Resend: `npm install resend`
2. Get API key from [https://resend.com](https://resend.com)
3. Add to `.env.local`: `RESEND_API_KEY=your_api_key`
4. Update `/app/api/contact/route.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(data: ContactFormData) {
  try {
    const response = await resend.emails.send({
      from: 'concierge@sewa-hospitality.com',
      to: data.email,
      subject: 'SEWA Concierge Request Received',
      html: `<h2>Request Received</h2><p>Thank you for your interest in SEWA services.</p>`,
    });
    
    // Optional: send admin notification email (in addition to dashboard storage)
    await resend.emails.send({
      from: 'system@sewa-hospitality.com',
      to: 'admin@sewa-hospitality.com',
      subject: `New Concierge Request from ${data.name}`,
      html: `<pre>${JSON.stringify(data, null, 2)}</pre>`,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false };
  }
}
```

### Option 2: SendGrid
1. Get API key from [https://sendgrid.com](https://sendgrid.com)
2. Install: `npm install @sendgrid/mail`
3. Add to `.env.local`: `SENDGRID_API_KEY=your_api_key`
4. Update route.ts with SendGrid client

### Option 3: Nodemailer (For Gmail/Custom SMTP)
1. Install: `npm install nodemailer`
2. Configure in `.env.local` with SMTP credentials
3. Update route.ts with nodemailer transporter

## Database Integration (Required for Admin)
To store form submissions and power the admin dashboard:

### With Supabase:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { error } = await supabase
  .from('concierge_requests')
  .insert([data]);
```

### With Neon/PostgreSQL:
```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
await sql`INSERT INTO concierge_requests (name, email, ...) VALUES (...)`;
```

## Form Fields
- **Name**: Required
- **Email**: Required, validated
- **Nationality**: Optional
- **Service Interest**: Required, dropdown selection
- **Preferred Language**: 10 languages supported
- **Message**: Required, long form text

## Admin Dashboard

- The admin panel lives at `/admin`
- It is protected by HTTP Basic Auth (`ADMIN_USERNAME` + `ADMIN_PASSWORD`)
- Concierge requests are stored in Supabase and listed in the dashboard

## Response Flow
1. User submits form → Client-side validation
2. POST to `/api/contact` with form data
3. Server-side validation
4. Data stored in Supabase
5. Email sent to user + concierge team
6. Success message displayed to user

## Deployment Checklist
- [ ] Configure email service provider
- [ ] Add API keys to environment variables
- [ ] Update email templates
- [ ] Set up Supabase database for submissions
- [ ] Test form submission end-to-end
- [ ] Configure SMTP/email sender domain
- [ ] Set up email forwarding rules
- [ ] Enable form spam protection (reCAPTCHA optional)

## Security Notes
- Email validation is implemented
- All inputs are sanitized
- API route is protected from CSRF
- Consider adding rate limiting for production
- Use environment variables for sensitive data
- Add reCAPTCHA for production deployment
