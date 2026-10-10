import Link from "next/link";
import { BarChart3, Check, LinkIcon, Palette, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white text-slate-900">
      {/* Nav */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
            <LinkIcon size={18} />
          </span>
          Linkfolio
        </span>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-slate-600 hover:text-slate-900"
          >
            Log in
          </Link>
          <Link
            href="/login?mode=signup"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-16 pb-24 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <Sparkles size={13} /> Free to start · no credit card
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl">
          One link for{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            everything you do
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
          Build a beautiful link-in-bio page in minutes and see exactly which
          links your audience clicks.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3">
          <Link
            href="/login?mode=signup"
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Create your page
          </Link>
          <Link
            href="/u/demo"
            className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            See a live example
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid w-full max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-3">
        {[
          {
            icon: Palette,
            title: "Beautiful by default",
            body: "A clean, mobile-first page that looks great on any device, in your accent color.",
          },
          {
            icon: BarChart3,
            title: "Real click analytics",
            body: "Track total clicks and see which links perform best over time.",
          },
          {
            icon: Sparkles,
            title: "Ready in minutes",
            body: "Sign in, pick a username, add your links. That is the whole setup.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-slate-200 p-6">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
              <Icon size={20} />
            </div>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm text-slate-600">{body}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <h2 className="text-center text-3xl font-bold">Simple pricing</h2>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          <PlanCard
            name="Free"
            price="R$ 0"
            features={[
              "1 page",
              "Up to 5 links",
              "7-day analytics",
              "Preset accent colors",
            ]}
            cta="Get started"
          />
          <PlanCard
            name="Pro"
            price="R$ 14,90"
            highlighted
            features={[
              "Unlimited links",
              "90-day analytics",
              "Any custom accent color",
              "No Linkfolio badge",
            ]}
            cta="Start free, upgrade later"
          />
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Prices in Brazilian reais (BRL). Cancel anytime, with a full refund within 7 days of your
          first payment.{" "}
          <Link href="/terms" className="font-medium text-indigo-600 hover:underline">
            Terms, billing and refunds
          </Link>
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-100 py-8 text-center text-sm text-slate-500">
        Linkfolio · built with Next.js, Supabase and Stripe
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/terms" className="hover:text-slate-900">
            Terms, billing and refunds
          </Link>
          <a href="mailto:joaobolinha194@gmail.com" className="hover:text-slate-900">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}

function PlanCard({
  name,
  price,
  features,
  cta,
  highlighted = false,
}: {
  name: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-8 ${
        highlighted
          ? "border-indigo-600 ring-1 ring-indigo-600"
          : "border-slate-200"
      }`}
    >
      <h3 className="font-semibold">{name}</h3>
      <p className="mt-2 text-4xl font-extrabold">
        {price}
        <span className="text-base font-medium text-slate-500">/mo</span>
      </p>
      <ul className="mt-6 space-y-2.5 text-sm text-slate-600">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <Check size={16} className="text-indigo-600" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/login?mode=signup"
        className={`mt-8 block rounded-xl px-4 py-2.5 text-center font-semibold ${
          highlighted
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "border border-slate-200 text-slate-700 hover:bg-slate-50"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
