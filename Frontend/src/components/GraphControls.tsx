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
  Navigation,
  Layers,
  Edit3,
  Plus,
  Trash2,
  X,
  Compass,
} from "lucide-react";

export default function GraphControls() {
  const {
    graphSteps,
    currentGraphStepIndex,
    graphAlgorithm,
    graphStartNode,
    graphTargetNode,
    graphPresetId,
    isGraphSandboxOpen,
    toggleGraphSandbox,
    addCustomGraphNode,
    removeCustomGraphNode,
    addCustomGraphEdge,
    removeCustomGraphEdge,
    loadCustomGraphTemplate,
    clearCustomGraph,
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

  const availableNodes = currentStep?.nodes.map((n) => n.id) || ["A", "B", "C", "D", "E", "F"];
  const currentEdges = currentStep?.edges || [];

  // Local state for edge connection in Sandbox
  const [edgeFrom, setEdgeFrom] = useState(availableNodes[0] || "A");
  const [edgeTo, setEdgeTo] = useState(availableNodes[1] || "B");
  const [edgeWeight, setEdgeWeight] = useState(3);
  const [isBidirectional, setIsBidirectional] = useState(true);

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

  // Keep edge selector valid if nodes change
  useEffect(() => {
    if (availableNodes.length > 0 && !availableNodes.includes(edgeFrom)) {
      setEdgeFrom(availableNodes[0]);
    }
    if (availableNodes.length > 1 && !availableNodes.includes(edgeTo)) {
      setEdgeTo(availableNodes[1]);
    }
  }, [availableNodes, edgeFrom, edgeTo]);

  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (edgeFrom && edgeTo && edgeFrom !== edgeTo) {
      addCustomGraphEdge(edgeFrom, edgeTo, edgeWeight, isBidirectional);
    }
  };

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

        {/* Graph Presets & Sandbox Toggle */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-[var(--text-muted)]">Network:</span>
          <button
            onClick={() => resetGraphPreset("classic")}
            className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
              graphPresetId === "classic"
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold"
                : "border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
            }`}
            title="Textbook 6-node weighted network"
          >
            Classic 6
          </button>
          <button
            onClick={() => resetGraphPreset("cyclic")}
            className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
              graphPresetId === "cyclic"
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold"
                : "border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
            }`}
            title="3D Ring cycle with chords"
          >
            Ring Cycle
          </button>
          <button
            onClick={() => resetGraphPreset("denseDag")}
            className={`px-2 py-0.5 rounded border text-[11px] transition-colors ${
              graphPresetId === "denseDag"
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold"
                : "border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
            }`}
            title="Directed Acyclic Graph"
          >
            DAG
          </button>

          {/* Graph Sandbox / Draw Graph Trigger */}
          <button
            onClick={toggleGraphSandbox}
            className={`px-2.5 py-0.5 rounded border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
              isGraphSandboxOpen
                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                : graphPresetId === "custom"
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)] font-bold"
                : "border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)]"
            }`}
            title="Draw and edit your own custom 3D graph"
          >
            <Edit3 className="w-3 h-3" />
            <span>Draw Graph {graphPresetId === "custom" && "•"}</span>
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

      {/* Interactive Graph Sandbox Drawer */}
      {isGraphSandboxOpen && (
        <div className="p-3 rounded-md bg-[var(--bg-raised)] border border-[var(--border-strong)] flex flex-col gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-bold text-[var(--text-primary)]">Interactive Graph Sandbox</span>
              <span className="text-[11px] text-[var(--text-muted)]">
                (Add vertices, connect edges & run traversals in real-time)
              </span>
            </div>
            <button
              onClick={toggleGraphSandbox}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Close Sandbox"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Column 1: Vertices Management */}
            <div className="flex flex-col gap-2 p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[11px] text-[var(--text-primary)]">
                  Vertices ({availableNodes.length}/10):
                </span>
                <button
                  onClick={addCustomGraphNode}
                  disabled={availableNodes.length >= 10}
                  className="px-2 py-0.5 rounded bg-[var(--accent)] text-white font-medium text-[11px] flex items-center gap-1 disabled:opacity-40"
                  title="Add next alphabetical vertex"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Node</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                {availableNodes.map((id) => (
                  <div
                    key={id}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] text-[11px] font-mono"
                  >
                    <span className="font-bold text-[var(--text-primary)]">{id}</span>
                    {availableNodes.length > 2 && (
                      <button
                        onClick={() => removeCustomGraphNode(id)}
                        className="text-[var(--text-muted)] hover:text-rose-500 ml-1 transition-colors"
                        title={`Delete node ${id}`}
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Edge Connection Form */}
            <form
              onSubmit={handleAddEdge}
              className="flex flex-col gap-2 p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[11px] text-[var(--text-primary)]">Connect Edge:</span>
                <label className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBidirectional}
                    onChange={(e) => setIsBidirectional(e.target.checked)}
                    className="rounded accent-[var(--accent)] w-3 h-3"
                  />
                  <span>Undirected</span>
                </label>
              </div>

              <div className="flex items-center gap-1.5">
                <select
                  value={edgeFrom}
                  onChange={(e) => setEdgeFrom(e.target.value)}
                  className="flex-1 px-1.5 py-1 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] font-mono text-[11px] text-[var(--text-primary)]"
                >
                  {availableNodes.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                <span className="text-[var(--text-muted)] font-mono">→</span>

                <select
                  value={edgeTo}
                  onChange={(e) => setEdgeTo(e.target.value)}
                  className="flex-1 px-1.5 py-1 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] font-mono text-[11px] text-[var(--text-primary)]"
                >
                  {availableNodes.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 px-1.5 py-1 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] text-[11px]">
                  <span className="text-[var(--text-muted)] text-[10px]">Wt:</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(Math.max(1, Number(e.target.value)))}
                    className="w-10 bg-transparent font-mono font-bold text-[var(--text-primary)] outline-none text-right"
                  />
                </div>

                <button
                  type="submit"
                  disabled={edgeFrom === edgeTo}
                  className="px-2.5 py-1 rounded bg-[var(--accent)] text-white text-[11px] font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
                >
                  Connect
                </button>
              </div>

              {/* Existing Edges Badges */}
              <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pt-0.5">
                {currentEdges.map((e) => (
                  <span
                    key={e.id}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-secondary)]"
                  >
                    <span>
                      {e.from} {e.directed ? "→" : "—"} {e.to} ({e.weight})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCustomGraphEdge(e.id)}
                      className="text-[var(--text-muted)] hover:text-rose-500 transition-colors ml-0.5"
                      title="Remove edge"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </form>

            {/* Column 3: Sandbox Quick Templates */}
            <div className="flex flex-col gap-2 p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <span className="font-semibold text-[11px] text-[var(--text-primary)]">Quick Topology Templates:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => loadCustomGraphTemplate("triangle")}
                  className="px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] truncate"
                  title="3-node cycle"
                >
                  △ Triangle (3)
                </button>
                <button
                  onClick={() => loadCustomGraphTemplate("star")}
                  className="px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] truncate"
                  title="Hub node radiating to 4 nodes"
                >
                  ★ Star Hub (5)
                </button>
                <button
                  onClick={() => loadCustomGraphTemplate("bipartite")}
                  className="px-2 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] text-[11px] text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] truncate"
                  title="2x2 cross connections"
                >
                  ☵ Bipartite (4)
                </button>
                <button
                  onClick={clearCustomGraph}
                  className="px-2 py-1 rounded border border-rose-300 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/50 text-[11px] text-left text-rose-700 dark:text-rose-400 truncate flex items-center gap-1"
                  title="Reset to 2 blank nodes"
                >
                  <Trash2 className="w-3 h-3 shrink-0" />
                  <span>Blank Canvas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

