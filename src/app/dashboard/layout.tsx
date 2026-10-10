import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink, LinkIcon } from "lucide-react";
import { getProfile } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";
import { BillingButton } from "@/components/billing-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/onboarding");

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-indigo-600 text-white">
                <LinkIcon size={15} />
              </span>
              <span className="hidden sm:inline">Linkfolio</span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Analytics
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/u/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">/u/{profile.username}</span>
            </a>
            {process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID && !profile.isOwner && (
              <BillingButton plan={profile.plan} />
            )}
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-8">{children}</main>
    </div>
  );
}
