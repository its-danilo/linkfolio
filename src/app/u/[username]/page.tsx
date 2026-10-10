import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LinkButton } from "@/components/link-button";
import { isOwnerUsername } from "@/lib/owner";
import type { PublicPage } from "@/lib/types";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_page", {
    p_username: username,
  });

  const page = data as PublicPage | null;
  if (!page) notFound();
  const plan =
    page.plan === "free" && (await isOwnerUsername(page.username)) ? "pro" : page.plan;

  return (
    <div className="flex min-h-full flex-col items-center bg-slate-50 px-5 py-14">
      <div className="w-full max-w-md text-center">
        {page.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.avatar_url}
            alt={page.display_name ?? page.username}
            className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-sm"
          />
        ) : (
          <div
            style={
              page.accent_color
                ? { backgroundColor: page.accent_color, color: "#fff" }
                : undefined
            }
            className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600"
          >
            {(page.display_name ?? page.username).charAt(0).toUpperCase()}
          </div>
        )}

        <h1 className="mt-4 text-xl font-bold text-slate-900">
          {page.display_name ?? `@${page.username}`}
        </h1>
        <p className="text-sm text-slate-500">@{page.username}</p>
        {page.bio && (
          <p className="mx-auto mt-3 max-w-sm text-sm text-slate-600">
            {page.bio}
          </p>
        )}

        <div className="mt-8 space-y-3">
          {page.links.length === 0 ? (
            <p className="text-sm text-slate-400">No links yet.</p>
          ) : (
            page.links.map((l) => (
              <LinkButton
                key={l.id}
                id={l.id}
                title={l.title}
                url={l.url}
                accent={page.accent_color}
              />
            ))
          )}
        </div>

        {plan === "free" && (
          <Link
            href="/"
            className="mt-12 inline-block text-xs font-medium text-slate-400 hover:text-slate-600"
          >
            Made with Linkfolio
          </Link>
        )}
      </div>
    </div>
  );
}
