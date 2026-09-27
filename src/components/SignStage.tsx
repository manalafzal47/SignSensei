import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, ExternalLink, RotateCcw } from "lucide-react";
import type { Sign, SignDemonstration } from "@/lib/signs";

export function SignReference({
  sign,
}: Readonly<{
  sign: Sign;
}>) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sign demonstration
          </p>
          <h2 className="mt-0.5 text-sm font-bold">{sign.word}</h2>
        </div>
      </div>

      {sign.demonstrations.map((demonstration) => (
        <div key={demonstration.label} className="border-t border-border">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <p className="text-xs font-semibold">{demonstration.label}</p>
            <div className="flex shrink-0 items-center gap-3">
              {demonstration.youtubeUrl && (
                <a
                  href={demonstration.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  Watch video <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <a
                href={demonstration.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"
              >
                Source <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          <div className="aspect-video bg-surface-2">
            <SignReferenceMedia sign={sign} demonstration={demonstration} />
          </div>
        </div>
      ))}
      <p className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
        ASL University (Lifeprint) reference examples. Phrase entries may show component signs;
        regional variants exist.
      </p>
    </section>
  );
}

function SignReferenceMedia({
  sign,
  demonstration,
}: Readonly<{ sign: Sign; demonstration: SignDemonstration }>) {
  return (
    <div
      className={
        demonstration.imageUrls.length === 1
          ? "h-full p-2"
          : "grid h-full grid-cols-2 gap-2 p-2"
      }
    >
      {demonstration.imageUrls.map((imageUrl, index) => (
        <img
          key={imageUrl}
          src={imageUrl}
          alt={`ASL University ${demonstration.label} example for ${sign.word}, frame ${index + 1}`}
          className={
            demonstration.imageUrls.length === 1
              ? "h-full w-full object-contain"
              : "aspect-4/3 w-full object-contain"
          }
          loading="lazy"
        />
      ))}
    </div>
  );
}

/** Live webcam mirror. Camera APIs only ever touch the browser, post-mount. */
export function CameraMirror({
  recording,
  overlayWord,
}: Readonly<{
  recording: boolean;
  overlayWord: string;
}>) {
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
          ? "pulse-ring relative aspect-3/4 w-full overflow-hidden rounded-3xl border-2 border-mismatch bg-surface-2"
          : "relative aspect-3/4 w-full overflow-hidden rounded-3xl border border-border bg-surface-2 shadow-lift"
      }
    >
      <video ref={videoRef} playsInline muted className="h-full w-full scale-x-[-1] object-cover" />

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
            <span className="h-2 w-2 rounded-full bg-mismatch-foreground" /> Reading your sign
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
