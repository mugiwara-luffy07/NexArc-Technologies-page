"use client";

import { useActionState, useId, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { applyInternship } from "@/app/actions";
import { INTERNSHIP_TRACKS, type FormState } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { ChoiceGroup, Consent, FormStatus, Honeypot, TextArea, TextField, Turnstile } from "./Fields";

type Values = { name: string; email: string; phone: string; college: string; portfolio: string; about: string };

export function InternshipForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(applyInternship, { status: "idle" });
  const [track, setTrack] = useState<string>();
  const [v, setV] = useState<Values>({ name: "", email: "", phone: "", college: "", portfolio: "", about: "" });
  const [consent, setConsent] = useState(false);
  const fileId = useId();
  const e = state.fieldErrors ?? {};
  const bind = (k: keyof Values) => ({
    name: k,
    value: v[k],
    onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((s) => ({ ...s, [k]: ev.target.value })),
  });

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-[var(--radius-card)] bg-surface p-8 ring-1 ring-line">
        <CheckCircle size={40} className="text-accent" aria-hidden />
        <h3 className="mt-5 text-display-md">Application received.</h3>
        <p className="mt-3 max-w-[48ch] text-muted">We review applications every week and will reply by email.</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative flex flex-col gap-8">
      <Honeypot />
      <input type="hidden" name="track" value={track ?? ""} />
      <ChoiceGroup name="_track" legend="Which track?" options={INTERNSHIP_TRACKS} value={track} onChange={setTrack} error={e.track} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField {...bind("name")} label="Full name" autoComplete="name" error={e.name} />
        <TextField {...bind("email")} type="email" inputMode="email" autoComplete="email" label="Email" error={e.email} />
        <TextField {...bind("phone")} type="tel" inputMode="tel" autoComplete="tel" label="Phone or WhatsApp" placeholder="+91" error={e.phone} />
        <TextField {...bind("college")} label="College and year" placeholder="e.g. Kongu Engineering College, 3rd year" error={e.college} />
        <div className="sm:col-span-2">
          <TextField
            {...bind("portfolio")}
            type="url"
            inputMode="url"
            label="GitHub, portfolio or Behance link"
            placeholder="https://"
            error={e.portfolio}
          />
        </div>
        <div className="sm:col-span-2">
          <TextArea {...bind("about")} label="What have you built so far?" hint="Projects, college work or anything you made on your own." error={e.about} />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor={fileId} className="font-medium">
            Resume <span className="font-normal text-subtle">(optional, PDF up to 5 MB)</span>
          </label>
          <input
            id={fileId}
            name="resume"
            type="file"
            accept="application/pdf"
            aria-invalid={e.resume ? true : undefined}
            className="block w-full rounded-[var(--radius-control)] border border-dashed border-line bg-surface p-3 text-muted file:mr-4 file:h-10 file:cursor-pointer file:rounded-[var(--radius-control)] file:border-0 file:bg-btn-bg file:px-4 file:text-btn-fg"
          />
          {e.resume && <p className="text-sm font-medium text-[#b42318] dark:text-[#ff8a7a]">{e.resume}</p>}
        </div>
      </div>

      <Consent checked={consent} onChange={setConsent} error={e.consent} />
      <Turnstile />
      <FormStatus state={state} />
      <Button type="submit" size="lg" disabled={pending} aria-busy={pending} className="w-full sm:w-fit">
        {pending ? "Sending" : "Send application"}
      </Button>
    </form>
  );
}
