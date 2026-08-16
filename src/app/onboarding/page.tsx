import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function OnboardingPage() {
  const profile = await getProfile();
  if (profile) redirect("/dashboard");

  return (
    <div className="flex min-h-full items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Claim your username
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          This is your public page address.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}
