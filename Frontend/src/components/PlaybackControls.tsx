"use client";

import React, { useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import { useVisualizerStore } from "@/store/useVisualizerStore";

export default function PlaybackControls() {
  const {
    steps,
    currentStepIndex,
    isPlaying,
    playbackSpeed,
    togglePlay,
    stepForward,
    stepBackward,
    resetPlayback,
    seekStep,
    setPlaybackSpeed,
  } = useVisualizerStore();

  const totalSteps = steps.length;
  const isFinished = currentStepIndex >= totalSteps - 1;

  // Derive live statistics up to current step
  const { comparisons, swaps } = React.useMemo(() => {
    let comps = 0;
    let swps = 0;
    for (let i = 0; i <= currentStepIndex && i < steps.length; i++) {
      const s = steps[i];
      if (s.action === "compare") comps++;
      if (s.action === "swap") swps++;
    }
    return { comparisons: comps, swaps: swps };
  }, [steps, currentStepIndex]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        stepBackward();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        stepForward();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        resetPlayback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, stepBackward, stepForward, resetPlayback]);

  // Playback loop interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const delay = Math.max(70, Math.floor(650 / playbackSpeed));
      timer = setInterval(() => {
        stepForward();
      }, delay);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playbackSpeed, stepForward]);

  return (
    <div className="border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-md p-3.5 flex flex-col gap-3">
      {/* Top row: Timeline Scrubber & Live Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Timeline Slider */}
        <div className="flex-1 w-full flex items-center gap-2.5">
          <span className="font-mono text-[var(--text-secondary)] min-w-[76px] select-none">
            {currentStepIndex} / {Math.max(0, totalSteps - 1)}
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => seekStep(Number(e.target.value))}
            className="w-full h-1.5 bg-[var(--border-strong)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            title="Drag to scrub timeline"
          />
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] font-mono text-[11px]">
            <span className="text-[var(--text-muted)]">Comparisons:</span>
            <span className="font-semibold text-[var(--text-primary)]">{comparisons}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] font-mono text-[11px]">
            <span className="text-[var(--text-muted)]">Swaps:</span>
            <span className="font-semibold text-[var(--text-primary)]">{swaps}</span>
          </div>
        </div>
      </div>

      {/* Bottom row: Playback Buttons & Speed Selector */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-color)] flex-wrap">
        <div className="flex items-center gap-1.5">
          <button
            onClick={resetPlayback}
            title="Reset (R)"
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={stepBackward}
            disabled={currentStepIndex === 0 || isPlaying}
            title="Step Back (←)"
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 text-[var(--text-secondary)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            title="Play / Pause (Space)"
            className={`px-3 py-1.5 rounded font-medium text-xs flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? "bg-[var(--bg-subtle)] border border-[var(--border-strong)] text-[var(--text-primary)]"
                : isFinished
                ? "bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)]"
                : "bg-[var(--accent)] text-white hover:opacity-90"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : isFinished ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Finished</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={stepForward}
            disabled={isFinished || isPlaying}
            title="Step Forward (→)"
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 text-[var(--text-secondary)] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="hidden md:inline text-[11px] text-[var(--text-muted)] ml-2">
            Shortcut: <kbd className="px-1 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[10px]">Space</kbd> play, <kbd className="px-1 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[10px]">←</kbd> <kbd className="px-1 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[10px]">→</kbd> step
          </span>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <Gauge className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[var(--text-muted)] text-[11px]">Speed:</span>
          <div className="flex rounded border border-[var(--border-color)] bg-[var(--bg-subtle)] p-0.5">
            {[0.5, 1, 2, 4].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  playbackSpeed === speed
                    ? "bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)] shadow-2xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
