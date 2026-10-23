"use client";

import React, { useMemo } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { ALGORITHMS } from "@/lib/algorithms";
import Visualizer from "@/components/Visualizer";

export default function CompareVisualizer() {
  const {
    array,
    selectedTopic,
    compareAlgoId,
    setCompareAlgoId,
    steps,
    compareSteps,
    currentStepIndex,
    theme,
    playbackSpeed,
  } = useVisualizerStore();

  const algoA = ALGORITHMS[selectedTopic];
  const algoB = ALGORITHMS[compareAlgoId];

  const stepA = steps[currentStepIndex] || steps[steps.length - 1] || steps[0];

  // Map progress ratio so both algorithms visually advance together on shared scrubber
  const progressRatio = steps.length > 1 ? currentStepIndex / (steps.length - 1) : 0;
  const compareIndex = Math.min(
    compareSteps.length - 1,
    Math.round(progressRatio * (compareSteps.length - 1))
  );
  const stepB = compareSteps[compareIndex] || compareSteps[compareSteps.length - 1] || compareSteps[0];

  const sortedA = useMemo(() => new Set(stepA.sortedIndices), [stepA]);
  const sortedB = useMemo(() => new Set(stepB.sortedIndices), [stepB]);

  const totalCompsA = steps[steps.length - 1]?.counters.comparisons ?? 0;
  const totalSwapsA = steps[steps.length - 1]?.counters.swaps ?? 0;
  const totalCompsB = compareSteps[compareSteps.length - 1]?.counters.comparisons ?? 0;
  const totalSwapsB = compareSteps[compareSteps.length - 1]?.counters.swaps ?? 0;

  return (
    <div className="flex flex-col gap-2 w-full h-full flex-1">
      {/* Compare Selector & Metrics Strip */}
      <div className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between text-xs gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--text-primary)]">Comparing:</span>
          <span className="px-2 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] font-medium">
            {algoA?.name}
          </span>
          <span className="text-[var(--text-muted)]">vs</span>
          <select
            value={compareAlgoId}
            onChange={(e) => setCompareAlgoId(e.target.value)}
            className="px-2 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium text-xs cursor-pointer outline-none"
          >
            {Object.values(ALGORITHMS)
              .filter((a) => a.id !== selectedTopic)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--text-secondary)]">
          <div>
            {algoA?.name}: <span className="font-semibold text-[var(--text-primary)]">{totalCompsA}</span> comps /{" "}
            <span className="font-semibold text-[var(--text-primary)]">{totalSwapsA}</span> swaps
          </div>
          <span className="text-[var(--border-strong)]">|</span>
          <div>
            {algoB?.name}: <span className="font-semibold text-[var(--text-primary)]">{totalCompsB}</span> comps /{" "}
            <span className="font-semibold text-[var(--text-primary)]">{totalSwapsB}</span> swaps
          </div>
        </div>
      </div>

      {/* Dual Side-by-Side Viewports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 min-h-[320px]">
        <Visualizer
          array={stepA.arraySnapshot}
          activeIndices={stepA.indices}
          action={stepA.action}
          sortedIndices={sortedA}
          theme={theme}
          speed={playbackSpeed}
          title={`${algoA?.name} (${stepA.counters.comparisons} comps, ${stepA.counters.swaps} swaps)`}
        />

        <Visualizer
          array={stepB.arraySnapshot}
          activeIndices={stepB.indices}
          action={stepB.action}
          sortedIndices={sortedB}
          theme={theme}
          speed={playbackSpeed}
          title={`${algoB?.name} (${stepB.counters.comparisons} comps, ${stepB.counters.swaps} swaps)`}
        />
      </div>
    </div>
  );
}
