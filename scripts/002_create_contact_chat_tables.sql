-- Table: contact_submissions (form submissions from contact page)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  nationality TEXT,
  service_interest TEXT,
  preferred_language TEXT DEFAULT 'en',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
  admin_notes TEXT,
  replied_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: chat_sessions (live chat sessions)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL, -- anonymous visitor identifier
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'closed', 'archived'
  ip_address TEXT,
  user_agent TEXT,
  location_country TEXT,
  location_city TEXT,
  page_url TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: chat_messages (individual messages in chat)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL, -- 'visitor', 'admin', 'system'
  sender_name TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: visitor_analytics (track all visits)
CREATE TABLE IF NOT EXISTS visitor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL, -- fingerprint or session ID
  session_id TEXT,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT, -- Google Ads click ID
  ip_address TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  language TEXT,
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Public insert policies (visitors can submit forms and chat)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create chat session" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can send chat messages" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can log analytics" ON visitor_analytics FOR INSERT WITH CHECK (true);

-- Visitors can read their own chat session (by visitor_id stored in localStorage)
CREATE POLICY "Visitors can read their own sessions" ON chat_sessions FOR SELECT USING (true);
CREATE POLICY "Visitors can read messages in their sessions" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Visitors can update their own sessions" ON chat_sessions FOR UPDATE USING (true);
