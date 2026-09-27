import { useEffect, useRef, useState } from "react";
import {
  DrawingUtils,
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

const MEDIAPIPE_VERSION = "1.0.1";

const WASM_CDN = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export type HandLandmark = {
  x: number;
  y: number;
  z: number;
};

export type HandFrame = {
  timestamp: number;
  hands: HandLandmark[][];
  handedness: string[];
};

export type HandTrackerStatus =
  | "booting"
  | "loading-model"
  | "starting-camera"
  | "live"
  | "error";

type HandTrackerProps = Readonly<{
  recording: boolean;
  onFrame?: (frame: HandFrame) => void;
}>;

export function HandTracker({ recording, onFrame }: HandTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;
  const recordingRef = useRef(recording);
  recordingRef.current = recording;

  const [status, setStatus] = useState<HandTrackerStatus>("booting");
  const [errorMessage, setErrorMessage] = useState("");
  const [handCount, setHandCount] = useState(0);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let animationFrameId = 0;
    let stream: MediaStream | null = null;
    let landmarker: HandLandmarker | null = null;
    let drawingUtils: DrawingUtils | null = null;

    let lastVideoTime = -1;
    let framesThisSecond = 0;
    let fpsWindowStart = performance.now();
    let lastHandCount = -1;

    async function boot() {
      try {
        // 1. Load the MediaPipe WebAssembly runtime.
        setStatus("loading-model");

        const vision = await FilesetResolver.forVisionTasks(WASM_CDN);

        if (cancelled) return;

        // 2. Load the pre-trained hand landmark model.
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (cancelled) return;

        // 3. Request camera access.
        setStatus("starting-camera");

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();

        if (video.videoWidth === 0) {
          await new Promise<void>((resolve) => {
            video.onloadedmetadata = () => resolve();
          });
        }

        if (cancelled) return;

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (context) {
          drawingUtils = new DrawingUtils(context);
        }

        setStatus("live");
        animationFrameId = requestAnimationFrame(processFrame);
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : String(error));
        console.error("[HandTracker] startup failed:", error);
      }
    }

    function processFrame() {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !landmarker) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }

      if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;

        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // 4. Run MediaPipe inference on the current video frame.
        const timestamp = performance.now();
        const result = landmarker.detectForVideo(video, timestamp);

        // 5. Draw the detected hand skeleton on the canvas.
        const context = canvas.getContext("2d");

        if (context && drawingUtils) {
          context.clearRect(0, 0, canvas.width, canvas.height);

          for (const landmarks of result.landmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              HandLandmarker.HAND_CONNECTIONS,
              {
                color: "#00E5A0",
                lineWidth: 4,
              },
            );

            drawingUtils.drawLandmarks(landmarks, {
              color: "#FF3B6B",
              lineWidth: 1,
              radius: 4,
            });
          }
        }

        if (result.landmarks.length !== lastHandCount) {
          lastHandCount = result.landmarks.length;
          setHandCount(result.landmarks.length);
        }

        // 6. Send landmark data to the practice page only when requested.
        // The raw camera video remains in the browser.
        if (recordingRef.current && onFrameRef.current) {
          onFrameRef.current({
            timestamp,
            hands: result.landmarks.map((hand) =>
              hand.map(({ x, y, z }) => ({ x, y, z })),
            ),
            handedness: result.handedness.map(
              (hand) => hand[0]?.categoryName ?? "Unknown",
            ),
          });
        }

        framesThisSecond++;

        const now = performance.now();

        if (now - fpsWindowStart >= 1000) {
          setFps(framesThisSecond);
          framesThisSecond = 0;
          fpsWindowStart = now;
        }
      }

      animationFrameId = requestAnimationFrame(processFrame);
    }

    boot();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrameId);
      stream?.getTracks().forEach((track) => track.stop());
      landmarker?.close();
    };
  }, []);

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border bg-black">
      <video
        ref={videoRef}
        playsInline
        muted
        className="h-full w-full scale-x-[-1] object-cover"
      />

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full scale-x-[-1] object-cover"
      />

      {status !== "live" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-6 text-center text-sm text-white">
          {status === "error" ? `Error: ${errorMessage}` : `${status}...`}
        </div>
      )}

      {status === "live" && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-4 py-3 text-xs text-white">
          <span>{recording ? "Capturing hand movement" : "Hand tracking ready"}</span>
          <span>
            {handCount} hand{handCount === 1 ? "" : "s"} · {fps} FPS
          </span>
        </div>
      )}
    </div>
  );
}