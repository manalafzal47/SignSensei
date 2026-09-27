import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { getImprovementSummary, getPracticeHistory } from "@/lib/app-store";

export const Route = createFileRoute("/history")({
  component: PracticeHistoryPage,
});

function PracticeHistoryPage() {
  const history = getPracticeHistory();
  const summary = getImprovementSummary(history);

  return (
    <AppShell>
      <ScreenHeader title="Progress" subtitle={`${history.length} recorded attempts`} />

      <div className="space-y-4 px-5">
        <div className="rounded-3xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Average hand visibility
          </p>
          <p className="mt-2 text-3xl font-bold">{summary.averageCoverage}%</p>
          <p className="mt-2 text-sm text-muted-foreground">{summary.recentTrend}</p>
        </div>

        {history.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-6 text-center text-sm text-muted-foreground">
            No attempts yet. Practice a sign to start building your history.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((attempt) => (
              <div key={attempt.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{attempt.word}</p>
                  <span className="text-sm font-bold text-primary">{attempt.coverage}% visible</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{attempt.category}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {attempt.misses.length > 0
                    ? attempt.misses.join(" · ")
                    : `Hand detected in ${attempt.coverage}% of ${attempt.sampleCount} frames.`}
                </p>
              </div>
            ))}
          </div>
        )}

        <Link to="/" className="block text-center text-sm font-medium text-primary">
          Back home
        </Link>
      </div>
    </AppShell>
  );
}
