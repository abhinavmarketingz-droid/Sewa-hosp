# SEWA Hospitality - Setup & Configuration Guide

## Project Overview

This is a luxury hospitality website built with Next.js 16, featuring:
- Multi-language support (10 languages)
- Email integration with Resend
- Responsive design with Tailwind CSS
- Context-based language switching
- Supabase & Neon database ready

## Prerequisites Setup

### 1. Required Environment Variables

Add these to your Vercel project environment variables:

```
RESEND_API_KEY=your_resend_api_key
```

### 2. Admin Dashboard Access

Admin access uses Supabase Auth (email/password). Create users in Supabase Auth and assign roles in the `profiles` table.

### 3. Database Integration (Required for Admin)

The admin dashboard and contact request storage require Supabase:

**Supabase:**
```
SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Neon:**
```
DATABASE_URL=your_neon_database_url
```

## Architecture Overview

### File Structure

```
app/
├── layout.tsx                 # Root layout with Providers wrapper
├── page.tsx                   # Homepage (Client Component)
├── about/page.tsx            # About page
├── services/page.tsx         # Services page
├── corporate/page.tsx        # Corporate solutions page
├── destinations/page.tsx     # Destinations page
├── partners/page.tsx         # Partners page
├── contact/page.tsx          # Contact page
└── api/
    └── contact/route.ts      # Email API endpoint

components/
├── header.tsx                # Navigation header with language switcher
├── footer.tsx                # Footer with language support
├── contact/
│   └── concierge-form.tsx   # Contact form component
└── home/
    ├── hero-section.tsx      # Homepage hero
    ├── who-we-serve.tsx      # Target audience section
    ├── services-grid.tsx     # Services grid display
    ├── why-sewa.tsx          # Value proposition
    ├── destinations-scroll.tsx # Destinations carousel
    └── final-cta.tsx         # Final call-to-action

lib/
├── i18n.ts                   # Language definitions & translations (10 languages)
├── language-context.tsx      # React Context for language management
└── utils.ts                  # Utility functions

public/
├── site-structure.json       # Complete site architecture in JSON format
└── [images]                  # Image assets

```

### Key Components

1. **Providers Wrapper** (`app/providers.tsx`)
   - Wraps entire app with LanguageProvider
   - Must be "use client" directive

2. **Language Context** (`lib/language-context.tsx`)
   - Manages language state with localStorage persistence
   - useLanguage() hook for accessing translations
   - Supports SSR hydration with mounted state

3. **All Pages**
   - Must have "use client" directive to access context
   - Import and use Header & Footer components
   - Use useLanguage() hook for dynamic content

## Email Integration Setup

### Resend Configuration

1. Get your API key from https://resend.com
2. Add `RESEND_API_KEY` to environment variables
3. Set reply-to email in `.env.local` (optional for development)

### Email Features

- ✓ Automatic confirmation emails to users
- ✓ Notification emails to concierge team
- ✓ HTML formatted professional templates
- ✓ Form validation on client & server

### Testing Email in Development

```bash
# Install dependencies
npm install resend

# Emails sent to RESEND_TEST_FROM_EMAIL during development
RESEND_TEST_FROM_EMAIL=test@example.com
```

## Multi-Language Implementation

### Supported Languages (10 Total)

1. English (en)
2. Hindi (hi)
3. Japanese (ja)
4. Korean (ko)
5. French (fr)
6. German (de)
7. Spanish (es)
8. Russian (ru)
9. Chinese (zh)
10. Turkish (tr)

### Using Translations

```tsx
import { useLanguage } from "@/lib/language-context"

export function MyComponent() {
  const { t, language, setLanguage } = useLanguage()
  
  return <h1>{t("nav.home")}</h1>  // Displays in current language
}
```

### Adding New Translations

1. Edit `lib/i18n.ts`
2. Add new keys under each language object
3. Use dot notation: `t("section.key")`

## Deployment

### Vercel Deployment

```bash
# Push to GitHub (or connect repo)
git push origin main

# Vercel auto-deploys on push
# Add environment variables in Vercel Dashboard > Settings > Environment Variables
```

### Environment Variables Needed on Vercel

1. `RESEND_API_KEY` - For email functionality
2. Supabase credentials (required for request storage + admin dashboard + auth)

## Page Structure & Navigation

| Page | Route | Purpose | Features |
|------|-------|---------|----------|
| Homepage | `/` | Main landing page | Hero, Services, Destinations, CTA |
| About | `/about` | Company information | Story, Vision, Leadership, Values |
| Services | `/services` | Detailed service listings | 6 service categories with details |
| Corporate | `/corporate` | B2B solutions | Executive relocation, housing, transport |
| Destinations | `/destinations` | Curated locations | 7 Indian destinations with experiences |
| Partners | `/partners` | Partnership info | Hotel, transport, property, legal partners |
| Contact | `/contact` | Concierge form | Form with email integration, contact info |

## Form Submission Flow

```
User fills form → Client validation → API POST to /api/contact
   ↓
Server validation → Supabase storage → Resend email send to concierge + confirmation to user
   ↓
Success message displayed → Form resets after 5 seconds
```

## Supabase Table Setup

Create a `concierge_requests` table in Supabase:

```sql
create table if not exists concierge_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  nationality text,
  service_interest text not null,
  preferred_language text,
  message text not null,
  submitted_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

create index if not exists concierge_requests_submitted_at_idx
  on concierge_requests (submitted_at desc);
```

Create content tables for admin-managed services and destinations:

```sql
create table if not exists content_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_key text,
  description text not null,
  items text[] not null,
  position integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists content_destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  headline text not null,
  description text not null,
  services text[] not null,
  highlights text[] not null,
  image_url text,
  position integer default 0,
  created_at timestamptz not null default now()
);

create index if not exists content_services_position_idx
  on content_services (position asc);

create index if not exists content_destinations_position_idx
  on content_destinations (position asc);
```

Create identity, roles, banners, sections, and audit tables:

```sql
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  role text not null default 'viewer',
  created_at timestamptz not null default now()
);

create table if not exists content_banners (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  message text not null,
  cta_label text,
  cta_url text,
  variant text not null default 'primary',
  active boolean not null default true,
  position integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists content_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null,
  image_url text,
  cta_label text,
  cta_url text,
  active boolean not null default true,
  position integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text not null,
  resource text not null,
  metadata jsonb not null default '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);
```

Add a trigger so new auth users get a profile:

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, role)
  values (new.id, new.email, 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

Enable Row Level Security and policies:

```sql
alter table profiles enable row level security;
alter table content_services enable row level security;
alter table content_destinations enable row level security;
alter table content_banners enable row level security;
alter table content_sections enable row level security;
alter table concierge_requests enable row level security;
alter table audit_logs enable row level security;

create policy "Profiles are viewable by owner"
  on profiles for select
  using (auth.uid() = id);

create policy "Admins can manage profiles"
  on profiles for all
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Public can read content"
  on content_services for select
  using (true);

create policy "Public can read destinations"
  on content_destinations for select
  using (true);

create policy "Public can read banners"
  on content_banners for select
  using (true);

create policy "Public can read sections"
  on content_sections for select
  using (true);

create policy "Admins can manage content"
  on content_services for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','editor')));

create policy "Admins can manage destinations"
  on content_destinations for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','editor')));

create policy "Admins can manage banners"
  on content_banners for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','editor')));

create policy "Admins can manage sections"
  on content_sections for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','editor')));

create policy "Admins can view concierge requests"
  on concierge_requests for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','editor','viewer')));

create policy "Admins can insert concierge requests"
  on concierge_requests for insert
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','editor')));

create policy "Admins can view audit logs"
  on audit_logs for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
```

## Responsive Breakpoints

- Mobile: < 768px (md breakpoint)
- Tablet: 768px - 1024px
- Desktop: > 1024px

All pages are mobile-first responsive using Tailwind CSS.

## Troubleshooting

### "useLanguage must be used within LanguageProvider" Error

**Solution:** Ensure page has `"use client"` directive at top:
```tsx
"use client"
import { useLanguage } from "@/lib/language-context"
```

### Emails not sending

1. Check RESEND_API_KEY is set in environment
2. Verify email format in form validation
3. Check Resend dashboard for API usage
4. Look at server logs for errors

### Language not persisting on refresh

- Check localStorage permissions in browser
- Language defaults to "en" on first visit
- User's selected language saved to localStorage as "sewa-language"

## Future Enhancements

1. **Database Integration**
   - Connect Supabase for concierge request storage
   - Track form submissions and follow-ups

2. **User Accounts**
   - Supabase Auth for user registration
   - Personalized dashboard for clients

3. **Content Management**
   - Migrate translations to CMS
   - Dynamic destination & partner listings

4. **Analytics**
   - Page view tracking
   - Form submission metrics
   - User behavior insights

## Support

For issues or questions:
- Contact: support@sewa-hospitality.com
- Docs: See README.md and ARCHITECTURE.md

---

**Last Updated:** January 2026
**Version:** 1.0.0
