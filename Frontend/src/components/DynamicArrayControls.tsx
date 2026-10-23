"use client";

import React, { useState, useEffect } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { ArrayVisualMode } from "@/types/visualizer";
import {
  Plus,
  Trash2,
  Eye,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  HardDrive,
} from "lucide-react";

export default function DynamicArrayControls() {
  const {
    dynamicArraySteps,
    currentDynamicArrayStepIndex,
    dynamicArrayMode,
    setDynamicArrayMode,
    pushBackDynamicArray,
    popBackDynamicArray,
    insertAtDynamicArray,
    accessIndexDynamicArray,
    resetDynamicArrayPreset,
    seekDynamicArrayStep,
    stepForwardDynamicArray,
    stepBackwardDynamicArray,
    isPlaying,
    togglePlay,
  } = useVisualizerStore();

  const [inputVal, setInputVal] = useState("99");
  const [indexVal, setIndexVal] = useState("1");

  const totalSteps = dynamicArraySteps.length;
  const currentStep = dynamicArraySteps[currentDynamicArrayStepIndex] || dynamicArraySteps[0];
  const pct = totalSteps > 1 ? (currentDynamicArrayStepIndex / (totalSteps - 1)) * 100 : 0;
  const isDynamic = dynamicArrayMode === "dynamic";

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForwardDynamicArray();
      }, 700);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepForwardDynamicArray]);

  const handlePushBack = () => {
    const v = parseInt(inputVal.trim(), 10);
    if (!isNaN(v)) {
      pushBackDynamicArray(v);
    }
  };

  const handlePopBack = () => {
    popBackDynamicArray();
  };

  const handleInsertAt = () => {
    const v = parseInt(inputVal.trim(), 10);
    const idx = parseInt(indexVal.trim(), 10);
    if (!isNaN(v) && !isNaN(idx)) {
      insertAtDynamicArray(v, idx);
    }
  };

  const handleAccess = () => {
    const idx = parseInt(indexVal.trim(), 10);
    if (!isNaN(idx)) {
      accessIndexDynamicArray(idx);
    }
  };

  return (
    <div className="border border-[var(--border-color)] border-t-0 bg-[var(--bg-surface)] rounded-b-md px-4 py-3 flex flex-col gap-3 select-none">
      {/* Top Operations Bar: Mode Toggle, Push Back, Insert At, Access, Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 1. Dynamic vs Static Mode Toggle */}
          <div className="flex rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5 text-xs">
            <button
              onClick={() => setDynamicArrayMode("dynamic")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                isDynamic
                  ? "bg-[var(--bg-surface)] text-[var(--accent)] shadow-2xs border border-[var(--accent)]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Dynamic (Vector)</span>
            </button>
            <button
              onClick={() => setDynamicArrayMode("static")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                !isDynamic
                  ? "bg-[var(--bg-surface)] text-[var(--accent)] shadow-2xs border border-[var(--accent)]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <span>Fixed Static</span>
            </button>
          </div>

          <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />

          {/* 2. Numeric Input + Push Back */}
          <div className="flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5">
            <input
              type="number"
              min="1"
              max="999"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePushBack()}
              placeholder="Val"
              className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-transparent outline-none text-[var(--text-primary)]"
            />
            <button
              onClick={handlePushBack}
              className="px-3 py-1 rounded bg-[var(--accent)] text-white font-medium hover:opacity-90 flex items-center gap-1 transition-opacity"
              title="Append element at end (Amortized O(1), doubles capacity when full)"
            >
              <Plus className="w-3 h-3" />
              <span>Push Back</span>
            </button>
          </div>

          {/* 3. Pop Back */}
          <button
            onClick={handlePopBack}
            className="px-2.5 py-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-red-500/10 text-red-600 font-medium flex items-center gap-1 transition-colors"
            title="Remove last element in O(1) time"
          >
            <Trash2 className="w-3 h-3" />
            <span>Pop Back</span>
          </button>

          {/* 4. Insert At Index & Access Index Controls */}
          <div className="flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5">
            <span className="px-1 text-[10px] text-[var(--text-muted)] font-mono">@idx:</span>
            <input
              type="number"
              min="0"
              max="15"
              value={indexVal}
              onChange={(e) => setIndexVal(e.target.value)}
              className="w-10 px-1 py-1 text-center font-mono text-xs bg-transparent outline-none text-[var(--text-primary)]"
            />
            <button
              onClick={handleInsertAt}
              className="px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-primary)] font-medium flex items-center gap-1 transition-colors text-[11px]"
              title="Insert at arbitrary index with element right-shifting (O(n))"
            >
              <span>Insert At</span>
            </button>
            <button
              onClick={handleAccess}
              className="px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--accent)] font-medium flex items-center gap-1 transition-colors text-[11px] ml-0.5"
              title="O(1) Direct Pointer Offset Random Access"
            >
              <Eye className="w-3 h-3" />
              <span>Access</span>
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--text-muted)]">Preset:</span>
          <button
            onClick={() => resetDynamicArrayPreset([10, 20, 30], 4)}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-amber-700 dark:text-amber-400 font-semibold"
            title="Click Push Back once to trigger 2x capacity doubling!"
          >
            Near Full (3/4)
          </button>
          <button
            onClick={() => resetDynamicArrayPreset([12, 24, 36, 48], 8)}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
          >
            Half (4/8)
          </button>
          <button
            onClick={() => resetDynamicArrayPreset([10, 20, 30, 40, 50, 60, 70, 80], 8)}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
          >
            Full (8/8)
          </button>
          <button
            onClick={() => resetDynamicArrayPreset()}
            className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)]"
            title="Reset Array"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrubber and Step Navigation */}
      {totalSteps > 1 && (
        <div className="flex items-center gap-3 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-1">
            <button
              onClick={stepBackwardDynamicArray}
              disabled={currentDynamicArrayStepIndex === 0}
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
              onClick={stepForwardDynamicArray}
              disabled={currentDynamicArrayStepIndex >= totalSteps - 1}
              className="p-1 rounded border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-secondary)]"
              title="Step Forward (→)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums min-w-[70px]">
            {currentDynamicArrayStepIndex} / {totalSteps - 1}
          </span>

          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentDynamicArrayStepIndex}
            onChange={(e) => seekDynamicArrayStep(Number(e.target.value))}
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

