"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { clsx } from "clsx";
import { login } from "./actions";

export function SubmitButton({ children, className, pendingText = "Saving" }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={clsx(
        "inline-flex h-10 items-center justify-center rounded-[var(--radius-control)] bg-btn-bg px-4 text-sm font-medium text-btn-fg transition-colors hover:bg-accent hover:text-on-accent disabled:opacity-60",
        className,
      )}
    >
      {pending ? pendingText : children}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(login, {});
  return (
    <form action={action} className="mt-8 flex flex-col gap-3">
      <label htmlFor="password" className="font-medium">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        autoFocus
        aria-invalid={state.error ? true : undefined}
        className="h-12 rounded-[var(--radius-control)] border border-line bg-surface px-3.5 text-base outline-none focus-visible:border-ink focus-visible:shadow-[0_0_0_3px_var(--accent)] aria-[invalid=true]:border-[#c0392b]"
      />
      {state.error && (
        <p role="alert" className="text-sm font-medium text-[#b42318] dark:text-[#ff8a7a]">
          {state.error}
        </p>
      )}
      <SubmitButton className="mt-2 h-12" pendingText="Checking">
        Sign in
      </SubmitButton>
    </form>
  );
}
