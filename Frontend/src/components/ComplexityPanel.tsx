"use client";

import React from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { ALGORITHMS } from "@/lib/algorithms";
import { Clock, HardDrive, ShieldCheck, Check, X } from "lucide-react";

export default function ComplexityPanel() {
  const { selectedTopic } = useVisualizerStore();
  const algorithm = ALGORITHMS[selectedTopic];

  if (!algorithm) return null;

  return (
    <div className="flex flex-col gap-3 p-3 text-xs overflow-y-auto">
      {/* Time Complexity Card */}
      <div className="p-3 rounded-md bg-[var(--bg-raised)] border border-[var(--border-color)] flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
          <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Time Complexity</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">Best</span>
            <span className="font-mono font-bold text-sm text-[var(--text-primary)]">
              {algorithm.timeComplexity.best}
            </span>
          </div>

          <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">Average</span>
            <span className="font-mono font-bold text-sm text-[var(--text-primary)]">
              {algorithm.timeComplexity.average}
            </span>
          </div>

          <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">Worst</span>
            <span className="font-mono font-bold text-sm text-[var(--text-primary)]">
              {algorithm.timeComplexity.worst}
            </span>
          </div>
        </div>
      </div>

      {/* Space & Memory Specs */}
      <div className="p-3 rounded-md bg-[var(--bg-raised)] border border-[var(--border-color)] flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
          <HardDrive className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Space & Properties</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <span className="text-[var(--text-secondary)]">Auxiliary Space:</span>
            <span className="font-mono font-bold text-[var(--text-primary)]">
              {algorithm.spaceComplexity}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <span className="text-[var(--text-secondary)]">Stable Sorting:</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              {algorithm.stable ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-600" />}
              {algorithm.stable ? "Yes" : "No"}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <span className="text-[var(--text-secondary)]">In-Place Algorithm:</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              {algorithm.inPlace ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-600" />}
              {algorithm.inPlace ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* Mathematical Invariants */}
      <div className="p-3 rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Loop Invariants</span>
        </div>

        <ul className="space-y-1 text-[11px] text-[var(--text-secondary)]">
          {algorithm.keyInvariants.map((inv, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
              <span>{inv}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
