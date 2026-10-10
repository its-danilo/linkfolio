import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isOwnerEmail } from "@/lib/owner";
import type { Profile } from "@/lib/types";

/** Returns the current profile (or null if the user has not onboarded yet).
 * Owners (OWNER_EMAILS) are reported as Pro. Redirects to /login when there is
 * no authenticated user. */
export async function getProfile(): Promise<(Profile & { isOwner: boolean }) | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) return null;
  const isOwner = isOwnerEmail(user.email);
  const profile = data as Profile;
  return { ...profile, plan: isOwner ? "pro" : profile.plan, isOwner };
}
