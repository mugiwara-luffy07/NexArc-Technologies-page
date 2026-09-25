"use client";

import { clsx } from "clsx";
import Link from "next/link";
import Script from "next/script";
import { useId, type ComponentProps, type ReactNode } from "react";

const control =
  "w-full rounded-[var(--radius-control)] border bg-surface px-3.5 text-ink placeholder:text-subtle " +
  "transition-[border-color,box-shadow] duration-200 outline-none " +
  "focus-visible:border-ink focus-visible:shadow-[0_0_0_3px_var(--accent)] focus-visible:outline-none " +
  "disabled:opacity-60 aria-[invalid=true]:border-[#c0392b] dark:aria-[invalid=true]:border-[#ff8a7a]";

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-subtle">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-[#b42318] dark:text-[#ff8a7a]">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = ComponentProps<"input"> & { label: string; hint?: string; error?: string; optional?: boolean };

export function TextField({ label, hint, error, optional, className, ...props }: InputProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        required={!optional}
        className={clsx(control, "h-12", className)}
        {...props}
      />
    </FieldShell>
  );
}

type AreaProps = ComponentProps<"textarea"> & { label: string; hint?: string; error?: string; optional?: boolean };

export function TextArea({ label, hint, error, optional, className, ...props }: AreaProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        required={!optional}
        className={clsx(control, "min-h-32 py-3 leading-relaxed", className)}
        {...props}
      />
    </FieldShell>
  );
}

/** Radio group styled as chips. Big tap targets, keyboard navigable as native radios. */
export function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  value?: string;
  onChange?: (v: string) => void;
  error?: string;
}) {
  const id = useId();
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined} className="flex flex-col gap-3">
      <legend className="mb-3 font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.6rem)] font-bold tracking-tight">{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === undefined ? undefined : value === opt}
              onChange={() => onChange?.(opt)}
              className="peer sr-only"
            />
            <span
              className={clsx(
                "inline-flex min-h-12 items-center rounded-[var(--radius-control)] border border-line bg-surface px-4 text-[0.975rem]",
                "transition-[border-color,background-color,color] duration-200 hover:border-ink",
                "peer-checked:border-ink peer-checked:bg-btn-bg peer-checked:text-btn-fg",
                "peer-focus-visible:shadow-[0_0_0_3px_var(--accent)]",
              )}
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-[#b42318] dark:text-[#ff8a7a]">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function Consent({
  error,
  checked,
  onChange,
}: {
  error?: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[0.95rem] text-muted">
        <input
          id={id}
          type="checkbox"
          name="consent"
          required
          checked={checked}
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          aria-invalid={error ? true : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-[var(--ink)]"
        />
        <span>
          NexArc may use these details to reply to me. See the{" "}
          <Link href="/privacy" className="text-ink underline decoration-accent underline-offset-2">
            privacy policy
          </Link>
          .
        </span>
      </label>
      {error && <p className="text-sm font-medium text-[#b42318] dark:text-[#ff8a7a]">{error}</p>}
    </div>
  );
}

/** Hidden from people and assistive tech; bots fill it. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function Turnstile() {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!key) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={key} data-size="flexible" data-theme="auto" />
    </>
  );
}

export function FormStatus({ state }: { state: { status: string; message?: string } }) {
  if (state.status !== "error" || !state.message) return null;
  return (
    <p role="alert" className="rounded-[var(--radius-control)] border border-[#b42318]/30 bg-[#b42318]/5 px-4 py-3 text-[0.95rem] text-[#b42318] dark:text-[#ff8a7a]">
      {state.message}
    </p>
  );
}
