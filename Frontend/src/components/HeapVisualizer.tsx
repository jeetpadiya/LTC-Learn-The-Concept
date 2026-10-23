"use client";

import React, { useState } from "react";
import { HeapNode, HeapType } from "@/types/visualizer";
import { ThemeMode } from "@/styles/tokens";
import { Binary, Layers, ArrowDownUp, Check, Info } from "lucide-react";

interface HeapVisualizerProps {
  nodes: HeapNode[];
  array: number[];
  heapType: HeapType;
  operation: string;
  activeIndices?: number[];
  swappedIndices?: [number, number];
  theme: ThemeMode;
}

export default function HeapVisualizer({
  nodes,
  array,
  heapType,
  operation,
  activeIndices = [],
  swappedIndices,
  theme,
}: HeapVisualizerProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const n = array.length;
  const rootVal = n > 0 ? array[0] : null;
  const treeHeight = n > 0 ? Math.floor(Math.log2(n)) : 0;

  // Build SVG parent-to-child connector lines
  const lines: { x1: number; y1: number; x2: number; y2: number; isHot: boolean; key: string }[] = [];
  nodes.forEach((node) => {
    if (node.parentIndex !== null) {
      const parentNode = nodes[node.parentIndex];
      if (parentNode) {
        const isSwapping =
          swappedIndices &&
          ((swappedIndices[0] === node.index && swappedIndices[1] === parentNode.index) ||
            (swappedIndices[1] === node.index && swappedIndices[0] === parentNode.index));
        const isComparing =
          activeIndices.includes(node.index) && activeIndices.includes(parentNode.index);

        lines.push({
          x1: parentNode.x,
          y1: parentNode.y,
          x2: node.x,
          y2: node.y,
          isHot: Boolean(isSwapping || isComparing),
          key: `line-${parentNode.index}-${node.index}`,
        });
      }
    }
  });

  const getNodeStyles = (node: HeapNode) => {
    const isHovered = hoveredIndex === node.index;
    const isSwapping =
      node.state === "swapping" ||
      (swappedIndices && (swappedIndices[0] === node.index || swappedIndices[1] === node.index));
    const isComparing = node.state === "comparing" || (activeIndices.includes(node.index) && !isSwapping);
    const isNew = node.state === "new";
    const isSettled = node.state === "settled";
    const isActive = node.state === "active";

    if (isSwapping) {
      return {
        bg: "bg-red-500/20 dark:bg-red-950/40",
        border: "border-red-500",
        text: "text-red-600 dark:text-red-400 font-bold",
        ring: "ring-2 ring-red-500/50 scale-105",
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
    if (isNew) {
      return {
        bg: "bg-emerald-500/20 dark:bg-emerald-950/40",
        border: "border-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400 font-bold",
        ring: "ring-2 ring-emerald-500/50 scale-105",
      };
    }
    if (isSettled) {
      return {
        bg: "bg-green-500/10 dark:bg-green-950/30",
        border: "border-green-500/60",
        text: "text-green-600 dark:text-green-400 font-semibold",
        ring: "",
      };
    }
    if (isActive) {
      return {
        bg: "bg-blue-500/20 dark:bg-blue-950/40",
        border: "border-blue-500",
        text: "text-blue-600 dark:text-blue-400 font-bold",
        ring: "ring-2 ring-blue-500/40",
      };
    }
    if (isHovered) {
      return {
        bg: "bg-[var(--bg-raised)]",
        border: "border-[var(--accent)]",
        text: "text-[var(--text-primary)] font-bold",
        ring: "ring-1 ring-[var(--accent)]",
      };
    }

    return {
      bg: "bg-[var(--bg-surface)]",
      border: "border-[var(--border-strong)]",
      text: "text-[var(--text-primary)] font-medium",
      ring: "",
    };
  };

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[var(--bg-canvas)] border border-[var(--border-color)] rounded-t-md overflow-hidden select-none">
      {/* Top Heap Stats & Mapping Formula Bar */}
      <div className="shrink-0 px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Heap Type Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] font-mono text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                heapType === "min" ? "bg-amber-500" : "bg-blue-500"
              }`}
            />
            <span className="font-bold uppercase tracking-wide text-[var(--text-primary)]">
              {heapType === "min" ? "Min-Heap" : "Max-Heap"}
            </span>
            <span className="text-[var(--text-muted)] text-[10px]">
              ({heapType === "min" ? "root = min" : "root = max"})
            </span>
          </div>

          {/* Size & Root Value */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[var(--text-muted)] text-[11px]">Size (n):</span>
            <span className="font-bold text-sm text-[var(--text-primary)] tabular-nums">{n}</span>
          </div>

          {rootVal !== null && (
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[var(--text-muted)] text-[11px]">Root (Top):</span>
              <span className="font-bold text-sm text-[var(--accent)] tabular-nums">{rootVal}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 font-mono hidden md:flex">
            <span className="text-[var(--text-muted)] text-[11px]">Height (h):</span>
            <span className="font-bold text-xs text-[var(--text-primary)] tabular-nums">
              {treeHeight} (⌊log₂ {n || 1}⌋)
            </span>
          </div>
        </div>

        {/* Contiguous Array Mapping Formulas */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)] bg-[var(--bg-raised)] px-2.5 py-1 rounded border border-[var(--border-color)]">
          <Binary className="w-3 h-3 text-[var(--accent)] shrink-0" />
          <span>
            parent = <span className="text-[var(--text-primary)] font-semibold">⌊(i-1)/2⌋</span>
          </span>
          <span>•</span>
          <span>
            left = <span className="text-[var(--text-primary)] font-semibold">2i + 1</span>
          </span>
          <span>•</span>
          <span>
            right = <span className="text-[var(--text-primary)] font-semibold">2i + 2</span>
          </span>
        </div>
      </div>

      {/* Main Visualizer Stage: Split View (Tree Above, Array Below) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* UPPER PORTION: Complete Binary Tree Visualizer */}
        <div className="flex-1 relative w-full min-h-[180px] overflow-hidden flex items-center justify-center p-2">
          {n === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 text-center p-6 text-[var(--text-muted)]">
              <Layers className="w-8 h-8 opacity-40" />
              <p className="text-xs font-semibold">Heap is currently empty.</p>
              <p className="text-[11px]">Click "Insert" or load a preset below to populate the heap.</p>
            </div>
          ) : (
            <div className="relative w-full h-full max-w-4xl max-h-[300px]">
              {/* SVG Connector Lines */}
              <svg
                viewBox="0 0 800 300"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid meet"
              >
                {lines.map((line) => (
                  <line
                    key={line.key}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={line.isHot ? "#f59e0b" : "var(--border-strong)"}
                    strokeWidth={line.isHot ? "2.5" : "1.5"}
                    strokeDasharray={line.isHot ? "4 2" : "none"}
                    className="transition-all duration-300"
                  />
                ))}
              </svg>

              {/* Tree Node Circles */}
              <svg
                viewBox="0 0 800 300"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Visual rendering via positioned HTML elements in parent container */}
              </svg>

              <div className="absolute inset-0 w-full h-full">
                {nodes.map((node) => {
                  const style = getNodeStyles(node);
                  // Calculate percentage coordinates matching 800x300 viewBox
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
                      onMouseEnter={() => setHoveredIndex(node.index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`absolute w-10 h-10 rounded-full border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${style.bg} ${style.border} ${style.ring}`}
                      title={`Index [${node.index}] | Value: ${node.val} | Parent: ${
                        node.parentIndex !== null ? `[${node.parentIndex}]` : "none (root)"
                      }`}
                    >
                      <span className={`text-xs ${style.text}`}>{node.val}</span>
                      {/* Floating Index Chip */}
                      <span className="absolute -bottom-4 text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-canvas)] px-1 rounded border border-[var(--border-color)]">
                        {node.index}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* LOWER PORTION: Underlying Contiguous Array Memory */}
        <div className="shrink-0 p-3 border-t border-[var(--border-color)] bg-[var(--bg-raised)] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5 font-semibold">
              <Binary className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Contiguous Array Representation</span>
              <span className="text-[var(--text-muted)] font-normal text-[10px]">
                (Zero pointer overhead • Linear storage)
              </span>
            </div>

            {hoveredIndex !== null && hoveredIndex < n && (
              <div className="text-[10px] text-[var(--accent)] font-semibold flex items-center gap-2">
                <span>Selected [{hoveredIndex}]:</span>
                <span>Parent: {hoveredIndex === 0 ? "Root" : `[${Math.floor((hoveredIndex - 1) / 2)}]`}</span>
                <span>Left: {2 * hoveredIndex + 1 < n ? `[${2 * hoveredIndex + 1}]` : "None"}</span>
                <span>Right: {2 * hoveredIndex + 2 < n ? `[${2 * hoveredIndex + 2}]` : "None"}</span>
              </div>
            )}
          </div>

          {/* Contiguous Array Slot Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
            {array.map((val, idx) => {
              const node = nodes[idx];
              const style = node ? getNodeStyles(node) : { bg: "", border: "", text: "", ring: "" };
              const isRoot = idx === 0;

              return (
                <div
                  key={`arr-${idx}-${val}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex flex-col items-center justify-between min-w-[54px] h-14 p-1 rounded border transition-all duration-200 cursor-pointer ${
                    style.bg || "bg-[var(--bg-surface)]"
                  } ${style.border || "border-[var(--border-color)]"} ${style.ring}`}
                >
                  {/* Top Index */}
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">[{idx}]</span>

                  {/* Value */}
                  <span className={`text-xs font-mono font-bold ${style.text || "text-[var(--text-primary)]"}`}>
                    {val}
                  </span>

                  {/* Role Chip */}
                  <span
                    className={`text-[8px] font-mono uppercase px-1 rounded ${
                      isRoot
                        ? "bg-[var(--accent)] text-white font-bold"
                        : "bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)]"
                    }`}
                  >
                    {isRoot ? "ROOT" : idx % 2 === 1 ? "LEFT" : "RIGHT"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

