-- SEWA Hospitality Database Schema
-- Table: site_settings (global settings, SEO defaults)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: pages (for page-level SEO and metadata)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  meta_keywords TEXT[],
  og_image TEXT,
  canonical_url TEXT,
  structured_data JSONB,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_hi TEXT,
  title_ja TEXT,
  title_ko TEXT,
  title_fr TEXT,
  title_de TEXT,
  title_es TEXT,
  title_ru TEXT,
  title_zh TEXT,
  title_tr TEXT,
  description TEXT,
  description_hi TEXT,
  description_ja TEXT,
  description_ko TEXT,
  description_fr TEXT,
  description_de TEXT,
  description_es TEXT,
  description_ru TEXT,
  description_zh TEXT,
  description_tr TEXT,
  items TEXT[],
  icon TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: destinations
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_hi TEXT,
  headline TEXT,
  headline_hi TEXT,
  description TEXT,
  description_hi TEXT,
  icon TEXT,
  services TEXT[],
  highlights TEXT[],
  image_url TEXT,
  gallery_images TEXT[],
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: team_members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  expertise TEXT[],
  languages TEXT[],
  image_url TEXT,
  linkedin_url TEXT,
  display_order INT DEFAULT 0,
  is_leadership BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: partners
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_location TEXT,
  client_image_url TEXT,
  platform TEXT, -- 'google', 'trustpilot', 'tripadvisor', 'direct'
  platform_url TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  content_hi TEXT,
  service_type TEXT,
  destination TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables (public read, admin write)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can read published content)
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read published pages" ON pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published services" ON services FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published destinations" ON destinations FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published team_members" ON team_members FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published partners" ON partners FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published testimonials" ON testimonials FOR SELECT USING (is_published = true);
