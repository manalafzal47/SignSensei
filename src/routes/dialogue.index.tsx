import { createFileRoute, Link } from "@tanstack/react-router";
import { MessagesSquare } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { DIALOGUES } from "@/lib/signs";

export const Route = createFileRoute("/dialogue/")({
  head: () => ({
    meta: [
      { title: "Conversation practice — Signal" },
      {
        name: "description",
        content:
          "Bite-sized ASL dialogue scenarios: a café greeting, meeting someone new, asking someone to repeat. Practice each turn on camera.",
      },
      { property: "og:title", content: "Conversation practice — Signal" },
      {
        property: "og:description",
        content: "Rehearse short, real ASL conversations one turn at a time.",
      },
    ],
  }),
  component: DialogueList,
});

function DialogueList() {
  return (
    <AppShell>
      <ScreenHeader
        title="Conversations"
        subtitle="Short scenarios, signed turn by turn"
      />
      <div className="space-y-3 px-5">
        {DIALOGUES.map((d) => (
          <Link
            key={d.id}
            to="/dialogue"
            className="grain relative block overflow-hidden rounded-3xl border border-border bg-surface p-5"
          >
            <div className="absolute inset-0 bg-signal opacity-[0.08]" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <MessagesSquare className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-semibold tracking-widest text-primary uppercase">
                  {d.level} · {d.minutes} min
                </span>
              </div>
              <h2 className="mt-2 text-lg font-bold">{d.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{d.scenario}</p>
              <div className="mt-3 flex gap-1.5">
                {d.lines.map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 flex-1 rounded-full bg-surface-2"
                  />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
