"use client";

import React from "react";
import { ActionType, StepPointers } from "@/types/visualizer";
import { ArrowUp } from "lucide-react";

interface ArrayRowProps {
  array: number[];
  activeIndices: number[];
  action: ActionType;
  pointers: StepPointers;
  sortedIndices: Set<number>;
}

export default function ArrayRow({
  array,
  activeIndices,
  action,
  pointers,
  sortedIndices,
}: ArrayRowProps) {
  // Collect active pointers for an index
  const getPointersForIndex = (idx: number) => {
    const list: { label: string; color: string }[] = [];
    if (pointers.i === idx) list.push({ label: "i", color: "text-amber-600 dark:text-amber-400" });
    if (pointers.j === idx) list.push({ label: "j", color: "text-blue-600 dark:text-blue-400" });
    if (pointers.min === idx) list.push({ label: "min", color: "text-cyan-600 dark:text-cyan-400" });
    if (pointers.pivot === idx) list.push({ label: "pivot", color: "text-indigo-600 dark:text-indigo-400" });
    return list;
  };

  return (
    <div className="w-full bg-[var(--bg-surface)] border-x border-[var(--border-color)] px-4 py-2 flex flex-col gap-1 overflow-x-auto select-none">
      {/* Cells row */}
      <div className="flex items-center justify-center gap-1.5 min-w-max mx-auto">
        {array.map((val, idx) => {
          const isActive = activeIndices.includes(idx);
          const isSorted = sortedIndices.has(idx);
          const activePointers = getPointersForIndex(idx);

          let cellStyle = "bg-[var(--bg-raised)] border-[var(--border-color)] text-[var(--text-secondary)]";

          if (isSorted) {
            cellStyle = "bg-green-500/10 border-green-600/40 text-green-800 dark:text-green-300 font-semibold";
          } else if (isActive) {
            if (action === "swap") {
              cellStyle = "bg-red-500/15 border-red-500 text-red-700 dark:text-red-300 font-bold scale-105";
            } else if (action === "compare") {
              cellStyle = "bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold scale-105";
            } else if (action === "pivot") {
              cellStyle = "bg-blue-500/15 border-blue-500 text-blue-700 dark:text-blue-300 font-bold scale-105";
            }
          }

          return (
            <div key={idx} className="flex flex-col items-center min-w-[34px] sm:min-w-[40px]">
              {/* Box Cell with value */}
              <div
                className={`w-full aspect-square flex flex-col items-center justify-center rounded-sm border transition-all text-xs font-mono tabular-nums ${cellStyle}`}
              >
                <span className="font-semibold text-xs leading-none">{val}</span>
                <span className="text-[9px] text-[var(--text-muted)] opacity-70 leading-none mt-0.5">
                  [{idx}]
                </span>
              </div>

              {/* Sorted underline indicator */}
              <div className="w-full h-1 mt-1 flex justify-center">
                {isSorted && (
                  <span
                    className="w-full h-0.5 bg-green-600/60 rounded-full"
                    title="Sorted region"
                  />
                )}
              </div>

              {/* Pointer markers (i, j, pivot, min) */}
              <div className="min-h-[16px] flex items-center justify-center gap-0.5 mt-0.5">
                {activePointers.map((p, pIdx) => (
                  <span
                    key={pIdx}
                    className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold leading-none ${p.color}`}
                    title={`Pointer ${p.label}`}
                  >
                    <ArrowUp className="w-2.5 h-2.5" />
                    <span>{p.label}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

