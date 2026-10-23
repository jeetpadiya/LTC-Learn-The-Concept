"use client";

import React from "react";
import { LinkedListNode, LinkedListPointers, LinkedListType } from "@/types/visualizer";
import { getTokens, ThemeMode } from "@/styles/tokens";
import { ArrowRight, ArrowLeft, ArrowDown } from "lucide-react";

interface LinkedListVisualizerProps {
  nodes: LinkedListNode[];
  pointers: LinkedListPointers;
  listType: LinkedListType;
  theme: ThemeMode;
}

export default function LinkedListVisualizer({
  nodes,
  pointers,
  listType,
  theme,
}: LinkedListVisualizerProps) {
  const tokens = getTokens(theme);
  const isDoubly = listType === "doubly";

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[var(--bg-canvas)] border border-[var(--border-color)] rounded-t-md overflow-hidden select-none">
      {/* Main Canvas / Stage Area */}
      <div className="flex-1 w-full h-full min-h-[300px] flex items-center p-6 overflow-x-auto overflow-y-hidden">
        {nodes.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center text-center gap-2 py-12">
            <div className="px-3 py-1 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] font-mono text-xs text-[var(--text-muted)]">
              head = nullptr
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              The linked list is currently empty. Use the controls below to insert nodes.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-max mx-auto py-8">
            {/* HEAD Pointer Label */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="px-2 py-0.5 rounded bg-[var(--accent)] text-white font-mono text-[10px] font-bold tracking-wider">
                HEAD
              </span>
              <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
            </div>

            {/* Render Nodes Sequence */}
            {nodes.map((node, idx) => {
              const isCurr = pointers.curr === node.id;
              const isPrev = pointers.prev === node.id;
              const isNext = pointers.next === node.id;
              const isTemp = pointers.temp === node.id;

              // Border and background state colors
              let borderStyle = "border-[var(--border-color)]";
              let bgStyle = "bg-[var(--bg-surface)]";
              if (node.state === "active" || isCurr) {
                borderStyle = "border-amber-500 shadow-xs";
                bgStyle = "bg-amber-500/10";
              } else if (node.state === "creating" || isTemp) {
                borderStyle = "border-blue-500 border-dashed animate-pulse";
                bgStyle = "bg-blue-500/10";
              } else if (node.state === "target") {
                borderStyle = "border-emerald-500 shadow-xs";
                bgStyle = "bg-emerald-500/10";
              } else if (node.state === "deleted") {
                borderStyle = "border-red-500 opacity-60";
                bgStyle = "bg-red-500/10";
              } else if (node.state === "reconnecting") {
                borderStyle = "border-[var(--accent)] shadow-xs";
                bgStyle = "bg-[var(--accent-subtle)]";
              }

              return (
                <div key={node.id} className="flex items-center gap-3">
                  {/* Single Node Card */}
                  <div className="flex flex-col items-center gap-1.5">
                    {/* Simulated Memory Address Header */}
                    <span className="font-mono text-[9px] text-[var(--text-muted)] tabular-nums">
                      {node.address}
                    </span>

                    {/* Node Body with Data Cell & Pointer Cells */}
                    <div
                      className={`flex rounded border-2 transition-all duration-200 overflow-hidden shadow-xs ${borderStyle} ${bgStyle}`}
                    >
                      {/* Prev Pointer Cell (Doubly only) */}
                      {isDoubly && (
                        <div className="w-7 h-12 flex items-center justify-center border-r border-[var(--border-color)] bg-[var(--bg-raised)]/60 text-[10px] font-mono text-[var(--text-muted)]">
                          {node.prevId ? "•" : "null"}
                        </div>
                      )}

                      {/* Value Data Cell */}
                      <div className="w-14 h-12 flex items-center justify-center font-mono font-bold text-base text-[var(--text-primary)]">
                        {node.val}
                      </div>

                      {/* Next Pointer Cell */}
                      <div className="w-7 h-12 flex items-center justify-center border-l border-[var(--border-color)] bg-[var(--bg-raised)]/60 text-[10px] font-mono text-[var(--text-muted)]">
                        {node.nextId ? "•" : "null"}
                      </div>
                    </div>

                    {/* Active Pointers Indicator Row beneath node */}
                    <div className="h-6 flex items-center gap-1 text-[10px] font-mono">
                      {isPrev && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-400 font-bold">
                          prev
                        </span>
                      )}
                      {isCurr && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500 font-bold">
                          curr
                        </span>
                      )}
                      {isNext && (
                        <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500 font-bold">
                          next
                        </span>
                      )}
                      {isTemp && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500 font-bold">
                          newNode
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Connecting Arrow(s) */}
                  {idx < nodes.length - 1 ? (
                    <div className="flex flex-col items-center justify-center gap-1 text-[var(--text-muted)] shrink-0">
                      {/* Forward pointer: next */}
                      <div className="flex items-center">
                        <div className="w-5 h-0.5 bg-[var(--border-strong)]" />
                        <ArrowRight className="w-3.5 h-3.5 -ml-1 text-[var(--border-strong)]" />
                      </div>

                      {/* Backward pointer: prev (if doubly) */}
                      {isDoubly && (
                        <div className="flex items-center">
                          <ArrowLeft className="w-3.5 h-3.5 -mr-1 text-[var(--text-muted)]" />
                          <div className="w-5 h-0.5 bg-[var(--border-color)]" />
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Final Node connects to NULL */
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex items-center text-[var(--text-muted)]">
                        <div className="w-4 h-0.5 bg-[var(--border-strong)]" />
                        <ArrowRight className="w-3.5 h-3.5 -ml-1 text-[var(--border-strong)]" />
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] font-mono text-[10px] text-[var(--text-muted)]">
                        nullptr
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* TAIL Pointer Label */}
            {nodes.length > 0 && (
              <div className="flex flex-col items-center gap-1 shrink-0 ml-2">
                <span className="px-2 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] text-[var(--text-secondary)] font-mono text-[10px] font-bold tracking-wider">
                  TAIL
                </span>
              </div>
            )}
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
            <span>Node</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.compare }}
            />
            <span>Active Pointer (curr)</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.pivot }}
            />
            <span>Allocating (newNode)</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.sorted }}
            />
            <span>Target / Linked</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.swap }}
            />
            <span>Deleted / Freed</span>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          {isDoubly ? "Doubly Linked (Prev ⇄ Next)" : "Singly Linked (Next →)"}
        </span>
      </div>
    </div>
  );
}

