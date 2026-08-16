# Setup

Everything you need to run Linkfolio locally and deploy it. Free tiers cover all
of this.

## 1. Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of `supabase/migrations/0001_init.sql`
   and run it. This creates the tables, RLS policies and the two RPC functions.
3. (Optional) Storage for avatars: **Storage > New bucket**, name it `avatars`,
   mark it **public**.
4. (Optional) Google login: **Authentication > Providers > Google**, enable it
   and paste your Google OAuth client id/secret.
5. Copy the keys from **Project Settings > API** into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (server only, keep secret)

## 2. Stripe
1. Create an account at [stripe.com](https://stripe.com) and stay in **Test mode**.
2. **Products > Add product**: name it "Linkfolio Pro", add a **recurring monthly**
   price (for example US$5). Copy the **Price ID** (`price_...`) into
   `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`.
3. **Developers > API keys**: copy the **Secret key** into `STRIPE_SECRET_KEY`.
4. Webhook secret for local testing (see step 4 below) goes into
   `STRIPE_WEBHOOK_SECRET`.

## 3. Environment
```bash
cp .env.example .env.local
```
Fill every value. `NEXT_PUBLIC_SITE_URL` stays `http://localhost:3000` for local dev.

## 4. Run locally
```bash
npm install
npm run dev
```
For subscription webhooks, in a second terminal use the Stripe CLI:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
It prints a `whsec_...` value; put it in `STRIPE_WEBHOOK_SECRET` and restart `npm run dev`.
Use the test card `4242 4242 4242 4242`, any future date and any CVC.

## 5. Deploy (Vercel)
1. Push the repo to GitHub and import it at [vercel.com](https://vercel.com).
2. Add every variable from `.env.local` in the Vercel project settings, but set
   `NEXT_PUBLIC_SITE_URL` to your Vercel URL.
3. In Stripe, add a **live webhook** endpoint pointing to
   `https://your-app.vercel.app/api/stripe/webhook` and copy its signing secret
   into the Vercel env.
4. In Supabase **Authentication > URL Configuration**, add your Vercel URL to the
   allowed redirect URLs.
