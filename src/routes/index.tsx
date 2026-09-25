import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Flame, Search, Sparkles, Star, ArrowRight, Play } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { SIGNS, DIALOGUES, SEED_HISTORY } from "@/lib/signs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Signal — Practice ASL with camera feedback" },
      {
        name: "description",
        content:
          "Signal is a sign language tutor: practice ASL words on camera, get feedback on handshape, facial expression and sign space, and rehearse real dialogues.",
      },
      { property: "og:title", content: "Signal — Practice ASL with camera feedback" },
      {
        property: "og:description",
        content:
          "Daily signs, webcam practice with feedback on the 70% that isn't your hands, and bite-sized conversation scenarios.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  const daily = SIGNS[0];

  if (!daily) {
    return null;
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SIGNS.filter(
      (s) =>
        s.word.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
    ).slice(0, 5);
  }, [query]);

  const weakest = SEED_HISTORY.filter((a) => a.score < 75).slice(0, 3);

  return (
    <AppShell>
      <ScreenHeader
        title="Good morning, Manal"
        subtitle="4-day streak · 12 signs in review"
        action={
          <span className="flex items-center gap-1.5 rounded-full bg-warm px-3 py-1.5 text-xs font-bold text-accent-foreground">
            <Flame className="h-3.5 w-3.5" /> 4
          </span>
        }
      />

      <div className="px-5">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a sign to practice…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        {results.length > 0 && (
          <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-surface">
            {results.map((s) => (
              <Link
                key={s.slug}
                to="/practice/$slug"
                params={{ slug: s.slug }}
                className="flex items-center justify-between border-b border-border px-4 py-3 text-sm last:border-0"
              >
                <span className="font-medium">{s.word}</span>
                <span className="text-xs text-muted-foreground">{s.category}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sign of the day */}
      <section className="mt-6 px-5">
        <SectionLabel icon={Sparkles} text="Sign of the day" />
        <Link
          to="/practice/$slug"
          params={{ slug: daily.slug }}
          className="grain relative mt-3 block overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-glow"
        >
          <div className="absolute inset-0 bg-signal opacity-[0.16]" />
          <div className="relative">
            <span className="text-[11px] font-semibold tracking-widest text-primary uppercase">
              {daily.category} · {daily.difficulty}
            </span>
            <h2 className="mt-2 text-3xl leading-none font-bold">{daily.word}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{daily.gloss}</p>
            <p className="mt-3 text-sm">
              <span className="text-muted-foreground">In a sentence: </span>
              {daily.sentence}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-sm font-semibold text-primary-foreground">
              <Play className="h-4 w-4" /> Practice on camera
            </span>
          </div>
        </Link>
      </section>

      {/* Review misses */}
      <section className="mt-7 px-5">
        <SectionLabel icon={Flame} text="Bring back what slipped" />
        <p className="mt-1 text-xs text-muted-foreground">
          Signs you missed, resurfaced before you forget them.
        </p>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {weakest.map((a) => (
            <Link
              key={a.slug + a.at}
              to="/practice/$slug"
              params={{ slug: a.slug }}
              className="min-w-[152px] rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{a.word}</span>
                <span
                  className={
                    a.score < 60
                      ? "text-xs font-bold text-mismatch"
                      : "text-xs font-bold text-accent"
                  }
                >
                  {a.score}%
                </span>
              </div>
              <p className="mt-2 text-xs leading-snug text-muted-foreground">
                {a.misses[0] ?? "Tighten the movement"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Dialogues */}
      <section className="mt-7 px-5">
        <div className="flex items-end justify-between">
          <SectionLabel icon={Star} text="Bite-sized conversations" />
          <Link to="/dialogue" className="text-xs font-semibold text-primary">
            All
          </Link>
        </div>
        <div className="mt-3 space-y-2.5">
          {DIALOGUES.slice(0, 2).map((d) => (
            <Link
              key={d.id}
              to="/dialogue"
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warm text-sm font-bold text-accent-foreground">
                {d.minutes}m
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{d.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {d.scenario}
                </p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function SectionLabel({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-bold">{text}</h3>
    </div>
  );
}
