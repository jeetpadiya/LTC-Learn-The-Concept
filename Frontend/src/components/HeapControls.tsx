"use client";

import React, { useState, useEffect } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { HeapType } from "@/types/visualizer";
import {
  Plus,
  Trash2,
  Eye,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
} from "lucide-react";

export default function HeapControls() {
  const {
    heapSteps,
    currentHeapStepIndex,
    heapType,
    setHeapType,
    insertIntoHeap,
    extractFromHeap,
    buildHeap,
    peekHeap,
    resetHeapPreset,
    seekHeapStep,
    stepForwardHeap,
    stepBackwardHeap,
    isPlaying,
    togglePlay,
  } = useVisualizerStore();

  const [inputVal, setInputVal] = useState("15");

  const totalSteps = heapSteps.length;
  const currentStep = heapSteps[currentHeapStepIndex] || heapSteps[0];
  const pct = totalSteps > 1 ? (currentHeapStepIndex / (totalSteps - 1)) * 100 : 0;

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForwardHeap();
      }, 700);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepForwardHeap]);

  const handleInsert = () => {
    const v = parseInt(inputVal.trim(), 10);
    if (!isNaN(v)) {
      insertIntoHeap(v);
    }
  };

  const handleExtract = () => {
    extractFromHeap();
  };

  const handleHeapify = () => {
    buildHeap();
  };

  const handlePeek = () => {
    peekHeap();
  };

  return (
    <div className="shrink-0 flex flex-col gap-2 p-3 bg-[var(--bg-surface)] border-t border-[var(--border-color)] text-xs select-none">
      {/* Upper Action Row: Operations, Inputs, Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Operations & Inputs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Heap Type Toggle */}
          <div className="flex rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5">
            <button
              onClick={() => setHeapType("min")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                heapType === "min"
                  ? "bg-[var(--accent)] text-white shadow-xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Min-Heap
            </button>
            <button
              onClick={() => setHeapType("max")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                heapType === "max"
                  ? "bg-[var(--accent)] text-white shadow-xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Max-Heap
            </button>
          </div>

          <div className="h-4 w-px bg-[var(--border-color)]" />

          {/* Value input for insert */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[var(--text-muted)]">Val:</span>
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              className="w-14 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] text-center"
              placeholder="15"
            />
          </div>

          {/* Insert button */}
          <button
            onClick={handleInsert}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--accent)] hover:opacity-90 text-white font-medium text-xs shadow-xs transition-opacity"
            title="Insert element & sift-up (O(log n))"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert</span>
          </button>

          {/* Extract Root button */}
          <button
            onClick={handleExtract}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium text-xs transition-colors"
            title="Extract top element & sift-down (O(log n))"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Extract Root</span>
          </button>

          {/* Peek Root button */}
          <button
            onClick={handlePeek}
            className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-colors"
            title="Inspect root element (O(1))"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Peek</span>
          </button>

          {/* Heapify (O(n) Build Heap) */}
          <button
            onClick={handleHeapify}
            className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-colors"
            title="Transform array into heap using linear O(n) bottom-up heapify"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Heapify (O(n))</span>
          </button>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Presets:</span>
          <button
            onClick={() =>
              resetHeapPreset(
                heapType === "min" ? [10, 20, 25, 40, 50, 30, 35] : [90, 80, 70, 40, 50, 60, 30]
              )
            }
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[10px] font-mono text-[var(--text-secondary)] transition-colors"
          >
            Balanced (7)
          </button>

          <button
            onClick={() => resetHeapPreset([65, 12, 89, 23, 45, 78, 34, 9])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[10px] font-mono text-[var(--text-secondary)] transition-colors"
          >
            Unordered (8)
          </button>

          <button
            onClick={() => resetHeapPreset([5])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[10px] font-mono text-[var(--text-secondary)] transition-colors"
            title="Single element"
          >
            Single (1)
          </button>
        </div>
      </div>

      {/* Playback Controls & Progress Scrubber */}
      <div className="flex items-center gap-3 pt-1 border-t border-[var(--border-color)] flex-wrap">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={stepBackwardHeap}
            disabled={currentHeapStepIndex <= 0}
            className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] disabled:opacity-30 disabled:pointer-events-none text-[var(--text-primary)]"
            title="Step backward"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={togglePlay}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium text-xs"
            title={isPlaying ? "Pause trace playback" : "Play step trace"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-mono">{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <button
            onClick={stepForwardHeap}
            disabled={currentHeapStepIndex >= totalSteps - 1}
            className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] disabled:opacity-30 disabled:pointer-events-none text-[var(--text-primary)]"
            title="Step forward"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrubber track */}
        <div className="flex-1 flex items-center gap-2 min-w-[120px]">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentHeapStepIndex}
            onChange={(e) => seekHeapStep(parseInt(e.target.value, 10))}
            className="flex-1 h-1.5 bg-[var(--bg-raised)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
          />
          <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0 tabular-nums">
            {currentHeapStepIndex + 1}/{totalSteps}
          </span>
        </div>
      </div>
    </div>
  );
}

