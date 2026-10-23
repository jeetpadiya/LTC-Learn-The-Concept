"use client";

import React from "react";
import { ArrayVisualCell, ArrayVisualMode } from "@/types/visualizer";
import { getTokens, ThemeMode } from "@/styles/tokens";
import { ArrowDown, Copy, HardDrive, RefreshCw } from "lucide-react";

interface DynamicArrayVisualizerProps {
  cells: ArrayVisualCell[];
  oldCells?: ArrayVisualCell[];
  size: number;
  capacity: number;
  mode: ArrayVisualMode;
  operation: string;
  targetIndex?: number;
  theme: ThemeMode;
}

export default function DynamicArrayVisualizer({
  cells,
  oldCells,
  size,
  capacity,
  mode,
  operation,
  targetIndex,
  theme,
}: DynamicArrayVisualizerProps) {
  const tokens = getTokens(theme);
  const isResize = operation === "resize" && oldCells && oldCells.length > 0;
  const occupancyPct = capacity > 0 ? Math.min(100, Math.round((size / capacity) * 100)) : 0;

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[var(--bg-canvas)] border border-[var(--border-color)] rounded-t-md overflow-hidden select-none">
      {/* Top Memory & Capacity Stat Bar */}
      <div className="shrink-0 px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[var(--text-muted)] text-[11px]">Size (n):</span>
            <span className="font-bold text-sm text-[var(--text-primary)] tabular-nums">{size}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[var(--text-muted)] text-[11px]">Capacity (C):</span>
            <span className="font-bold text-sm text-[var(--accent)] tabular-nums">{capacity}</span>
          </div>

          {/* Occupancy Bar */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 rounded-full bg-[var(--bg-raised)] border border-[var(--border-color)] overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  size === capacity
                    ? "bg-amber-500"
                    : "bg-[var(--accent)]"
                }`}
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-secondary)] tabular-nums">
              {occupancyPct}% full
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
          <span>Mode: </span>
          <span className="font-bold uppercase text-[var(--text-primary)]">{mode}</span>
          <span>• Amortized Append: </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">O(1)</span>
        </div>
      </div>

      {/* Main Memory Buffer Stage */}
      <div className="flex-1 w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 overflow-auto">
        {isResize ? (
          /* ================================================= */
          /* 2x CAPACITY RESIZE VIEW: Old vs New Heap Block   */
          /* ================================================= */
          <div className="flex flex-col items-center gap-4 w-full max-w-4xl py-4">
            {/* 1. Old Buffer (Full) */}
            <div className="flex flex-col items-center gap-1 opacity-70">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                <span>Old Buffer (0x2000) • Capacity: {oldCells.length} (Full - Deprecated)</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto p-2 bg-[var(--bg-raised)]/40 rounded border border-[var(--border-color)]">
                {oldCells.map((c) => (
                  <div key={c.id} className="flex flex-col items-center gap-1 shrink-0">
                    <span className="font-mono text-[9px] text-[var(--text-muted)]">{c.address}</span>
                    <div className="w-14 h-12 rounded border border-[var(--border-strong)] bg-[var(--bg-surface)] flex items-center justify-center font-mono font-bold text-sm text-[var(--text-muted)] line-through">
                      {c.val}
                    </div>
                    <span className="font-mono text-[9px] text-[var(--text-muted)]">[{c.index}]</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Downward Copy Arrows */}
            <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold animate-pulse">
              <ArrowDown className="w-4 h-4" />
              <span>Copying existing elements to 2× contiguous heap memory...</span>
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* 2. New 2x Buffer */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-primary)] font-semibold">
                <RefreshCw className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>New Buffer (0x5000) • Capacity: {capacity} (Double Headroom)</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto p-2 bg-[var(--bg-surface)] rounded border-2 border-[var(--accent)] shadow-xs">
                {cells.map((c) => {
                  const isCopying = c.state === "copying";
                  const isNew = c.state === "new";

                  return (
                    <div key={c.id} className="flex flex-col items-center gap-1 shrink-0">
                      <span className="font-mono text-[9px] text-[var(--text-muted)]">{c.address}</span>
                      <div
                        className={`w-14 h-12 rounded border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 ${
                          isCopying
                            ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400 shadow-xs scale-105"
                            : isNew
                            ? "border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-400 font-black shadow-xs"
                            : c.isReserved
                            ? "border-dashed border-[var(--border-color)] bg-[var(--bg-raised)]/30 text-[var(--text-muted)]"
                            : "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                        }`}
                      >
                        {c.val !== null ? c.val : "•"}
                      </div>
                      <span className="font-mono text-[9px] text-[var(--text-muted)]">[{c.index}]</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ================================================= */
          /* STANDARD CONTIGUOUS MEMORY ARRAY VIEW            */
          /* ================================================= */
          <div className="flex flex-col items-center gap-4 w-full max-w-4xl py-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
              <HardDrive className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Contiguous Heap Memory Block (Base Address: 0x2000)</span>
            </div>

            {/* Contiguous Array Cells Row */}
            <div className="flex items-center gap-2 overflow-x-auto p-3 bg-[var(--bg-raised)]/40 rounded-md border border-[var(--border-color)] max-w-full">
              {cells.map((cell) => {
                const isTarget = cell.index === targetIndex;
                let borderStyle = "border-[var(--border-color)]";
                let bgStyle = "bg-[var(--bg-surface)]";
                let textStyle = "text-[var(--text-primary)]";

                if (cell.state === "active" || isTarget) {
                  borderStyle = "border-amber-500 shadow-xs scale-105";
                  bgStyle = "bg-amber-500/15";
                  textStyle = "text-amber-700 dark:text-amber-400 font-bold";
                } else if (cell.state === "new") {
                  borderStyle = "border-blue-500 shadow-xs";
                  bgStyle = "bg-blue-500/15";
                  textStyle = "text-blue-700 dark:text-blue-400 font-bold";
                } else if (cell.state === "shifting") {
                  borderStyle = "border-purple-500 border-dashed animate-pulse";
                  bgStyle = "bg-purple-500/15";
                  textStyle = "text-purple-700 dark:text-purple-400 font-bold";
                } else if (cell.isReserved) {
                  borderStyle = "border-dashed border-[var(--border-strong)]";
                  bgStyle = "bg-[var(--bg-surface)]/40";
                  textStyle = "text-[var(--text-muted)]";
                }

                return (
                  <div key={cell.id} className="flex flex-col items-center gap-1 shrink-0">
                    {/* Simulated Byte Memory Address */}
                    <span className="font-mono text-[9px] text-[var(--text-muted)] tabular-nums">
                      {cell.address}
                    </span>

                    {/* Array Cell */}
                    <div
                      className={`w-14 h-12 rounded border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 shadow-2xs ${borderStyle} ${bgStyle} ${textStyle}`}
                    >
                      {cell.val !== null ? cell.val : "empty"}
                    </div>

                    {/* Array Index Marker */}
                    <span className="font-mono text-[9px] text-[var(--text-muted)]">
                      [{cell.index}]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Legend Bar */}
      <div className="w-full bg-[var(--bg-surface)] border-t border-[var(--border-color)] px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] gap-3 select-none">
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.defaultBar }}
            />
            <span>Populated Element</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span className="w-2.5 h-2.5 rounded-sm border border-dashed border-[var(--border-strong)] bg-transparent" />
            <span>Reserved Headroom</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.compare }}
            />
            <span>Active / Access / Copying</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.pivot }}
            />
            <span>New Append</span>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          Contiguous Pointer Formula: address = base + index × 4 bytes
        </span>
      </div>
    </div>
  );
}

