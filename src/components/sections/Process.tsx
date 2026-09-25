import { ARC_PATH } from "@/components/brand/Mark";

export const processSteps = [
  { verb: "Discover", text: "We learn how your business runs today and agree what the first release must do." },
  { verb: "Design", text: "Flows and screens in your brand, reviewed with you before any code is written." },
  { verb: "Build", text: "Weekly working demos, so you see real progress instead of status updates." },
  { verb: "Ship", text: "Testing on real phones, launch, and a handover your team can actually use." },
  { verb: "Grow", text: "Fixes, improvements and new features on a simple monthly plan." },
];

/** Progress arc: the mark's arc filled to the step's share of the journey. */
function StepArc({ progress }: { progress: number }) {
  return (
    <svg viewBox="8 8 34 34" className="size-10" aria-hidden>
      <path d={ARC_PATH} pathLength={1} fill="none" strokeWidth="5" strokeLinecap="round" className="stroke-line" />
      <path
        d={ARC_PATH}
        pathLength={1}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        className="stroke-accent"
        strokeDasharray={`${progress} 1`}
      />
      <circle cx="35" cy="35" r="3.5" className={progress === 1 ? "fill-ink" : "fill-line"} />
    </svg>
  );
}

export function Process() {
  const n = processSteps.length;
  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
      {processSteps.map((s, i) => (
        <li key={s.verb} className="flex flex-col gap-3">
          <StepArc progress={(i + 1) / n} />
          <h3 className="font-display text-xl font-bold tracking-tight">{s.verb}</h3>
          <p className="text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
