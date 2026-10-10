import { createAdminClient } from "@/lib/supabase/admin";

/** Emails in OWNER_EMAILS (comma-separated) get every Pro feature without a
 * subscription. SERVER-ONLY: reads a private env var. */
export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const owners = (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return owners.includes(email.toLowerCase());
}

/** Whether the public page of `username` belongs to an owner. Used where only
 * the public page data is available, without the visitor's session. */
export async function isOwnerUsername(username: string): Promise<boolean> {
  if (!process.env.OWNER_EMAILS) return false;
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (!profile) return false;
  const { data } = await admin.auth.admin.getUserById(profile.id);
  return isOwnerEmail(data.user?.email);
}
