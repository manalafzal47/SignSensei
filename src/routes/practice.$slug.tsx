import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Eye,
  Hand,
  Move3d,
  Repeat,
  TriangleAlert,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CameraMirror, SignReference } from "@/components/SignStage";
import { ScoreRing } from "@/components/ScoreRing";
import { getSign } from "@/lib/signs";

export const Route = createFileRoute("/practice/$slug")({
  loader: ({ params }) => {
    const sign = getSign(params.slug);
    if (!sign) throw notFound();
    return { sign };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Sign not found — Signal" }, { name: "robots", content: "noindex" }],
      };
    }
    const { sign } = loaderData;
    return {
      meta: [
        { title: `Practice “${sign.word}” — Signal` },
        {
          name: "description",
          content: `Practice the ASL sign for ${sign.word} on camera: ${sign.handshape}, ${sign.facial}.`,
        },
        { property: "og:title", content: `Practice “${sign.word}” in ASL — Signal` },
        {
          property: "og:description",
          content: `Handshape, movement, facial expression and sign space for ${sign.word}, with live camera feedback.`,
        },
      ],
    };
  },
  component: Practice,
});

type Phase = "ready" | "recording" | "result";

function Practice() {
  const { sign } = Route.useLoaderData();
  const [phase, setPhase] = useState<Phase>("ready");
  const [speed, setSpeed] = useState(0.5);
  const [score, setScore] = useState(0);
  const [attempt, setAttempt] = useState(0);

  function start() {
    setPhase("recording");
    window.setTimeout(() => {
      const next = attempt === 0 ? 62 : Math.min(97, 62 + attempt * 14);
      setScore(next);
      setAttempt((a) => a + 1);
      setPhase("result");
    }, 2200);
  }

  const channels = [
    {
      icon: Hand,
      label: "Handshape",
      value: sign.handshape,
      ok: score >= 60,
    },
    {
      icon: Repeat,
      label: "Movement",
      value: sign.movement,
      ok: score >= 75,
    },
    {
      icon: Eye,
      label: "Face & brows",
      value: sign.facial,
      ok: score >= 85,
    },
    {
      icon: Move3d,
      label: "Sign space",
      value: sign.space,
      ok: score >= 70,
    },
  ];

  return (
    <AppShell>
      <header className="flex items-center gap-3 px-5 pt-7 pb-4">
        <Link
          to="/library"
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
            {sign.category}
          </p>
          <h1 className="text-xl font-bold">{sign.word}</h1>
        </div>
      </header>

      <div className="space-y-4 px-5">
        <SignReference
          word={sign.word}
          speed={speed}
          onSpeedChange={setSpeed}
          compact={phase === "result"}
        />

        <CameraMirror recording={phase === "recording"} overlayWord={sign.word} />

        {phase !== "result" ? (
          <>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Watch for
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li>
                  <span className="text-muted-foreground">Face · </span>
                  {sign.facial}
                </li>
                <li>
                  <span className="text-muted-foreground">Space · </span>
                  {sign.space}
                </li>
              </ul>
              <p className="mt-3 text-sm">
                <span className="text-muted-foreground">In context · </span>
                {sign.sentence}
                <span className="block text-xs text-muted-foreground">
                  {sign.sentenceGloss}
                </span>
              </p>
            </div>

            <button
              onClick={start}
              disabled={phase === "recording"}
              className="w-full rounded-2xl bg-signal py-4 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-70"
            >
              {phase === "recording" ? "Hold the sign…" : "Start practice"}
            </button>
          </>
        ) : (
          <div className="rise space-y-4">
            <div className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-5">
              <ScoreRing score={score} />
              <div>
                <p className="font-display text-lg font-bold">
                  {score >= 80 ? "Clean sign" : score >= 60 ? "Almost there" : "Keep going"}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  {score >= 80
                    ? "Hands, face and space all lined up. Try it inside a dialogue next."
                    : "Your hands read correctly — the gap is in the parts that carry 70% of the meaning."}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {channels.map(({ icon: Icon, label, value, ok }) => (
                <div
                  key={label}
                  className={
                    ok
                      ? "flex gap-3 rounded-2xl border border-match/40 bg-surface p-4"
                      : "flex gap-3 rounded-2xl border border-mismatch/50 bg-surface p-4"
                  }
                >
                  <span
                    className={
                      ok
                        ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-match/15 text-match"
                        : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mismatch/15 text-mismatch"
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      {label}
                      {ok ? (
                        <BadgeCheck className="h-3.5 w-3.5 text-match" />
                      ) : (
                        <TriangleAlert className="h-3.5 w-3.5 text-mismatch" />
                      )}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {ok ? value : `Adjust · ${value}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setPhase("ready")}
                className="flex-1 rounded-2xl bg-signal py-4 text-sm font-bold text-primary-foreground"
              >
                Try again
              </button>
              <Link
                to="/history"
                className="flex-1 rounded-2xl border border-border bg-surface py-4 text-center text-sm font-semibold"
              >
                Save & exit
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
