import { notFound } from "next/navigation";
import Link from "next/link";
import RatingInput from "./rating-input";
import ProtocolStep from "./protocol-step";
import StepTracker from "./step-tracker";

const STEPS = [
  {
    id: 1,
    title: "Context",
    description:
      "Set the scene for your switch. What is the current situation and what needs to change?",
    placeholder: "Context details will go here.",
  },
  {
    id: 2,
    title: "State",
    description:
      "Capture your current state of mind. How are you feeling about this change?",
    placeholder: "State capture will go here.",
  },
  {
    id: 3,
    title: "Protocol",
    description:
      "Define the protocol for your switch. What concrete steps will you take?",
    placeholder: "Protocol builder will go here.",
  },
] as const;

const TOTAL_STEPS = STEPS.length;

export function generateStaticParams() {
  return STEPS.map((s) => ({ step: String(s.id) }));
}

export default async function StepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: raw } = await params;
  const stepNum = Number(raw);

  if (isNaN(stepNum) || stepNum < 1 || stepNum > TOTAL_STEPS) {
    notFound();
  }

  const step = STEPS[stepNum - 1];
  const isFirst = stepNum === 1;
  const isLast = stepNum === TOTAL_STEPS;

  return (
    <div className="flex flex-col gap-8">
      <StepTracker step={stepNum} />
      {/* Progress indicator */}
      <nav aria-label="Step progress" className="flex items-center gap-2">
        {STEPS.map((s) => (
          <Link
            key={s.id}
            href={`/switch/${s.id}`}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              s.id === stepNum
                ? "bg-gray-900 text-white"
                : s.id < stepNum
                  ? "bg-gray-300 text-gray-700"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {s.id}
          </Link>
        ))}
        <span className="ml-2 text-sm text-gray-500">
          Step {stepNum} of {TOTAL_STEPS}
        </span>
      </nav>

      {/* Step content */}
      <section>
        <h1 className="text-2xl font-bold">{step.title}</h1>
        <p className="mt-2 text-gray-600">{step.description}</p>
        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-400">
          {stepNum === 1 && (
            <RatingInput kind="before" label="How do you feel right now? (before)" />
          )}
          {stepNum === 2 && step.placeholder}
          {stepNum === 3 && <ProtocolStep />}
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {isFirst ? (
          <span />
        ) : (
          <Link
            href={`/switch/${stepNum - 1}`}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Back
          </Link>
        )}
        {isLast ? (
          <Link
            href="/"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Done
          </Link>
        ) : (
          <Link
            href={`/switch/${stepNum + 1}`}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
