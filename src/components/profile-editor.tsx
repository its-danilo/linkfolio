"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

const PRESETS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#111827"];

export function ProfileEditor({ profile }: { profile: Profile }) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [accent, setAccent] = useState(profile.accent_color ?? "#4f46e5");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const isPro = profile.plan === "pro";

  async function save() {
    setStatus("saving");
    await createClient()
      .from("profiles")
      .update({
        display_name: displayName || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
        accent_color: accent,
      })
      .eq("id", profile.id);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-semibold text-slate-900">Profile</h2>

      <div className="mt-4 space-y-4">
        <Field label="Display name">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="input"
          />
        </Field>

        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            placeholder="A short line about you"
            className="input resize-none"
          />
        </Field>

        <Field label="Avatar URL">
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://…/avatar.png"
            className="input"
          />
        </Field>

        <Field label="Accent color">
          <div className="flex items-center gap-2">
            {PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAccent(c)}
                aria-label={c}
                style={{ backgroundColor: c }}
                className={`h-7 w-7 rounded-full ring-2 ${
                  accent === c ? "ring-slate-900" : "ring-transparent"
                }`}
              />
            ))}
            {isPro && (
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-7 w-7 cursor-pointer rounded"
                aria-label="Custom color"
              />
            )}
          </div>
          {!isPro && (
            <p className="mt-1.5 text-xs text-slate-400">
              Custom colors are a Pro feature.
            </p>
          )}
        </Field>
      </div>

      <button
        onClick={save}
        disabled={status === "saving"}
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {status === "saved" ? (
          <>
            <Check size={15} /> Saved
          </>
        ) : status === "saving" ? (
          "Saving…"
        ) : (
          "Save profile"
        )}
      </button>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
