-- Seed initial content data

-- Insert site settings
INSERT INTO site_settings (key, value) VALUES
('company_name', '"SEWA Hospitality Services Pvt. Ltd."'),
('company_tagline', '"Bespoke hospitality and lifestyle services for global elites in India"'),
('contact_email', '"concierge@sewa-hospitality.com"'),
('contact_phone', '"+91 XXXX-XXXX-XXXX"'),
('contact_whatsapp', '"+91 XXXX-XXXX-XXXX"'),
('address', '{"city": "Gurgaon", "country": "India"}'::jsonb),
('social_links', '{"linkedin": "", "instagram": "", "facebook": "", "twitter": ""}'::jsonb),
('business_hours', '{"weekdays": "9:00 AM - 10:00 PM", "weekends": "10:00 AM - 8:00 PM"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Insert pages SEO data
INSERT INTO pages (slug, title, description, meta_keywords) VALUES
('home', 'SEWA Hospitality - Luxury Concierge & Services in India', 'Bespoke hospitality and lifestyle services for global elites in India. Luxury travel, concierge, residences, and relocation.', ARRAY['luxury concierge india', 'expat services', 'luxury travel india', 'relocation services india']),
('about', 'About SEWA Hospitality - Our Story & Values', 'Bridging Indian hospitality traditions with global standards of excellence. Learn about our vision, philosophy, and leadership team.', ARRAY['about sewa hospitality', 'luxury concierge company', 'hospitality services india']),
('services', 'Our Services - SEWA Hospitality', 'Comprehensive luxury services including travel, concierge, residences, relocation, and exclusive experiences.', ARRAY['luxury services india', 'concierge services', 'expat relocation']),
('corporate', 'Corporate & Expat Solutions - SEWA Hospitality', 'Seamless relocation and lifestyle management for your global workforce. Executive relocation, corporate housing, and fleet services.', ARRAY['corporate relocation india', 'expat services', 'executive housing']),
('destinations', 'Curated Destinations Across India - SEWA Hospitality', 'Experience India''s most luxurious destinations with our personalized concierge services. Delhi, Mumbai, Goa, Jaipur, and more.', ARRAY['luxury destinations india', 'delhi concierge', 'mumbai luxury', 'goa luxury travel']),
('partners', 'Partners & Affiliations - SEWA Hospitality', 'Authorized partnerships with India''s most prestigious hospitality and service providers.', ARRAY['luxury partners india', 'hotel partnerships', 'travel partners']),
('contact', 'Contact SEWA Hospitality - Concierge Request', 'Connect with our concierge desk and let us craft your perfect experience in India.', ARRAY['contact sewa', 'concierge request', 'luxury travel inquiry'])
ON CONFLICT (slug) DO NOTHING;

-- Insert services
INSERT INTO services (slug, title, description, items, icon, display_order, is_featured) VALUES
('travel', 'Luxury Travel & Mobility', 'Experience the world in absolute comfort with our curated travel solutions', ARRAY['First/Business Class bookings', 'Luxury hotels & resorts', 'Chauffeur-driven cars', 'Airport VIP services', 'Private jet arrangements', 'Yacht charters'], 'Plane', 1, true),
('concierge', 'Concierge & Lifestyle', 'Your dedicated team ready to fulfill your every desire', ARRAY['24/7 personal concierge', 'Fine dining reservations', 'Shopping assistance', 'Private chef services', 'Wellness & spa arrangements', 'Event planning'], 'Sparkles', 2, true),
('residences', 'Premium Residences', 'Your perfect home away from home with full-service luxury', ARRAY['Luxury serviced apartments', 'Full housekeeping services', 'Private chef on request', 'Butler & household staff', 'Premium security systems', 'Concierge within residence'], 'Home', 3, true),
('relocation', 'Relocation Services', 'Seamless transition to your new home in India', ARRAY['Visa & FRRO assistance', 'Cultural orientation programs', 'School admissions support', 'Settling-in arrangements', 'Property search & selection', 'Move management'], 'MapPin', 4, true),
('immigration', 'Immigration Support', 'Expert guidance through every immigration step', ARRAY['Visa consultation & application', 'FRRO registration support', 'Legal documentation', 'Compliance assistance', 'Work permit support', 'Family visa processing'], 'FileText', 5, false),
('experiences', 'Curated Experiences', 'Unforgettable moments tailored to your interests', ARRAY['Private cultural tours', 'Invite-only experiences', 'Corporate team building', 'CSR event planning', 'Heritage walks', 'Wellness retreats'], 'Star', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert destinations
INSERT INTO destinations (slug, name, headline, description, icon, services, highlights, display_order, is_featured) VALUES
('delhi-ncr', 'Delhi NCR', 'Business Hub of India', 'Modern luxury meets ancient heritage in India''s capital region', 'Plane', ARRAY['Business facilities', 'Urban luxury hotels', 'Cultural experiences', 'Fine dining', 'Shopping'], ARRAY['Iconic monuments and museums', 'World-class business infrastructure', 'Michelin-starred restaurants', 'Luxury shopping malls'], 1, true),
('mumbai', 'Mumbai', 'Cosmopolitan Coastal Paradise', 'Bollywood glamour meets corporate sophistication', 'Building', ARRAY['Coastal villas', 'Fine dining', 'Entertainment', 'Shopping', 'Business'], ARRAY['Gateway of India views', 'Luxury beachfront properties', 'Five-star dining experiences', 'Entertainment & nightlife'], 2, true),
('goa', 'Goa', 'Tropical Leisure Escape', 'Sun, sand, and serenity in India''s premier beach destination', 'Palmtree', ARRAY['Luxury villas', 'Wellness retreats', 'Water sports', 'Fine dining', 'Events'], ARRAY['Private beach access', 'Wellness and yoga programs', 'Yacht charters', 'Sunset dining experiences'], 3, true),
('jaipur', 'Jaipur', 'The Pink City Experience', 'Royal heritage and cultural immersion in Rajasthan', 'Crown', ARRAY['Heritage tours', 'Royal experiences', 'Cultural immersion', 'Fine dining', 'Events'], ARRAY['City Palace tours', 'Amber Fort experiences', 'Traditional Rajasthani cuisine', 'Cultural performances'], 4, false),
('varanasi', 'Varanasi', 'Spiritual Awakening', 'The world''s oldest living city and holiest Hindu pilgrimage site', 'Sparkles', ARRAY['Spiritual concierge', 'Private ghat access', 'Cultural tours', 'Meditation', 'Wellness'], ARRAY['Private ghat experiences', 'Spiritual guidance', 'Traditional ceremonies', 'Cultural education'], 5, false),
('rishikesh', 'Rishikesh', 'Yoga & Wellness Capital', 'Gateway to the Himalayas and center of spiritual wellness', 'Heart', ARRAY['Yoga retreats', 'Wellness programs', 'Adventure activities', 'Meditation', 'Ayurveda'], ARRAY['World-class yoga programs', 'Ayurvedic treatments', 'Adventure activities', 'Meditation & wellness'], 6, false),
('south-india', 'South India', 'Tropical Splendor', 'Backwaters, beaches, and ancient temples across Kerala, Tamil Nadu, and beyond', 'Waves', ARRAY['Backwater cruises', 'Temple tours', 'Beach resorts', 'Spice route', 'Ayurveda'], ARRAY['Backwater houseboats', 'Ancient temple tours', 'Spice plantation visits', 'Traditional cuisine'], 7, false)
ON CONFLICT (slug) DO NOTHING;

-- Insert team members
INSERT INTO team_members (name, title, bio, expertise, languages, display_order, is_leadership) VALUES
('Priya Sharma', 'Founder & Director', 'With over 15 years in luxury hospitality, Priya founded SEWA to bridge the gap between Indian warmth and global service standards.', ARRAY['Concierge', 'Hospitality', 'Client Relations'], ARRAY['Hindi', 'English'], 1, true),
('Kenji Tanaka', 'Head of International Relations', 'Kenji brings expertise in serving Japanese corporate clients and executives relocating to India.', ARRAY['Travel', 'Corporate', 'Japanese Market'], ARRAY['Japanese', 'English'], 2, true),
('Sophie Moreau', 'Director of Residential Services', 'Sophie manages our premium residence portfolio and relocation services with French precision and Indian hospitality.', ARRAY['Properties', 'Relocation', 'Interior Design'], ARRAY['French', 'English'], 3, true)
ON CONFLICT DO NOTHING;

-- Insert partners
INSERT INTO partners (name, category, description, display_order, is_featured) VALUES
('Oberoi Hotels & Resorts', 'Hotels', 'Five-star luxury chain partnership', 1, true),
('Taj Hotels', 'Hotels', 'Premium heritage hotels', 2, true),
('ITC Hotels', 'Hotels', 'Luxury business hotels', 3, true),
('Leela Palace', 'Hotels', 'Ultra-luxury properties', 4, true),
('Aman Resorts', 'Resorts', 'Boutique luxury resorts', 5, true),
('Six Senses', 'Wellness', 'Wellness retreat centers', 6, true),
('Carzonrent', 'Transport', 'Premium chauffeur services', 7, false),
('Air Charter Service', 'Transport', 'Private jet arrangements', 8, false),
('Knight Frank India', 'Property', 'Luxury real estate', 9, false),
('Cyril Amarchand Mangaldas', 'Legal', 'Immigration law firm', 10, false)
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (client_name, client_title, client_company, client_location, platform, rating, content, service_type, is_featured, display_order) VALUES
('Takeshi Yamamoto', 'Managing Director', 'Toyota Motor Corporation', 'Japan', 'google', 5, 'SEWA made our executive relocation seamless. From visa processing to finding the perfect residence in Gurgaon, their attention to detail is unmatched. Highly recommend for any Japanese company entering India.', 'relocation', true, 1),
('Sarah Mitchell', 'Expat Spouse', NULL, 'United Kingdom', 'trustpilot', 5, 'Moving to Delhi with two children was daunting until SEWA stepped in. They handled school admissions, found us a beautiful home, and even arranged cultural orientation. Truly exceptional service.', 'relocation', true, 2),
('Hans Mueller', 'CEO', 'German Engineering Firm', 'Germany', 'direct', 5, 'Our corporate retreat in Rajasthan was perfectly orchestrated by SEWA. From private palace dinners to heritage tours, every moment was memorable. Professional, discrete, and absolutely reliable.', 'experiences', true, 3),
('Jennifer Park', 'Travel Blogger', NULL, 'South Korea', 'tripadvisor', 5, 'SEWA curated an incredible 2-week luxury journey through Kerala and Goa. The backwater houseboat experience and beachfront villa were beyond expectations. True luxury travel.', 'travel', true, 4),
('Mohammed Al-Rashid', 'Investment Banker', 'Dubai Holdings', 'UAE', 'google', 5, 'SEWA''s 24/7 concierge service has been invaluable during my frequent visits to Mumbai. From last-minute restaurant reservations to airport VIP services, they never disappoint.', 'concierge', true, 5),
('Lisa Chen', 'Marketing Director', 'Tech Startup', 'Singapore', 'direct', 5, 'Organizing our company offsite in Goa was stress-free with SEWA. They managed everything from luxury accommodations to team-building activities. Will definitely use again.', 'corporate', false, 6)
ON CONFLICT DO NOTHING;
