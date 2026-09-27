export type AppUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type PracticeAttempt = {
  id: string;
  slug: string;
  word: string;
  category: string;
  coverage: number;
  sampleCount: number;
  at: string;
  misses: string[];
  summary: string;
};

type StoredHistoryAttempt = Partial<PracticeAttempt> & {
  slug: string;
  word: string;
  coverage: number;
  sampleCount: number;
  at: string;
  misses: string[];
};

const USER_KEY = "signsense-user";
const HISTORY_KEY = "signsense-practice-history-v3";

function readFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrentUser(): AppUser | null {
  return readFromStorage<AppUser>(USER_KEY);
}

export function saveCurrentUser(user: AppUser) {
  writeToStorage(USER_KEY, user);
}

export function clearCurrentUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_KEY);
}

export function getPracticeHistory(): PracticeAttempt[] {
  const history = readFromStorage<StoredHistoryAttempt[]>(HISTORY_KEY) ?? [];

  return history.map((attempt, index) => ({
    id: attempt.id ?? `${attempt.slug}-${attempt.at ?? index}`,
    slug: attempt.slug,
    word: attempt.word,
    category: attempt.category ?? "Practice",
    coverage: attempt.coverage,
    sampleCount: attempt.sampleCount,
    at: attempt.at ?? new Date().toISOString(),
    misses: Array.isArray(attempt.misses) ? attempt.misses : [],
    summary: attempt.summary ?? "Practice attempt recorded.",
  }));
}

export function appendPracticeAttempt(
  attempt: Omit<PracticeAttempt, "id" | "at"> & { at?: string },
) {
  const history = getPracticeHistory();

  const nextAttempt: PracticeAttempt = {
    ...attempt,
    id: `${attempt.slug}-${Date.now()}`,
    at: attempt.at ?? new Date().toISOString(),
  };

  const next = [nextAttempt, ...history].slice(0, 20);
  writeToStorage(HISTORY_KEY, next);
  return next;
}

export function getImprovementSummary(history: PracticeAttempt[]) {
  if (history.length === 0) {
    return { averageCoverage: 0, recentTrend: "No practice yet", weakest: [] };
  }

  const averageCoverage = Math.round(
    history.reduce((sum, attempt) => sum + attempt.coverage, 0) / history.length,
  );

  const sortedByCoverage = [...history].sort((a, b) => a.coverage - b.coverage);

  const strongestRecent = [...history].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  )[0];

  const recentTrend =
    strongestRecent
      ? `The camera detected a hand in ${strongestRecent.coverage}% of the frames in your latest attempt. This does not measure sign accuracy.`
      : "No practice yet";

  return {
    averageCoverage,
    recentTrend,
    weakest: sortedByCoverage.slice(0, 3),
  };
}
