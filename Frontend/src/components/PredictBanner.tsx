"use client";

import React from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { HelpCircle, Check, X } from "lucide-react";

export default function PredictBanner() {
  const { predictState, submitPrediction, dismissPrediction } = useVisualizerStore();

  if (!predictState.isActive) return null;

  return (
    <div className="p-3 rounded-md border border-amber-500/40 bg-amber-500/10 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <div>
          <span className="font-bold text-[var(--text-primary)] block sm:inline mr-2">
            Predict Next Step:
          </span>
          <span className="text-[var(--text-secondary)]">{predictState.question}</span>
        </div>
      </div>

      {predictState.userChoice === null ? (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => submitPrediction(false)}
            className="px-3 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] hover:bg-[var(--bg-raised)] font-medium text-[var(--text-primary)]"
          >
            No Swap
          </button>
          <button
            onClick={() => submitPrediction(true)}
            className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold"
          >
            Yes, Swap
          </button>
          <button
            onClick={dismissPrediction}
            className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-1"
          >
            Skip
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 font-semibold shrink-0">
          {predictState.isCorrect ? (
            <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400">
              <Check className="w-4 h-4" /> Correct deduction!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-400">
              <X className="w-4 h-4" /> Incorrect deduction.
            </span>
          )}
          <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2">
            Score: {predictState.score}/{predictState.total}
          </span>
        </div>
      )}
    </div>
  );
}

