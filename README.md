# Linkfolio

A link-in-bio SaaS: create one shareable page for all your links and see which
ones your audience actually clicks. Free tier plus a paid Pro plan.

> Live demo: _add your Vercel URL here_

## Features
- Email magic-link and Google sign in (Supabase Auth)
- Public page at `/u/username`, mobile-first
- Link editor with reordering and active/inactive toggle
- Click analytics dashboard (totals and per-link, over time)
- Monthly subscription with Stripe (Free vs Pro), managed via the Stripe Customer Portal
- Per-user data isolation with Postgres Row-Level Security

## Tech stack
- **Next.js** (App Router, TypeScript) + **Tailwind CSS**
- **Supabase** (Auth, Postgres, Storage, RLS)
- **Stripe** (Checkout, Customer Portal, webhooks)
- Deployed on **Vercel**

## Security notes
- Tables are private by default; RLS restricts every row to its owner.
- Public pages are served through a `security definer` RPC that returns only
  safe fields, so internal columns (Stripe IDs, plan) are never exposed to the
  anonymous API.
- Click logging goes through a `register_click` RPC that derives the owner from
  the link, instead of trusting client-supplied values.

## Getting started
See [SETUP.md](./SETUP.md) for the full setup (Supabase, Stripe and env vars).
Short version:

```bash
cp .env.example .env.local   # then fill in the values
npm install
npm run dev                  # http://localhost:3000
```
