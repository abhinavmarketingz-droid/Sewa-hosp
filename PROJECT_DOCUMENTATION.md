# SEWA Hospitality - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [Architecture & Database Design](#architecture--database-design)
4. [Information Architecture](#information-architecture)
5. [UI/UX Design System](#uiux-design-system)
6. [Frontend Implementation](#frontend-implementation)
7. [Admin Dashboard](#admin-dashboard)
8. [Backend Services & APIs](#backend-services--apis)
9. [Live Chat System](#live-chat-system)
10. [Analytics & Tracking](#analytics--tracking)
11. [SEO & Content Optimization](#seo--content-optimization)
12. [Authentication & Security](#authentication--security)
13. [Deployment & DevOps](#deployment--devops)
14. [Future Enhancements](#future-enhancements)
15. [Development Workflow](#development-workflow)

---

## Project Overview

### Mission & Vision
**SEWA Hospitality** is a premium hospitality concierge platform specializing in connecting international travelers and businesses with world-class healthcare, luxury travel, wellness, and cultural experiences across India.

### Core Services
- **Medical Tourism**: World-class healthcare coordination with hospital partnerships
- **Luxury Travel**: Bespoke luxury experiences across India's exclusive destinations
- **Wellness Retreats**: Authentic Ayurveda, yoga, and holistic healing programs
- **Corporate Services**: End-to-end MICE (Meetings, Incentives, Conferences, Exhibitions) solutions
- **Destination Weddings**: Premium celebration planning at India's finest venues
- **Heritage Tours**: Cultural immersion and historical site exploration

### Key Features
- Multi-language support (English, Hindi, Japanese, Korean, French, German, Spanish, Russian, Chinese, Turkish)
- Real-time live chat with persistent sessions across page navigation
- Comprehensive analytics tracking with IP-based geolocation
- Admin dashboard for content, chat, and contact management
- Visitor analytics with session tracking and conversion monitoring
- SEO-optimized pages with structured data markup
- Google Ads integration with conversion tracking (gclid parameter support)
- Responsive design optimized for mobile and desktop
- Production-grade security with proper authentication and authorization

---

## Technical Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2 with Server Components
- **Styling**: Tailwind CSS v4
- **Component Library**: shadcn/ui
- **Package Manager**: npm
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js (Next.js Server Functions)
- **Database**: Supabase (PostgreSQL with RLS)
- **ORM/Query Builder**: Supabase JavaScript Client
- **Authentication**: Custom session-based (bcryptjs)
- **Email**: Resend (optional integration)
- **File Storage**: Vercel Blob (optional)

### DevOps & Deployment
- **Hosting**: Vercel
- **Version Control**: Git (GitHub integration)
- **Environment Variables**: Vercel Dashboard
- **Analytics**: Vercel Web Analytics
- **Monitoring**: Vercel Observability

### Development Tools
- **Build Tool**: Turbopack (Next.js 16 default)
- **Code Quality**: Biome
- **Type Safety**: TypeScript strict mode
- **Real-time Updates**: Supabase Realtime

---

## Architecture & Database Design

### Database Schema

#### 1. Content Tables

**site_settings**
```sql
- id: UUID (Primary Key)
- key: TEXT (UNIQUE)
- value: JSONB
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ

Stores: company info, social links, SEO defaults, feature flags
```

**pages**
```sql
- id: UUID (Primary Key)
- slug: TEXT (UNIQUE)
- title: TEXT
- description: TEXT
- meta_keywords: TEXT[]
- og_image: TEXT
- canonical_url: TEXT
- structured_data: JSONB
- is_published: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ

Stores: Page metadata for SEO and social sharing
```

**services**
```sql
- id: UUID (Primary Key)
- slug: TEXT (UNIQUE)
- title: TEXT (+ translations: title_hi, title_ja, title_ko, title_fr, title_de, title_es, title_ru, title_zh, title_tr)
- description: TEXT (+ translated versions)
- items: TEXT[] (Service features/bullets)
- icon: TEXT (Icon name for UI)
- image_url: TEXT
- display_order: INT
- is_featured: BOOLEAN
- is_published: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ

Stores: 6 core service offerings with multi-language support
```

**destinations**
```sql
- id: UUID (Primary Key)
- slug: TEXT (UNIQUE)
- name: TEXT (+ name_hi)
- headline: TEXT (+ headline_hi)
- description: TEXT (+ description_hi)
- icon: TEXT
- services: TEXT[] (Associated services)
- highlights: TEXT[] (Key attractions)
- image_url: TEXT
- gallery_images: TEXT[]
- display_order: INT
- is_featured: BOOLEAN
- is_published: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ

Stores: 6 destination profiles (Delhi, Mumbai, Rajasthan, Kerala, Goa, Varanasi)
```

**team_members**
```sql
- id: UUID (Primary Key)
- name: TEXT
- title: TEXT
- bio: TEXT
- expertise: TEXT[]
- languages: TEXT[]
- image_url: TEXT
- linkedin_url: TEXT
- display_order: INT
- is_leadership: BOOLEAN
- is_published: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ

Stores: 4 leadership team profiles
```

**partners**
```sql
- id: UUID (Primary Key)
- name: TEXT
- category: TEXT (Healthcare, Hospitality, Aviation, Tourism)
- description: TEXT
- logo_url: TEXT
- website_url: TEXT
- display_order: INT
- is_featured: BOOLEAN
- is_published: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ

Stores: 8+ partner organizations across categories
```

**testimonials**
```sql
- id: UUID (Primary Key)
- client_name: TEXT
- client_title: TEXT
- client_company: TEXT
- client_location: TEXT
- client_image_url: TEXT
- platform: TEXT (google, trustpilot, tripadvisor, yelp, direct)
- platform_url: TEXT
- rating: INT (1-5)
- content: TEXT (+ content_hi)
- service_type: TEXT
- destination: TEXT
- is_featured: BOOLEAN
- is_published: BOOLEAN
- display_order: INT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ

Stores: 6+ featured testimonials with platform links
```

#### 2. Contact & Lead Management

**contact_submissions**
```sql
- id: UUID (Primary Key)
- name: TEXT
- email: TEXT
- phone: TEXT
- nationality: TEXT
- service_interest: TEXT
- preferred_language: TEXT
- message: TEXT
- status: TEXT (new, contacted, qualified, converted, declined)
- admin_notes: TEXT
- replied_at: TIMESTAMPTZ
- ip_address: TEXT
- user_agent: TEXT
- referrer: TEXT
- utm_source: TEXT
- utm_medium: TEXT
- utm_campaign: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ

Stores: Contact form submissions with UTM tracking and admin notes
```

#### 3. Live Chat System

**chat_sessions**
```sql
- id: UUID (Primary Key)
- visitor_id: TEXT
- visitor_name: TEXT
- visitor_email: TEXT
- visitor_phone: TEXT
- status: TEXT (active, closed, inactive)
- ip_address: TEXT
- user_agent: TEXT
- location_country: TEXT
- location_city: TEXT
- page_url: TEXT
- started_at: TIMESTAMPTZ
- ended_at: TIMESTAMPTZ
- last_message_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ

Stores: Chat session metadata and participant info
```

**chat_messages**
```sql
- id: UUID (Primary Key)
- session_id: UUID (FK -> chat_sessions)
- sender_type: TEXT (visitor, admin, system)
- sender_name: TEXT
- message: TEXT
- is_read: BOOLEAN
- created_at: TIMESTAMPTZ

Stores: Individual chat messages within sessions
```

#### 4. Analytics & Tracking

**visitor_analytics**
```sql
- id: UUID (Primary Key)
- visitor_id: TEXT
- session_id: TEXT
- page_path: TEXT
- page_title: TEXT
- referrer: TEXT
- utm_source: TEXT
- utm_medium: TEXT
- utm_campaign: TEXT
- utm_term: TEXT
- utm_content: TEXT
- gclid: TEXT (Google Click ID for Ads conversion tracking)
- ip_address: TEXT
- country: TEXT
- city: TEXT
- region: TEXT
- device_type: TEXT (mobile, tablet, desktop)
- browser: TEXT
- os: TEXT (iOS, Android, Windows, macOS, Linux)
- screen_resolution: TEXT
- language: TEXT
- duration_seconds: INT
- created_at: TIMESTAMPTZ

Stores: Detailed visitor analytics with device, location, and conversion tracking
```

#### 5. Admin Management

**admin_users**
```sql
- id: UUID (Primary Key)
- email: TEXT (UNIQUE)
- password_hash: TEXT (bcryptjs)
- name: TEXT
- role: TEXT (super_admin, admin, support)
- is_active: BOOLEAN
- last_login: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ

Stores: Admin user accounts with role-based access
```

**admin_sessions**
```sql
- id: UUID (Primary Key)
- admin_id: UUID (FK -> admin_users)
- token: TEXT (UNIQUE)
- expires_at: TIMESTAMPTZ
- ip_address: TEXT
- user_agent: TEXT
- created_at: TIMESTAMPTZ

Stores: Active admin sessions with 7-day expiration
```

**audit_log**
```sql
- id: UUID (Primary Key)
- admin_id: UUID (FK -> admin_users)
- action: TEXT (create, update, delete, reply_chat)
- table_name: TEXT
- record_id: UUID
- old_data: JSONB
- new_data: JSONB
- ip_address: TEXT
- created_at: TIMESTAMPTZ

Stores: Audit trail of all admin actions
```

### Database Indexes
- `idx_services_slug`, `idx_services_featured`
- `idx_destinations_slug`, `idx_destinations_featured`
- `idx_partners_category`, `idx_partners_featured`
- `idx_testimonials_platform`, `idx_testimonials_featured`
- `idx_team_members_leadership`
- `idx_pages_slug`
- `idx_contact_status`, `idx_contact_created`
- `idx_chat_sessions_visitor`, `idx_chat_sessions_status`
- `idx_chat_messages_session`
- `idx_analytics_visitor`, `idx_analytics_created`, `idx_analytics_page`
- `idx_admin_sessions_token`, `idx_admin_sessions_admin`

### Row Level Security (RLS) Policies
- **Public can read**: All published content tables
- **Anyone can insert**: Contact submissions, chat sessions, chat messages, analytics
- **Service role only**: Admin tables (full CRUD)
- **Visitors read own sessions**: Chat sessions and messages for their session ID

---

## Information Architecture

### Content Hierarchy

```
SEWA Hospitality/
├── Home (/)
│   ├── Hero Section
│   ├── Services Grid (6 services)
│   ├── Why SEWA Section
│   ├── Who We Serve Section
│   ├── Featured Destinations
│   ├── Featured Partners
│   ├── Testimonials Carousel
│   ├── Final CTA
│   └── Footer
│
├── Services (/services)
│   ├── Service Detail Pages (6 total)
│   ├── Service Features & Benefits
│   ├── Related Destinations
│   ├── CTA Forms
│   └── SEO Optimized
│
├── Destinations (/destinations)
│   ├── Destination Grid
│   ├── Destination Detail Pages (6 total)
│   ├── Gallery View
│   ├── Available Services
│   ├── Highlights & Attractions
│   └── Booking CTA
│
├── About (/about)
│   ├── Company Story
│   ├── Team Members Display
│   ├── Values & Mission
│   ├── Expertise Highlights
│   └── Contact CTA
│
├── Partners (/partners)
│   ├── Partner Categories Filter
│   ├── Partner Grid (8+ partners)
│   ├── Category-based Grouping
│   ├── External Links
│   └── Partnership Opportunities CTA
│
├── Corporate (/corporate)
│   ├── Corporate Services Overview
│   ├── MICE Solutions
│   ├── Case Studies
│   ├── Team Retreat Options
│   ├── Incentive Programs
│   └── Corporate Inquiry Form
│
├── Contact (/contact)
│   ├── Contact Form
│   ├── Contact Information
│   ├── Live Chat Widget
│   ├── Location Map
│   └── Social Links
│
└── Admin (/admin)
    ├── Login (/admin/login)
    ├── Dashboard (/admin)
    ├── Contacts (/admin/contacts)
    ├── Chat (/admin/chat)
    └── Protected Routes with Session Validation
```

### Data Flow Architecture

```
Visitor Journey:
1. Lands on homepage
2. Analytics tracked (visitor_id, utm_params, device info)
3. Browses services/destinations
4. Interacts with live chat widget
5. Submits contact form OR starts chat
6. Data stored in database with full metadata
7. Admin receives notification
8. Admin responds via chat or contact form reply

Admin Journey:
1. Login with credentials
2. Session created with 7-day expiration
3. Access dashboard with metrics
4. View contacts and chat sessions
5. Respond to messages in real-time
6. Track visitor analytics
7. Audit trail records all actions
```

---

## UI/UX Design System

### Color Palette
- **Primary**: #1F2937 (Dark Slate - Luxury & Trust)
- **Accent**: #DC2626 (Crimson Red - Energy & India)
- **Secondary**: #06B6D4 (Cyan - Health & Wellness)
- **Neutral**: #F9FAFB (Off-white), #6B7280 (Gray), #111827 (Near-black)

### Typography
- **Headings**: Geist Font Family (Modern, premium feel)
- **Body**: Geist Sans (Clean, readable)
- **Mono**: Geist Mono (Code, technical content)
- **Line Height**: 1.6 for body, 1.4 for headings

### Spacing Scale (Tailwind)
- xs: 2px (0.125rem)
- sm: 4px (0.25rem)
- md: 8px (0.5rem)
- lg: 16px (1rem)
- xl: 24px (1.5rem)
- 2xl: 32px (2rem)
- 3xl: 48px (3rem)
- 4xl: 64px (4rem)

### Component System

#### Layout Components
- **Header**: Sticky navigation with logo, menu links, CTA button
- **Footer**: Multi-column with links, social, newsletter signup
- **Container**: Max-width 1280px with responsive padding
- **Grid**: 12-column system for flexible layouts

#### Content Components
- **Hero Section**: Full-width banner with background image, headline, CTA
- **Card**: Service/destination/partner cards with image, title, description
- **Testimonial Card**: Client photo, name, company, rating, quote, platform link
- **Team Card**: Photo, name, title, bio, expertise badges
- **Partner Logo**: Clickable partner logos with external links

#### Interactive Components
- **Forms**: Contact form, chat input, search, filters
- **Buttons**: Primary (red), Secondary (outline), Tertiary (text)
- **Inputs**: Text, email, tel, select, textarea with validation
- **Live Chat Widget**: Floating button → modal with persistent session
- **Modals**: Contact form modal, image gallery lightbox

#### Responsive Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+
- Large Desktop: 1280px+

### Accessibility Standards
- WCAG 2.1 AA compliance
- Semantic HTML with proper heading hierarchy
- Alt text for all images
- ARIA labels for interactive elements
- Focus management for keyboard navigation
- Color contrast ratios ≥ 4.5:1 for text

---

## Frontend Implementation

### Page Structure & Components

#### Home Page (/)
**Components**:
- `HeroSection`: Eye-catching banner with gradient overlay, headline, subheading, CTA button
- `ServicesGrid`: 6 service cards in responsive grid (3 cols desktop, 2 cols tablet, 1 col mobile)
- `WhySewaSection`: Value proposition with 4 key differentiators
- `WhoWeServeSection`: 4 audience segments (Patients, Travelers, Couples, Corporates)
- `DestinationsScroll`: Horizontal scroll carousel of featured destinations
- `PartnersSection`: Logo grid with category filters, external links
- `TestimonialsSection`: Interactive carousel with featured testimonial display
- `FinalCTASection`: Newsletter signup and contact form
- `Header`: Sticky navigation
- `Footer`: Multi-column footer with sitemap links

**Data Flow**:
```typescript
getServices({ featured: true, limit: 6 })
  ↓
getDestinations({ featured: true, limit: 6 })
  ↓
getPartners({ featured: true })
  ↓
getTestimonials({ featured: true, limit: 6 })
  ↓
Fallback data if database unavailable
```

**SEO Optimization**:
- Meta title: "SEWA Hospitality - Premium Medical Tourism & Luxury Travel in India"
- Meta description: "Experience world-class medical tourism, luxury travel, wellness retreats in India"
- og:image: Branded hero image
- Structured data: Organization, LocalBusiness, Service schema

#### Services Page (/services)
**Components**:
- `ServicesList`: All 6 services in card grid
- `ServiceCard`: Clickable card with icon, title, description, CTA
- `ServiceDetail`: Full-page service information (when clicked)
  - Service description
  - Key features/benefits list
  - Related destinations
  - Related team members
  - Client testimonials for this service
  - Contact form for inquiries

**Data Flow**:
```typescript
getServices()  // All published services
  ↓
For each service click:
getServiceBySlug(slug)
  ↓
getDestinations where services includes this service
  ↓
getTestimonials where service_type matches
```

**SEO**: Individual meta tags for each service, structured data with Service schema

#### Destinations Page (/destinations)
**Components**:
- `DestinationsList`: Grid of 6 destination cards
- `DestinationCard`: Image, name, headline, quick stats, CTA
- `DestinationDetail`: Full destination experience page
  - Hero image/gallery
  - Description and highlights
  - Available services
  - Related testimonials
  - Photo gallery
  - Booking inquiry form

**Data Flow**:
```typescript
getDestinations()  // All published destinations
  ↓
For each destination click:
getDestinationBySlug(slug)
  ↓
getServices where services includes this destination
  ↓
getTestimonials where destination matches
```

#### About Page (/about)
**Components**:
- `CompanyStory`: Text section with company history
- `MissionValues`: Mission, vision, values statements
- `TeamGrid`: 4 leadership team member profiles
  - Photo, name, title, expertise tags, languages
  - Bio text
  - LinkedIn link
- `Stats`: Key metrics (years, clients, destinations)
- `CultureSection`: Company culture and values

**Data Flow**:
```typescript
getTeamMembers({ is_leadership: true })
getSiteSettings('company')  // Company info
```

#### Partners Page (/partners)
**Components**:
- `CategoryFilter`: Filter buttons for partner categories
- `PartnerGrid`: Responsive grid of partner logos
- `PartnerCard`: Logo, name, category, description, external link
- `PartnerStats`: Number of partners by category

**Data Flow**:
```typescript
getPartners()  // All featured partners
  ↓
Filter by selected category (client-side)
```

#### Corporate Page (/corporate)
**Components**:
- `CorporateHero`: Corporate-focused value proposition
- `MICEServices`: Meeting, Incentive, Conference, Exhibition services
- `CaseStudies`: Success stories from corporate clients
- `OfferedPrograms`: Team retreats, executive travel, incentive programs
- `CorporateForm`: Specialized corporate inquiry form

**Data Flow**:
```typescript
getServices({ service_type: 'Corporate Services' })
getTestimonials({ service_type: 'Corporate Services' })
```

#### Contact Page (/contact)
**Components**:
- `ContactForm`: Full inquiry form with validation
  - Name, email, phone, nationality, service interest
  - Preferred language selector
  - Message textarea
  - Submit button with loading state
- `ContactInfo`: Address, phone, email, hours
- `LiveChatWidget`: Persistent chat interface
- `LocationMap`: Embedded map to office
- `SocialLinks`: Links to social media

**Data Flow**:
```typescript
Contact Form Submit:
  ↓
submitContactForm(data)  // Server action
  ↓
trackAnalytics(utm_params, ip_address, device_info)
  ↓
sendEmail(contact_email, admin_email)  // Optional Resend
  ↓
Return success message
```

#### Live Chat Widget
**Components**:
- `ChatButton`: Floating action button (bottom-right)
- `ChatModal`: Expanded chat interface
  - Pre-chat form (name, email, phone)
  - Message list with timestamp
  - Message input with send button
  - Loading indicators
  - Unread message badge

**Behavior**:
- Persists across page navigation (sessionStorage)
- Maintains visitor_id for session continuity
- Real-time message updates via Supabase subscriptions
- Shows online/offline status
- Auto-scrolls to latest message

### State Management

**Client-side State** (React Context/Hooks):
- `ChatProvider`: Manages chat UI state, messages, visitor session
- `LanguageProvider`: Current language preference (i18n)
- `ThemeProvider`: Dark/light mode (if implemented)
- `AnalyticsProvider`: Tracks page views, events

**Server-side State** (Database):
- All content data cached with Supabase
- Session data in PostgreSQL
- Admin sessions with expiration
- Analytics logged to database

### Performance Optimization

**Image Optimization**:
- Next.js Image component with lazy loading
- Responsive srcset for different screen sizes
- WebP format with JPEG fallback
- Optimized image dimensions per component

**Code Splitting**:
- Route-based code splitting (automatic with App Router)
- Dynamic imports for heavy components
- Lazy load testimonials carousel on intersection

**Caching Strategy**:
- Static pages generated at build time (homepage, services, destinations)
- ISR (Incremental Static Regeneration) with 3600s revalidation
- Browser cache headers (max-age: 31536000 for assets)
- Supabase query caching with SWR

**Bundle Size**:
- Tree shaking enabled
- Unused CSS purged by Tailwind
- No runtime dependencies in bundle
- gzip compression enabled

---

## Admin Dashboard

### Admin Features

#### Dashboard Overview (/admin)
**Metrics**:
- Total visitors (last 7 days, 30 days)
- New contacts received
- Active chat sessions
- Conversion rate (contacts/visitors)
- Traffic source breakdown

**Recent Activity**:
- Last 5 contacts
- Active chat sessions
- Recent testimonial
- System health status

#### Contacts Management (/admin/contacts)
**Features**:
- Table view of all contacts with sorting/filtering
- Columns: Name, Email, Service, Status, Date, Actions
- Status workflow: new → contacted → qualified → converted/declined
- Bulk actions: Mark as read, change status, delete
- Detail view: Full contact info, admin notes, edit capability
- Reply functionality: Send email response (via Resend)
- Export contacts: CSV, PDF formats
- Search: By name, email, phone, service
- Filter: By date range, status, service type, source (UTM)

**Data Model**:
```typescript
interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  nationality?: string
  service_interest?: string
  preferred_language: string
  message: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'declined'
  admin_notes?: string
  replied_at?: Date
  ip_address: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  created_at: Date
  updated_at: Date
}
```

#### Live Chat Management (/admin/chat)
**Features**:
- List of all chat sessions with visitor info
- Session details: Visitor name, email, phone, start time, duration
- Message history: Full conversation timeline
- Send message: Admin can respond in real-time
- Session actions: Mark resolved, end session, transfer
- Visitor info edit: Update phone, email, notes
- Message search: Find conversations by keyword
- Export chat: Download conversation transcript

**Real-time Updates**:
- Supabase subscriptions for incoming messages
- New session alerts
- Notification sound (optional)
- Desktop notifications (if permitted)

**Analytics Integration**:
- View visitor analytics for this session
- Pages visited during chat
- Device and location info
- Referrer information

#### Analytics Dashboard (/admin/analytics - Future)
**Metrics**:
- Visitor traffic trends (daily, weekly, monthly)
- Geographic distribution (countries, cities)
- Device breakdown (mobile, tablet, desktop)
- Top pages visited
- Bounce rate by page
- Average session duration
- Traffic sources (organic, direct, referral, ads)
- Conversion funnel (visitor → contact → client)

**Filters**:
- Date range selection
- Country/city filter
- Device type filter
- Traffic source filter
- Service/page specific

**Export**:
- PDF report generation
- CSV data export
- Scheduled reports via email

#### Content Management (Future Phases)
**Services Management**:
- Create/edit/delete services
- Multi-language support
- Image upload and management
- Feature ordering and visibility

**Destinations Management**:
- Create/edit/delete destinations
- Gallery image management
- Service association
- Featured flag management

**Team Members Management**:
- Add/edit team profiles
- Photo uploads
- Expertise and language tags
- Leadership designation

**Partners Management**:
- Partner directory management
- Logo uploads
- Category assignment
- Featured partner selection

**Testimonials Management**:
- Approval workflow for user-submitted testimonials
- Manual testimonial creation
- Platform attribution
- Featured selection
- Rating management

#### User Management (Future)
**Admin Users**:
- List all admin users with roles
- Add new admin (email, password, role)
- Edit permissions
- Disable/enable accounts
- Password reset
- Last login tracking

**Roles**:
- `super_admin`: Full access to all features and user management
- `admin`: Full access except user management
- `support`: Limited to contacts and chat, view-only analytics

**Audit Log**:
- All admin actions logged
- Timestamp, admin user, action, before/after data
- Export audit trail
- Search and filter logs

#### Settings (Future)
**General Settings**:
- Site title, description, logo
- Contact information
- Social media links
- Business hours
- Timezone

**Email Settings**:
- SMTP configuration (if self-hosted)
- Email templates
- Notification preferences

**Integrations**:
- Google Ads conversion tracking (gclid setup)
- Facebook Pixel
- Mailchimp/email list integration
- Zapier webhooks
- Slack notifications

### Admin UI/UX

**Sidebar Navigation**:
- Dashboard
- Contacts
- Chat
- Analytics (future)
- Content (future)
- Users (future)
- Settings (future)
- Logout

**Header**:
- User profile dropdown
- Search bar
- Notifications bell
- Current date/time

**Tables**:
- Sortable columns
- Pagination (20 rows per page)
- Bulk selection
- Quick actions dropdown
- Export buttons

**Forms**:
- Inline editing where possible
- Modal forms for complex data
- Form validation with error messages
- Success/error toast notifications
- Auto-save drafts

**Mobile Responsiveness**:
- Collapsible sidebar on mobile
- Simplified table view (cards on mobile)
- Touch-friendly button sizes (48x48px minimum)
- Full-width modals on mobile

---

## Backend Services & APIs

### Server Actions (Next.js)

#### Contact Management
```typescript
// lib/actions/contact.ts
export async function submitContactForm(data: {
  name: string
  email: string
  phone?: string
  nationality?: string
  service_interest?: string
  preferred_language?: string
  message: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  ip_address?: string
  user_agent?: string
  referrer?: string
})
```

**Flow**:
1. Validate form data
2. Get visitor IP from headers
3. Extract UTM parameters from referrer URL
4. Insert into `contact_submissions` table
5. Send confirmation email (optional)
6. Send admin notification
7. Track analytics
8. Return success/error response

#### Chat Management
```typescript
// lib/actions/chat.ts
export async function startChatSession(data: {
  visitorId: string
  visitorName?: string
  visitorEmail?: string
  visitorPhone?: string
  pageUrl?: string
})

export async function sendChatMessage(
  sessionId: string,
  message: string,
  senderType: 'visitor' | 'admin' | 'system'
)

export async function getChatMessages(sessionId: string)

export async function updateChatSessionInfo(
  sessionId: string,
  data: { visitorName?: string; visitorEmail?: string; visitorPhone?: string }
)

export async function endChatSession(sessionId: string)
```

#### Analytics Tracking
```typescript
// lib/actions/analytics.ts
export async function trackPageView(data: {
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
})

export async function updatePageDuration(
  sessionId: string,
  pagePath: string,
  duration: number
)
```

### API Routes

#### Admin Authentication
```typescript
// app/api/admin/login/route.ts
POST /api/admin/login
Body: { email: string; password: string }
Returns: { success: boolean; token?: string; error?: string }
```

**Process**:
1. Find admin user by email
2. Compare password with bcryptjs
3. Create session token
4. Store in `admin_sessions` with 7-day expiration
5. Set HTTP-only cookie
6. Return token

```typescript
// app/api/admin/logout/route.ts
POST /api/admin/logout
Headers: { cookie: session token }
Returns: { success: boolean }
```

**Process**:
1. Validate session
2. Delete session from database
3. Clear HTTP-only cookie
4. Log audit entry

#### Contact API
```typescript
// app/api/contact/route.ts
POST /api/contact
Body: ContactFormData
Returns: { success: boolean; id?: string; error?: string }
```

**Process**:
1. Validate data
2. Extract IP address
3. Get geo-location (optional)
4. Store in database
5. Send emails
6. Track analytics
7. Return response

#### Admin Contacts API
```typescript
// app/api/admin/contacts/route.ts
GET /api/admin/contacts?status=new&limit=20&offset=0
Headers: { cookie: admin session token }
Returns: ContactSubmission[]

POST /api/admin/contacts/:id
Body: { status?: string; admin_notes?: string }
Returns: { success: boolean }

DELETE /api/admin/contacts/:id
Returns: { success: boolean }
```

#### Admin Chat API (Future)
```typescript
// app/api/admin/chat/route.ts
GET /api/admin/chat/sessions
Returns: ChatSession[]

POST /api/admin/chat/sessions/:sessionId/message
Body: { message: string }
Returns: { success: boolean; messageId?: string }

GET /api/admin/chat/sessions/:sessionId/messages
Returns: ChatMessage[]
```

#### Analytics API (Future)
```typescript
// app/api/admin/analytics/route.ts
GET /api/admin/analytics?start_date=2024-01-01&end_date=2024-01-31
Returns: {
  total_visitors: number
  new_contacts: number
  conversion_rate: number
  top_pages: Array<{ path: string; views: number }>
  traffic_sources: Array<{ source: string; count: number }>
}
```

### Error Handling & Logging

**Try-Catch Pattern**:
```typescript
try {
  // Attempt database operation
} catch (error) {
  console.error('[v0] Error description:', error instanceof Error ? error.message : String(error))
  // Return fallback data or error response
}
```

**Error Responses**:
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid session)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

**Logging**:
- All errors logged with `[v0]` prefix
- Request/response logging in development
- Performance metrics tracking
- Error aggregation (future)

### Database Utilities

#### Supabase Client Setup
```typescript
// lib/supabase/client.ts
export function createClient(): SupabaseClient
// Browser-safe client for client components

// lib/supabase/server.ts
export async function createClient(): SupabaseClient
// Server-side client with cookies for SSR

// lib/supabase/admin.ts
export function createAdminClient(): SupabaseClient
// Service role client for admin operations
```

#### Data Fetching Functions
```typescript
// lib/data/*.ts
export async function getServices(options?: {
  featured?: boolean
  limit?: number
}): Promise<Service[]>

export async function getDestinations(options?: {
  featured?: boolean
  limit?: number
}): Promise<Destination[]>

export async function getPartners(options?: {
  featured?: boolean
  category?: string
  limit?: number
}): Promise<Partner[]>

export async function getTestimonials(options?: {
  featured?: boolean
  platform?: string
  serviceType?: string
  destination?: string
  limit?: number
}): Promise<Testimonial[]>

// All functions include fallback data for offline/error scenarios
```

---

## Live Chat System

### Architecture

**Session Persistence**:
- `sessionStorage` stores visitor_id and chat session_id
- Persists across page navigation (same tab)
- Cleared on browser tab close
- Unique identifier per browser session

**Real-time Messaging**:
- Supabase Realtime subscriptions for incoming messages
- PostgreSQL LISTEN/NOTIFY for admin notifications
- WebSocket connections maintained by Supabase
- Automatic reconnection on connection loss

**Message Queue**:
- Unsent messages stored in localStorage during disconnect
- Retry logic with exponential backoff
- Notification on reconnection

### Visitor Flow

**1. Initiate Chat**:
- Visitor clicks floating chat button
- Pre-chat form appears (name, email, phone)
- Form validation
- `startChatSession()` creates new session
- Session ID stored in sessionStorage

**2. Send Messages**:
- Visitor types message
- `sendChatMessage()` on send button click
- Message appears immediately (optimistic update)
- API call to backend
- Server stores in database
- Realtime subscription pushes to admin

**3. Receive Messages**:
- Admin sends reply
- Supabase realtime subscription triggers
- Message appears in chat
- Notification sound (if enabled)
- Auto-scroll to latest message

**4. End Chat**:
- Visitor closes chat modal
- Session remains active for 30 minutes
- Reopen chat to continue conversation
- `endChatSession()` marks as closed after timeout

### Admin Flow

**1. Monitor Sessions**:
- Real-time list of active chats
- New session alert
- Unread message badge
- Visitor info (name, email, page URL)

**2. Join Conversation**:
- Click session to open
- Load message history
- Can see previous messages
- Type reply in message input

**3. Send Messages**:
- Reply to visitor
- Messages appear in real-time
- Automatic timestamp and sender name

**4. Session Management**:
- Update visitor information
- Add internal notes
- Mark as resolved
- Transfer to other admin (future)
- Close session

### Database Schema for Chat
```typescript
interface ChatSession {
  id: string
  visitor_id: string
  visitor_name?: string
  visitor_email?: string
  visitor_phone?: string
  status: 'active' | 'closed'
  ip_address: string
  user_agent: string
  location_country?: string
  location_city?: string
  page_url: string
  started_at: Date
  ended_at?: Date
  last_message_at: Date
}

interface ChatMessage {
  id: string
  session_id: string
  sender_type: 'visitor' | 'admin' | 'system'
  sender_name?: string
  message: string
  is_read: boolean
  created_at: Date
}
```

### Chat Widget UI
- **Floating Button**: 60x60px, bottom-right corner, pulse animation
- **Chat Modal**: 400px wide on desktop, full-width on mobile
- **Message Area**: Scrollable, max-height 400px
- **Input Area**: Fixed bottom, message input + send button
- **Timestamps**: Visible on hover
- **Sender Badges**: Different colors for visitor vs admin
- **Typing Indicator**: "Admin is typing..." (future)

---

## Analytics & Tracking

### Visitor Tracking

**Unique Identifier**:
- Generate `visitor_id` on first visit (stored in sessionStorage)
- Persists across page navigation
- Resets on browser tab close
- Used to correlate sessions

**Session Tracking**:
- `session_id` generated per visit
- Tracks duration on page
- Records all pages visited in session
- Attributes conversion to original session

**Data Collection**:
- Page path and title
- Referrer URL
- Device info (type, OS, browser)
- Screen resolution
- Language preference
- IP address (geo-location future)
- Session duration

**UTM Parameters**:
- utm_source: Traffic source (google, facebook, etc.)
- utm_medium: Marketing medium (cpc, organic, social)
- utm_campaign: Campaign name
- utm_term: Search term (if applicable)
- utm_content: Ad variant (if applicable)

**Google Ads Integration**:
- gclid parameter captured from URL
- Stored with analytics record
- Enables conversion tracking in Google Ads
- Allows audience building and remarketing

### Analytics Component

```typescript
// components/analytics/analytics-tracker.tsx
export function AnalyticsTracker() {
  useEffect(() => {
    // On page mount:
    // 1. Get or create visitor_id
    // 2. Get or create session_id
    // 3. Extract UTM parameters
    // 4. Extract gclid
    // 5. Get device info
    // 6. Send pageview
    
    // On page leave:
    // 1. Calculate session duration
    // 2. Record page duration
  }, [])
}
```

### Dashboard Metrics

**Key Performance Indicators**:
- Total visitors (unique visitor_ids)
- Page views (total analytics records)
- Bounce rate (visitors who view only 1 page)
- Average session duration
- Conversion rate (visitors who submit contact form)
- Cost per conversion (if integrated with ads platform)

**Traffic Sources**:
- Organic search
- Direct traffic
- Referral sources
- Social media
- Paid ads (Google Ads, Facebook)
- Email campaigns

**Device Analytics**:
- Mobile vs desktop traffic
- Top devices
- OS breakdown
- Browser breakdown
- Screen resolution distribution

**Geographic Distribution**:
- Countries
- Cities
- Regional heatmap (future)

**Page Performance**:
- Most visited pages
- Pages with highest bounce rate
- Pages with longest average duration
- Pages with highest conversion rate

### Real-time Analytics Updates

**Dashboard Refresh**:
- Auto-refresh every 60 seconds
- Manual refresh button
- Real-time visitor count
- Live chat activity
- Recent contact form submissions

**Notifications** (Admin):
- New contact form submission
- New chat session initiated
- Message received in chat
- Alert on unusual traffic spike
- Alert on high bounce rate

---

## SEO & Content Optimization

### On-Page SEO

**Meta Tags**:
```typescript
// Each page includes:
export const metadata: Metadata = {
  title: 'Page Title - SEWA Hospitality',
  description: 'Page description for search results',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    url: 'https://sewahospitality.com/page',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Page image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Title',
    description: 'Twitter Description',
    images: ['/twitter-image.jpg'],
  },
  canonical: 'https://sewahospitality.com/page',
}
```

**Structured Data** (JSON-LD):
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "SEWA Hospitality",
  "description": "Premium hospitality concierge services",
  "url": "https://sewahospitality.com",
  "logo": "https://sewahospitality.com/logo.png",
  "image": "https://sewahospitality.com/og-image.jpg",
  "telephone": "+91-11-4000-0000",
  "email": "info@sewahospitality.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Hospitality Lane",
    "addressLocality": "New Delhi",
    "postalCode": "110001",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://facebook.com/sewahospitality",
    "https://instagram.com/sewahospitality",
    "https://linkedin.com/company/sewahospitality"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "45"
  }
}
```

**Heading Hierarchy**:
- H1: Single per page, descriptive of main topic
- H2: Main sections
- H3: Subsections
- H4+: Detailed sections (use sparingly)

**Content Optimization**:
- Focus keywords naturally integrated
- Keyword density 1-2%
- LSI keywords included
- Internal links to related content
- Image alt text describes content, not just decorative

### Technical SEO

**Sitemap** (`app/sitemap.ts`):
```typescript
export default async function sitemap(): Route.MetadataRoute.Sitemap {
  return [
    {
      url: 'https://sewahospitality.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://sewahospitality.com/services',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // ... all pages
  ]
}
```

**Robots.txt** (`app/robots.ts`):
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: 'https://sewahospitality.com/sitemap.xml',
  }
}
```

**Mobile Optimization**:
- Responsive design (320px - 2560px)
- Touch-friendly buttons (48x48px minimum)
- Fast load times (<3s on 4G)
- No intrusive interstitials

**Core Web Vitals**:
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

**Page Speed**:
- Gzip compression enabled
- CSS/JS minification
- Image optimization (WebP, responsive sizes)
- Code splitting
- Lazy loading

### Multi-Language SEO

**Language Tags**:
```html
<html lang="en">
<!-- Or via Next.js metadata -->
<meta name="language" content="English" />
<link rel="alternate" hreflang="en" href="https://sewahospitality.com" />
<link rel="alternate" hreflang="hi" href="https://sewahospitality.com/hi" />
```

**Content in Multiple Languages**:
- Services with translations (title_hi, description_hi, etc.)
- Destinations with local names
- Team member expertise in multiple languages
- Forms in user's preferred language

**Hreflang Implementation** (Future):
- Canonical tags for original language
- Hreflang links to all language versions
- Avoid rel="canonical" to different domain

### Google Ads Integration

**Conversion Tracking**:
```typescript
// Capture gclid from URL
const params = new URLSearchParams(window.location.search)
const gclid = params.get('gclid')

// Store with analytics
trackPageView({
  gclid: gclid,
  // ... other data
})

// Store with contact submission
submitContactForm({
  gclid: gclid,
  // ... other data
})
```

**Conversion Tags**:
```html
<!-- Google Ads event tag -->
<script>
  gtag('event', 'conversion', {
    'send_to': 'AW-123456789/ABC123ABC',
    'transaction_id': '',
    'value': 0,
    'currency': 'USD'
  });
</script>
```

**Remarketing Audiences**:
- All visitors
- Service page visitors
- Contact form visitors
- Chat initiators
- Converters (contacts submitted)

### Content Calendar & Strategy

**Target Keywords**:
- Primary: "Medical tourism India", "Luxury travel India", "Wellness retreats India"
- Secondary: "Ayurveda retreats", "Destination weddings India", "Corporate travel India"
- Long-tail: "Best hospitals in Delhi for foreigners", "Luxury hotels in Rajasthan for destination wedding"

**Content Pillars**:
1. Medical Tourism (15 articles)
2. Luxury Travel (12 articles)
3. Wellness & Ayurveda (10 articles)
4. Destination Guides (6 articles)
5. Corporate Solutions (8 articles)
6. Client Stories (Testimonials) (ongoing)

**Publishing Schedule**:
- Blog posts: 2x per week
- Case studies: 1x per month
- Video content: 1x per week (YouTube)
- Social media: Daily
- Email newsletter: 2x per week

---

## Authentication & Security

### Admin Authentication

**Login Flow**:
1. User enters email and password
2. API validates credentials against database
3. Password compared using bcryptjs.compare()
4. If match, create session token (random 32 bytes, hex encoded)
5. Store session in `admin_sessions` with 7-day expiration
6. Set HTTP-only, Secure, SameSite cookie
7. Return success response
8. User redirected to dashboard

**Session Validation**:
- Every admin route checks session validity
- Session must exist in database and not be expired
- Admin user must be active (is_active = true)
- Invalid session redirects to login

**Logout Flow**:
1. Get session token from cookie
2. Delete session from `admin_sessions` table
3. Clear HTTP-only cookie
4. Create audit log entry
5. Redirect to login page

### Password Security

**Hashing**:
- Algorithm: bcryptjs with 10 rounds
- Library: `bcryptjs` npm package
- Never store plain passwords
- Hash length: 60 characters

**Password Requirements**:
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, special characters
- Cannot be reused (last 5 passwords tracked - future)
- Expire every 90 days (future)

**Password Reset** (Future):
1. User enters email
2. Generate reset token (32 bytes random)
3. Send reset link via email with token
4. User clicks link, enters new password
5. Validate token hasn't expired (15 min)
6. Hash new password and update database
7. Invalidate all existing sessions

### Session Security

**Session Token**:
- Generate using `crypto.randomBytes(32).toString('hex')`
- Stored in `admin_sessions` table
- Used in HTTP-only cookie for API authentication
- Never sent in URL or local storage

**Cookie Configuration**:
```typescript
// HTTP-only, prevents JavaScript access
HttpOnly: true

// Secure flag, only sent over HTTPS
Secure: true

// SameSite prevents CSRF attacks
SameSite: 'Strict'

// Expiration: 7 days
MaxAge: 7 * 24 * 60 * 60 * 1000
```

**CSRF Protection**:
- SameSite cookie configuration prevents cross-site requests
- Server Actions include automatic CSRF protection (Next.js)
- State-changing operations use POST, not GET

### Data Protection

**Database Access**:
- All database operations use parameterized queries
- No string concatenation in SQL
- Supabase client handles query safety
- Service role key only used server-side

**Input Validation**:
- All form inputs validated on client (UX)
- All form inputs re-validated on server (security)
- Whitelist expected fields
- Reject extra/unknown fields

**Rate Limiting** (Future):
- Login attempts: 5 per 15 minutes per IP
- Contact form: 1 per 5 minutes per IP
- API endpoints: 100 per minute per IP

### API Security

**Authentication Headers**:
```typescript
// Admin routes require valid session cookie
const session = cookies().get('admin_session')?.value
if (!session) return new Response('Unauthorized', { status: 401 })

// Verify session exists and hasn't expired
const { data: sessionData } = await adminClient
  .from('admin_sessions')
  .select('admin_id')
  .eq('token', session)
  .gt('expires_at', new Date())
  .single()

if (!sessionData) return new Response('Invalid session', { status: 401 })
```

**Audit Logging**:
- All admin actions logged to `audit_log`
- Includes: admin_id, action, table_name, record_id, old/new data, timestamp
- Enables accountability and troubleshooting
- Exportable for compliance

### GDPR & Privacy Compliance

**Data Collection**:
- Explicit privacy policy disclosure on contact form
- Consent checkbox before submitting contact form
- Clear data usage explanation

**Data Storage**:
- Contact data stored in secure PostgreSQL database
- Encrypted in transit (HTTPS only)
- Data retention: 3 years by default
- Manual deletion available for users

**Data Export** (Future):
- Users can request export of their data
- CSV/JSON format
- Download link expires after 24 hours

**Data Deletion** (Future):
- Users can request deletion of their data
- Soft delete (marked deleted, not removed) for audit purposes
- Hard delete after 30-day grace period

---

## Deployment & DevOps

### Environment Configuration

**Environment Variables**:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Resend (Email)
RESEND_API_KEY=[resend-key]

# Admin Email
ADMIN_EMAIL=admin@sewahospitality.com

# Application
NEXT_PUBLIC_APP_URL=https://sewahospitality.com
NODE_ENV=production
```

**Development** (`.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=local-key
SUPABASE_SERVICE_ROLE_KEY=local-service-role-key
```

### Vercel Deployment

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
  }
}
```

**Build Process**:
1. `npm ci` - Clean install dependencies
2. `npm run build` - Build Next.js application
3. Output to `.next` folder
4. Assets automatically optimized and compressed

**Deployment Steps**:
1. Push to GitHub (main branch)
2. Vercel automatically triggers build
3. Build completes in ~2 minutes
4. Automatic deployment to staging/production
5. Post-deployment health checks
6. SSL certificate automatically provisioned

### Database Backups

**Supabase Backups**:
- Automatic daily backups (retained 30 days)
- Point-in-time recovery available
- Manual backup creation possible
- Backup restoration to new database

**Database Migrations**:
```bash
# Run migration scripts
npm run migrate

# Or manually in Supabase SQL editor
```

### Performance Monitoring

**Vercel Analytics**:
- Core Web Vitals tracking
- Page performance metrics
- Edge Function performance
- Database query times

**Application Monitoring**:
- Error tracking and reporting
- Performance metrics
- Log aggregation

### Continuous Integration

**GitHub Actions** (Optional Future):
```yaml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Build
        run: npm run build
      - name: Run tests
        run: npm run test
```

### Disaster Recovery

**Backup Strategy**:
- Daily Supabase backups
- Database exports to cloud storage (optional)
- Code backed up in Git repository
- Configuration backed up as infrastructure-as-code

**Recovery Process**:
1. Restore database from backup (Supabase)
2. Redeploy application from Git (Vercel)
3. Verify data integrity
4. Notify stakeholders

---

## Future Enhancements

### Phase 2 Features (3-6 months)

1. **Admin Content Management**
   - CMS interface for services, destinations, team, partners
   - Rich text editor for descriptions
   - Image upload and management
   - SEO meta tag editor
   - Published/draft status workflow

2. **Analytics Dashboard**
   - Detailed visitor metrics
   - Traffic source breakdown
   - Geographic analytics
   - Device analytics
   - Conversion funnel tracking
   - Custom report generation
   - Email report scheduling

3. **Email Integration**
   - Contact form notification emails
   - Chat notification emails
   - Admin alert emails
   - Newsletter signup functionality
   - Email template management

4. **Language Management**
   - Multi-language site version selection
   - URL structure for languages (/en/, /hi/, etc.)
   - Language-specific content management
   - Automatic language detection
   - Language switcher on website

5. **User Accounts** (Optional)
   - User registration and login
   - Profile management
   - Saved preferences (language, communication)
   - Order history
   - Wishlist/favorites

### Phase 3 Features (6-12 months)

1. **Advanced Admin Features**
   - User management with role-based access control
   - Team member permissions
   - API key management
   - Webhook integrations
   - Third-party app marketplace

2. **Marketing Automation**
   - Email sequence builder
   - Marketing automation workflows
   - Lead scoring
   - Behavioral triggers
   - A/B testing

3. **Booking System**
   - Service/package booking
   - Calendar integration
   - Availability management
   - Payment processing (Stripe integration)
   - Invoice generation

4. **Video Content**
   - Video hosting and management
   - YouTube integration
   - Video analytics
   - Live streaming capability

5. **Mobile Application**
   - iOS app (React Native)
   - Android app (React Native)
   - Offline functionality
   - Push notifications

### Phase 4 Features (12+ months)

1. **AI-Powered Features**
   - Chatbot for pre-qualification
   - Natural language processing for customer queries
   - Recommendation engine
   - Predictive analytics

2. **Advanced Analytics**
   - Machine learning models for conversion prediction
   - Customer lifetime value analysis
   - Churn prediction
   - Cohort analysis

3. **Enterprise Features**
   - Multi-user team collaboration
   - Audit logging and compliance
   - Custom branding per sub-brand
   - White-label capabilities

4. **Global Expansion**
   - Support for multiple currencies
   - Tax calculation (VAT, GST)
   - International payment methods
   - Multi-region deployment

---

## Development Workflow

### Project Structure

```
sewa-hospitality/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   ├── chat/
│   │   ├── contacts/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── contacts/
│   │   ├── contact/
│   │   ├── chat/
│   │   └── analytics/
│   ├── (main)/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── corporate/
│   │   ├── destinations/
│   │   ├── partners/
│   │   ├── services/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── admin/
│   │   ├── admin-chat-panel.tsx
│   │   ├── admin-sidebar.tsx
│   │   ├── contacts-table.tsx
│   │   └── dashboard-stats.tsx
│   ├── analytics/
│   │   └── analytics-tracker.tsx
│   ├── chat/
│   │   ├── chat-provider.tsx
│   │   ├── live-chat-widget.tsx
│   │   └── message-list.tsx
│   ├── home/
│   │   ├── destinations-scroll.tsx
│   │   ├── final-cta.tsx
│   │   ├── hero-section.tsx
│   │   ├── partners-section.tsx
│   │   ├── service-card.tsx
│   │   ├── services-grid.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── who-we-serve.tsx
│   │   └── why-sewa.tsx
│   ├── contact/
│   │   └── concierge-form.tsx
│   ├── footer.tsx
│   ├── header.tsx
│   ├── seo/
│   │   ├── google-ads-tracking.tsx
│   │   └── page-seo.tsx
│   └── ui/
│       └── [shadcn components]
│
├── lib/
│   ├── actions/
│   │   ├── analytics.ts
│   │   ├── chat.ts
│   │   ├── contact.ts
│   │   └── admin.ts
│   ├── data/
│   │   ├── destinations.ts
│   │   ├── pages.ts
│   │   ├── partners.ts
│   │   ├── services.ts
│   │   ├── site-settings.ts
│   │   ├── team.ts
│   │   └── testimonials.ts
│   ├── supabase/
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   ├── proxy.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── i18n.ts
│   ├── language-context.tsx
│   └── utils.ts
│
├── public/
│   ├── images/
│   │   └── [all image assets]
│   ├── icons/
│   │   └── [icon assets]
│   └── [other static files]
│
├── scripts/
│   ├── 001_create_site_content_tables.sql
│   ├── 002_create_contact_chat_tables.sql
│   ├── 003_create_admin_tables_v2.sql
│   ├── 004_create_indexes.sql
│   ├── 005_seed_initial_data.sql
│   ├── 006_create_default_admin.sql
│   ├── 007_seed_data_fresh.sql
│   └── generate-admin-password.js
│
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── .env.local
├── .env.example
├── .gitignore
├── components.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── proxy.ts
├── tsconfig.json
└── README.md
```

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Type check
npm run type-check

# Format code
npm run format

# Run tests
npm run test
```

### Git Workflow

**Branch Strategy**:
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Production hotfixes

**Commit Convention**:
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Code refactoring
perf: Performance improvements
test: Add tests
chore: Maintenance tasks
```

**Pull Request Process**:
1. Create feature branch from `develop`
2. Make changes and commit
3. Push to GitHub
4. Create pull request with description
5. Code review by team member
6. Address feedback
7. Merge to `develop`
8. Deploy to staging for QA
9. Merge to `main` when ready
10. Deploy to production

### Code Quality Standards

**TypeScript**:
- Strict mode enabled
- No implicit `any`
- Proper type exports
- All functions typed
- Return types explicit

**Component Best Practices**:
- Functional components only
- Use hooks for state management
- Memo for performance where needed
- Proper key usage in lists
- Error boundaries for error handling

**Performance**:
- Image optimization with Next.js Image
- Code splitting with dynamic imports
- Lazy loading of components
- Caching strategies
- Database query optimization

**Testing** (Future):
- Unit tests with Jest
- Component tests with React Testing Library
- Integration tests
- E2E tests with Playwright
- Target: 80% code coverage

### Database Management

**Running Migrations**:
1. Create new SQL file in `scripts/` directory
2. Name with sequential number: `NNN_description.sql`
3. Execute via Supabase dashboard SQL editor
4. Or use: `supabase_apply_migration` tool
5. Commit SQL file to Git
6. Document changes in CHANGELOG

**Data Backup**:
```bash
# Manual backup (via Supabase dashboard)
# Automated daily backups (Supabase)
# Monitor backup status in Supabase dashboard
```

**Database Seeding**:
```bash
# Initial seed with `007_seed_data_fresh.sql`
# Add specific records manually via dashboard
# Update via admin panel (Phase 2)
```

---

## Conclusion & Production Readiness Checklist

### Pre-Launch Checklist

- [x] Database schema created and indexed
- [x] Seed data populated (services, destinations, team, partners, testimonials)
- [x] Admin authentication functional
- [x] Contact form with database storage
- [x] Live chat system with persistence
- [x] Analytics tracking implemented
- [x] All pages with SEO metadata
- [x] Sitemap and robots.txt generated
- [x] Responsive design tested
- [x] Fallback data for offline scenarios
- [x] Error handling and logging
- [x] Admin dashboard basic functionality
- [ ] SSL certificate (automatic via Vercel)
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Backup strategy established
- [ ] Monitoring and alerts configured
- [ ] Documentation complete

### Launch Day Tasks

1. Set environment variables in Vercel dashboard
2. Configure custom domain (sewahospitality.com)
3. Set up email notifications (admin email)
4. Configure Google Ads conversion tracking
5. Submit sitemap to Google Search Console
6. Configure robots.txt in Google Search Console
7. Set up Google Analytics (optional)
8. Test all forms and chat functionality
9. Verify analytics data collection
10. Smoke test all pages on production

### Post-Launch Monitoring

- Monitor 404 errors and fix broken links
- Track conversion funnel in analytics
- Monitor admin chat activity
- Review contact form submissions
- Check Core Web Vitals in Vercel Analytics
- Monitor error rates and performance
- Daily backup verification
- Security audit logs review

### Ongoing Maintenance

- **Weekly**: Review analytics, chat quality, contact form leads
- **Monthly**: Content updates, partner addition, testimonials
- **Quarterly**: Security audit, performance optimization, SEO review
- **Annually**: Database cleanup, compliance audit, infrastructure review

---

## Contact & Support

**Technical Issues**: [support@sewahospitality.com](mailto:support@sewahospitality.com)

**Admin Access**: [admin.sewahospitality.com](https://admin.sewahospitality.com)

**Database Access**: Supabase Dashboard

**Deployment**: Vercel Dashboard

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Status**: Production Ready
