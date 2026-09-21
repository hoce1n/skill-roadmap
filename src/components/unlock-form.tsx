import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { setPasscode, unlockWithPasscode } from "@/lib/items.functions";
import type { UnlockState } from "@/lib/types";

export function UnlockForm({ initial }: { initial: UnlockState }) {
  const navigate = useNavigate();
  const setting = !initial.hasPasscode;
  const [passcode, setPasscodeValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (setting && passcode !== confirm) {
      setError("The two passcodes do not match.");
      return;
    }
    setPending(true);
    try {
      if (setting) {
        await setPasscode({ data: { passcode } });
      } else {
        await unlockWithPasscode({ data: { passcode } });
      }
      await navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unlock.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-12 text-fg">
      <div className="w-full max-w-md">
        <p className="mb-2 text-xs tracking-wide text-muted">
          full-stack-skill-roadmap-en.md
        </p>
        <h1 className="mb-2 text-xl font-medium tracking-tight">
          Skill Roadmap
        </h1>
        <p className="mb-8 max-w-prose text-sm leading-normal text-muted">
          {setting
            ? "Choose a passcode for this checklist. You will enter it on later visits. Unlock lasts seven days in this browser."
            : "Enter the passcode to open the checklist. Unlock lasts seven days in this browser."}
        </p>
        <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">
              {setting ? "New passcode" : "Passcode"}
            </span>
            <input
              type="password"
              name="passcode"
              autoComplete={setting ? "new-password" : "current-password"}
              value={passcode}
              onChange={(e) => setPasscodeValue(e.target.value)}
              minLength={4}
              required
              suppressHydrationWarning
              className="min-h-11 border border-rule bg-bg px-3 text-fg"
            />
          </label>
          {setting ? (
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-muted">Confirm passcode</span>
              <input
                type="password"
                name="confirm"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={4}
                required
                suppressHydrationWarning
                className="min-h-11 border border-rule bg-bg px-3 text-fg"
              />
            </label>
          ) : null}
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 border border-fg bg-fg px-4 text-sm text-bg hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Working…" : setting ? "Set passcode" : "Unlock"}
          </button>
        </form>
      </div>
    </main>
  );
}
