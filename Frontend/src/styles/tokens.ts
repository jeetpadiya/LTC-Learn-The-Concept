/**
 * Design Tokens for LTC (Learn The Concept)
 * Visualgo / Brilliant / Linear docs aesthetic.
 * Light default; Dark = warm charcoal (#16181d, #1e2128).
 * Slate-400 default, amber compare, red swap, blue pivot/min, muted green sorted.
 */

export const SEMANTIC_COLORS = {
  light: {
    surface: "#ffffff",
    raised: "#f8fafc",
    canvas: "#f8fafc",
    border: "#e2e8f0",
    borderStrong: "#cbd5e1",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#64748b",
    accent: "#2563eb",
    accentSubtle: "#eff6ff",

    // Algorithm state colors
    defaultBar: "#94a3b8",      // slate-400
    compare: "#d97706",         // amber-600
    swap: "#dc2626",            // red-600
    pivot: "#2563eb",           // blue-600
    sorted: "#16a34a",          // muted green
    sortedMuted: "#dcfce7",     // muted green fill
  },
  dark: {
    surface: "#16181d",         // warm charcoal surface
    raised: "#1e2128",          // raised charcoal
    canvas: "#111317",          // base canvas
    border: "#2b2f38",
    borderStrong: "#3b404d",
    textPrimary: "#f1f5f9",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    accent: "#3b82f6",
    accentSubtle: "#172554",

    // Algorithm state colors
    defaultBar: "#64748b",      // slate-500
    compare: "#f59e0b",         // amber-500
    swap: "#ef4444",            // red-500
    pivot: "#3b82f6",           // blue-500
    sorted: "#22c55e",          // muted green
    sortedMuted: "#14532d",     // dark muted green fill
  },
} as const;

export type ThemeMode = "light" | "dark";

export function getTokens(mode: ThemeMode) {
  return SEMANTIC_COLORS[mode];
}
