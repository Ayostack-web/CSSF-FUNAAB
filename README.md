# CSSF FUNAAB Website

A production-focused church fellowship website built with Next.js and Supabase.

The app includes:
- Public-facing pages for fellowship content and events
- Admin portal for managing sermons, worship images, banners, and site settings
- Dynamic content updates from database-backed APIs

## Live Features

- Event banner carousel with image uploads, event date, and event time
- Sermon publishing and deletion from admin dashboard
- Worship image upload and deletion
- Site Settings management for contact phone numbers (supports two numbers)
- Dynamic phone display in Contact and Footer sections
- Admin-gated mutation APIs using Supabase session token + email check
- Signed URL handling for banner image delivery

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Supabase (Auth, Database, Storage)
- Tailwind CSS + shadcn/ui primitives
- Embla Carousel (autoplay)

## Project Structure (high-level)

- `src/app/page.jsx` - main landing page composition
- `src/app/admin-portal/page.jsx` - admin dashboard UI and actions
- `src/app/component/` - reusable page sections (Hero, Footer, Contact, UpcomingEvents, etc.)
- `src/app/api/` - server routes for banners, worship, account info, and site settings
- `src/app/utils/supabase/` - Supabase client/server helpers

## Environment Variables

Create a `.env.local` file at the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=your_admin_email@example.com
```

Notes:
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-side only.
- `ADMIN_EMAIL` is used to authorize write operations in protected API routes.

## Database Requirements

The app expects these tables/buckets:

### Tables
- `sermons`
	- `id`, `title`, `drive_link`, `created_at`
- `worship_images`
	- `id`, `title`, `image_url`, `order`, `created_at`
- `banners`
	- `id`, `event_name`, `image_url`, `event_date`, `event_time`, `created_at`
- `site_settings`
	- `id`, `key` (unique), `value`, `created_at`, `updated_at`
	- expected keys:
		- `footer_phone`
		- `footer_phone_secondary`

### Storage Buckets
- `event-banners`
- `worship_images`

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` - start local dev server (Turbopack)
- `npm run build` - build for production
- `npm run start` - start production server
- `npm run lint` - run lint checks

## Admin Workflow

1. Sign in through the admin portal.
2. Upload banners with:
	 - Event name
	 - Event date
	 - Event time
	 - Banner image
3. Manage sermons and worship items.
4. Update Site Settings phone numbers once, then Contact/Footer update automatically.

## API Endpoints (selected)

- `GET /api/banner/list` - fetch banners (with signed image URLs)
- `POST /api/banner/upload` - create banner (admin-authenticated)
- `POST /api/banner/delete` - delete banner (admin-authenticated)
- `POST /api/worship/upload` - create worship item (admin-authenticated)
- `POST /api/worship/delete` - delete worship item (admin-authenticated)
- `GET /api/site-settings/footer-phone` - fetch primary/secondary phone numbers
- `POST /api/site-settings/footer-phone` - update phone numbers (admin-authenticated)

## Deployment

This project deploys well to Vercel.

Deployment checklist:
- Set all required environment variables in your hosting provider
- Confirm database schema includes `banners.event_date` and `banners.event_time`
- Confirm `site_settings` table exists with required keys
- Ensure storage buckets exist and have proper policies

## Why this project is portfolio-ready

- Demonstrates full-stack ownership (UI + API + DB + auth)
- Includes real admin tooling and content operations
- Uses dynamic backend-driven content instead of hardcoded values
- Shows practical production concerns (authorization, signed URLs, settings management)

## License

MIT License. See [LICENSE](LICENSE).
