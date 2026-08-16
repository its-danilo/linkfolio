"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

export function OnboardingForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const value = username.trim().toLowerCase();
    if (!USERNAME_RE.test(value)) {
      setError("3-30 characters: lowercase letters, numbers or underscore.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    const { error: insertError } = await supabase
      .from("profiles")
      .insert({ id: user.id, username: value });

    if (insertError) {
      setLoading(false);
      setError(
        insertError.code === "23505"
          ? "That username is already taken."
          : "Could not save. Please try again.",
      );
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <div className="flex items-center rounded-lg border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
        <span className="pl-3.5 text-sm text-slate-400">/u/</span>
        <input
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname"
          className="w-full rounded-lg bg-transparent px-1.5 py-2.5 text-sm outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}
