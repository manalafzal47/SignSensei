import type { HandFrame } from "@/components/HandTracker";
import type { Sign } from "./signs";

export type AttemptFeedback = {
  score: number;
  issues: string[];
  strengths: string[];
};

export function evaluateAttempt(frames: HandFrame[], sign: Sign): AttemptFeedback {
  if (!frames.length) {
    return {
      score: 0,
      issues: ["No hand detected in the recording."],
      strengths: ["Camera preview is active."],
    };
  }

  const handsByFrame = frames
    .map((frame) => frame.hands.length)
    .filter((count) => count > 0);

  const visibleHands = handsByFrame.length;
  const avgHandCount = visibleHands === 0 ? 0 : handsByFrame.reduce((sum, count) => sum + count, 0) / visibleHands;

  const handLocations = frames
    .filter((frame) => frame.hands.length > 0)
    .map((frame) => frame.hands[0])
    .filter((hand): hand is NonNullable<typeof hand> => Boolean(hand));

  if (handLocations.length === 0) {
    return {
      score: 5,
      issues: ["No hand detected in the recording."],
      strengths: ["Camera access is working."],
    };
  }

  const allXs = handLocations.flatMap((hand) => hand.map((landmark) => landmark.x));
  const allYs = handLocations.flatMap((hand) => hand.map((landmark) => landmark.y));

  const xCenter = average(allXs);
  const yCenter = average(allYs);
  const movement = measureMovement(handLocations);

  const issues: string[] = [];
  const strengths: string[] = [];

  if (yCenter > 0.62) {
    issues.push("Your hand is too low in frame.");
  } else {
    strengths.push("Your hand is positioned in a useful central range.");
  }

  if (movement < 0.08) {
    issues.push("Movement is too small to match the sign.");
  } else {
    strengths.push("The sign has a clear motion pattern.");
  }

  if (avgHandCount < 0.8) {
    issues.push("Hand detection was inconsistent.");
  } else {
    strengths.push("The camera was tracking your hand consistently.");
  }

  if (Math.abs(xCenter - 0.5) > 0.25) {
    issues.push("Keep your hand centered in the frame.");
  }

  const score = clamp(
    100 -
      issues.length * 18 -
      (Math.max(0, yCenter - 0.55) * 90 + Math.max(0, 0.12 - movement) * 70),
    0,
    100,
  );

  return {
    score: Math.round(score),
    issues: issues.length ? issues : ["Your movement is consistent with the target pattern."],
    strengths: strengths.length ? strengths : ["You maintained a steady hand position."],
  };
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function measureMovement(handLocations: Array<Array<{ x: number; y: number; z: number }>>) {
  if (handLocations.length < 2) return 0.05;

  let totalDistance = 0;

  for (let i = 1; i < handLocations.length; i += 1) {
    const previousHand = handLocations[i - 1];
    const currentHand = handLocations[i];

    if (!previousHand || !currentHand) continue;

    const previousWrist = previousHand[0];
    const currentWrist = currentHand[0];

    if (!previousWrist || !currentWrist) continue;

    totalDistance += Math.hypot(
      currentWrist.x - previousWrist.x,
      currentWrist.y - previousWrist.y,
    );
  }

  return totalDistance / Math.max(1, handLocations.length - 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
