import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/types";

export default async function AnalyticsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/onboarding");

  const days = PLAN_LIMITS[profile.plan].analyticsDays;
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const supabase = await createClient();
  const [{ data: links }, { data: clicks }] = await Promise.all([
    supabase.from("links").select("id, title").eq("profile_id", profile.id),
    supabase
      .from("link_clicks")
      .select("link_id, created_at")
      .eq("profile_id", profile.id)
      .gte("created_at", since.toISOString()),
  ]);

  const clickRows = (clicks ?? []) as { link_id: string; created_at: string }[];
  const linkRows = (links ?? []) as { id: string; title: string }[];
  const total = clickRows.length;

  // Clicks per day across the window.
  const dayKeys: string[] = [];
  const dayCounts: number[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    dayKeys.push(d.toISOString().slice(0, 10));
    dayCounts.push(0);
  }
  const dayIndex = new Map(dayKeys.map((k, i) => [k, i]));
  for (const c of clickRows) {
    const idx = dayIndex.get(c.created_at.slice(0, 10));
    if (idx !== undefined) dayCounts[idx]++;
  }
  const maxDay = Math.max(1, ...dayCounts);

  // Clicks per link.
  const perLink = linkRows
    .map((l) => ({
      title: l.title,
      count: clickRows.filter((c) => c.link_id === l.id).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxLink = Math.max(1, ...perLink.map((p) => p.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Last {days} days</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-500">Total clicks</p>
        <p className="mt-1 text-4xl font-extrabold text-slate-900">{total}</p>

        <div className="mt-6 flex h-32 items-end gap-[3px]">
          {dayCounts.map((count, i) => (
            <div
              key={dayKeys[i]}
              title={`${dayKeys[i]}: ${count}`}
              className="flex-1 rounded-t bg-indigo-500/80 transition hover:bg-indigo-600"
              style={{ height: `${(count / maxDay) * 100}%`, minHeight: 2 }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>{dayKeys[0]}</span>
          <span>{dayKeys[dayKeys.length - 1]}</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Clicks by link</h2>
        <div className="mt-4 space-y-3">
          {perLink.length === 0 && (
            <p className="text-sm text-slate-400">No links yet.</p>
          )}
          {perLink.map((l) => (
            <div key={l.title} className="flex items-center gap-3">
              <span className="w-40 shrink-0 truncate text-sm text-slate-700">
                {l.title}
              </span>
              <div className="h-2.5 flex-1 rounded-full bg-slate-100">
                <div
                  className="h-2.5 rounded-full bg-indigo-500"
                  style={{ width: `${(l.count / maxLink) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-medium text-slate-900">
                {l.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {profile.plan === "free" && (
        <p className="rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          Free plans show the last 7 days. Upgrade to Pro for 90 days of history.
        </p>
      )}
    </div>
  );
}
