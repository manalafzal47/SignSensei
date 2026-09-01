import { Link, useRouterState } from "@tanstack/react-router";
import { Hand, House, MessagesSquare, ChartLine } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Today", icon: House },
  { to: "/library", label: "Library", icon: Hand },
  { to: "/dialogue", label: "Dialogue", icon: MessagesSquare },
  { to: "/history", label: "Progress", icon: ChartLine },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col pb-24">
        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-md items-stretch justify-between px-3 py-2">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors"
              >
                <span
                  className={
                    active
                      ? "flex h-9 w-14 items-center justify-center rounded-full bg-signal text-primary-foreground"
                      : "flex h-9 w-14 items-center justify-center rounded-full text-muted-foreground"
                  }
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </span>
                <span className={active ? "text-foreground" : "text-muted-foreground"}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-4 px-5 pt-8 pb-5">
      <div>
        <h1 className="text-[26px] leading-tight font-bold">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
