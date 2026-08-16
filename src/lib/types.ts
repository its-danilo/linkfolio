export type Plan = "free" | "pro";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: string;
  accent_color: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
};

export type Link = {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  position: number;
  is_active: boolean;
  created_at: string;
};

/** Shape returned by the get_public_page() RPC (safe, public fields only). */
export type PublicPage = {
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: string;
  accent_color: string | null;
  plan: Plan;
  links: { id: string; title: string; url: string }[];
};

export const PLAN_LIMITS = {
  free: { maxLinks: 5, analyticsDays: 7, badge: true },
  pro: { maxLinks: Infinity, analyticsDays: 90, badge: false },
} as const;
