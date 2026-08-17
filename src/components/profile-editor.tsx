"use client";

import { useRef, useState } from "react";
import { Check, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

const PRESETS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#111827"];
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;

export function ProfileEditor({ profile }: { profile: Profile }) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [accent, setAccent] = useState(profile.accent_color ?? "#4f46e5");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPro = profile.plan === "pro";

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be picked again later
    if (!file) return;

    setUploadError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Use a PNG, JPG or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("Image must be 2MB or smaller.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext =
      file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${profile.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      setUploading(false);
      setUploadError(error.message);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
  }

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

        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Avatar
          </span>
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="h-16 w-16 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-xl font-bold text-slate-400">
                {(displayName || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <Upload size={15} /> {uploading ? "Uploading…" : "Upload photo"}
              </button>
              <p className="mt-1 text-xs text-slate-400">
                PNG, JPG or WebP, up to 2MB.
              </p>
            </div>
          </div>
          {uploadError && (
            <p className="mt-1.5 text-sm text-red-600">{uploadError}</p>
          )}
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="…or paste an image URL"
            className="input mt-3"
          />
        </div>

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
