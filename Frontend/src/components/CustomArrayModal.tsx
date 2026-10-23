"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { ALGORITHMS } from "@/lib/algorithms";
import {
  X,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Hash,
} from "lucide-react";

export default function CustomArrayModal() {
  const {
    isCustomModalOpen,
    closeCustomModal,
    applyCustomArray,
    array,
    selectedTopic,
  } = useVisualizerStore();

  const algorithm = ALGORITHMS[selectedTopic];

  // Local state for the input values
  const [textInput, setTextInput] = useState("");
  const [singleValueInput, setSingleValueInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync with current store array whenever modal opens
  useEffect(() => {
    if (isCustomModalOpen) {
      setTextInput(array.join(", "));
      setErrorMsg(null);
    }
  }, [isCustomModalOpen, array]);

  // Parse text input into numbers
  const parsedNumbers = useMemo(() => {
    if (!textInput.trim()) return [];
    return textInput
      .split(/[, \t\n]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }, [textInput]);

  const maxVal = useMemo(
    () => Math.max(...parsedNumbers, 1),
    [parsedNumbers]
  );

  // Add a single number to the list
  const handleAddSingle = () => {
    const val = parseInt(singleValueInput.trim(), 10);
    if (isNaN(val) || val <= 0) {
      setErrorMsg("Please enter a positive whole number.");
      return;
    }
    if (parsedNumbers.length >= 24) {
      setErrorMsg("Maximum limit is 24 elements for clean visualization.");
      return;
    }

    const next = [...parsedNumbers, val];
    setTextInput(next.join(", "));
    setSingleValueInput("");
    setErrorMsg(null);
  };

  // Remove a specific number by index
  const handleRemoveChip = (idxToRemove: number) => {
    const next = parsedNumbers.filter((_, idx) => idx !== idxToRemove);
    setTextInput(next.join(", "));
    setErrorMsg(null);
  };

  // Apply educational presets
  const applyPresetTemplate = (type: "reversed" | "nearly" | "duplicates" | "small" | "random") => {
    let template: number[] = [];
    if (type === "reversed") {
      template = [90, 75, 60, 45, 35, 25, 15, 5];
    } else if (type === "nearly") {
      template = [10, 20, 25, 45, 40, 60, 75, 90]; // 45 & 40 out of order
    } else if (type === "duplicates") {
      template = [30, 70, 30, 90, 70, 15, 30, 50];
    } else if (type === "small") {
      template = [4, 9, 2, 7, 5, 8, 1, 6];
    } else if (type === "random") {
      template = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 10);
    }
    setTextInput(template.join(", "));
    setErrorMsg(null);
  };

  // Submit and run the algorithm
  const handleSubmit = () => {
    if (parsedNumbers.length < 3) {
      setErrorMsg("Please enter at least 3 numbers to see algorithm steps.");
      return;
    }
    if (parsedNumbers.length > 24) {
      setErrorMsg("Maximum 24 elements allowed for optimal 3D stage clarity.");
      return;
    }
    // Check for any negative numbers
    if (parsedNumbers.some((n) => n <= 0)) {
      setErrorMsg("All numbers must be positive integers (> 0).");
      return;
    }

    applyCustomArray(parsedNumbers);
  };

  if (!isCustomModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold text-xs">
              <Hash className="w-3.5 h-3.5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] leading-none">
                Input Your Own Numbers
              </h3>
              <span className="text-[11px] text-[var(--text-muted)]">
                Algorithm: {algorithm?.name}
              </span>
            </div>
          </div>

          <button
            onClick={closeCustomModal}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Educational Templates */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
            Quick Templates
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => applyPresetTemplate("nearly")}
              className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)] transition-colors"
            >
              Nearly Sorted
            </button>
            <button
              onClick={() => applyPresetTemplate("reversed")}
              className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)] transition-colors"
            >
              Worst Case (Reverse)
            </button>
            <button
              onClick={() => applyPresetTemplate("duplicates")}
              className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)] transition-colors"
            >
              With Duplicates
            </button>
            <button
              onClick={() => applyPresetTemplate("small")}
              className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)] transition-colors"
            >
              Single Digits (1-9)
            </button>
            <button
              onClick={() => applyPresetTemplate("random")}
              className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)] transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[var(--accent)]" /> Random 8
            </button>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <label className="font-semibold text-[var(--text-primary)]">
              Enter Numbers (comma or space separated):
            </label>
            <span className="font-mono text-[var(--text-muted)]">
              {parsedNumbers.length} / 24 items
            </span>
          </div>

          <textarea
            rows={2}
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="e.g. 45, 12, 89, 23, 67, 5, 34"
            className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-raised)] font-mono text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Single Element Adder */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="999"
            value={singleValueInput}
            onChange={(e) => setSingleValueInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSingle()}
            placeholder="Add value..."
            className="w-28 p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] font-mono text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
          <button
            onClick={handleAddSingle}
            className="px-2.5 py-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
          <button
            onClick={() => {
              setTextInput("");
              setErrorMsg(null);
            }}
            className="px-2 py-1.5 rounded text-xs text-[var(--text-muted)] hover:text-red-600 transition-colors ml-auto"
          >
            Clear All
          </button>
        </div>

        {/* Interactive Chip List */}
        {parsedNumbers.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-[var(--text-muted)]">
              Current Array Elements:
            </span>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)]">
              {parsedNumbers.map((num, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-strong)] font-mono text-xs font-semibold text-[var(--text-primary)]"
                >
                  <span>{num}</span>
                  <button
                    onClick={() => handleRemoveChip(idx)}
                    className="text-[var(--text-muted)] hover:text-red-500 ml-0.5"
                    title="Remove item"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Miniature Bar Preview */}
        {parsedNumbers.length > 0 && (
          <div className="flex flex-col gap-1 p-2 rounded border border-[var(--border-color)] bg-[var(--bg-raised)]">
            <span className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
              Stage Preview (Relative Heights)
            </span>
            <div className="h-12 flex items-end justify-center gap-1 px-2 pb-1">
              {parsedNumbers.map((val, idx) => {
                const heightPct = Math.max(15, (val / maxVal) * 100);
                return (
                  <div
                    key={idx}
                    className="flex-1 bg-[var(--accent)] rounded-xs transition-all max-w-[20px]"
                    style={{ height: `${heightPct}%` }}
                    title={`[${idx}] = ${val}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
          <button
            onClick={closeCustomModal}
            className="px-3 py-1.5 rounded border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={parsedNumbers.length < 3}
            className="px-4 py-1.5 rounded bg-[var(--accent)] disabled:opacity-50 text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 transition-opacity"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Sort My Numbers ({parsedNumbers.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

