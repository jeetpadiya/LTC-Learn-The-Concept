"use client";

import React, { useState } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { ArrayPreset } from "@/types/visualizer";
import {
  Shuffle,
  Edit3,
  Sun,
  Moon,
  X,
  Check,
  BookOpen,
} from "lucide-react";

export default function TopBar() {
  const {
    selectedTopic,
    theme,
    toggleTheme,
    inputPreset,
    arraySize,
    customInputStr,
    setArrayPreset,
    isPredictMode,
    togglePredictMode,
    isCompareMode,
    toggleCompareMode,
    showInlineQuiz,
    setShowInlineQuiz,
    isBackendOnline,
    openCustomModal,
    openCheatSheet,
  } = useVisualizerStore();

  const isTree = selectedTopic === "bst";
  const isGraph = selectedTopic === "graph";
  const isLinkedList = selectedTopic === "linkedlist";
  const isStackQueue = selectedTopic === "stackqueue";
  const isArray = selectedTopic === "array";
  const isHeap = selectedTopic === "heap";
  const isHashTable = selectedTopic === "hashtable";
  const isTrie = selectedTopic === "trie";
  const isStructure = isTree || isGraph || isLinkedList || isStackQueue || isArray || isHeap || isHashTable || isTrie;

  // Filled track percentage for N slider
  const nPct = ((arraySize - 5) / (24 - 5)) * 100;

  return (
    <header className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2 shrink-0 select-none">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* GROUP 1: LEFT DATA */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-1.5 font-bold text-sm tracking-tight text-[var(--text-primary)]">
            <span className="w-5 h-5 rounded-sm bg-[var(--accent)] text-white text-[11px] font-mono flex items-center justify-center font-black">
              L
            </span>
            <span>LTC</span>
          </div>

          <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />

          {isTree ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="font-semibold text-[var(--text-primary)]">3D Binary Search Tree (BST)</span>
              <span className="text-[var(--text-muted)] text-[11px] hidden sm:inline">• Left Drag: Rotate 360° | Operations below</span>
            </div>
          ) : isGraph ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="font-semibold text-[var(--text-primary)]">3D Network Graph</span>
              <span className="text-[var(--text-muted)] text-[11px] hidden sm:inline">• BFS, DFS & Dijkstra | 360° OrbitControls</span>
            </div>
          ) : isLinkedList ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="font-semibold text-[var(--text-primary)]">Linked List Visualizer</span>
              <span className="text-[var(--text-muted)] text-[11px] hidden sm:inline">• Singly & Doubly Linked | Pointer Memory Operations</span>
            </div>
          ) : isStackQueue ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="font-semibold text-[var(--text-primary)]">Stack & Queue Visualizer</span>
              <span className="text-[var(--text-muted)] text-[11px] hidden sm:inline">• LIFO Stack Chamber & FIFO Queue Pipeline</span>
            </div>
          ) : isArray ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="font-semibold text-[var(--text-primary)]">Array & Dynamic Array</span>
              <span className="text-[var(--text-muted)] text-[11px] hidden sm:inline">• Contiguous Memory & 2× Capacity Doubling</span>
            </div>
          ) : isHeap ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="font-semibold text-[var(--text-primary)]">Binary Heap & Priority Queue</span>
              <span className="text-[var(--text-muted)] text-[11px] hidden sm:inline">• Complete Binary Tree & Contiguous Array Mapping</span>
            </div>
          ) : isHashTable ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="font-semibold text-[var(--text-primary)]">Hash Table & Collisions</span>
              <span className="text-[var(--text-muted)] text-[11px] hidden sm:inline">• Separate Chaining, Linear Probing & 2× Rehashing</span>
            </div>
          ) : isTrie ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="font-semibold text-[var(--text-primary)]">Trie (Prefix Tree)</span>
              <span className="text-[var(--text-muted)] text-[11px] hidden sm:inline">• Prefix Compression & Live Autocomplete</span>
            </div>
          ) : (
            <>
              {/* Preset Segmented Control */}
              <div className="flex rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5 text-xs">
                {(["random", "sorted", "reversed", "few-unique"] as ArrayPreset[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setArrayPreset(preset)}
                    className={`px-2.5 py-1 rounded text-[11px] capitalize transition-colors ${
                      inputPreset === preset
                        ? "bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)] shadow-2xs"
                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    {preset === "few-unique" ? "Few Unique" : preset}
                  </button>
                ))}
                <button
                  onClick={openCustomModal}
                  className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1 transition-colors ${
                    inputPreset === "custom"
                      ? "bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)] shadow-2xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                  title="Input your own numbers"
                >
                  <Edit3 className="w-3 h-3 text-[var(--accent)]" />
                  <span>Enter Values...</span>
                </button>
              </div>

              {/* N Slider with visible filled track and value readout */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-xs">
                <span className="text-[11px] text-[var(--text-muted)]">N:</span>
                <input
                  type="range"
                  min={5}
                  max={24}
                  value={arraySize}
                  onChange={(e) => setArrayPreset(inputPreset, Number(e.target.value))}
                  className="w-18"
                  style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${nPct}%, var(--border-color) ${nPct}%, var(--border-color) 100%)`,
                  }}
                  title="Number of elements"
                />
                <span className="font-mono text-[11px] font-semibold text-[var(--text-primary)] w-5 text-right tabular-nums">
                  {arraySize}
                </span>
              </div>

              {/* Shuffle / Randomize Button */}
              <button
                onClick={() => setArrayPreset(inputPreset)}
                className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] transition-colors"
                title="Randomize array"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* GROUP 2: RIGHT MODES */}
        <div className="flex items-center gap-3">
          {/* Segmented Mode Tabs: Predict, Compare, Quiz */}
          <div className="flex rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5 text-xs">
            {!isStructure && (
              <>
                <button
                  onClick={togglePredictMode}
                  className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                    isPredictMode
                      ? "bg-[var(--bg-surface)] font-semibold text-amber-700 dark:text-amber-400 shadow-2xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  Predict
                </button>

                <button
                  onClick={toggleCompareMode}
                  className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                    isCompareMode
                      ? "bg-[var(--bg-surface)] font-semibold text-[var(--accent)] shadow-2xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  Compare
                </button>
              </>
            )}

            <button
              onClick={() => setShowInlineQuiz(!showInlineQuiz)}
              className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                showInlineQuiz
                  ? "bg-[var(--bg-surface)] font-semibold text-emerald-700 dark:text-emerald-400 shadow-2xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Quiz
            </button>

            <button
              onClick={openCheatSheet}
              className="px-2.5 py-1 rounded text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
              title="Open Comprehensive DSA Cheat Sheet & Complexity Matrix"
            >
              <BookOpen className="w-3 h-3 text-[var(--accent)]" />
              <span>Cheat Sheet</span>
            </button>
          </div>

          <div className="h-4 w-px bg-[var(--border-color)]" />

          {/* Backend Status: Small Dot + Tooltip (Not a button!) */}
          <div
            className="flex items-center gap-1.5 cursor-help"
            title={
              isBackendOnline
                ? "C++ Engine (Crow): Online at localhost:18080"
                : "C++ Engine: Offline (using local trace generator)"
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendOnline ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"
              }`}
            />
            <span className="text-[10px] font-mono text-[var(--text-muted)] hidden lg:inline">
              {isBackendOnline ? "C++ Live" : "Local"}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
