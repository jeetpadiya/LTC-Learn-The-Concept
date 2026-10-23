"use client";

import React, { useState, useEffect } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import {
  Plus,
  Search,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function AvlControls() {
  const {
    avlSteps,
    currentAvlStepIndex,
    insertIntoAvlTree,
    searchInAvlTree,
    resetAvlTreePreset,
    seekAvlStep,
    stepForwardAvl,
    stepBackwardAvl,
    isPlaying,
    togglePlay,
  } = useVisualizerStore();

  const [insertVal, setInsertVal] = useState("25");
  const [searchVal, setSearchVal] = useState("40");

  const totalSteps = avlSteps.length;
  const currentStep = avlSteps[currentAvlStepIndex] || avlSteps[0];
  const pct = totalSteps > 1 ? (currentAvlStepIndex / (totalSteps - 1)) * 100 : 0;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForwardAvl();
      }, 750);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepForwardAvl]);

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseInt(insertVal.trim(), 10);
    if (!isNaN(v) && v > 0) {
      insertIntoAvlTree(v);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseInt(searchVal.trim(), 10);
    if (!isNaN(v) && v > 0) {
      searchInAvlTree(v);
    }
  };

  return (
    <div className="border border-[var(--border-color)] border-t-0 bg-[var(--bg-surface)] rounded-b-md px-4 py-3 flex flex-col gap-3 select-none">
      {/* Top Operations Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Insert Form */}
          <form onSubmit={handleInsert} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-[11px]">
              <span className="text-[var(--text-muted)] font-mono">Val:</span>
              <input
                type="number"
                min={1}
                max={999}
                value={insertVal}
                onChange={(e) => setInsertVal(e.target.value)}
                className="w-12 bg-transparent font-mono font-bold text-[var(--text-primary)] outline-none text-right"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert</span>
            </button>
          </form>

          <div className="h-4 w-px bg-[var(--border-color)]" />

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-[11px]">
              <span className="text-[var(--text-muted)] font-mono">Key:</span>
              <input
                type="number"
                min={1}
                max={999}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-12 bg-transparent font-mono font-bold text-[var(--text-primary)] outline-none text-right"
              />
            </div>
            <button
              type="submit"
              className="px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Rotation Preset Triggers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> Presets:
          </span>
          <button
            onClick={() => resetAvlTreePreset("balanced")}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
            title="Balanced 7-Node AVL Tree"
          >
            Balanced (7)
          </button>
          <button
            onClick={() => resetAvlTreePreset("rrCase")}
            className="px-2 py-0.5 rounded border border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-[11px] text-purple-700 dark:text-purple-300 font-semibold"
            title="Inserts 10, 20, 30 → Left Rotation (RR)"
          >
            RR (Left Rot)
          </button>
          <button
            onClick={() => resetAvlTreePreset("llCase")}
            className="px-2 py-0.5 rounded border border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-[11px] text-purple-700 dark:text-purple-300 font-semibold"
            title="Inserts 30, 20, 10 → Right Rotation (LL)"
          >
            LL (Right Rot)
          </button>
          <button
            onClick={() => resetAvlTreePreset("lrCase")}
            className="px-2 py-0.5 rounded border border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-[11px] text-purple-700 dark:text-purple-300 font-semibold"
            title="Inserts 30, 10, 20 → Double Rotation (LR)"
          >
            LR (Double)
          </button>
          <button
            onClick={() => resetAvlTreePreset("rlCase")}
            className="px-2 py-0.5 rounded border border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-[11px] text-purple-700 dark:text-purple-300 font-semibold"
            title="Inserts 10, 30, 20 → Double Rotation (RL)"
          >
            RL (Double)
          </button>
          <button
            onClick={() => resetAvlTreePreset("balanced")}
            className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)]"
            title="Reset Tree"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Rotation Status Banner */}
      <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="font-semibold text-[11px] text-[var(--text-secondary)]">AVL Invariant:</span>
          <span className="font-mono text-[11px] text-[var(--text-primary)]">
            Balance Factor BF = height(L) - height(R) ∈ &#123;-1, 0, +1&#125;
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--text-muted)]">Active Rotation:</span>
          <span className="font-mono font-bold text-xs text-purple-700 dark:text-purple-400">
            {currentStep?.rotationType && currentStep.rotationType !== "none"
              ? `${currentStep.rotationType} Rotation`
              : "None (Balanced)"}
          </span>
        </div>
      </div>

      {/* Scrubber and Playback Bar */}
      {totalSteps > 1 && (
        <div className="flex items-center gap-3 pt-1 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-1">
            <button
              onClick={stepBackwardAvl}
              disabled={currentAvlStepIndex === 0}
              className="p-1 rounded border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-secondary)]"
              title="Step Back (←)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={togglePlay}
              className="px-2.5 py-1 rounded bg-[var(--accent)] text-white text-xs font-semibold flex items-center gap-1"
              title="Play / Pause"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button
              onClick={stepForwardAvl}
              disabled={currentAvlStepIndex >= totalSteps - 1}
              className="p-1 rounded border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-secondary)]"
              title="Step Forward (→)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums min-w-[70px]">
            {currentAvlStepIndex} / {totalSteps - 1}
          </span>

          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentAvlStepIndex}
            onChange={(e) => seekAvlStep(Number(e.target.value))}
            className="flex-1"
            style={{
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border-color) ${pct}%, var(--border-color) 100%)`,
            }}
          />

          <span className="text-xs font-medium text-[var(--text-secondary)] truncate max-w-sm hidden md:inline">
            {currentStep?.description}
          </span>
        </div>
      )}
    </div>
  );
}
