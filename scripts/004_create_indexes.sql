-- Performance indexes for common queries

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured) WHERE is_featured = true;

-- Destinations indexes
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_display_order ON destinations(display_order);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(is_featured) WHERE is_featured = true;

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_leadership ON team_members(is_leadership) WHERE is_leadership = true;
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);

-- Partners indexes
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
CREATE INDEX IF NOT EXISTS idx_partners_featured ON partners(is_featured) WHERE is_featured = true;

-- Testimonials indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_platform ON testimonials(platform);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_service_type ON testimonials(service_type);

-- Contact submissions indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);

-- Chat indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor ON chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON visitor_analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON visitor_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_page ON visitor_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_country ON visitor_analytics(country);
CREATE INDEX IF NOT EXISTS idx_analytics_gclid ON visitor_analytics(gclid) WHERE gclid IS NOT NULL;
