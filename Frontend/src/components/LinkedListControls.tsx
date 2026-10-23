"use client";

import React, { useState, useEffect } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { LinkedListType } from "@/types/visualizer";
import {
  Plus,
  Trash2,
  RotateCcw,
  RefreshCw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  Link as LinkIcon,
} from "lucide-react";

export default function LinkedListControls() {
  const {
    linkedListSteps,
    currentLinkedListStepIndex,
    linkedListType,
    setLinkedListType,
    insertHeadLinkedList,
    insertTailLinkedList,
    deleteLinkedListNode,
    reverseLinkedList,
    resetLinkedListPreset,
    seekLinkedListStep,
    stepForwardLinkedList,
    stepBackwardLinkedList,
    isPlaying,
    togglePlay,
  } = useVisualizerStore();

  const [inputVal, setInputVal] = useState("25");
  const [deleteVal, setDeleteVal] = useState("99");

  const totalSteps = linkedListSteps.length;
  const currentStep = linkedListSteps[currentLinkedListStepIndex] || linkedListSteps[0];
  const pct = totalSteps > 1 ? (currentLinkedListStepIndex / (totalSteps - 1)) * 100 : 0;

  // Auto-play interval for linked list steps
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForwardLinkedList();
      }, 750);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepForwardLinkedList]);

  const handleInsertHead = () => {
    const v = parseInt(inputVal.trim(), 10);
    if (!isNaN(v)) {
      insertHeadLinkedList(v);
    }
  };

  const handleInsertTail = () => {
    const v = parseInt(inputVal.trim(), 10);
    if (!isNaN(v)) {
      insertTailLinkedList(v);
    }
  };

  const handleDelete = () => {
    const v = parseInt(deleteVal.trim(), 10);
    if (!isNaN(v)) {
      deleteLinkedListNode(v);
    }
  };

  return (
    <div className="border border-[var(--border-color)] border-t-0 bg-[var(--bg-surface)] rounded-b-md px-4 py-3 flex flex-col gap-3 select-none">
      {/* Top Operations Bar: Mode Toggle, Insert Head/Tail, Delete, Reverse */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 1. Singly vs Doubly Toggle */}
          <div className="flex rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5 text-xs">
            <button
              onClick={() => setLinkedListType("singly")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                linkedListType === "singly"
                  ? "bg-[var(--bg-surface)] text-[var(--accent)] shadow-2xs border border-[var(--accent)]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Singly Linked
            </button>
            <button
              onClick={() => setLinkedListType("doubly")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                linkedListType === "doubly"
                  ? "bg-[var(--bg-surface)] text-[var(--accent)] shadow-2xs border border-[var(--accent)]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Doubly Linked
            </button>
          </div>

          <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />

          {/* 2. Numeric Input for Insert */}
          <div className="flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5">
            <input
              type="number"
              min="1"
              max="999"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsertHead()}
              placeholder="Val"
              className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-transparent outline-none text-[var(--text-primary)]"
            />
            <button
              onClick={handleInsertHead}
              className="px-2.5 py-1 rounded bg-[var(--accent)] text-white font-medium hover:opacity-90 flex items-center gap-1 transition-opacity"
              title="Insert at beginning of list - O(1)"
            >
              <Plus className="w-3 h-3" />
              <span>Head</span>
            </button>
            <button
              onClick={handleInsertTail}
              className="px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-primary)] font-medium flex items-center gap-1 transition-colors ml-0.5"
              title="Append to end of list - O(1)"
            >
              <Plus className="w-3 h-3 text-[var(--accent)]" />
              <span>Tail</span>
            </button>
          </div>

          {/* 3. Delete by Value */}
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
              title="Search and delete node by value"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>

          {/* 4. In-Place Reverse */}
          <button
            onClick={() => reverseLinkedList()}
            className="px-2.5 py-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-primary)] font-medium flex items-center gap-1 transition-colors"
            title="Reverse list pointers in-place - O(n)"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Reverse</span>
          </button>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--text-muted)]">Preset:</span>
          <button
            onClick={() => resetLinkedListPreset([12, 99, 37, 45])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
          >
            Default 4
          </button>
          <button
            onClick={() => resetLinkedListPreset([10, 20, 30, 40, 50, 60])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
          >
            Sorted 6
          </button>
          <button
            onClick={() => resetLinkedListPreset([])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
          >
            Empty
          </button>
          <button
            onClick={() => resetLinkedListPreset()}
            className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)]"
            title="Reset List"
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
              onClick={stepBackwardLinkedList}
              disabled={currentLinkedListStepIndex === 0}
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
              onClick={stepForwardLinkedList}
              disabled={currentLinkedListStepIndex >= totalSteps - 1}
              className="p-1 rounded border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-secondary)]"
              title="Step Forward (→)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums min-w-[70px]">
            {currentLinkedListStepIndex} / {totalSteps - 1}
          </span>

          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentLinkedListStepIndex}
            onChange={(e) => seekLinkedListStep(Number(e.target.value))}
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

