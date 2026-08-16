"use client";

import { createClient } from "@/lib/supabase/client";

/** A public-page link that records a click before opening the URL. */
export function LinkButton({
  id,
  title,
  url,
  accent,
}: {
  id: string;
  title: string;
  url: string;
  accent?: string | null;
}) {
  function handleClick() {
    // Fire-and-forget: the tab stays open (target=_blank), so this resolves.
    try {
      createClient().rpc("register_click", {
        p_link_id: id,
        p_referrer: document.referrer || null,
      });
    } catch {
      // Never block the navigation on analytics.
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      style={accent ? { borderColor: accent } : undefined}
      className="block w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-center font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {title}
    </a>
  );
}
