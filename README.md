# SEWA Hospitality Services - Luxury Website

A sophisticated, fully responsive luxury hospitality website built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. Designed with a premium aesthetic featuring multi-language support, professional concierge services, and seamless integration architecture.

## Overview

SEWA Hospitality Services is a boutique concierge and luxury lifestyle company serving global elites in India. This website presents:

- **Luxury Travel & Mobility**: First/business class bookings, chauffeur services
- **VIP Concierge Services**: 24/7 personal concierge, dining reservations, shopping
- **Serviced Residences**: Fully managed luxury apartments with housekeeping
- **Relocation & Immigration**: Visa support, cultural orientation, settling-in
- **Curated Experiences**: Private tours, events, spiritual journeys
- **Corporate Solutions**: Executive relocation, housing, compliance

## Technology Stack

### Core Framework
- **Next.js 16**: Latest React framework with App Router, Server Components
- **React 19.2**: Latest React with improved performance and hooks
- **TypeScript**: Full type safety across the codebase
- **Tailwind CSS v4**: Modern utility-first CSS with semantic design tokens

### UI & Components
- **shadcn/ui**: Production-ready component library
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Beautiful icon library

### Forms & Validation
- **React Hook Form**: Efficient form state management
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Schema validation integration

### Additional Libraries
- **next-themes**: Dark mode support
- **sonner**: Toast notifications
- **react-hook-form**: Form management
- **class-variance-authority**: Component variant management

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with i18n provider
│   ├── globals.css             # Luxury color system & typography
│   ├── page.tsx                # Homepage
│   ├── about/                  # About SEWA page
│   ├── services/               # Services overview page
│   ├── corporate/              # Corporate solutions page
│   ├── destinations/           # Destinations showcase
│   ├── partners/               # Partners & affiliations
│   ├── contact/                # Contact & concierge form
│   └── api/
│       └── contact/            # Email API endpoint
├── components/
│   ├── header.tsx              # Navigation header
│   ├── footer.tsx              # Footer with links
│   ├── home/                   # Homepage sections
│   │   ├── hero-section.tsx
│   │   ├── who-we-serve.tsx
│   │   ├── services-grid.tsx
│   │   ├── why-sewa.tsx
│   │   ├── destinations-scroll.tsx
│   │   └── final-cta.tsx
│   ├── contact/
│   │   └── concierge-form.tsx  # Contact form component
│   ├── home/
│   │   └── service-card.tsx    # Reusable service card
│   └── ui/                     # shadcn components
├── lib/
│   ├── i18n.ts                 # Translations (10 languages)
│   ├── language-context.tsx    # i18n context provider
│   └── utils.ts                # Utility functions
├── public/
│   ├── site-structure.json     # Site architecture document
│   └── images/                 # Hero & destination images
└── README.md                   # This file
```

## Features

### Multi-Language Support
Fully implemented i18n with 10 languages:
- English, Hindi, Japanese, Korean, French, German, Spanish, Russian, Chinese, Turkish
- Language selector in header and footer
- Persistent language preference in localStorage
- All content translations provided

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Fully functional on all devices
- Optimized touch interactions for mobile

### Luxury Aesthetic
- Serif typography (Playfair Display for headings)
- Premium color palette: Forest Green (#1a4d2e), Warm Gold (#b8860b), Ivory
- Generous whitespace and calm layouts
- Cinematic hero sections with full-width imagery

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- Color contrast compliance
- Screen reader optimized

### Forms & Integrations
- Contact/Concierge request form
- Client-side and server-side validation
- Email service ready (Resend, SendGrid, Nodemailer)
- Optional database integration (Supabase, Neon)

## Pages

### Public Pages
1. **Home** (`/`) - Hero, services, destinations, why SEWA
2. **About** (`/about`) - Brand story, vision, team, values
3. **Services** (`/services`) - All service offerings with details
4. **Corporate** (`/corporate`) - Executive relocation & housing
5. **Destinations** (`/destinations`) - Curated Indian destinations
6. **Partners** (`/partners`) - Hotel, transport, legal partners
7. **Contact** (`/contact`) - Concierge form & contact info

## Installation & Setup

### Prerequisites
- Node.js 18+ (compatible with Node 20+)
- npm or pnpm package manager

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd sewa-hospitality
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables (optional for email):
```bash
# Create .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url      # Optional
RESEND_API_KEY=your_key                # Optional
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## Configuration

### Language Settings
Edit `lib/i18n.ts` to:
- Add/remove languages
- Update translations
- Change default language

### Color Theme
Customize in `app/globals.css`:
- CSS variables for brand colors
- Dark mode variants
- Semantic design tokens

### Contact Form
Update in `app/contact/page.tsx`:
- Contact details (email, phone)
- Operating hours
- Office location

### Email Integration
Follow `IMPLEMENTATION_GUIDE.md` for:
- Resend setup
- SendGrid configuration
- Database integration options

## Performance Optimizations

- Server-side rendering for SEO
- Image optimization with Next.js Image
- CSS-in-JS with Tailwind for minimal bundle
- Dynamic imports for heavy components
- Responsive images with srcset

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Best Practices

- Environment variables for sensitive data
- Input validation on client & server
- CSRF protection (Next.js built-in)
- XSS prevention through React escaping
- Email service API keys secured

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel deploy
```

### Other Platforms
- **Netlify**: `npm run build` then connect Git
- **Docker**: Create Dockerfile with Node.js
- **Traditional VPS**: Node.js + PM2/systemd

## API Documentation

### POST `/api/contact`
**Submit a concierge request**

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "nationality": "USA",
  "serviceInterest": "Luxury Travel & Mobility",
  "preferredLanguage": "en",
  "message": "I would like to book..."
}
```

Response:
```json
{
  "success": true,
  "message": "Your request has been received..."
}
```

## Customization Guide

### Adding New Service
1. Add service object to services array in page/component
2. Create dedicated service ID in component
3. Update navigation if needed

### Changing Colors
1. Update CSS variables in `app/globals.css`
2. Modify both light and dark mode
3. Test contrast ratios for accessibility

### Adding New Language
1. Add language code to `Language` type in `lib/i18n.ts`
2. Add to `languages` object
3. Add translation object in `translations`
4. Test in language selector

## Database Integration

### Supabase
```typescript
import { createServerClient } from '@supabase/ssr';

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
```

### Neon
```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
await sql`INSERT INTO concierge_requests (name, email) VALUES ($1, $2)`;
```

## Troubleshooting

### Language not persisting
- Check localStorage permissions in browser
- Verify language code matches available languages
- Clear browser cache

### Contact form not sending
- Verify API endpoint is configured
- Check email service API key
- Review server logs for errors
- Test with POST request directly

### Images not loading
- Verify image paths in public/ folder
- Check image file formats (jpg, png, webp)
- Test with placeholder.svg from v0

### Styling issues
- Clear Tailwind cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check globals.css for CSS variable definitions

## Future Enhancements

- User authentication for private client portal
- Booking system for services
- Payment integration (Stripe)
- Blog/News section
- Admin dashboard for content management
- Advanced analytics
- Video testimonials
- Live chat support widget

## Contributing

1. Create a feature branch
2. Make your changes
3. Test responsive design
4. Submit pull request

## License

Proprietary - SEWA Hospitality Services Pvt. Ltd.

## Support

- **Email**: info@sewa-hospitality.com
- **WhatsApp**: Contact form on website
- **Office**: Gurgaon, India

---

**Built with AKM** - AI-powered UI generation platform
