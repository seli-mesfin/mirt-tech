# ምርት tech

Professional enterprise agricultural trade and contract management platform.

## Supabase Setup

1. Create a Supabase project.
2. In Supabase SQL editor, run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. In Supabase Auth settings, ensure Email/Password provider is enabled.

## Run

```bash
npm install
npm run dev
```

 runs at(https://mirt-tech-2fop.vercel.app/)

## Current Implementation Status

- Supabase Auth: signup/login/logout implemented
- Role profile table: `profiles` (`farmer` / `exporter`) implemented
- Farmers module: fully connected to Supabase with per-user row-level access
- Exporters/Deals/Payments: schema + RLS ready in Supabase, UI wiring is next
