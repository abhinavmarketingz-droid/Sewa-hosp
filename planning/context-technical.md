# Technical Architecture Context

## Extensibility Model
**Goal**: Make the platform extension-based without sacrificing stability.

- **Core**: Authentication, content engine, media, audit logging, backups.
- **Extensions**: Payments, booking, loyalty, advanced analytics, custom widgets.
- **Extension Registry**: Each extension declares:
  - Routes
  - UI components
  - Content schema additions
  - Permissions
  - Feature flags

## Theming System
- **Design token layer** (JSON + CSS variables)
- **Theme extensions** (packaged overrides and components)
- **Tenant-level theme selection**
- **Runtime theming** with low payload

## Performance & Delivery
- Aggressive caching for public pages
- Edge-compatible content API
- Incremental static regeneration where applicable
- Media optimization pipeline

## Data Model Upgrades
- Add **tenant_id** to all content and media tables
- Add **theme_config** table per tenant
- Add **extension_entitlements** per tenant
- Add **page_builder** schema (pages, sections, blocks)

## Build & Release
- Deterministic dependency versions
- CI gates on lint, tests, and Lighthouse budgets
- Feature-flagged rollout for new extensions

## Platform Interfaces
- Admin UI for toggling extensions
- Public API with versioning
- Webhooks for external integrations
