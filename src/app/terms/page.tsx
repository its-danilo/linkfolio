import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms, billing and refunds | Linkfolio",
  description: "How Linkfolio subscriptions, cancellations, refunds and your data work.",
};

const CONTACT = "joaobolinha194@gmail.com";

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 text-slate-700">
      <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to Linkfolio
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-slate-900">Terms, billing and refunds</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: October 10, 2026</p>

      <Section title="Who we are">
        <p>
          Linkfolio is operated by Michelli da Silva. For anything about your account, billing or these
          terms, write to <Mail />.
        </p>
      </Section>

      <Section title="The service">
        <p>Linkfolio gives you one public page that holds all your links, with an editor and click analytics.</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>
            <strong>Free:</strong> 1 page, up to 5 links, 7 days of analytics, preset accent colors and a small “Made with Linkfolio” link on your page.
          </li>
          <li>
            <strong>Pro:</strong> unlimited links, 90 days of analytics, any custom accent color and no Linkfolio link on your page.
          </li>
        </ul>
      </Section>

      <Section title="Billing">
        <p>
          Pro costs <strong>R$ 14,90 per month</strong>, charged in Brazilian reais (BRL) through
          Stripe when you subscribe and renewed automatically every month until you cancel. Card
          details are handled by Stripe; Linkfolio never sees or stores them. If a price changes, we
          email you at least 30 days before the new price applies.
        </p>
      </Section>

      <Section title="Cancellation">
        <p>
          Cancel anytime from <strong>Manage billing</strong> in your dashboard. You keep Pro until
          the end of the period you already paid for, and then your account goes back to the Free
          plan. Your data is kept.
        </p>
      </Section>

      <Section title="Refunds">
        <p>
          <strong>7-day right of withdrawal:</strong> you can ask for a full refund within 7 days of
          your first payment, as provided by article 49 of the Brazilian Consumer Protection Code
          (CDC). Email <Mail /> from the address of your account and we cancel the subscription and
          refund the charge.
        </p>
        <p className="mt-3">
          After those 7 days, payments are not refunded, including for partial months: cancelling
          stops the next renewal.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>Don’t use Linkfolio to link to illegal content, malware, phishing or spam, or to impersonate someone. We may remove links or suspend accounts that do.</p>
      </Section>

      <Section title="Your data">
        <p>We store your email, your profile (username, display name, bio, avatar, color), your links, and for each click on them the date, the referring site and the visitor’s country. We don’t store visitors’ IP addresses.</p>
        <p className="mt-3">
          It is stored and processed by the services that run Linkfolio: Supabase (database and sign-in), Vercel (hosting) and Stripe (payments). We do not sell
          your data or use it for advertising. To delete your account and everything in it, email{" "}
          <Mail />.
        </p>
      </Section>

      <Section title="Availability and changes">
        <p>
          We work to keep Linkfolio running, but it is provided as is, without a guarantee of
          uninterrupted service. We may update these terms; significant changes are announced by
          email before they apply.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Mail() {
  return (
    <a href={`mailto:${CONTACT}`} className="font-medium text-indigo-600 hover:underline">
      {CONTACT}
    </a>
  );
}
