"use client";

import React, { useState } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import {
  ListFilter,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Clock,
} from "lucide-react";

const SORTING_TOPICS = [
  { id: "bubble", title: "Bubble Sort", desc: "Adjacent compare & swap" },
  { id: "selection", title: "Selection Sort", desc: "Find minimum & place" },
  { id: "insertion", title: "Insertion Sort", desc: "Shift & insert into sublist" },
  { id: "quick", title: "Quick Sort", desc: "Divide & conquer partition" },
];

const DATA_STRUCTURE_TOPICS = [
  { id: "array", title: "Array & Dynamic Array", desc: "Contiguous Memory, 2x Doubling, Shifting" },
  { id: "heap", title: "Binary Heap & Priority Queue", desc: "Min/Max Heap, 2i+1 Array Mapping, Sift-Up/Down" },
  { id: "hashtable", title: "Hash Table & Collisions", desc: "Separate Chaining, Linear Probing, Rehashing" },
  { id: "linkedlist", title: "Singly & Doubly Linked List", desc: "Pointers, In-Place Reversal, O(1) Head" },
  { id: "stackqueue", title: "Stack & Queue (LIFO/FIFO)", desc: "Push, Pop, Enqueue, Dequeue Buffers" },
  { id: "bst", title: "Binary Search Tree (BST)", desc: "3D Nodes, Insert, Search, Delete" },
  { id: "graph", title: "Graph: BFS, DFS, Dijkstra", desc: "3D Network, Shortest Path, Relaxations" },
];

const UNRELEASED_STRUCTURES = [
  { id: "trie", title: "Trie (Prefix Tree)" },
];

// Miniature SVG Progress Ring
function ProgressRing({ completed }: { completed: boolean }) {
  return (
    <svg className="w-4 h-4 shrink-0 -rotate-90" viewBox="0 0 20 20">
      <circle
        cx="10"
        cy="10"
        r="7"
        className="stroke-[var(--border-strong)] fill-none"
        strokeWidth="2.5"
      />
      {completed && (
        <circle
          cx="10"
          cy="10"
          r="7"
          className="stroke-emerald-600 fill-none transition-all duration-300"
          strokeWidth="2.5"
          strokeDasharray="44"
          strokeDashoffset="0"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function TopicNav() {
  const {
    selectedTopic,
    setTopic,
    topicProgress,
    setShowInlineQuiz,
    showInlineQuiz,
  } = useVisualizerStore();

  const [sortingOpen, setSortingOpen] = useState(true);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <aside className="w-full h-full flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-color)] select-none">
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Sorting Algorithms Collapsible Group */}
        <div className="flex flex-col">
          <button
            onClick={() => setSortingOpen(!sortingOpen)}
            className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Sorting</span>
            </div>
            {sortingOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {sortingOpen && (
            <div className="mt-1 space-y-0.5">
              {SORTING_TOPICS.map((topic) => {
                const isSelected = selectedTopic === topic.id;
                const isDone = Boolean(topicProgress[topic.id]);

                return (
                  <button
                    key={topic.id}
                    onClick={() => setTopic(topic.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between text-xs transition-colors ${
                      isSelected
                        ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold border border-[var(--accent)]/30"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="flex flex-col pr-1 truncate">
                      <span className="leading-tight truncate">{topic.title}</span>
                      <span className="text-[10px] text-[var(--text-muted)] font-normal truncate">
                        {topic.desc}
                      </span>
                    </div>

                    <ProgressRing completed={isDone} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Data Structures Group (Interactive BST & 3D Graphs Unlocked) */}
        <div className="flex flex-col pt-1 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span>Structures & Networks</span>
            </div>
          </div>

          <div className="mt-1 space-y-0.5">
            {DATA_STRUCTURE_TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              const isDone = Boolean(topicProgress[topic.id]);

              return (
                <button
                  key={topic.id}
                  onClick={() => setTopic(topic.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between text-xs transition-colors ${
                    isSelected
                      ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold border border-[var(--accent)]/30"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div className="flex flex-col pr-1 truncate">
                    <span className="leading-tight truncate">{topic.title}</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-normal truncate">
                      {topic.desc}
                    </span>
                  </div>

                  <ProgressRing completed={isDone} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Group (Single Collapsed Group) */}
        <div className="flex flex-col pt-1 border-t border-[var(--border-color)]">
          <button
            onClick={() => setComingSoonOpen(!comingSoonOpen)}
            className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Coming Soon</span>
            </div>
            {comingSoonOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {comingSoonOpen && (
            <div className="mt-1 space-y-1 px-2.5 py-1 text-[11px] text-[var(--text-muted)]">
              {UNRELEASED_STRUCTURES.map((s) => (
                <div key={s.id} className="py-0.5 truncate flex items-center gap-1.5 opacity-70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-strong)] shrink-0" />
                  <span className="truncate">{s.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Normal, Non-Clipping Footer Row for Topic Mastery Quiz */}
      <div className="shrink-0 p-2.5 border-t border-[var(--border-color)] bg-[var(--bg-raised)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
          <span className="text-xs text-[var(--text-primary)] font-medium truncate">
            Topic Quiz
          </span>
        </div>

        <button
          onClick={() => setShowInlineQuiz(!showInlineQuiz)}
          className="px-2.5 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-semibold text-[var(--text-primary)] transition-colors shrink-0"
        >
          {showInlineQuiz ? "Close" : "Open Quiz"}
        </button>
      </div>
    </aside>
  );
}
