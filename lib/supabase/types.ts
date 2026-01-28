// Database types for all tables
export interface SiteSettings {
  id: string
  key: string
  value: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  slug: string
  title: string
  description: string
  meta_keywords: string[]
  og_image: string | null
  canonical_url: string | null
  structured_data: Record<string, unknown> | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  slug: string
  title: string
  title_hi: string | null
  title_ja: string | null
  title_ko: string | null
  title_zh: string | null
  title_de: string | null
  title_fr: string | null
  title_es: string | null
  title_ru: string | null
  title_tr: string | null
  description: string
  description_hi: string | null
  description_ja: string | null
  description_ko: string | null
  description_zh: string | null
  description_de: string | null
  description_fr: string | null
  description_es: string | null
  description_ru: string | null
  description_tr: string | null
  icon: string | null
  image_url: string | null
  items: string[]
  is_featured: boolean
  is_published: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Destination {
  id: string
  slug: string
  name: string
  name_hi: string | null
  headline: string | null
  headline_hi: string | null
  description: string
  description_hi: string | null
  icon: string | null
  image_url: string | null
  gallery_images: string[]
  services: string[]
  highlights: string[]
  is_featured: boolean
  is_published: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  title: string
  bio: string | null
  expertise: string[]
  languages: string[]
  image_url: string | null
  linkedin_url: string | null
  is_leadership: boolean
  is_published: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  logo_url: string | null
  website_url: string | null
  description: string | null
  category: string
  is_featured: boolean
  is_published: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  client_title: string | null
  client_company: string | null
  client_location: string | null
  client_image_url: string | null
  content: string
  content_hi: string | null
  rating: number
  service_type: string | null
  destination: string | null
  platform: string | null
  platform_url: string | null
  is_featured: boolean
  is_published: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  nationality: string | null
  preferred_language: string | null
  service_interest: string | null
  message: string
  status: "new" | "contacted" | "in_progress" | "completed" | "spam"
  admin_notes: string | null
  replied_at: string | null
  ip_address: string | null
  user_agent: string | null
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  created_at: string
  updated_at: string
}

export interface ChatSession {
  id: string
  visitor_id: string
  visitor_name: string | null
  visitor_email: string | null
  visitor_phone: string | null
  status: "active" | "waiting" | "closed"
  page_url: string | null
  ip_address: string | null
  user_agent: string | null
  location_country: string | null
  location_city: string | null
  started_at: string
  ended_at: string | null
  last_message_at: string | null
  created_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  sender_type: "visitor" | "admin" | "system"
  sender_name: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface VisitorAnalytics {
  id: string
  visitor_id: string
  session_id: string
  page_path: string
  page_title: string | null
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  gclid: string | null
  ip_address: string | null
  country: string | null
  region: string | null
  city: string | null
  device_type: string | null
  browser: string | null
  os: string | null
  screen_resolution: string | null
  language: string | null
  duration_seconds: number
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "editor"
  is_active: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}
