import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Gauge, RotateCcw } from "lucide-react";

/** Stylized reference figure for the target sign — no stock photography. */
export function SignReference({
  word,
  speed,
  onSpeedChange,
  compact = false,
}: {
  word: string;
  speed: number;
  onSpeedChange: (s: number) => void;
  compact?: boolean;
}) {
  return (
    <div className="grain relative overflow-hidden rounded-2xl border border-border bg-surface">
      <div
        className={
          compact
            ? "relative flex h-40 items-center justify-center"
            : "relative flex h-56 items-center justify-center"
        }
      >
        <div className="absolute inset-0 bg-signal opacity-[0.14]" />
        <SigningFigure speed={speed} />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-veil" />
        <span className="absolute bottom-3 left-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Reference · {word}
        </span>
      </div>

      <div className="flex items-center gap-3 border-t border-border px-4 py-3">
        <Gauge className="h-4 w-4 text-primary" />
        <span className="text-xs text-muted-foreground">Speed</span>
        <div className="ml-auto flex gap-1.5">
          {[0.25, 0.5, 1].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={
                speed === s
                  ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                  : "rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground"
              }
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SigningFigure({ speed }: { speed: number }) {
  const duration = `${2.4 / speed}s`;
  return (
    <svg viewBox="0 0 200 150" className="relative h-40 w-auto">
      <defs>
        <linearGradient id="figure" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.74 0.145 216)" />
          <stop offset="100%" stopColor="oklch(0.78 0.135 176)" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="42" r="24" fill="url(#figure)" opacity="0.95" />
      <path
        d="M64 148 C64 108 80 88 100 88 C120 88 136 108 136 148 Z"
        fill="url(#figure)"
        opacity="0.35"
      />
      <g style={{ transformOrigin: "100px 100px" }}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-14 100 100; 12 100 100; -14 100 100"
          dur={duration}
          repeatCount="indefinite"
        />
        <rect x="94" y="92" width="12" height="44" rx="6" fill="url(#figure)" />
        <circle cx="100" cy="136" r="11" fill="oklch(0.82 0.155 84)" />
      </g>
      <circle cx="91" cy="38" r="3" fill="oklch(0.17 0.022 264)" />
      <circle cx="109" cy="38" r="3" fill="oklch(0.17 0.022 264)" />
      <path
        d="M92 50 Q100 56 108 50"
        stroke="oklch(0.17 0.022 264)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Live webcam mirror. Camera APIs only ever touch the browser, post-mount. */
export function CameraMirror({
  recording,
  overlayWord,
}: {
  recording: boolean;
  overlayWord: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"idle" | "live" | "denied">("idle");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setState("live");
      } catch {
        if (!cancelled) setState("denied");
      }
    }

    start();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div
      className={
        recording
          ? "pulse-ring relative aspect-[3/4] w-full overflow-hidden rounded-3xl border-2 border-mismatch bg-surface-2"
          : "relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-border bg-surface-2 shadow-lift"
      }
    >
      <video
        ref={videoRef}
        playsInline
        muted
        className="h-full w-full scale-x-[-1] object-cover"
      />

      {state !== "live" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
          {state === "denied" ? (
            <>
              <CameraOff className="h-7 w-7 text-mismatch" />
              <p className="text-sm font-semibold">Camera unavailable</p>
              <p className="text-xs text-muted-foreground">
                Allow camera access to mirror your signing and get feedback.
              </p>
            </>
          ) : (
            <>
              <Camera className="h-7 w-7 animate-pulse text-primary" />
              <p className="text-xs text-muted-foreground">Starting camera…</p>
            </>
          )}
        </div>
      )}

      {/* framing guides: sign space + face box, the 70% people forget */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[8%] left-1/2 h-[26%] w-[34%] -translate-x-1/2 rounded-2xl border border-dashed border-primary/50" />
        <div className="absolute top-[36%] left-1/2 h-[46%] w-[74%] -translate-x-1/2 rounded-3xl border border-dashed border-match/40" />
        <span className="absolute top-[8%] left-1/2 -translate-x-1/2 -translate-y-5 text-[10px] font-semibold tracking-wide text-primary uppercase">
          Face
        </span>
        <span className="absolute bottom-[16%] left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-wide text-match/80 uppercase">
          Sign space
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-veil px-4 pt-10 pb-4">
        {recording ? (
          <span className="flex items-center gap-2 rounded-full bg-mismatch px-3 py-1 text-xs font-bold text-mismatch-foreground">
            <span className="h-2 w-2 rounded-full bg-mismatch-foreground" /> Reading
            your sign
          </span>
        ) : (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5" /> Mirror on · {overlayWord}
          </span>
        )}
      </div>
    </div>
  );
}
