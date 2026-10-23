"use client";

import React from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { getTokens } from "@/styles/tokens";

export default function LegendStrip() {
  const { theme } = useVisualizerStore();
  const tokens = getTokens(theme);

  return (
    <div className="w-full bg-[var(--bg-surface)] border-x border-b border-[var(--border-color)] px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] gap-3 select-none">
      <div className="flex items-center gap-3.5 flex-wrap">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span
            className="w-2.5 h-2.5 rounded-xs"
            style={{ backgroundColor: tokens.defaultBar }}
          />
          <span>Default</span>
        </div>

        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span
            className="w-2.5 h-2.5 rounded-xs"
            style={{ backgroundColor: tokens.compare }}
          />
          <span>Compare (CMP)</span>
        </div>

        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span
            className="w-2.5 h-2.5 rounded-xs"
            style={{ backgroundColor: tokens.swap }}
          />
          <span>Swap (SWAP)</span>
        </div>

        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span
            className="w-2.5 h-2.5 rounded-xs"
            style={{ backgroundColor: tokens.pivot }}
          />
          <span>Pivot/Min (PIV)</span>
        </div>

        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span
            className="w-2.5 h-2.5 rounded-xs"
            style={{ backgroundColor: tokens.sorted }}
          />
          <span>Sorted (✓)</span>
        </div>
      </div>

      <span className="font-mono text-[10px] text-[var(--text-muted)] hidden sm:inline">
        Front-on Orthographic View • Values Auto-Fit Headroom
      </span>
    </div>
  );
}

