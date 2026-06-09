# AmarBazar Supabase Setup

This project is wired for Supabase PostgreSQL, Supabase Auth, Supabase Storage, and Prisma.

## 1. Environment

Copy `.env.example` to `.env` and replace the database placeholders with your Supabase connection strings.

Required variables:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.bwzzmjkmblsimczliece.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.bwzzmjkmblsimczliece.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://bwzzmjkmblsimczliece.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_STORAGE_BUCKET="amarbazar-media"
NEXT_PUBLIC_SITE_URL="http://localhost:3020"
```

Use Supabase's pooled connection for `DATABASE_URL`. Use the direct connection for migrations and `db push` through `DIRECT_URL`.

## 2. Prisma

Validate and generate:

```bash
npx prisma validate
npx prisma generate
```

Push schema to Supabase:

```bash
npx prisma db push
npm run db:seed
```

For production, prefer migrations:

```bash
npx prisma migrate dev --name init
npx prisma migrate deploy
```

## 3. Auth

Enabled flows:

- Email/password login
- Email/password register
- Forgot password
- Reset password
- Google OAuth callback at `/auth/callback`
- Admin login with role checks through `UserProfile.role`

In Supabase Dashboard:

1. Enable Email provider.
2. Enable Google provider.
3. Add redirect URLs:
   - `http://localhost:3020/auth/callback`
   - `https://your-domain.com/auth/callback`
4. Add site URL:
   - `http://localhost:3020`

Admin users must exist in `UserProfile` with role `ADMIN`, `SUPER_ADMIN`, or `STAFF`.

Promote an existing user after they register/login once:

```bash
npm run promote-admin -- admin@example.com SUPER_ADMIN
```

## 4. Storage

Create a public bucket:

```text
amarbazar-media
```

Recommended folder structure:

```text
products/
categories/
brands/
banners/
blogs/
settings/
```

Use Supabase Storage policies appropriate for your production model. Public read is suitable for storefront assets; writes should be admin-only.

## 5. Current Backend Foundation

Implemented in this pass:

- Enterprise Prisma schema
- Prisma singleton
- Supabase browser/server clients
- Auth server actions
- OAuth callback route
- Product/category/brand/cart repositories
- Checkout/order service
- Route protection for `/admin/*` and `/dashboard/*`

Next wiring stages:

- Replace mock storefront queries with repository-backed server components.
- Connect admin CRUD pages to server actions.
- Add media upload UI using Supabase Storage.
- Run `npm run db:seed` after `npx prisma db push`.
