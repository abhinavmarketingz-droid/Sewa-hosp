# SEWA Hospitality Website - Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Header + Navigation                               │  │
│  │ Language Selector | Mobile Menu                   │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Page Content (Rendered by Next.js)                │  │
│  │ Hero | Services | Forms | Images                  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Footer + Contact Info                             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↕ HTTPS
┌─────────────────────────────────────────────────────────┐
│              Next.js 16 Server (Node.js)                │
│  ┌──────────────────────────────────────────────────┐   │
│  │ App Router                                       │   │
│  │ /app - Page routes                              │   │
│  │ /api - Server endpoints                         │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Server Actions & Route Handlers                  │   │
│  │ POST /api/contact - Form submissions            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↕ API Calls
┌─────────────────────────────────────────────────────────┐
│         External Services (Optional Integration)         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Email Services                                   │   │
│  │ - Resend (preferred)                            │   │
│  │ - SendGrid                                       │   │
│  │ - Nodemailer                                     │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Database (Optional)                              │   │
│  │ - Supabase PostgreSQL                           │   │
│  │ - Neon PostgreSQL                               │   │
│  │ - Custom database                               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### Form Submission Flow
```
User Input → Form Component (React)
    ↓ (Validation with Zod)
Valid Data → API Route Handler
    ↓ (Server-side validation)
Clean Data → Email Service
    ↓ (Send confirmation)
Success → Database (optional)
    ↓ (Log submission)
Response → Client (Toast notification)
```

### Language Selection Flow
```
Language Dropdown → useLanguage Hook
    ↓ (Update context)
Context Update → Re-render Components
    ↓ (Use new translations)
New Language → localStorage
    ↓ (Persist preference)
Page Reload → Read from localStorage
```

## Component Hierarchy

```
Layout
├── Header
│   ├── Logo/Brand
│   ├── Navigation Links
│   ├── Language Selector
│   └── Mobile Menu
├── Main Content
│   ├── Page Components
│   │   ├── Hero Section
│   │   ├── Service Cards
│   │   ├── Forms
│   │   └── CTAs
│   └── Footer
└── Footer
    ├── Links
    ├── Contact Info
    └── Copyright
```

## File Organization by Layer

### Presentation Layer (`/components`)
- UI components (buttons, forms, cards)
- Page sections (hero, services, etc.)
- Layout components (header, footer)

### Business Logic Layer (`/lib`)
- i18n translations and context
- Form validation schemas
- Utility functions

### Data Layer (`/app/api`)
- Route handlers
- External service integration
- Database queries

### Routing Layer (`/app`)
- Page routes (Next.js App Router)
- Nested layouts
- Route-specific components

## Technology Dependencies

### Critical Dependencies
- **next**: Framework
- **react**: UI library
- **tailwindcss**: Styling
- **radix-ui**: Accessible components

### Form Handling
- **react-hook-form**: Form state
- **zod**: Validation
- **@hookform/resolvers**: Schema integration

### Styling
- **class-variance-authority**: Component variants
- **tailwind-merge**: Class merging
- **lucide-react**: Icons

### Utilities
- **next-themes**: Dark mode
- **sonner**: Notifications
- **date-fns**: Date handling

## Responsive Design Strategy

### Breakpoints
```
Mobile (< 640px)
  - Single column layouts
  - Hamburger menu
  - Full-width forms

Tablet (640px - 1024px)
  - 2-column grids
  - Sidebar navigation
  - Optimized spacing

Desktop (> 1024px)
  - 3-4 column grids
  - Full navigation
  - Maximum width container
```

### Mobile-First CSS
All styles start mobile and enhance with `md:`, `lg:`, `xl:` prefixes.

## Styling System

### Design Tokens (CSS Variables)
```css
--primary: Forest Green (#1a4d2e)
--secondary: Warm Gold (#b8860b)
--background: Ivory (#f8f6f1)
--foreground: Charcoal (#1a1a1a)
--border: Light Gray (#f0ebe4)
--muted: Very Light Gray (#f5f1eb)
```

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter/Lato (sans-serif)
- **Monospace**: Geist Mono

### Spacing Scale
- `2px`, `4px`, `6px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`

## State Management

### Client-Side State
- **useLanguage()**: Current language and translations
- **useState()**: Form data, UI toggles
- **localStorage**: Language preference persistence

### Server-Side State
- Request/response in API routes
- Optional database records

## Error Handling

### Client-Side
- Form validation with Zod
- Try-catch blocks around API calls
- User-friendly error messages

### Server-Side
- Input validation on every endpoint
- Error logging to console
- Graceful error responses

## Security Measures

### Input Validation
- Zod schema validation on client
- Re-validation on server
- Email format verification

### Data Protection
- No sensitive data in URLs
- HTTPS-only communication
- Environment variables for secrets
- CSRF protection (Next.js built-in)

### Best Practices
- Principle of least privilege
- No hardcoded secrets
- Rate limiting recommended
- reCAPTCHA for production

## Performance Optimization

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting (Next.js automatic)

### Image Optimization
- Next.js Image component
- WebP format with fallbacks
- Lazy loading by default
- Responsive srcset

### Caching Strategies
- Browser caching headers
- ISR (Incremental Static Regeneration)
- Static export for deployment

### Bundle Analysis
```bash
npm run build
npm run analyze  # (if configured)
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Email service integrated
- [ ] Database connected (optional)
- [ ] Images optimized
- [ ] Forms tested end-to-end
- [ ] All languages tested
- [ ] Mobile responsiveness verified
- [ ] Performance audited (Lighthouse)
- [ ] Security headers configured
- [ ] Analytics integrated

## Monitoring & Maintenance

### Health Checks
- Form submissions logging
- API endpoint availability
- Email delivery confirmation
- Database connection status

### Analytics Points
- Page views
- Form submissions
- Language selection
- Device types
- Geographic location

## Scaling Considerations

### For High Traffic
- Implement CDN for static assets
- Database connection pooling
- Rate limiting on API
- Email queue system
- Caching layer (Redis)

### Database Scaling
- Index frequently queried columns
- Archive old submissions
- Regular backups
- Connection monitoring

### Content Scaling
- Internationalization for more languages
- Additional destination pages
- Team profile expansion
- Service offerings growth

---

**Last Updated**: January 2026
**Maintained By**: SEWA Development Team
