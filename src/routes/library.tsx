import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { CATEGORIES, SIGNS } from "@/lib/signs";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Sign library — Signal" },
      {
        name: "description",
        content:
          "Browse ASL vocabulary by category, search any word, and keep a favourites playlist to review the signs you care about.",
      },
      { property: "og:title", content: "Sign library — Signal" },
      {
        property: "og:description",
        content: "Searchable, categorized ASL vocabulary with a favourites playlist.",
      },
    ],
  }),
  component: Library,
});

const FAV_DEFAULT = ["thank-you", "how-are-you"];

function Library() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [favs, setFavs] = useState<string[]>(FAV_DEFAULT);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SIGNS.filter((s) => {
      if (cat !== "All" && s.category !== cat) return false;
      if (onlyFavs && !favs.includes(s.slug)) return false;
      return !q || s.word.toLowerCase().includes(q);
    });
  }, [query, cat, onlyFavs, favs]);

  return (
    <AppShell>
      <ScreenHeader
        title="Library"
        subtitle={`${SIGNS.length} signs · ${favs.length} favourites`}
        action={
          <button
            onClick={() => setOnlyFavs((v) => !v)}
            className={
              onlyFavs
                ? "rounded-full bg-warm px-3 py-1.5 text-xs font-bold text-accent-foreground"
                : "rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground"
            }
          >
            Favourites
          </button>
        }
      />

      <div className="px-5">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              cat === c
                ? "shrink-0 rounded-full bg-signal px-3.5 py-1.5 text-xs font-bold text-primary-foreground"
                : "shrink-0 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5 px-5">
        {list.map((s) => {
          const fav = favs.includes(s.slug);
          return (
            <div
              key={s.slug}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"
            >
              <Link
                to="/practice/$slug"
                params={{ slug: s.slug }}
                className="min-w-0 flex-1"
              >
                <p className="truncate text-sm font-semibold">{s.word}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {s.category} · {s.difficulty} · {s.gloss}
                </p>
              </Link>
              <button
                aria-label={fav ? "Remove favourite" : "Add favourite"}
                onClick={() =>
                  setFavs((f) =>
                    f.includes(s.slug)
                      ? f.filter((x) => x !== s.slug)
                      : [...f, s.slug],
                  )
                }
                className="shrink-0 p-1"
              >
                <Star
                  className={
                    fav ? "h-5 w-5 fill-accent text-accent" : "h-5 w-5 text-muted-foreground"
                  }
                />
              </button>
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nothing here yet — try another category.
          </p>
        )}
      </div>
    </AppShell>
  );
}
