"use client";

import React, { useState, useEffect } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import {
  Search,
  GitMerge,
  Link2,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function DisjointSetControls() {
  const {
    dsuSteps,
    currentDsuStepIndex,
    findInDsu,
    unionInDsu,
    checkConnectedDsu,
    resetDsuPreset,
    seekDsuStep,
    stepForwardDsu,
    stepBackwardDsu,
    isPlaying,
    togglePlay,
  } = useVisualizerStore();

  const currentStep = dsuSteps[currentDsuStepIndex] || dsuSteps[0];
  const elements = currentStep?.elements || [];

  const [findId, setFindId] = useState<number>(0);
  const [unionX, setUnionX] = useState<number>(0);
  const [unionY, setUnionY] = useState<number>(1);

  const totalSteps = dsuSteps.length;
  const pct = totalSteps > 1 ? (currentDsuStepIndex / (totalSteps - 1)) * 100 : 0;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForwardDsu();
      }, 750);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepForwardDsu]);

  const handleFind = (e: React.FormEvent) => {
    e.preventDefault();
    findInDsu(findId);
  };

  const handleUnion = (e: React.FormEvent) => {
    e.preventDefault();
    if (unionX !== unionY) {
      unionInDsu(unionX, unionY);
    }
  };

  const handleConnected = () => {
    checkConnectedDsu(unionX, unionY);
  };

  return (
    <div className="border border-[var(--border-color)] border-t-0 bg-[var(--bg-surface)] rounded-b-md px-4 py-3 flex flex-col gap-3 select-none">
      {/* Top Operations Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Find Operation Form */}
          <form onSubmit={handleFind} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-[11px]">
              <span className="text-[var(--text-muted)] font-mono">Find:</span>
              <select
                value={findId}
                onChange={(e) => setFindId(Number(e.target.value))}
                className="bg-transparent font-bold text-[var(--text-primary)] outline-none cursor-pointer"
              >
                {elements.map((el) => (
                  <option key={el.id} value={el.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    {el.label} ({el.id})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1 transition-opacity"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Root</span>
            </button>
          </form>

          <div className="h-4 w-px bg-[var(--border-color)]" />

          {/* Union Operation Form */}
          <form onSubmit={handleUnion} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-[11px]">
              <span className="text-[var(--text-muted)] font-mono">Union:</span>
              <select
                value={unionX}
                onChange={(e) => setUnionX(Number(e.target.value))}
                className="bg-transparent font-bold text-[var(--text-primary)] outline-none cursor-pointer"
              >
                {elements.map((el) => (
                  <option key={el.id} value={el.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    {el.label}
                  </option>
                ))}
              </select>

              <span className="text-[var(--text-muted)] font-mono">∪</span>

              <select
                value={unionY}
                onChange={(e) => setUnionY(Number(e.target.value))}
                className="bg-transparent font-bold text-[var(--text-primary)] outline-none cursor-pointer"
              >
                {elements.map((el) => (
                  <option key={el.id} value={el.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    {el.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={unionX === unionY}
              className="px-3 py-1 rounded bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40 flex items-center gap-1 transition-opacity"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Union Sets</span>
            </button>

            <button
              type="button"
              onClick={handleConnected}
              className="px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors"
              title="Check if x and y share the same root"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Connected?</span>
            </button>
          </form>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> Presets:
          </span>
          <button
            onClick={() => resetDsuPreset("kruskal")}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
            title="Kruskal MST edge contractions"
          >
            Kruskal MST
          </button>
          <button
            onClick={() => resetDsuPreset("deepChain")}
            className="px-2 py-0.5 rounded border border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-[11px] text-purple-700 dark:text-purple-300 font-semibold"
            title="E -> D -> C -> B -> A chain ready for path compression"
          >
            Deep Chain
          </button>
          <button
            onClick={() => resetDsuPreset("twoClusters")}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
            title="2 major clusters {A,B,C,D} & {E,F,G,H}"
          >
            2 Clusters
          </button>
          <button
            onClick={() => resetDsuPreset("reset")}
            className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)]"
            title="Reset to 8 singleton sets"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Connectivity Banner if operation === "connected" */}
      {currentStep?.operation === "connected" && (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-semibold ${
            currentStep.connected
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
          }`}
        >
          {currentStep.connected ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>
            {currentStep.connected
              ? "YES — Vertices are in the SAME connected component (shared root)."
              : "NO — Vertices are in DIFFERENT disjoint sets (separate roots)."}
          </span>
        </div>
      )}

      {/* Step Scrubber and Playback Controls */}
      {totalSteps > 1 && (
        <div className="flex items-center gap-3 pt-1 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-1">
            <button
              onClick={stepBackwardDsu}
              disabled={currentDsuStepIndex === 0}
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
              onClick={stepForwardDsu}
              disabled={currentDsuStepIndex >= totalSteps - 1}
              className="p-1 rounded border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-secondary)]"
              title="Step Forward (→)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums min-w-[70px]">
            {currentDsuStepIndex} / {totalSteps - 1}
          </span>

          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentDsuStepIndex}
            onChange={(e) => seekDsuStep(Number(e.target.value))}
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
