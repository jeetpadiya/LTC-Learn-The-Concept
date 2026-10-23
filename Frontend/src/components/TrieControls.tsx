"use client";

import React, { useState, useEffect } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import {
  Plus,
  Trash2,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Compass,
} from "lucide-react";

export default function TrieControls() {
  const {
    trieSteps,
    currentTrieStepIndex,
    insertIntoTrie,
    searchInTrie,
    startsWithTrie,
    autocompleteTrie,
    deleteFromTrie,
    resetTriePreset,
    seekTrieStep,
    stepForwardTrie,
    stepBackwardTrie,
    isPlaying,
    togglePlay,
  } = useVisualizerStore();

  const [inputWord, setInputWord] = useState("cart");

  const totalSteps = trieSteps.length;
  const currentStep = trieSteps[currentTrieStepIndex] || trieSteps[0];
  const pct = totalSteps > 1 ? (currentTrieStepIndex / (totalSteps - 1)) * 100 : 0;

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForwardTrie();
      }, 700);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepForwardTrie]);

  const handleInsert = () => {
    const w = inputWord.trim();
    if (w) insertIntoTrie(w);
  };

  const handleSearch = () => {
    const w = inputWord.trim();
    if (w) searchInTrie(w);
  };

  const handleStartsWith = () => {
    const w = inputWord.trim();
    if (w) startsWithTrie(w);
  };

  const handleAutocomplete = () => {
    const w = inputWord.trim();
    if (w) autocompleteTrie(w);
  };

  const handleDelete = () => {
    const w = inputWord.trim();
    if (w) deleteFromTrie(w);
  };

  return (
    <div className="shrink-0 flex flex-col gap-2 p-3 bg-[var(--bg-surface)] border-t border-[var(--border-color)] text-xs select-none">
      {/* Upper Action Row: Operations, Inputs, Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Operations & Inputs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Word Input */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[var(--text-muted)]">Word:</span>
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value.toLowerCase())}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              className="w-20 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] text-center lowercase"
              placeholder="cart"
            />
          </div>

          {/* Insert Word */}
          <button
            onClick={handleInsert}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--accent)] hover:opacity-90 text-white font-medium text-xs shadow-xs transition-opacity"
            title="Insert word into Trie (O(L))"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert</span>
          </button>

          {/* Search Exact Word */}
          <button
            onClick={handleSearch}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium text-xs transition-colors"
            title="Search for complete word in Trie (O(L))"
          >
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Search</span>
          </button>

          {/* Prefix Search (startsWith) */}
          <button
            onClick={handleStartsWith}
            className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-colors"
            title="Check if any word starts with this prefix (O(P))"
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Starts With</span>
          </button>

          {/* Autocomplete */}
          <button
            onClick={handleAutocomplete}
            className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-colors"
            title="Gather all words in subtree completing this prefix"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Autocomplete</span>
          </button>

          {/* Delete Word */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-colors"
            title="Unmark word and prune unreferenced character nodes"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Presets:</span>
          <button
            onClick={() => resetTriePreset(["cat", "car", "cart", "dog", "dot"])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[10px] font-mono text-[var(--text-secondary)] transition-colors"
            title="Common animal prefix overlaps"
          >
            Animals (5)
          </button>

          <button
            onClick={() => resetTriePreset(["code", "coder", "codec", "cpu"])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[10px] font-mono text-[var(--text-secondary)] transition-colors"
            title="Tech coding vocabulary"
          >
            Tech (4)
          </button>

          <button
            onClick={() => resetTriePreset(["tree", "trie", "try"])}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[10px] font-mono text-[var(--text-secondary)] transition-colors"
            title="Words sharing 'tr' prefix"
          >
            Tr-Words (3)
          </button>
        </div>
      </div>

      {/* Playback Controls & Progress Scrubber */}
      <div className="flex items-center gap-3 pt-1 border-t border-[var(--border-color)] flex-wrap">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={stepBackwardTrie}
            disabled={currentTrieStepIndex <= 0}
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
            onClick={stepForwardTrie}
            disabled={currentTrieStepIndex >= totalSteps - 1}
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
            value={currentTrieStepIndex}
            onChange={(e) => seekTrieStep(parseInt(e.target.value, 10))}
            className="flex-1 h-1.5 bg-[var(--bg-raised)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
          />
          <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0 tabular-nums">
            {currentTrieStepIndex + 1}/{totalSteps}
          </span>
        </div>
      </div>
    </div>
  );
}

