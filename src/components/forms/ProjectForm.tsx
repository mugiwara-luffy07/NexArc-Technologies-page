"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { submitProject } from "@/app/actions";
import { BUDGET_OPTIONS, SERVICE_OPTIONS, TIMELINE_OPTIONS, type FormState } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { ARC_PATH } from "@/components/brand/Mark";
import { ChoiceGroup, Consent, FormStatus, Honeypot, TextArea, TextField, Turnstile } from "./Fields";
import { site } from "@/lib/site";

const STEPS = ["Service", "Budget", "Details", "Contact"] as const;
// which step owns which field, so server errors can send the user back to the right place
const FIELD_STEP: Record<string, number> = { service: 0, budget: 1, timeline: 1, details: 2 };

function StepArc({ step }: { step: number }) {
  return (
    <svg viewBox="8 8 34 34" className="size-9" aria-hidden>
      <path d={ARC_PATH} pathLength={1} fill="none" strokeWidth="5" strokeLinecap="round" className="stroke-line" />
      <path
        d={ARC_PATH}
        pathLength={1}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${(step + 1) / STEPS.length} 1`}
        className="stroke-accent transition-[stroke-dasharray] duration-500 ease-[var(--ease-arc)]"
      />
    </svg>
  );
}

export function ProjectForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitProject, { status: "idle" });
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string>();
  // ?service= from a service page pre-selects the option. Read after mount so the form still server-renders.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("service");
    const match = SERVICE_OPTIONS.find((s) => s === q);
    if (match) setService(match);
  }, []);
  const [budget, setBudget] = useState<string>();
  const [timeline, setTimeline] = useState<string>();
  const [details, setDetails] = useState("");
  // controlled, because React resets uncontrolled fields after a form action
  const [contact, setContact] = useState({ name: "", company: "", email: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const bind = (k: keyof typeof contact) => ({
    name: k,
    value: contact[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setContact((c) => ({ ...c, [k]: e.target.value })),
  });
  const [localError, setLocalError] = useState<Record<string, string>>({});
  const top = useRef<HTMLDivElement>(null);

  const errors = { ...state.fieldErrors, ...localError };

  // Server said an earlier step is invalid: go back there
  useEffect(() => {
    if (state.status !== "error" || !state.fieldErrors) return;
    const first = Math.min(...Object.keys(state.fieldErrors).map((k) => FIELD_STEP[k] ?? 3));
    setStep(first);
  }, [state]);

  const mounted = useRef(false);
  useEffect(() => {
    // keep the step heading in view when moving between steps (not on first load)
    if (mounted.current) top.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    mounted.current = true;
  }, [step]);

  function next() {
    const e: Record<string, string> = {};
    if (step === 0 && !service) e.service = "Pick the closest option";
    if (step === 1 && !budget) e.budget = "Pick a budget range";
    if (step === 1 && !timeline) e.timeline = "Pick a timeline";
    if (step === 2 && details.trim().length < 20) e.details = "A couple of sentences helps us reply properly";
    setLocalError(e);
    if (Object.keys(e).length === 0) setStep((s) => s + 1);
  }

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-[var(--radius-card)] bg-surface p-8 ring-1 ring-line sm:p-10">
        <CheckCircle size={40} className="text-accent" aria-hidden />
        <h2 className="mt-5 text-display-md">Brief received. Thank you.</h2>
        <p className="mt-3 max-w-[48ch] text-muted">
          We will reply within one working day. A confirmation is on its way to your inbox. If it is urgent, WhatsApp us on {site.phone}.
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate={step < 3} className="relative" aria-describedby="brief-progress">
      <div ref={top} className="scroll-mt-28" />
      <div id="brief-progress" className="mb-8 flex items-center gap-3">
        <StepArc step={step} />
        <p className="text-sm text-muted">
          Step {step + 1} of {STEPS.length}
          <span className="text-ink">: {STEPS[step]}</span>
        </p>
      </div>

      <Honeypot />
      {/* chips live in state; mirror them as hidden inputs so every step submits together */}
      <input type="hidden" name="service" value={service ?? ""} />
      <input type="hidden" name="budget" value={budget ?? ""} />
      <input type="hidden" name="timeline" value={timeline ?? ""} />

      <div hidden={step !== 0}>
        <ChoiceGroup name="_service" legend="What do you need?" options={SERVICE_OPTIONS} value={service} onChange={setService} error={errors.service} />
      </div>

      <div hidden={step !== 1} className="flex flex-col gap-10">
        <ChoiceGroup name="_budget" legend="Roughly what budget?" options={BUDGET_OPTIONS} value={budget} onChange={setBudget} error={errors.budget} />
        <ChoiceGroup name="_timeline" legend="When do you want to start?" options={TIMELINE_OPTIONS} value={timeline} onChange={setTimeline} error={errors.timeline} />
      </div>

      <div hidden={step !== 2}>
        <TextArea
          name="details"
          label="Tell us about the project"
          hint="What does your business do, and what should this project change for you? Links to sites you like help too."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          error={errors.details}
          rows={7}
        />
      </div>

      <div hidden={step !== 3} className="grid gap-5 sm:grid-cols-2">
        <TextField {...bind("name")} label="Your name" autoComplete="name" error={errors.name} />
        <TextField {...bind("company")} label="Business name" autoComplete="organization" optional error={errors.company} />
        <TextField {...bind("email")} type="email" label="Email" autoComplete="email" inputMode="email" error={errors.email} />
        <TextField {...bind("phone")} type="tel" label="Phone or WhatsApp" autoComplete="tel" inputMode="tel" placeholder="+91" error={errors.phone} />
        <div className="sm:col-span-2 flex flex-col gap-5">
          <Consent checked={consent} onChange={setConsent} error={errors.consent} />
          <Turnstile />
        </div>
      </div>

      <div className="mt-6">
        <FormStatus state={state} />
      </div>

      {/* Sticky on phones so Next/Back never scroll out of reach */}
      <div
        className={clsx(
          "sticky bottom-0 z-10 -mx-4 mt-8 flex items-center gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur",
          "sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none",
        )}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        {step > 0 && (
          <Button variant="secondary" size="lg" onClick={() => setStep((s) => s - 1)} disabled={pending}>
            Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button size="lg" onClick={next} className="flex-1 sm:flex-none">
            Next
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={pending} aria-busy={pending} className="flex-1 sm:flex-none">
            {pending ? "Sending" : "Send brief"}
          </Button>
        )}
      </div>
    </form>
  );
}
