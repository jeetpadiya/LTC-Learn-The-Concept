"use client";

import React, { useState, useEffect } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { GraphAlgorithmType } from "@/types/visualizer";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Share2,
  Navigation,
  Layers,
} from "lucide-react";

export default function GraphControls() {
  const {
    graphSteps,
    currentGraphStepIndex,
    graphAlgorithm,
    graphStartNode,
    graphTargetNode,
    setGraphAlgorithm,
    setGraphStartNode,
    setGraphTargetNode,
    runGraphAlgorithm,
    resetGraphPreset,
    seekGraphStep,
    stepForwardGraph,
    stepBackwardGraph,
    isPlaying,
    togglePlay,
  } = useVisualizerStore();

  const totalSteps = graphSteps.length;
  const currentStep = graphSteps[currentGraphStepIndex] || graphSteps[0];
  const pct = totalSteps > 1 ? (currentGraphStepIndex / (totalSteps - 1)) * 100 : 0;

  // Auto-play interval for graph steps
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForwardGraph();
      }, 750);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepForwardGraph]);

  const availableNodes = currentStep?.nodes.map((n) => n.id) || ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="border border-[var(--border-color)] border-t-0 bg-[var(--bg-surface)] rounded-b-md px-4 py-3 flex flex-col gap-3 select-none">
      {/* Top Operations Bar: Algorithm Selection, Source/Target, Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 1. Algorithm Toggle: BFS, DFS, Dijkstra */}
          <div className="flex rounded border border-[var(--border-color)] bg-[var(--bg-raised)] p-0.5 text-xs">
            {(["bfs", "dfs", "dijkstra"] as GraphAlgorithmType[]).map((algo) => {
              const isSelected = graphAlgorithm === algo;
              return (
                <button
                  key={algo}
                  onClick={() => setGraphAlgorithm(algo)}
                  className={`px-2.5 py-1 rounded text-[11px] uppercase font-semibold transition-colors ${
                    isSelected
                      ? "bg-[var(--bg-surface)] text-[var(--accent)] shadow-2xs border border-[var(--accent)]/30"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {algo === "dijkstra" ? "Dijkstra" : algo.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* 2. Source Node Selector */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-[11px]">
            <span className="text-[var(--text-muted)]">Start:</span>
            <select
              value={graphStartNode}
              onChange={(e) => setGraphStartNode(e.target.value)}
              className="bg-transparent font-bold text-[var(--text-primary)] outline-none cursor-pointer"
            >
              {availableNodes.map((id) => (
                <option key={id} value={id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  {id}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Target Node Selector (Active for Dijkstra) */}
          {graphAlgorithm === "dijkstra" && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] text-[11px]">
              <span className="text-[var(--text-muted)]">Target:</span>
              <select
                value={graphTargetNode}
                onChange={(e) => setGraphTargetNode(e.target.value)}
                className="bg-transparent font-bold text-[var(--text-primary)] outline-none cursor-pointer"
              >
                {availableNodes.map((id) => (
                  <option key={id} value={id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    {id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Run Traversal Button */}
          <button
            onClick={() => runGraphAlgorithm()}
            className="px-3 py-1 rounded bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 transition-opacity"
          >
            <Navigation className="w-3 h-3 fill-current" />
            <span>Run {graphAlgorithm.toUpperCase()}</span>
          </button>
        </div>

        {/* Graph Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--text-muted)]">Network:</span>
          <button
            onClick={() => resetGraphPreset("classic")}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
            title="Textbook 6-node weighted network"
          >
            Classic 6
          </button>
          <button
            onClick={() => resetGraphPreset("cyclic")}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
            title="3D Ring cycle with chords"
          >
            Ring Cycle
          </button>
          <button
            onClick={() => resetGraphPreset("denseDag")}
            className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)]"
            title="Directed Acyclic Graph"
          >
            DAG
          </button>
          <button
            onClick={() => resetGraphPreset("classic")}
            className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)]"
            title="Reset Network"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frontier Status Row: Queue / Stack / Min-Heap display */}
      <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] text-xs overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <Layers className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
          <span className="font-semibold text-[11px] text-[var(--text-secondary)]">
            {graphAlgorithm === "bfs"
              ? "FIFO Queue:"
              : graphAlgorithm === "dfs"
              ? "Call Stack:"
              : "Min-Heap PQ:"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto font-mono text-[11px]">
          {currentStep?.frontierItems && currentStep.frontierItems.length > 0 ? (
            currentStep.frontierItems.map((item, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--text-primary)]"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="text-[var(--text-muted)] italic text-[10px]">
              (empty)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] shrink-0">
          <span>Visited:</span>
          <span className="font-mono text-[var(--text-primary)] font-semibold">
            {currentStep?.visitedOrder ? currentStep.visitedOrder.join(" → ") : "None"}
          </span>
        </div>
      </div>

      {/* Step Scrubber and Playback Controls */}
      {totalSteps > 1 && (
        <div className="flex items-center gap-3 pt-1 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-1">
            <button
              onClick={stepBackwardGraph}
              disabled={currentGraphStepIndex === 0}
              className="p-1 rounded border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-secondary)]"
              title="Step Back (←)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={togglePlay}
              className="px-2.5 py-1 rounded bg-[var(--accent)] text-white text-xs font-semibold flex items-center gap-1"
              title="Play / Pause"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button
              onClick={stepForwardGraph}
              disabled={currentGraphStepIndex >= totalSteps - 1}
              className="p-1 rounded border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-secondary)]"
              title="Step Forward (→)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums min-w-[70px]">
            {currentGraphStepIndex} / {totalSteps - 1}
          </span>

          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentGraphStepIndex}
            onChange={(e) => seekGraphStep(Number(e.target.value))}
            className="flex-1"
            style={{
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border-color) ${pct}%, var(--border-color) 100%)`,
            }}
          />

          <span className="text-xs font-medium text-[var(--text-secondary)] truncate max-w-sm hidden md:inline">
            {currentStep?.description}
          </span>
        </div>
      )}
    </div>
  );
}

