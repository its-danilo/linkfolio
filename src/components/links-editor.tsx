"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS, type Link as LinkRow, type Plan } from "@/lib/types";

export function LinksEditor({
  initialLinks,
  profileId,
  plan,
}: {
  initialLinks: LinkRow[];
  profileId: string;
  plan: Plan;
}) {
  const [links, setLinks] = useState<LinkRow[]>(
    [...initialLinks].sort((a, b) => a.position - b.position),
  );
  const supabase = createClient();
  const limit = PLAN_LIMITS[plan].maxLinks;
  const atLimit = links.length >= limit;

  async function addLink() {
    if (atLimit) return;
    const position = links.length
      ? Math.max(...links.map((l) => l.position)) + 1
      : 0;
    const { data } = await supabase
      .from("links")
      .insert({
        profile_id: profileId,
        title: "New link",
        url: "https://",
        position,
      })
      .select()
      .single();
    if (data) setLinks((prev) => [...prev, data as LinkRow]);
  }

  async function updateLink(id: string, patch: Partial<LinkRow>) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    await supabase.from("links").update(patch).eq("id", id);
  }

  async function deleteLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await supabase.from("links").delete().eq("id", id);
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= links.length) return;
    const a = links[index];
    const b = links[target];
    setLinks((prev) =>
      prev
        .map((l) => {
          if (l.id === a.id) return { ...l, position: b.position };
          if (l.id === b.id) return { ...l, position: a.position };
          return l;
        })
        .sort((x, y) => x.position - y.position),
    );
    await Promise.all([
      supabase.from("links").update({ position: b.position }).eq("id", a.id),
      supabase.from("links").update({ position: a.position }).eq("id", b.id),
    ]);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Links</h2>
        <span className="text-xs text-slate-400">
          {links.length}
          {limit === Infinity ? "" : ` / ${limit}`}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {links.map((link, i) => (
          <div
            key={link.id}
            className="flex items-start gap-2 rounded-xl border border-slate-200 p-3"
          >
            <div className="flex flex-col">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                aria-label="Move up"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === links.length - 1}
                className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                aria-label="Move down"
              >
                <ArrowDown size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-2">
              <input
                value={link.title}
                onChange={(e) =>
                  setLinks((prev) =>
                    prev.map((l) =>
                      l.id === link.id ? { ...l, title: e.target.value } : l,
                    ),
                  )
                }
                onBlur={(e) => updateLink(link.id, { title: e.target.value })}
                placeholder="Title"
                className="input"
              />
              <input
                value={link.url}
                onChange={(e) =>
                  setLinks((prev) =>
                    prev.map((l) =>
                      l.id === link.id ? { ...l, url: e.target.value } : l,
                    ),
                  )
                }
                onBlur={(e) => updateLink(link.id, { url: e.target.value })}
                placeholder="https://…"
                className="input"
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <label className="inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={link.is_active}
                  onChange={(e) =>
                    updateLink(link.id, { is_active: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <span className="h-5 w-9 rounded-full bg-slate-200 p-0.5 transition peer-checked:bg-indigo-600">
                  <span className="block h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
                </span>
              </label>
              <button
                onClick={() => deleteLink(link.id)}
                className="text-slate-300 hover:text-red-500"
                aria-label="Delete link"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <p className="py-2 text-sm text-slate-400">
            No links yet. Add your first one below.
          </p>
        )}
      </div>

      {atLimit ? (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You reached the {limit}-link limit of the Free plan. Upgrade to Pro for
          unlimited links.
        </p>
      ) : (
        <button
          onClick={addLink}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
        >
          <Plus size={16} /> Add link
        </button>
      )}
    </section>
  );
}
