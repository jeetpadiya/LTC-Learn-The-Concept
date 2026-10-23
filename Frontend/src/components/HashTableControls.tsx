"use client";

import React, { useState, useEffect } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { HashCollisionStrategy } from "@/types/visualizer";
import {
  Plus,
  Trash2,
  Search,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";

export default function HashTableControls() {
  const {
    hashTableSteps,
    currentHashTableStepIndex,
    hashStrategy,
    setHashStrategy,
    insertIntoHashTable,
    searchInHashTable,
    deleteFromHashTable,
    rehashTable,
    resetHashTablePreset,
    seekHashTableStep,
    stepForwardHashTable,
    stepBackwardHashTable,
    isPlaying,
    togglePlay,
  } = useVisualizerStore();

  const [inputVal, setInputVal] = useState("23");

  const totalSteps = hashTableSteps.length;
  const currentStep = hashTableSteps[currentHashTableStepIndex] || hashTableSteps[0];
  const pct = totalSteps > 1 ? (currentHashTableStepIndex / (totalSteps - 1)) * 100 : 0;

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForwardHashTable();
      }, 700);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepForwardHashTable]);

  const handleInsert = () => {
    const k = parseInt(inputVal.trim(), 10);
    if (!isNaN(k)) {
      insertIntoHashTable(k);
    }
  };

  const handleSearch = () => {
    const k = parseInt(inputVal.trim(), 10);
    if (!isNaN(k)) {
      searchInHashTable(k);
    }
  };

  const handleDelete = () => {
    const k = parseInt(inputVal.trim(), 10);
    if (!isNaN(k)) {
      deleteFromHashTable(k);
    }
  };

  const handleRehash = () => {
    rehashTable();
  };

  return (
    <div className="shrink-0 flex flex-col gap-2 p-3 bg-[var(--bg-surface)] border-t border-[var(--border-color)] text-xs select-none">
      {/* Upper Action Row: Operations, Inputs, Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Operations & Inputs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Strategy Toggle */}
          <div className="flex rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5">
            <button
              onClick={() => setHashStrategy("chaining")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                hashStrategy === "chaining"
                  ? "bg-[var(--accent)] text-white shadow-xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Chaining
            </button>
            <button
              onClick={() => setHashStrategy("linear_probing")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                hashStrategy === "linear_probing"
                  ? "bg-[var(--accent)] text-white shadow-xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Linear Probing
            </button>
          </div>

          <div className="h-4 w-px bg-[var(--border-color)]" />

          {/* Key input */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[var(--text-muted)]">Key:</span>
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              className="w-14 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] text-center"
              placeholder="23"
            />
          </div>

          {/* Insert button */}
          <button
            onClick={handleInsert}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--accent)] hover:opacity-90 text-white font-medium text-xs shadow-xs transition-opacity"
            title="Insert key and resolve collision (O(1) Avg)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert</span>
          </button>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium text-xs transition-colors"
            title="Lookup key using hash & collision probe (O(1) Avg)"
          >
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Search</span>
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-colors"
            title="Delete key (unlinks node in chaining or leaves Tombstone in probing)"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Delete</span>
          </button>

          {/* Rehash (2x Capacity) */}
          <button
            onClick={handleRehash}
            className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-colors"
            title="Manually trigger 2x capacity doubling and redistribution"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Rehash (2×)</span>
          </button>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Presets:</span>
          <button
            onClick={() => resetHashTablePreset([7, 14, 21, 28, 35])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[10px] font-mono text-[var(--text-secondary)] transition-colors"
            title="Multiple keys colliding at bucket [0]"
          >
            Collisions [0]
          </button>

          <button
            onClick={() => resetHashTablePreset([10, 22, 31, 4, 17])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[10px] font-mono text-[var(--text-secondary)] transition-colors"
            title="Keys spread across different buckets"
          >
            Spread (5)
          </button>

          <button
            onClick={() => resetHashTablePreset([12, 19, 26, 33, 40])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[10px] font-mono text-[var(--text-secondary)] transition-colors"
            title="Load factor 5/7 = 0.71, next insert triggers rehash"
          >
            Near Rehash (5/7)
          </button>
        </div>
      </div>

      {/* Playback Controls & Progress Scrubber */}
      <div className="flex items-center gap-3 pt-1 border-t border-[var(--border-color)] flex-wrap">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={stepBackwardHashTable}
            disabled={currentHashTableStepIndex <= 0}
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
            onClick={stepForwardHashTable}
            disabled={currentHashTableStepIndex >= totalSteps - 1}
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
            value={currentHashTableStepIndex}
            onChange={(e) => seekHashTableStep(parseInt(e.target.value, 10))}
            className="flex-1 h-1.5 bg-[var(--bg-raised)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
          />
          <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0 tabular-nums">
            {currentHashTableStepIndex + 1}/{totalSteps}
          </span>
        </div>
      </div>
    </div>
  );
}

