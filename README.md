# AmarBazar

AmarBazar is a single-vendor electronics eCommerce platform built with Next.js, Prisma, Supabase Auth, Supabase PostgreSQL, and Supabase Storage.

## Setup

1. Create or open the Supabase project.

2. Copy environment examples:

```bash
cp .env.example .env
cp .env.local.example .env.local
```

3. Add real values:

```env
NEXT_PUBLIC_SUPABASE_URL="https://bwzzmjkmblsimczliece.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
DATABASE_URL="postgresql://postgres:YOUR_REAL_PASSWORD@db.bwzzmjkmblsimczliece.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:YOUR_REAL_PASSWORD@db.bwzzmjkmblsimczliece.supabase.co:5432/postgres"
NEXT_PUBLIC_SITE_URL="http://localhost:3020"
```

`DATABASE_URL` and `DIRECT_URL` must not contain brackets or placeholder passwords. Prisma CLI reads `.env`; the Next.js app reads `.env.local`.

4. Install and prepare database:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

5. Create a normal user from `/register`.

6. Promote the user:

```bash
npm run promote-admin -- admin@example.com SUPER_ADMIN optional-password
```

7. Login at `/admin/login`.

Public `/admin/register` is disabled after first SUPER_ADMIN setup. New admin accounts must be created or approved by a SUPER_ADMIN from the Admin Users section.
Public role selection is never exposed. SUPER_ADMIN manages admins at `/admin/admins`.

To create Supabase Auth users directly from `/admin/admins` or from `promote-admin`, add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and `.env`. Without it, profiles can be promoted but password login users must already exist in Supabase Auth.

## Google Auth

In Supabase Dashboard > Authentication > Providers > Google:

- Enable Google provider.
- Add Google credentials.
- Add callback URL:

```text
https://bwzzmjkmblsimczliece.supabase.co/auth/v1/callback
```

Also add app redirect URLs:

```text
http://localhost:3020/auth/callback
https://your-domain.com/auth/callback
```

## Health Check

Use `/api/health/db` to test database connectivity. It returns a safe JSON response and never exposes secrets.
