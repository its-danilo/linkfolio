import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProfileEditor } from "@/components/profile-editor";
import { LinksEditor } from "@/components/links-editor";
import type { Link as LinkRow } from "@/lib/types";

export default async function DashboardPage() {
  const profile = await getProfile();
  if (!profile) redirect("/onboarding");

  const supabase = await createClient();
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profile.id)
    .order("position");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your page</h1>
          <p className="mt-1 text-sm text-slate-500">
            Live at{" "}
            <a
              href={`/u/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:underline"
            >
              /u/{profile.username}
            </a>
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            profile.plan === "pro"
              ? "bg-indigo-50 text-indigo-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {profile.plan === "pro" ? "Pro" : "Free"}
        </span>
      </div>

      <ProfileEditor profile={profile} />
      <LinksEditor
        initialLinks={(links as LinkRow[]) ?? []}
        profileId={profile.id}
        plan={profile.plan}
      />
    </div>
  );
}
