import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SignReference } from "@/components/SignStage";
import { HandTracker, type HandFrame } from "@/components/HandTracker";
import { appendPracticeAttempt, getCurrentUser } from "@/lib/app-store";
import { evaluateCapture } from "@/lib/sign-scoring";
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
  const [coverage, setCoverage] = useState(0);
  const [sampleCount, setSampleCount] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const user = getCurrentUser();

  const framesRef = useRef<HandFrame[]>([]);

  function handleFrame(frame: HandFrame) {
    framesRef.current.push(frame);
  }

  function start() {
    framesRef.current = [];
    setIssues([]);
    setStrengths([]);
    setPhase("recording");

    window.setTimeout(() => {
      const frames = framesRef.current;
      const evaluation = evaluateCapture(frames);

      setCoverage(evaluation.coverage);
      setSampleCount(evaluation.sampleCount);
      setIssues(evaluation.issues);
      setStrengths(evaluation.strengths);

      appendPracticeAttempt({
        slug: sign.slug,
        word: sign.word,
        category: sign.category,
        coverage: evaluation.coverage,
        sampleCount: evaluation.sampleCount,
        misses: evaluation.issues,
        summary: evaluation.strengths[0] ?? "Practice attempt recorded.",
      });

      setPhase("result");
    }, 2200);
  }

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
        <SignReference sign={sign} />

        <HandTracker recording={phase === "recording"} onFrame={handleFrame} />

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
              </p>
            </div>

            <button
              onClick={start}
              disabled={phase === "recording"}
              className="w-full rounded-2xl bg-signal py-4 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-70"
            >
              {phase === "recording" ? "Capturing hand movement..." : "Start practice"}
            </button>
          </>
        ) : (
          <div className="rise space-y-4">
            <div className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-5">
              <div className="min-w-24">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Hand detected
                </p>
                <p className="mt-1 text-3xl font-bold">{coverage}%</p>
              </div>
              <div>
                <p className="font-display text-lg font-bold">Camera capture</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  Detected a hand in {Math.round((coverage / 100) * sampleCount)} of {sampleCount} captured frames. This does not grade sign accuracy.{" "}
                  {user
                    ? `Saved to ${user.name.split(" ")[0]}'s practice history.`
                    : "Saved to your local practice history."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm font-semibold">What the camera detected</p>
              <ul className="mt-2 space-y-1.5 text-xs leading-snug text-muted-foreground">
                {strengths.length > 0 ? (
                  strengths.map((strength) => <li key={strength}>• {strength}</li>)
                ) : (
                  <li>• No hand landmarks were detected during this attempt.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm font-semibold">Framing feedback</p>
              <ul className="mt-2 space-y-1.5 text-xs leading-snug text-muted-foreground">
                {issues.length > 0 ? (
                  issues.map((issue) => <li key={issue}>• {issue}</li>)
                ) : (
                  <li>• No major issues flagged in this attempt.</li>
                )}
              </ul>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  framesRef.current = [];
                  setIssues([]);
                  setStrengths([]);
                  setPhase("ready");
                }}
                className="flex-1 rounded-2xl bg-signal py-4 text-sm font-bold text-primary-foreground"
              >
                Try again
              </button>

              <Link
                to="/library"
                className="flex-1 rounded-2xl border border-border bg-surface py-4 text-center text-sm font-semibold"
              >
                Exit
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
