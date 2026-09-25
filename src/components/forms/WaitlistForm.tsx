"use client";

import { useActionState, useState } from "react";
import { joinWaitlist } from "@/app/actions";
import type { FormState } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { Consent, FormStatus, Honeypot, TextField, Turnstile } from "./Fields";

export function WaitlistForm({ products }: { products: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(joinWaitlist, { status: "idle" });
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [consent, setConsent] = useState(false);

  if (state.status === "success") {
    return (
      <p role="status" className="rounded-[var(--radius-card)] bg-surface p-6 text-lg ring-1 ring-line">
        You are on the list. We will email you once, when it launches.
      </p>
    );
  }

  return (
    <form action={action} className="relative flex flex-col gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={state.fieldErrors?.email}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="waitlist-product" className="font-medium">
            Interested in <span className="font-normal text-subtle">(optional)</span>
          </label>
          <select
            id="waitlist-product"
            name="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="h-12 w-full rounded-[var(--radius-control)] border border-line bg-surface px-3.5 text-ink focus-visible:border-ink focus-visible:shadow-[0_0_0_3px_var(--accent)] focus-visible:outline-none"
          >
            <option value="">All upcoming products</option>
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Consent checked={consent} onChange={setConsent} error={state.fieldErrors?.consent} />
      <Turnstile />
      <FormStatus state={state} />
      <Button type="submit" size="lg" disabled={pending} aria-busy={pending} className="w-full sm:w-fit">
        {pending ? "Joining" : "Join the waitlist"}
      </Button>
    </form>
  );
}
