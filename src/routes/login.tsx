import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { saveCurrentUser } from "@/lib/app-store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("Manal");
  const [email, setEmail] = useState("manal@example.com");

  function handleSubmit() {
    saveCurrentUser({
      id: "demo-user",
      name: name.trim() || "User",
      email: email.trim() || "user@example.com",
      createdAt: new Date().toISOString(),
    });

    navigate({ to: "/" });
  }

  return (
    <AppShell>
      <div className="flex min-h-[80vh] flex-col justify-center px-5">
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
            SignFlow
          </p>
          <h1 className="mt-3 text-3xl font-bold">Welcome back</h1>
        </div>

        <div className="space-y-4 rounded-3xl border border-border bg-surface p-5">
          <label className="block text-sm font-medium">
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm outline-none"
            />
          </label>

          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm outline-none"
            />
          </label>

          <button
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-signal py-3.5 text-sm font-bold text-primary-foreground"
          >
            Continue
          </button>

          <Link to="/" className="block text-center text-sm text-muted-foreground">
            Back to home
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
