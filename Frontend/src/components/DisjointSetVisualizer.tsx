"use client";

import React, { useMemo } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { DsuElement } from "@/types/visualizer";
import { Crown, ArrowRight, Network, Layers, GitMerge } from "lucide-react";

// Distinct color palette for up to 10 disjoint set components
const COMPONENT_COLORS = [
  { bg: "bg-blue-500/10 dark:bg-blue-950/30", border: "border-blue-400 dark:border-blue-600", text: "text-blue-600 dark:text-blue-400", pill: "bg-blue-500" },
  { bg: "bg-emerald-500/10 dark:bg-emerald-950/30", border: "border-emerald-400 dark:border-emerald-600", text: "text-emerald-600 dark:text-emerald-400", pill: "bg-emerald-500" },
  { bg: "bg-amber-500/10 dark:bg-amber-950/30", border: "border-amber-400 dark:border-amber-600", text: "text-amber-600 dark:text-amber-400", pill: "bg-amber-500" },
  { bg: "bg-purple-500/10 dark:bg-purple-950/30", border: "border-purple-400 dark:border-purple-600", text: "text-purple-600 dark:text-purple-400", pill: "bg-purple-500" },
  { bg: "bg-rose-500/10 dark:bg-rose-950/30", border: "border-rose-400 dark:border-rose-600", text: "text-rose-600 dark:text-rose-400", pill: "bg-rose-500" },
  { bg: "bg-teal-500/10 dark:bg-teal-950/30", border: "border-teal-400 dark:border-teal-600", text: "text-teal-600 dark:text-teal-400", pill: "bg-teal-500" },
  { bg: "bg-indigo-500/10 dark:bg-indigo-950/30", border: "border-indigo-400 dark:border-indigo-600", text: "text-indigo-600 dark:text-indigo-400", pill: "bg-indigo-500" },
  { bg: "bg-orange-500/10 dark:bg-orange-950/30", border: "border-orange-400 dark:border-orange-600", text: "text-orange-600 dark:text-orange-400", pill: "bg-orange-500" },
];

export default function DisjointSetVisualizer() {
  const { dsuSteps, currentDsuStepIndex } = useVisualizerStore();

  const currentStep = dsuSteps[currentDsuStepIndex] || dsuSteps[0];
  const elements = currentStep?.elements || [];

  // Group elements by root to display disjoint components
  const clusters = useMemo(() => {
    const map = new Map<number, DsuElement[]>();
    for (const el of elements) {
      const rootId = el.root;
      if (!map.has(rootId)) {
        map.set(rootId, []);
      }
      map.get(rootId)!.push(el);
    }
    return Array.from(map.entries()).map(([rootId, members], index) => {
      const rootElement = elements.find((e) => e.id === rootId) || members[0];
      const colorScheme = COMPONENT_COLORS[index % COMPONENT_COLORS.length];
      return {
        rootId,
        rootElement,
        members,
        colorScheme,
      };
    });
  }, [elements]);

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-canvas)] overflow-hidden select-none">
      {/* Top Main Stage: Disjoint Component Tree Clusters */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[var(--accent)]" />
            <span className="font-bold text-xs text-[var(--text-primary)]">
              Disjoint Component Clusters ({clusters.length} Sets)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Set Root</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Querying</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Compressing</span>
            </span>
          </div>
        </div>

        {/* Component Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {clusters.map(({ rootId, rootElement, members, colorScheme }) => {
            const isRootActive = currentStep?.activeIds?.includes(rootId);
            return (
              <div
                key={rootId}
                className={`p-3 rounded-lg border flex flex-col gap-2.5 transition-all duration-200 ${
                  colorScheme.bg
                } ${isRootActive ? "ring-2 ring-[var(--accent)] shadow-md" : colorScheme.border}`}
              >
                {/* Cluster Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${colorScheme.pill}`} />
                    <span className="font-bold text-xs text-[var(--text-primary)] font-mono">
                      Set: {rootElement.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]">
                    <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
                      Rank: {rootElement.rank}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
                      Size: {rootElement.size}
                    </span>
                  </div>
                </div>

                {/* Cluster Members */}
                <div className="flex flex-wrap gap-2 pt-1 items-center">
                  {members.map((member) => {
                    const isRoot = member.parent === member.id;
                    const isActive = currentStep?.activeIds?.includes(member.id);
                    const isQuerying = member.state === "querying";
                    const isCompressing = member.state === "compressing";

                    return (
                      <div
                        key={member.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-mono transition-all duration-200 ${
                          isCompressing
                            ? "bg-purple-100 dark:bg-purple-950/60 border-purple-400 text-purple-700 dark:text-purple-300 scale-105 shadow-xs"
                            : isQuerying
                            ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-700 dark:text-amber-300 scale-105 shadow-xs"
                            : isRoot
                            ? "bg-[var(--bg-surface)] border-[var(--accent)] font-bold text-[var(--text-primary)] shadow-2xs"
                            : "bg-[var(--bg-surface)]/80 border-[var(--border-color)] text-[var(--text-secondary)]"
                        }`}
                      >
                        {isRoot && <Crown className="w-3 h-3 text-amber-500 shrink-0" />}
                        <span className="text-xs font-bold">{member.label}</span>

                        {!isRoot && (
                          <div className="flex items-center gap-0.5 text-[10px] text-[var(--text-muted)]">
                            <ArrowRight className="w-2.5 h-2.5" />
                            <span>{elements[member.parent]?.label}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Stage: Contiguous Memory Arrays (Parent & Rank Tables) */}
      <div className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="font-semibold text-[11px] text-[var(--text-primary)]">
              Underlying Disjoint Set Array Representation
            </span>
          </div>

          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            parent[i] == i indicates set representative root
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[10px] text-[var(--text-muted)] uppercase">
                <th className="py-1 px-2 text-left font-normal">Array / Field</th>
                {elements.map((el) => (
                  <th key={el.id} className="py-1 px-2.5 font-bold text-[var(--text-secondary)]">
                    {el.label} (i={el.id})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {/* Parent Array Row */}
              <tr>
                <td className="py-1.5 px-2 text-left text-[11px] font-sans font-semibold text-[var(--text-primary)]">
                  parent[i]
                </td>
                {elements.map((el) => {
                  const isRoot = el.parent === el.id;
                  const isActive = currentStep?.activeIds?.includes(el.id);
                  return (
                    <td
                      key={el.id}
                      className={`py-1.5 px-2.5 font-bold transition-colors ${
                        isActive
                          ? "bg-[var(--accent)] text-white"
                          : isRoot
                          ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {elements[el.parent]?.label} ({el.parent})
                    </td>
                  );
                })}
              </tr>

              {/* Rank Array Row */}
              <tr>
                <td className="py-1.5 px-2 text-left text-[11px] font-sans font-semibold text-[var(--text-muted)]">
                  rank[i]
                </td>
                {elements.map((el) => (
                  <td key={el.id} className="py-1.5 px-2.5 text-[var(--text-muted)]">
                    {el.rank}
                  </td>
                ))}
              </tr>

              {/* Size Array Row */}
              <tr>
                <td className="py-1.5 px-2 text-left text-[11px] font-sans font-semibold text-[var(--text-muted)]">
                  size[i]
                </td>
                {elements.map((el) => (
                  <td key={el.id} className="py-1.5 px-2.5 text-[var(--text-muted)]">
                    {el.size}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
