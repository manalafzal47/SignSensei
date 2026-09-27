import type { HandFrame } from "@/components/HandTracker";

export type AttemptFeedback = {
  coverage: number;
  sampleCount: number;
  issues: string[];
  strengths: string[];
};

export function evaluateCapture(frames: HandFrame[]): AttemptFeedback {
  if (!frames.length) {
    return {
      coverage: 0,
      sampleCount: 0,
      issues: ["No hand detected in the recording."],
      strengths: [],
    };
  }

  const visibleFrames = frames.filter((frame) => frame.hands.length > 0);
  const coverage = Math.round((visibleFrames.length / frames.length) * 100);
  const wrists = visibleFrames
    .map((frame) => frame.hands[0]?.[0])
    .filter((wrist): wrist is NonNullable<typeof wrist> => wrist !== undefined);

  if (wrists.length === 0) {
    return {
      coverage,
      sampleCount: frames.length,
      issues: ["No hand detected in the recording."],
      strengths: [],
    };
  }

  const centerDistance = average(
    wrists.map((wrist) => Math.hypot(wrist.x - 0.5, wrist.y - 0.5)),
  );

  const issues: string[] = [];
  const strengths: string[] = [];

  if (coverage < 80) {
    issues.push("Keep your hand visible throughout the recording.");
  } else {
    strengths.push("Your hand stayed visible for most of the recording.");
  }

  if (centerDistance > 0.2) {
    issues.push("Move your signing hand closer to the center of the camera frame.");
  } else {
    strengths.push("Your hand was framed near the center of the camera.");
  }

  return {
    coverage,
    sampleCount: frames.length,
    issues,
    strengths,
  };
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

