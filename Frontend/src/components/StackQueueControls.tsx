"use client";

import React, { useState, useEffect } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { StackQueueMode } from "@/types/visualizer";
import {
  Plus,
  Trash2,
  Eye,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowLeft,
  Layers,
} from "lucide-react";

export default function StackQueueControls() {
  const {
    stackQueueSteps,
    currentStackQueueStepIndex,
    stackQueueMode,
    setStackQueueMode,
    pushStack,
    popStack,
    peekStack,
    enqueueQueue,
    dequeueQueue,
    peekQueue,
    resetStackQueuePreset,
    seekStackQueueStep,
    stepForwardStackQueue,
    stepBackwardStackQueue,
    isPlaying,
    togglePlay,
  } = useVisualizerStore();

  const [inputVal, setInputVal] = useState("42");

  const totalSteps = stackQueueSteps.length;
  const currentStep = stackQueueSteps[currentStackQueueStepIndex] || stackQueueSteps[0];
  const pct = totalSteps > 1 ? (currentStackQueueStepIndex / (totalSteps - 1)) * 100 : 0;
  const isStack = stackQueueMode === "stack";

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForwardStackQueue();
      }, 700);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepForwardStackQueue]);

  const handleAdd = () => {
    const v = parseInt(inputVal.trim(), 10);
    if (!isNaN(v)) {
      if (isStack) {
        pushStack(v);
      } else {
        enqueueQueue(v);
      }
    }
  };

  const handleRemove = () => {
    if (isStack) {
      popStack();
    } else {
      dequeueQueue();
    }
  };

  const handlePeek = () => {
    if (isStack) {
      peekStack();
    } else {
      peekQueue();
    }
  };

  return (
    <div className="border border-[var(--border-color)] border-t-0 bg-[var(--bg-surface)] rounded-b-md px-4 py-3 flex flex-col gap-3 select-none">
      {/* Top Operations Bar: Mode Toggle, Push/Pop / Enqueue/Dequeue, Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 1. Stack vs Queue Mode Toggle */}
          <div className="flex rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5 text-xs">
            <button
              onClick={() => setStackQueueMode("stack")}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                isStack
                  ? "bg-[var(--bg-surface)] text-[var(--accent)] shadow-2xs border border-[var(--accent)]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Stack (LIFO)</span>
            </button>
            <button
              onClick={() => setStackQueueMode("queue")}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                !isStack
                  ? "bg-[var(--bg-surface)] text-[var(--accent)] shadow-2xs border border-[var(--accent)]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Queue (FIFO)</span>
            </button>
          </div>

          <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />

          {/* 2. Numeric Input + Primary Insertion Button */}
          <div className="flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5">
            <input
              type="number"
              min="1"
              max="999"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Val"
              className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-transparent outline-none text-[var(--text-primary)]"
            />
            <button
              onClick={handleAdd}
              className="px-3 py-1 rounded bg-[var(--accent)] text-white font-medium hover:opacity-90 flex items-center gap-1 transition-opacity"
              title={isStack ? "Push value onto stack TOP (O(1))" : "Enqueue value at queue REAR (O(1))"}
            >
              <Plus className="w-3 h-3" />
              <span>{isStack ? "Push" : "Enqueue"}</span>
            </button>
          </div>

          {/* 3. Primary Removal Button (Pop / Dequeue) */}
          <button
            onClick={handleRemove}
            className="px-2.5 py-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-red-500/10 text-red-600 font-medium flex items-center gap-1 transition-colors"
            title={isStack ? "Pop topmost element from stack (O(1))" : "Dequeue frontmost element from queue (O(1))"}
          >
            {isStack ? <ArrowUp className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
            <span>{isStack ? "Pop" : "Dequeue"}</span>
          </button>

          {/* 4. Peek Button */}
          <button
            onClick={handlePeek}
            className="px-2.5 py-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-primary)] font-medium flex items-center gap-1 transition-colors"
            title={isStack ? "Inspect TOP without removing (O(1))" : "Inspect FRONT without removing (O(1))"}
          >
            <Eye className="w-3 h-3 text-amber-600" />
            <span>Peek</span>
          </button>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--text-muted)]">Preset:</span>
          <button
            onClick={() => resetStackQueuePreset([15, 30, 45, 60])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
          >
            4 Items
          </button>
          <button
            onClick={() => resetStackQueuePreset([10, 20, 30, 40, 50, 60, 70, 80])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
            title="Max capacity buffer"
          >
            Full (8)
          </button>
          <button
            onClick={() => resetStackQueuePreset([])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
          >
            Empty
          </button>
          <button
            onClick={() => resetStackQueuePreset()}
            className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)]"
            title="Reset Buffer"
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
              onClick={stepBackwardStackQueue}
              disabled={currentStackQueueStepIndex === 0}
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
              onClick={stepForwardStackQueue}
              disabled={currentStackQueueStepIndex >= totalSteps - 1}
              className="p-1 rounded border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-secondary)]"
              title="Step Forward (→)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums min-w-[70px]">
            {currentStackQueueStepIndex} / {totalSteps - 1}
          </span>

          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentStackQueueStepIndex}
            onChange={(e) => seekStackQueueStep(Number(e.target.value))}
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

