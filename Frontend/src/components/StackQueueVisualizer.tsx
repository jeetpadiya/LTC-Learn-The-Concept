"use client";

import React from "react";
import { StackQueueItem, StackQueueMode } from "@/types/visualizer";
import { getTokens, ThemeMode } from "@/styles/tokens";
import { ArrowDown, ArrowUp, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";

interface StackQueueVisualizerProps {
  items: StackQueueItem[];
  mode: StackQueueMode;
  maxCapacity: number;
  operation: string;
  theme: ThemeMode;
}

export default function StackQueueVisualizer({
  items,
  mode,
  maxCapacity,
  operation,
  theme,
}: StackQueueVisualizerProps) {
  const tokens = getTokens(theme);
  const isStack = mode === "stack";
  const isOverflow = operation === "overflow";
  const isUnderflow = operation === "underflow";

  const topIndex = items.length - 1;
  const frontIndex = 0;
  const rearIndex = items.length - 1;

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[var(--bg-canvas)] border border-[var(--border-color)] rounded-t-md overflow-hidden select-none">
      {/* Overflow / Underflow Alert Banner */}
      {isOverflow && (
        <div className="shrink-0 px-4 py-1.5 bg-red-500/10 border-b border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold">
            {isStack ? "Stack Overflow!" : "Queue Overflow!"} Buffer capacity ({maxCapacity}) reached. Cannot push/enqueue without reallocating.
          </span>
        </div>
      )}
      {isUnderflow && (
        <div className="shrink-0 px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold">
            {isStack ? "Stack Underflow!" : "Queue Underflow!"} Buffer is empty (size 0). Cannot pop/dequeue.
          </span>
        </div>
      )}

      {/* Main Visualizer Stage */}
      <div className="flex-1 w-full h-full min-h-[300px] flex items-center justify-center p-6 overflow-auto">
        {isStack ? (
          /* ========================================= */
          /* STACK VISUALIZATION (Vertical Container)  */
          /* ========================================= */
          <div className="flex items-end gap-6 py-4">
            {/* Left side: TOP indicator pointer */}
            <div className="h-[320px] flex flex-col justify-end items-end relative w-20">
              {items.length > 0 && (
                <div
                  className="absolute right-0 flex items-center gap-1.5 transition-all duration-300"
                  style={{
                    bottom: `${(items.length - 1) * 38 + 10}px`,
                  }}
                >
                  <span className="px-1.5 py-0.5 rounded bg-[var(--accent)] text-white font-mono text-[10px] font-bold">
                    TOP
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                </div>
              )}
            </div>

            {/* Vertical Stack Tube / Chamber */}
            <div className="flex flex-col items-center">
              {/* Stack Open Top Header */}
              <div className="w-44 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pb-1 px-1 border-b border-dashed border-[var(--border-strong)]">
                <span>OPEN TOP</span>
                <span>Push / Pop ↓↑</span>
              </div>

              {/* Stack Chamber Body (open top, closed sides and bottom) */}
              <div className="w-44 h-[320px] border-2 border-t-0 border-[var(--border-strong)] bg-[var(--bg-raised)]/30 rounded-b-md flex flex-col-reverse p-1.5 gap-1.5 relative overflow-hidden">
                {/* Capacity grid guide marks */}
                {Array.from({ length: maxCapacity }).map((_, slotIdx) => (
                  <div
                    key={slotIdx}
                    className="absolute inset-x-2 border-b border-dashed border-[var(--border-color)]/30 pointer-events-none"
                    style={{ bottom: `${slotIdx * 38 + 18}px` }}
                  />
                ))}

                {items.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[11px] text-[var(--text-muted)] italic">
                    Stack is empty
                  </div>
                ) : (
                  items.map((item, idx) => {
                    const isTop = idx === topIndex;
                    let borderStyle = "border-[var(--border-color)]";
                    let bgStyle = "bg-[var(--bg-surface)]";

                    if (item.state === "entering") {
                      borderStyle = "border-blue-500 border-dashed animate-bounce";
                      bgStyle = "bg-blue-500/15";
                    } else if (item.state === "leaving") {
                      borderStyle = "border-red-500 opacity-60";
                      bgStyle = "bg-red-500/15";
                    } else if (item.state === "peek" || (item.state === "active" && isTop)) {
                      borderStyle = "border-amber-500 shadow-xs";
                      bgStyle = "bg-amber-500/15";
                    } else if (isTop) {
                      borderStyle = "border-[var(--accent)] shadow-2xs";
                      bgStyle = "bg-[var(--accent-subtle)]";
                    }

                    return (
                      <div
                        key={item.id}
                        className={`h-8 w-full rounded border-2 flex items-center justify-between px-3 text-xs font-mono font-bold transition-all duration-200 z-10 ${borderStyle} ${bgStyle}`}
                      >
                        <span className="text-[10px] text-[var(--text-muted)] font-normal">
                          [{idx}]
                        </span>
                        <span className="text-sm text-[var(--text-primary)]">
                          {item.val}
                        </span>
                        <span className="text-[9px] text-[var(--text-muted)] font-normal uppercase">
                          {isTop ? "TOP" : ""}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Stack Bottom Base */}
              <div className="w-52 h-2.5 bg-[var(--border-strong)] rounded-b-md mt-0.5" />
            </div>

            {/* Right side: Capacity gauge */}
            <div className="h-[320px] flex flex-col justify-end text-[11px] font-mono text-[var(--text-muted)] pl-2">
              <span className="font-semibold text-[var(--text-primary)]">
                Height: {items.length} / {maxCapacity}
              </span>
              <span className="text-[10px]">
                {items.length === maxCapacity ? "(FULL)" : items.length === 0 ? "(EMPTY)" : ""}
              </span>
            </div>
          </div>
        ) : (
          /* ========================================= */
          /* QUEUE VISUALIZATION (Horizontal Pipeline) */
          /* ========================================= */
          <div className="flex flex-col items-center gap-6 py-6 w-full max-w-4xl">
            {/* Flow Indicators Above Pipeline */}
            <div className="w-full flex items-center justify-between text-xs font-mono px-4 text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold">
                <ArrowLeft className="w-4 h-4" />
                <span>EXIT / DEQUEUE (FRONT)</span>
              </div>

              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                <span>ENTRY / ENQUEUE (REAR)</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>

            {/* Horizontal Pipeline Chamber (open at left and right) */}
            <div className="w-full h-24 border-y-2 border-[var(--border-strong)] bg-[var(--bg-raised)]/30 flex items-center px-4 gap-3 overflow-x-auto relative rounded-sm shadow-inner">
              {items.length === 0 ? (
                <div className="w-full flex items-center justify-center text-xs font-mono text-[var(--text-muted)] italic">
                  Queue is empty (size 0)
                </div>
              ) : (
                items.map((item, idx) => {
                  const isFront = idx === 0;
                  const isRear = idx === items.length - 1;

                  let borderStyle = "border-[var(--border-color)]";
                  let bgStyle = "bg-[var(--bg-surface)]";

                  if (item.state === "entering") {
                    borderStyle = "border-blue-500 border-dashed animate-pulse";
                    bgStyle = "bg-blue-500/15";
                  } else if (item.state === "leaving") {
                    borderStyle = "border-red-500 opacity-60";
                    bgStyle = "bg-red-500/15";
                  } else if (item.state === "peek" || (item.state === "active" && isFront)) {
                    borderStyle = "border-amber-500 shadow-xs";
                    bgStyle = "bg-amber-500/15";
                  } else if (isFront) {
                    borderStyle = "border-red-500/60 shadow-2xs";
                  }

                  return (
                    <div key={item.id} className="flex flex-col items-center gap-1 shrink-0">
                      {/* Upper Label (FRONT / REAR) */}
                      <span className="font-mono text-[10px] font-bold text-[var(--accent)] h-4">
                        {isFront && isRear ? "FRONT & REAR" : isFront ? "FRONT" : isRear ? "REAR" : ""}
                      </span>

                      {/* Element Cell */}
                      <div
                        className={`w-16 h-12 rounded border-2 flex items-center justify-center text-sm font-mono font-bold transition-all duration-200 shadow-xs ${borderStyle} ${bgStyle}`}
                      >
                        <span className="text-[var(--text-primary)]">{item.val}</span>
                      </div>

                      {/* Index Below */}
                      <span className="font-mono text-[9px] text-[var(--text-muted)]">
                        [{idx}]
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Queue Pointers Status Footer */}
            <div className="w-full flex items-center justify-between text-xs font-mono px-4 text-[var(--text-muted)]">
              <div>
                <span>Front Item: </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {items.length > 0 ? items[0].val : "none"}
                </span>
              </div>

              <div>
                <span>Capacity: </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {items.length} / {maxCapacity}
                </span>
              </div>

              <div>
                <span>Rear Item: </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {items.length > 0 ? items[items.length - 1].val : "none"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend Strip */}
      <div className="w-full bg-[var(--bg-surface)] border-t border-[var(--border-color)] px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] gap-3 select-none">
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.defaultBar }}
            />
            <span>Stored Element</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.pivot }}
            />
            <span>Pushing / Enqueuing</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.swap }}
            />
            <span>Popping / Dequeuing</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: tokens.compare }}
            />
            <span>Peek / Active Target</span>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          {isStack ? "Stack: LIFO (Last-In, First-Out)" : "Queue: FIFO (First-In, First-Out)"}
        </span>
      </div>
    </div>
  );
}

