"use client";

import React, { useState } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import {
  Plus,
  Search,
  Trash2,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  GitBranch,
} from "lucide-react";

export default function TreeControls() {
  const {
    treeSteps,
    currentTreeStepIndex,
    insertIntoTree,
    searchInTree,
    deleteFromTree,
    resetTree,
    seekTreeStep,
    stepForwardTree,
    stepBackwardTree,
    isPlaying,
    togglePlay,
  } = useVisualizerStore();

  const [insertVal, setInsertVal] = useState("25");
  const [searchVal, setSearchVal] = useState("40");
  const [deleteVal, setDeleteVal] = useState("30");

  const totalSteps = treeSteps.length;
  const currentStep = treeSteps[currentTreeStepIndex] || treeSteps[0];
  const pct = totalSteps > 1 ? (currentTreeStepIndex / (totalSteps - 1)) * 100 : 0;

  // Auto-play interval for tree steps
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForwardTree();
      }, 700);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepForwardTree]);

  const handleInsert = () => {
    const v = parseInt(insertVal.trim(), 10);
    if (!isNaN(v) && v > 0) {
      insertIntoTree(v);
    }
  };

  const handleSearch = () => {
    const v = parseInt(searchVal.trim(), 10);
    if (!isNaN(v) && v > 0) {
      searchInTree(v);
    }
  };

  const handleDelete = () => {
    const v = parseInt(deleteVal.trim(), 10);
    if (!isNaN(v) && v > 0) {
      deleteFromTree(v);
    }
  };

  return (
    <div className="border border-[var(--border-color)] border-t-0 bg-[var(--bg-surface)] rounded-b-md px-4 py-3 flex flex-col gap-3 select-none">
      {/* Top Operations Row: Insert, Search, Delete */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* 1. Insert Operation */}
          <div className="flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5">
            <input
              type="number"
              min="1"
              max="999"
              value={insertVal}
              onChange={(e) => setInsertVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              placeholder="Val"
              className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-transparent outline-none text-[var(--text-primary)]"
            />
            <button
              onClick={handleInsert}
              className="px-2.5 py-1 rounded bg-[var(--accent)] text-white font-medium hover:opacity-90 flex items-center gap-1 transition-opacity"
            >
              <Plus className="w-3 h-3" />
              <span>Insert</span>
            </button>
          </div>

          {/* 2. Search Operation */}
          <div className="flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5">
            <input
              type="number"
              min="1"
              max="999"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Val"
              className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-transparent outline-none text-[var(--text-primary)]"
            />
            <button
              onClick={handleSearch}
              className="px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-primary)] font-medium flex items-center gap-1 transition-colors"
            >
              <Search className="w-3 h-3 text-amber-600" />
              <span>Search</span>
            </button>
          </div>

          {/* 3. Delete Operation */}
          <div className="flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5">
            <input
              type="number"
              min="1"
              max="999"
              value={deleteVal}
              onChange={(e) => setDeleteVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDelete()}
              placeholder="Val"
              className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-transparent outline-none text-[var(--text-primary)]"
            />
            <button
              onClick={handleDelete}
              className="px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-red-500/10 text-red-600 font-medium flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Tree Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--text-muted)]">Preset:</span>
          <button
            onClick={() => resetTree([50, 30, 70, 20, 40, 60, 80])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
          >
            Balanced 7
          </button>
          <button
            onClick={() => resetTree([10, 20, 30, 40, 50])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
            title="Degenerate O(n) line"
          >
            Skewed
          </button>
          <button
            onClick={() => resetTree()}
            className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)]"
            title="Reset Tree"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Traversal Step Scrubber if operation produced steps */}
      {totalSteps > 1 && (
        <div className="flex items-center gap-3 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-1">
            <button
              onClick={stepBackwardTree}
              disabled={currentTreeStepIndex === 0}
              className="p-1 rounded border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-secondary)]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={togglePlay}
              className="px-2.5 py-1 rounded bg-[var(--accent)] text-white text-xs font-semibold flex items-center gap-1"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button
              onClick={stepForwardTree}
              disabled={currentTreeStepIndex >= totalSteps - 1}
              className="p-1 rounded border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-secondary)]"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums">
            Step {currentTreeStepIndex} / {totalSteps - 1}
          </span>

          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentTreeStepIndex}
            onChange={(e) => seekTreeStep(Number(e.target.value))}
            className="flex-1"
            style={{
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border-color) ${pct}%, var(--border-color) 100%)`,
            }}
          />

          <span className="text-xs font-medium text-[var(--text-secondary)] truncate max-w-xs">
            {currentStep.description}
          </span>
        </div>
      )}
    </div>
  );
}
