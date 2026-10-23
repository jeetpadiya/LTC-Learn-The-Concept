"use client";

import React, { useState } from "react";
import { TrieNodeVisual } from "@/types/visualizer";
import { ThemeMode } from "@/styles/tokens";
import { Network, BookOpen, Sparkles, Check, Search, Tag } from "lucide-react";

interface TrieVisualizerProps {
  nodes: Record<string, TrieNodeVisual>;
  wordList: string[];
  operation: string;
  activeNodeId?: string;
  activeChar?: string;
  charIndex?: number;
  targetWord?: string;
  suggestions?: string[];
  theme: ThemeMode;
}

export default function TrieVisualizer({
  nodes,
  wordList,
  operation,
  activeNodeId,
  activeChar,
  charIndex,
  targetWord,
  suggestions = [],
  theme,
}: TrieVisualizerProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const nodeArray = Object.values(nodes);
  const totalNodes = nodeArray.length;
  const wordCount = wordList.length;

  // Build SVG connector lines between parent and child nodes
  const lines: {
    key: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    char: string;
    isHot: boolean;
  }[] = [];

  nodeArray.forEach((node) => {
    if (node.parentId && nodes[node.parentId]) {
      const parent = nodes[node.parentId];
      const isHot =
        node.id === activeNodeId ||
        parent.id === activeNodeId ||
        node.state === "comparing" ||
        node.state === "found" ||
        node.state === "active";

      lines.push({
        key: `line-${parent.id}-${node.id}`,
        x1: parent.x,
        y1: parent.y,
        x2: node.x,
        y2: node.y,
        char: node.char,
        isHot,
      });
    }
  });

  const getNodeStyles = (node: TrieNodeVisual) => {
    const isHovered = hoveredNodeId === node.id;
    const isCurrentActive = node.id === activeNodeId;
    const isComparing = node.state === "comparing";
    const isInserted = node.state === "inserted";
    const isFound = node.state === "found";
    const isNotFound = node.state === "not_found";
    const isTerminal = node.isEndOfWord;

    if (isFound) {
      return {
        bg: "bg-emerald-500/25 dark:bg-emerald-950/50",
        border: "border-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400 font-black",
        ring: "ring-2 ring-emerald-500/60 scale-110",
      };
    }
    if (isComparing) {
      return {
        bg: "bg-amber-500/20 dark:bg-amber-950/40",
        border: "border-amber-500",
        text: "text-amber-600 dark:text-amber-400 font-bold",
        ring: "ring-2 ring-amber-500/50 scale-105",
      };
    }
    if (isInserted) {
      return {
        bg: "bg-blue-500/20 dark:bg-blue-950/40",
        border: "border-blue-500",
        text: "text-blue-600 dark:text-blue-400 font-bold",
        ring: "ring-2 ring-blue-500/50 scale-105",
      };
    }
    if (isNotFound) {
      return {
        bg: "bg-red-500/20 dark:bg-red-950/40",
        border: "border-red-500",
        text: "text-red-600 dark:text-red-400 font-bold",
        ring: "ring-2 ring-red-500/50",
      };
    }
    if (isCurrentActive) {
      return {
        bg: "bg-[var(--bg-raised)]",
        border: "border-[var(--accent)]",
        text: "text-[var(--text-primary)] font-bold",
        ring: "ring-2 ring-[var(--accent)] scale-105",
      };
    }
    if (isTerminal) {
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-950/20",
        border: "border-emerald-500/80 border-2",
        text: "text-emerald-700 dark:text-emerald-300 font-bold",
        ring: "",
      };
    }
    if (isHovered) {
      return {
        bg: "bg-[var(--bg-raised)]",
        border: "border-[var(--border-strong)]",
        text: "text-[var(--text-primary)] font-bold",
        ring: "ring-1 ring-[var(--accent)]",
      };
    }

    return {
      bg: "bg-[var(--bg-surface)]",
      border: "border-[var(--border-color)]",
      text: "text-[var(--text-primary)] font-medium",
      ring: "",
    };
  };

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[var(--bg-canvas)] border border-[var(--border-color)] rounded-t-md overflow-hidden select-none">
      {/* Top Trie Stat Bar */}
      <div className="shrink-0 px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[var(--text-muted)] text-[11px]">Words (W):</span>
            <span className="font-bold text-sm text-[var(--accent)] tabular-nums">{wordCount}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[var(--text-muted)] text-[11px]">Nodes:</span>
            <span className="font-bold text-sm text-[var(--text-primary)] tabular-nums">{totalNodes}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono hidden sm:flex">
            <span className="text-[var(--text-muted)] text-[11px]">Time Complexity:</span>
            <span className="font-bold text-xs text-[var(--text-primary)]">
              O(L) <span className="text-[10px] text-[var(--text-muted)]">(L = word length)</span>
            </span>
          </div>
        </div>

        {/* Legend / Status Chip */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-emerald-500/20" />
            <span>Word Terminal (isEndOfWord)</span>
          </div>
          {targetWord && (
            <div className="flex items-center gap-1 bg-[var(--bg-raised)] px-2 py-0.5 rounded border border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">Target:</span>
              <span className="font-bold text-[var(--accent)] font-mono">"{targetWord}"</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Trie Tree Canvas */}
      <div className="flex-1 relative w-full min-h-0 overflow-auto p-4 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl max-h-[300px]">
          {/* SVG Connector Lines & Edge Character Labels */}
          <svg
            viewBox="0 0 800 300"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
          >
            {lines.map((line) => {
              const midX = (line.x1 + line.x2) / 2;
              const midY = (line.y1 + line.y2) / 2;

              return (
                <g key={line.key}>
                  <line
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={line.isHot ? "#f59e0b" : "var(--border-strong)"}
                    strokeWidth={line.isHot ? "2.5" : "1.5"}
                    strokeDasharray={line.isHot ? "4 2" : "none"}
                    className="transition-all duration-300"
                  />
                  {/* Small character label pill on branch edge */}
                  <circle cx={midX} cy={midY} r="7" fill="var(--bg-surface)" stroke="var(--border-color)" />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-[var(--text-muted)] font-bold pointer-events-none"
                  >
                    {line.char}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Positioned Node Elements */}
          <div className="absolute inset-0 w-full h-full">
            {nodeArray.map((node) => {
              const isRoot = node.id === "root";
              const style = getNodeStyles(node);
              const leftPct = (node.x / 800) * 100;
              const topPct = (node.y / 300) * 100;

              return (
                <div
                  key={node.id}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`absolute rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isRoot ? "w-11 h-11" : "w-9 h-9"
                  } ${style.bg} ${style.border} ${style.ring}`}
                  title={
                    isRoot
                      ? "Trie Root"
                      : `Char: '${node.char}' | Path: ${node.id.replace("node-", "")} | isEndOfWord: ${node.isEndOfWord}`
                  }
                >
                  <span className={`text-xs font-mono uppercase ${style.text}`}>
                    {isRoot ? "ROOT" : node.char}
                  </span>

                  {/* Terminal Word Indicator Badge */}
                  {node.isEndOfWord && node.word && (
                    <span className="absolute -bottom-4 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-[var(--bg-canvas)] px-1 rounded border border-emerald-500/40 shadow-xs whitespace-nowrap">
                      "{node.word}"
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Dictionary Words & Autocomplete Suggestions Strip */}
      <div className="shrink-0 p-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col gap-2">
        {/* Dictionary Word Bank */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)] uppercase shrink-0">
            <BookOpen className="w-3 h-3 text-[var(--accent)]" />
            <span>Dictionary ({wordList.length}):</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {wordList.length === 0 ? (
              <span className="text-[11px] font-mono text-[var(--text-muted)] italic">
                Dictionary is empty. Insert a word above.
              </span>
            ) : (
              wordList.map((w) => (
                <span
                  key={`dict-${w}`}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                    targetWord === w
                      ? "bg-[var(--accent)] text-white font-bold border-transparent"
                      : "bg-[var(--bg-raised)] text-[var(--text-secondary)] border-[var(--border-color)]"
                  }`}
                >
                  {w}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Live Autocomplete Suggestions (If queried) */}
        {suggestions.length > 0 && (
          <div className="flex items-center gap-2 pt-1.5 border-t border-[var(--border-color)] flex-wrap">
            <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase shrink-0">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Autocomplete ({suggestions.length}):</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {suggestions.map((sug) => (
                <span
                  key={`sug-${sug}`}
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                >
                  {sug}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

