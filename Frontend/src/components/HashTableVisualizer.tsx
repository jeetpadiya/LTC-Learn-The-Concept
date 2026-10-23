"use client";

import React from "react";
import { HashBucket, HashCollisionStrategy } from "@/types/visualizer";
import { ThemeMode } from "@/styles/tokens";
import { ArrowDown, Hash, AlertTriangle, Layers, ArrowRight, ShieldAlert } from "lucide-react";

interface HashTableVisualizerProps {
  buckets: HashBucket[];
  oldBuckets?: HashBucket[];
  capacity: number;
  keyCount: number;
  loadFactor: number;
  strategy: HashCollisionStrategy;
  operation: string;
  activeKey?: number;
  computedHash?: number;
  probeSequence?: number[];
  theme: ThemeMode;
}

export default function HashTableVisualizer({
  buckets,
  oldBuckets,
  capacity,
  keyCount,
  loadFactor,
  strategy,
  operation,
  activeKey,
  computedHash,
  probeSequence = [],
  theme,
}: HashTableVisualizerProps) {
  const isRehashing = operation === "rehash" && oldBuckets && oldBuckets.length > 0;
  const isChaining = strategy === "chaining";
  const isOverThreshold = loadFactor >= 0.75;

  const getLoadFactorColor = (alpha: number) => {
    if (alpha >= 0.75) return "text-red-600 dark:text-red-400";
    if (alpha >= 0.5) return "text-amber-600 dark:text-amber-400";
    return "text-emerald-600 dark:text-emerald-400";
  };

  const getLoadBarColor = (alpha: number) => {
    if (alpha >= 0.75) return "bg-red-500";
    if (alpha >= 0.5) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[var(--bg-canvas)] border border-[var(--border-color)] rounded-t-md overflow-hidden select-none">
      {/* Top Hash Table Stat & Load Factor Bar */}
      <div className="shrink-0 px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Strategy Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] font-mono text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                isChaining ? "bg-blue-500" : "bg-purple-500"
              }`}
            />
            <span className="font-bold uppercase tracking-wide text-[var(--text-primary)]">
              {isChaining ? "Separate Chaining" : "Linear Probing"}
            </span>
          </div>

          {/* Key Count & Capacity */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[var(--text-muted)] text-[11px]">Keys (n):</span>
            <span className="font-bold text-sm text-[var(--text-primary)] tabular-nums">{keyCount}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[var(--text-muted)] text-[11px]">Buckets (M):</span>
            <span className="font-bold text-sm text-[var(--accent)] tabular-nums">{capacity}</span>
          </div>

          {/* Load Factor Gauge */}
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[var(--text-muted)] text-[11px]">Load (α = n/M):</span>
            <div className="flex items-center gap-1.5">
              <span className={`font-bold text-xs tabular-nums ${getLoadFactorColor(loadFactor)}`}>
                {loadFactor.toFixed(2)}
              </span>
              <div className="relative w-20 h-2 rounded-full bg-[var(--bg-raised)] border border-[var(--border-color)] overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getLoadBarColor(loadFactor)}`}
                  style={{ width: `${Math.min(100, Math.round((loadFactor / 1.0) * 100))}%` }}
                />
                {/* 0.75 Threshold Marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500/80"
                  style={{ left: "75%" }}
                  title="Rehash Threshold (0.75)"
                />
              </div>
            </div>
            {isOverThreshold && (
              <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Rehash Needed</span>
              </span>
            )}
          </div>
        </div>

        {/* Formula Badge */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)] bg-[var(--bg-raised)] px-2.5 py-1 rounded border border-[var(--border-color)]">
          <Hash className="w-3 h-3 text-[var(--accent)] shrink-0" />
          <span>
            h(k) = <span className="text-[var(--text-primary)] font-semibold">k % {capacity}</span>
          </span>
          {computedHash !== undefined && (
            <>
              <span>•</span>
              <span className="text-[var(--accent)] font-semibold">
                Target: [{computedHash}]
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* VIEW 1: SEPARATE CHAINING (Linked List Chains) */}
        {isChaining ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {buckets.map((bucket) => {
              const isTarget = bucket.state === "target" || bucket.index === computedHash;
              const isCollision = bucket.state === "collision";

              return (
                <div
                  key={`bucket-${bucket.index}`}
                  className={`flex flex-col rounded border transition-all duration-300 ${
                    isCollision
                      ? "border-amber-500 bg-amber-500/10 shadow-sm"
                      : isTarget
                      ? "border-[var(--accent)] bg-[var(--bg-raised)] shadow-sm"
                      : "border-[var(--border-color)] bg-[var(--bg-surface)]"
                  }`}
                >
                  {/* Bucket Header */}
                  <div className="px-2 py-1.5 border-b border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[var(--text-primary)]">
                      [{bucket.index}]
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      len: {bucket.nodes.length}
                    </span>
                  </div>

                  {/* Bucket Linked List Chain */}
                  <div className="p-2 flex flex-col items-center gap-1.5 min-h-[140px]">
                    {bucket.nodes.length === 0 ? (
                      <span className="text-[10px] font-mono text-[var(--text-muted)] my-auto opacity-50">
                        null
                      </span>
                    ) : (
                      bucket.nodes.map((node, nIdx) => {
                        const isNodeInserted = node.state === "inserted";
                        const isNodeComparing = node.state === "comparing";
                        const isNodeActive = node.state === "active";
                        const isNodeDeleted = node.state === "deleted";

                        return (
                          <React.Fragment key={node.id}>
                            <div
                              className={`w-full py-1.5 px-2 rounded border text-center font-mono text-xs font-semibold transition-all duration-300 ${
                                isNodeInserted
                                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 scale-105"
                                  : isNodeComparing
                                  ? "bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 scale-105"
                                  : isNodeActive
                                  ? "bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400"
                                  : isNodeDeleted
                                  ? "bg-red-500/20 border-red-500 text-red-600 dark:text-red-400 line-through"
                                  : "bg-[var(--bg-canvas)] border-[var(--border-strong)] text-[var(--text-primary)]"
                              }`}
                            >
                              {node.key}
                            </div>

                            {/* Downward pointer arrow connecting chain nodes */}
                            {nIdx < bucket.nodes.length - 1 && (
                              <ArrowDown className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: OPEN ADDRESSING (LINEAR PROBING WITH TOMBSTONES) */
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
              <span>Contiguous Slot Array with Linear Probing:</span>
              <span className="text-[var(--accent)]">slot = (h(k) + probe) % M</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-8 gap-2.5">
              {buckets.map((bucket) => {
                const isProbed = probeSequence.includes(bucket.index);
                const probeOrder = probeSequence.indexOf(bucket.index);
                const isTarget = bucket.index === computedHash;
                const isTombstone = bucket.isTombstone;
                const val = bucket.nodes[0]?.key;
                const nodeState = bucket.nodes[0]?.state;

                return (
                  <div
                    key={`probe-slot-${bucket.index}`}
                    className={`relative flex flex-col items-center justify-between p-2 rounded-md border min-h-[90px] transition-all duration-300 ${
                      nodeState === "inserted"
                        ? "bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/30"
                        : isProbed
                        ? "bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/40"
                        : isTarget
                        ? "bg-[var(--bg-raised)] border-[var(--accent)]"
                        : isTombstone
                        ? "bg-red-500/10 border-dashed border-red-500/50"
                        : "bg-[var(--bg-surface)] border-[var(--border-color)]"
                    }`}
                  >
                    {/* Slot Header Index */}
                    <div className="w-full flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                      <span className="font-bold">[{bucket.index}]</span>
                      {isProbed && (
                        <span className="text-[9px] px-1 rounded bg-amber-500 text-white font-bold">
                          #{probeOrder + 1}
                        </span>
                      )}
                    </div>

                    {/* Value or Tombstone or Empty */}
                    <div className="my-auto font-mono text-center">
                      {isTombstone ? (
                        <div className="flex flex-col items-center">
                          <span className="text-red-500 font-bold text-xs">TOMBSTONE</span>
                          <span className="text-[9px] text-[var(--text-muted)]">[DEL: {val}]</span>
                        </div>
                      ) : bucket.isOccupied && val !== undefined ? (
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {val}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)] opacity-40">
                          empty
                        </span>
                      )}
                    </div>

                    {/* Probing formula footer */}
                    <span className="text-[9px] font-mono text-[var(--text-muted)]">
                      {bucket.index === computedHash ? "Primary Hash" : `dist +${(bucket.index - (computedHash || 0) + capacity) % capacity}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rehashing Split View (When active) */}
        {isRehashing && (
          <div className="p-3 rounded-md bg-[var(--bg-raised)] border border-[var(--accent)] flex items-center gap-3 text-xs">
            <Layers className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <div className="flex-1 text-[var(--text-secondary)]">
              <span className="font-bold text-[var(--text-primary)]">Rehashing in Progress: </span>
              Doubled table capacity from {oldBuckets?.length} to {capacity} buckets. All keys are being re-indexed using new hash function h_new(k) = k % {capacity}.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

