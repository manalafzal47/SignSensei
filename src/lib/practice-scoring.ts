export type PracticeFrame = {
  timestamp: number;
  hands: Array<Array<{ x: number; y: number; z: number }>>;
  handedness: string[];
};

export type PracticeAssessment = {
  score: number;
  handVisible: boolean;
  coverage: number;
  feedback: string[];
  summary: string;
};

const HAND_TARGETS: Record<string, { expectedHeight: number; expectedCenter: number; movement: number }> = {
  "thank-you": { expectedHeight: 0.42, expectedCenter: 0.55, movement: 0.18 },
  "good-morning": { expectedHeight: 0.55, expectedCenter: 0.5, movement: 0.12 },
  "how-are-you": { expectedHeight: 0.48, expectedCenter: 0.52, movement: 0.2 },
  default: { expectedHeight: 0.5, expectedCenter: 0.5, movement: 0.15 },
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getHandCenter(hand: Array<{ x: number; y: number; z: number }>) {
  if (!hand.length) return null;

  const xs = hand.map((point) => point.x);
  const ys = hand.map((point) => point.y);

  return {
    x: average(xs),
    y: average(ys),
  };
}

function getHandSpread(hand: Array<{ x: number; y: number; z: number }>) {
  if (!hand.length) return 0;

  const xs = hand.map((point) => point.x);
  const ys = hand.map((point) => point.y);

  const xRange = Math.max(...xs) - Math.min(...xs);
  const yRange = Math.max(...ys) - Math.min(...ys);

  return Math.max(xRange, yRange);
}

export function scorePracticeAttempt(frames: PracticeFrame[], signSlug: string): PracticeAssessment {
  if (!frames.length) {
    return {
      score: 0,
      handVisible: false,
      coverage: 0,
      feedback: ["Move into frame and keep your hand visible for the whole attempt."],
      summary: "No hand data was captured.",
    };
  }

  const visibleFrames = frames.filter((frame) => frame.hands.length > 0);
  const coverage = Math.round((visibleFrames.length / frames.length) * 100);
  const handCenters = visibleFrames
    .map((frame) => {
      const hand = frame.hands[0];
      return hand ? getHandCenter(hand) : null;
    })
    .filter((center): center is { x: number; y: number } => center !== null);

  const handVisible = handCenters.length > 0;
  const defaultTarget: { expectedHeight: number; expectedCenter: number; movement: number } =
    (HAND_TARGETS["default"] ?? {
      expectedHeight: 0.5,
      expectedCenter: 0.5,
      movement: 0.15,
    }) as { expectedHeight: number; expectedCenter: number; movement: number };
  const target: { expectedHeight: number; expectedCenter: number; movement: number } =
    HAND_TARGETS[signSlug] ?? defaultTarget;

  const currentHeight = handVisible ? average(handCenters.map((center) => center.y)) : 0;
  const currentCenter = handVisible ? average(handCenters.map((center) => center.x)) : 0;
  const fingerSpread = visibleFrames.length
    ? average(
        visibleFrames.flatMap((frame) => {
          const hand = frame.hands[0];
          return hand ? [getHandSpread(hand)] : [0];
        }),
      )
    : 0;

  let score = 0;
  const feedback: string[] = [];

  score += clamp((coverage / 100) * 55, 0, 55);

  if (handVisible) {
    const verticalDiff = Math.abs(currentHeight - target.expectedHeight);
    const centerDiff = Math.abs(currentCenter - target.expectedCenter);

    score += clamp((1 - verticalDiff / 0.4) * 20, 0, 20);
    score += clamp((1 - centerDiff / 0.5) * 15, 0, 15);

    if (verticalDiff > 0.2) {
      feedback.push("Move your hand slightly closer to the target sign height.");
    } else {
      feedback.push("Hand height is in a strong range.");
    }

    if (centerDiff > 0.25) {
      feedback.push("Keep the sign centered in front of the camera.");
    } else {
      feedback.push("Your hand is centered well in the frame.");
    }
  } else {
    score += 0;
    feedback.push("Move into frame and keep your hand visible for the whole attempt.");
  }

  const motionQuality =
    handVisible && visibleFrames.length > 2
      ? clamp((1 - Math.abs((fingerSpread ?? 0) - target.movement) / 0.5) * 10, 0, 10)
      : 0;
  score += motionQuality;

  if (motionQuality < 4) {
    feedback.push("Try making the motion more deliberate and consistent.");
  } else {
    feedback.push("The motion is consistent enough to keep improving.");
  }

  const finalScore = clamp(Math.round(score), 0, 100);

  let summary = "Nice try — keep refining your movement.";
  if (finalScore >= 80) summary = "Strong sign attempt — your form is close to the target.";
  else if (finalScore >= 60) summary = "Good pacing — refine the hand position and motion.";
  else if (finalScore >= 35) summary = "You are in frame, but the sign needs more control.";

  return {
    score: finalScore,
    handVisible,
    coverage,
    feedback: Array.from(new Set(feedback)).slice(0, 4),
    summary,
  };
}
