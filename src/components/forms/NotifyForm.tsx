"use client";

import { useActionState, useState } from "react";
import { joinWaitlist } from "@/app/actions";
import type { FormState } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { Consent, FormStatus, Honeypot, Turnstile } from "./Fields";

/** One-field "tell me when" signup. Reuses the waitlist pipeline, tagged with `topic`. */
export function NotifyForm({ topic, success, cta = "Notify me" }: { topic: string; success: string; cta?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(joinWaitlist, { status: "idle" });
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  if (state.status === "success") {
    return (
      <p role="status" className="rounded-[var(--radius-control)] bg-surface px-4 py-3 font-medium ring-1 ring-line">
        {success}
      </p>
    );
  }

  return (
    <form action={action} className="relative flex flex-col gap-4">
      <Honeypot />
      <input type="hidden" name="product" value={topic} />
      <div className="flex flex-col gap-2">
        <label htmlFor="notify-email" className="font-medium">
          Your email
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="notify-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={state.fieldErrors?.email ? true : undefined}
            className="h-12 w-full rounded-[var(--radius-control)] border border-line bg-surface px-3.5 text-ink focus-visible:border-ink focus-visible:shadow-[0_0_0_3px_var(--accent)] focus-visible:outline-none sm:max-w-sm"
          />
          <Button type="submit" size="lg" disabled={pending} aria-busy={pending} className="sm:w-fit">
            {pending ? "Saving" : cta}
          </Button>
        </div>
        {state.fieldErrors?.email && <p className="text-sm font-medium text-[#b42318] dark:text-[#ff8a7a]">{state.fieldErrors.email}</p>}
      </div>
      <Consent checked={consent} onChange={setConsent} error={state.fieldErrors?.consent} />
      <Turnstile />
      <FormStatus state={state} />
    </form>
  );
}
