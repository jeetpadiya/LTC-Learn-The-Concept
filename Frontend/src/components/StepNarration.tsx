"use client";

import React from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { ALGORITHMS } from "@/lib/algorithms";
import { Info, CheckCircle2, ArrowRightLeft, Eye, ShieldCheck } from "lucide-react";

export default function StepNarration() {
  const { steps, currentStepIndex, selectedTopic } = useVisualizerStore();
  const currentStep = steps[currentStepIndex] || steps[0];
  const algorithm = ALGORITHMS[selectedTopic];

  const getActionBadge = (action: string) => {
    switch (action) {
      case "compare":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <Eye className="w-3 h-3" /> Compare
          </span>
        );
      case "swap":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">
            <ArrowRightLeft className="w-3 h-3" /> Swap
          </span>
        );
      case "sorted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30">
            <CheckCircle2 className="w-3 h-3" /> Locked in Place
          </span>
        );
      case "pivot":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
            <Info className="w-3 h-3" /> Pivot / Candidate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30">
            State Change
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 text-sm leading-relaxed">
      {/* Current Step Banner */}
      <div className="flex flex-col gap-2 p-3 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Step {currentStep?.stepIndex ?? 0}
          </span>
          {getActionBadge(currentStep?.action ?? "init")}
        </div>

        <p className="font-medium text-[var(--text-primary)]">
          {currentStep?.description}
        </p>

        {currentStep?.reasoning && (
          <div className="mt-1 pt-2 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">Why: </span>
            {currentStep.reasoning}
          </div>
        )}
      </div>

      {/* Conceptual Summary */}
      <div className="flex flex-col gap-1.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Algorithm Principle
        </h4>
        <p className="text-xs text-[var(--text-secondary)] leading-normal">
          {algorithm?.summary}
        </p>
      </div>

      {/* Key Invariants */}
      {algorithm?.keyInvariants && (
        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Guaranteed Invariants</span>
          </div>

          <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
            {algorithm.keyInvariants.map((inv, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                <span>{inv}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

