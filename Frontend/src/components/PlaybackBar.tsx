"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  X,
} from "lucide-react";
import { useVisualizerStore } from "@/store/useVisualizerStore";

export default function PlaybackBar() {
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

  const [showHelp, setShowHelp] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || steps[0];
  const isFinished = currentStepIndex >= totalSteps - 1;

  // Track scrubber percentage for filled track styling
  const pct = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Interval execution loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const delay = Math.max(60, Math.floor(600 / playbackSpeed));
      timer = setInterval(() => {
        stepForward();
      }, delay);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playbackSpeed, stepForward]);

  return (
    <div className="relative border border-[var(--border-color)] border-t-0 bg-[var(--bg-surface)] rounded-b-md px-4 py-3 flex flex-col gap-2.5 select-none">
      {/* Scrubber row with colored tick marks */}
      <div className="flex items-center gap-3 w-full">
        <span className="font-mono text-xs tabular-nums text-[var(--text-secondary)] min-w-[70px]">
          {currentStepIndex} / {Math.max(0, totalSteps - 1)}
        </span>

        {/* Timeline with colored tick marks for events */}
        <div className="relative flex-1 flex items-center">
          {/* Background event ticks */}
          <div className="absolute inset-x-0 h-1.5 pointer-events-none flex items-center overflow-hidden rounded-full">
            {steps.map((st, idx) => {
              if (idx % 2 !== 0 && totalSteps > 50) return null; // subsample for performance on large arrays
              let tickColor = "transparent";
              if (st.action === "swap") tickColor = "rgba(220, 38, 38, 0.6)"; // red
              else if (st.action === "compare") tickColor = "rgba(217, 119, 6, 0.4)"; // amber
              else if (st.action === "sorted") tickColor = "rgba(22, 163, 74, 0.6)"; // green

              const leftPos = (idx / Math.max(1, totalSteps - 1)) * 100;
              return (
                <span
                  key={idx}
                  className="absolute top-0 bottom-0 w-[2px]"
                  style={{ left: `${leftPos}%`, backgroundColor: tickColor }}
                />
              );
            })}
          </div>

          {/* Range input with visible filled portion */}
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => seekStep(Number(e.target.value))}
            className="w-full relative z-10"
            style={{
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border-color) ${pct}%, var(--border-color) 100%)`,
            }}
            title="Scrub step timeline"
          />
        </div>

        {/* Live Counters: Comparisons, Swaps, Pass */}
        <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
          <div className="px-2 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] flex items-center gap-1">
            <span className="text-[var(--text-muted)]">C:</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {currentStep.counters.comparisons}
            </span>
          </div>

          <div className="px-2 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] flex items-center gap-1">
            <span className="text-[var(--text-muted)]">S:</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {currentStep.counters.swaps}
            </span>
          </div>

          <div className="px-2 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] flex items-center gap-1">
            <span className="text-[var(--text-muted)]">Pass:</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {currentStep.pass}
            </span>
          </div>
        </div>
      </div>

      {/* Button controls & speed */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={resetPlayback}
            title="Reset (R)"
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={stepBackward}
            disabled={currentStepIndex === 0 || isPlaying}
            title="Step Back (←)"
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] disabled:opacity-40 text-[var(--text-secondary)] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={togglePlay}
            title="Play / Pause (Space)"
            className={`px-3 py-1 rounded font-medium text-xs flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? "bg-[var(--bg-raised)] border border-[var(--border-strong)] text-[var(--text-primary)]"
                : isFinished
                ? "bg-[var(--bg-raised)] border border-[var(--border-color)] text-[var(--text-muted)]"
                : "bg-[var(--accent)] text-white hover:opacity-90"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFinished ? "Replay" : "Play"}</span>
              </>
            )}
          </button>

          <button
            onClick={stepForward}
            disabled={isFinished || isPlaying}
            title="Step Forward (→)"
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] disabled:opacity-40 text-[var(--text-secondary)] transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Segmented Control & Shortcuts popover trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[var(--text-muted)] text-[11px]">Speed:</span>
            <div className="flex rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5">
              {[0.5, 1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    playbackSpeed === spd
                      ? "bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)] shadow-2xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* "?" Popover for shortcuts */}
          <div className="relative">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Keyboard shortcuts"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {showHelp && (
              <div
                ref={helpRef}
                className="absolute right-0 bottom-8 z-30 w-52 p-3 rounded border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-md text-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between pb-1 border-b border-[var(--border-color)] font-semibold text-[var(--text-primary)]">
                  <span>Shortcuts</span>
                  <button onClick={() => setShowHelp(false)}>
                    <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  </button>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Play / Pause</span>
                  <kbd className="px-1 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] font-mono text-[10px]">
                    Space
                  </kbd>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Step Forward</span>
                  <kbd className="px-1 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] font-mono text-[10px]">
                    →
                  </kbd>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Step Back</span>
                  <kbd className="px-1 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] font-mono text-[10px]">
                    ←
                  </kbd>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Reset</span>
                  <kbd className="px-1 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] font-mono text-[10px]">
                    R
                  </kbd>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

