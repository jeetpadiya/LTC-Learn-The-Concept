"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { ALGORITHMS } from "@/lib/algorithms";
import TopBar from "@/components/TopBar";
import TopicNav from "@/components/TopicNav";
import Visualizer from "@/components/Visualizer";
import CompareVisualizer from "@/components/CompareVisualizer";
import TreeVisualizer3D from "@/components/TreeVisualizer3D";
import TreeControls from "@/components/TreeControls";
import GraphVisualizer3D from "@/components/GraphVisualizer3D";
import GraphControls from "@/components/GraphControls";
import LinkedListVisualizer from "@/components/LinkedListVisualizer";
import LinkedListControls from "@/components/LinkedListControls";
import StackQueueVisualizer from "@/components/StackQueueVisualizer";
import StackQueueControls from "@/components/StackQueueControls";
import DynamicArrayVisualizer from "@/components/DynamicArrayVisualizer";
import DynamicArrayControls from "@/components/DynamicArrayControls";
import HeapVisualizer from "@/components/HeapVisualizer";
import HeapControls from "@/components/HeapControls";
import HashTableVisualizer from "@/components/HashTableVisualizer";
import HashTableControls from "@/components/HashTableControls";
import ArrayRow from "@/components/ArrayRow";
import LegendStrip from "@/components/LegendStrip";
import PlaybackBar from "@/components/PlaybackBar";
import Narration from "@/components/Narration";
import CodePanel from "@/components/CodePanel";
import ComplexityPanel from "@/components/ComplexityPanel";
import PredictBanner from "@/components/PredictBanner";
import InlineQuiz from "@/components/InlineQuiz";
import CustomArrayModal from "@/components/CustomArrayModal";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Info,
  Edit3,
} from "lucide-react";

export default function Home() {
  const {
    selectedTopic,
    steps,
    currentStepIndex,
    treeSteps,
    currentTreeStepIndex,
    graphSteps,
    currentGraphStepIndex,
    linkedListSteps,
    currentLinkedListStepIndex,
    linkedListType,
    stackQueueSteps,
    currentStackQueueStepIndex,
    stackQueueMode,
    dynamicArraySteps,
    currentDynamicArrayStepIndex,
    dynamicArrayMode,
    heapSteps,
    currentHeapStepIndex,
    heapType,
    hashTableSteps,
    currentHashTableStepIndex,
    hashStrategy,
    theme,
    playbackSpeed,
    isCompareMode,
    showInlineQuiz,
    showComplexityTab,
    setShowComplexityTab,
    checkBackendHealth,
    openCustomModal,
  } = useVisualizerStore();

  const [isNavOpen, setIsNavOpen] = useState(true);
  const isTree = selectedTopic === "bst";
  const isGraph = selectedTopic === "graph";
  const isLinkedList = selectedTopic === "linkedlist";
  const isStackQueue = selectedTopic === "stackqueue";
  const isArray = selectedTopic === "array";
  const isHeap = selectedTopic === "heap";
  const isHashTable = selectedTopic === "hashtable";
  const isStructure = isTree || isGraph || isLinkedList || isStackQueue || isArray || isHeap || isHashTable;

  const currentStep = steps[currentStepIndex] || steps[0];
  const currentTreeStep = treeSteps[currentTreeStepIndex] || treeSteps[0];
  const currentGraphStep = graphSteps[currentGraphStepIndex] || graphSteps[0];
  const currentLinkedListStep = linkedListSteps[currentLinkedListStepIndex] || linkedListSteps[0];
  const currentStackQueueStep = stackQueueSteps[currentStackQueueStepIndex] || stackQueueSteps[0];
  const currentDynamicArrayStep = dynamicArraySteps[currentDynamicArrayStepIndex] || dynamicArraySteps[0];
  const currentHeapStep = heapSteps[currentHeapStepIndex] || heapSteps[0];
  const currentHashTableStep = hashTableSteps[currentHashTableStepIndex] || hashTableSteps[0];
  const algorithm = ALGORITHMS[selectedTopic];

  // Derive locked sorted elements set
  const sortedIndicesSet = useMemo(
    () => (currentStep ? new Set(currentStep.sortedIndices) : new Set<number>()),
    [currentStep?.sortedIndices]
  );

  // Initial check for C++ backend
  useEffect(() => {
    checkBackendHealth();
  }, [checkBackendHealth]);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] overflow-hidden font-sans">
      {/* Top Application Bar (Two groups only: LEFT data, RIGHT modes) */}
      <TopBar />

      {/* Main 3-Pane Resizable / Collapsible Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation: Topics with progress rings & coming soon */}
        <div
          className={`shrink-0 transition-all duration-200 border-r border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col ${
            isNavOpen ? "w-56 lg:w-60" : "w-0 overflow-hidden border-r-0"
          }`}
        >
          <TopicNav />
        </div>

        {/* Center Primary Focus (≥ 55% width, flex-fills available height, no gaps) */}
        <main className="flex-1 flex flex-col p-3 overflow-hidden bg-[var(--bg-canvas)] min-w-0">
          {/* Header row: Nav collapse button, Topic Title + Complexity Chips */}
          <div className="flex items-center justify-between pb-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] transition-colors shrink-0"
                title={isNavOpen ? "Collapse navigation" : "Expand navigation"}
              >
                {isNavOpen ? (
                  <PanelLeftClose className="w-3.5 h-3.5" />
                ) : (
                  <PanelLeftOpen className="w-3.5 h-3.5" />
                )}
              </button>

              <div className="flex items-center gap-2 truncate">
                <h1 className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {algorithm?.name}
                </h1>
                {!isStructure && (
                  <button
                    onClick={openCustomModal}
                    className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[11px] text-[var(--accent)] font-medium flex items-center gap-1 transition-colors shrink-0"
                    title="Enter your own numbers to sort"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>My Numbers</span>
                  </button>
                )}
                <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
                  • {algorithm?.summary.slice(0, 48)}...
                </span>
              </div>
            </div>

            {/* Complexity Chips & View Toggle */}
            <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] text-[11px]">
                Time: <span className="font-semibold text-[var(--text-primary)]">{algorithm?.timeComplexity.average}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] text-[11px] hidden md:inline">
                Space: <span className="font-semibold text-[var(--text-primary)]">{algorithm?.spaceComplexity}</span>
              </span>
              {!isStructure && (
                <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] text-[11px] hidden lg:inline">
                  Stable: {algorithm?.stable ? "Yes" : "No"}
                </span>
              )}

              <button
                onClick={() => setShowComplexityTab(!showComplexityTab)}
                className="p-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)]"
                title="Toggle detailed Big-O specs"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Predict Mode Interactive Question Prompt (Sorting only) */}
          {!isStructure && (
            <div className="shrink-0 mb-2">
              <PredictBanner />
            </div>
          )}

          {/* Inline Quiz View (If toggled open, renders directly in main stream) */}
          {showInlineQuiz && (
            <div className="shrink-0 mb-2">
              <InlineQuiz />
            </div>
          )}

          {/* Visualization Stage Container: Flex-fills available height cleanly */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {isHashTable ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Hash Table Visualizer (Chaining vs Linear Probing & Rehashing) */}
                <div className="flex-1 w-full min-h-0 overflow-hidden">
                  <HashTableVisualizer
                    buckets={currentHashTableStep?.buckets || []}
                    oldBuckets={currentHashTableStep?.oldBuckets}
                    capacity={currentHashTableStep?.capacity || 7}
                    keyCount={currentHashTableStep?.keyCount || 0}
                    loadFactor={currentHashTableStep?.loadFactor || 0}
                    strategy={hashStrategy}
                    operation={currentHashTableStep?.operation || "init"}
                    activeKey={currentHashTableStep?.activeKey}
                    computedHash={currentHashTableStep?.computedHash}
                    probeSequence={currentHashTableStep?.probeSequence}
                    theme={theme}
                  />
                </div>

                {/* Interactive Hash Table Operation Controls */}
                <HashTableControls />
              </div>
            ) : isHeap ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Binary Heap Visualizer (Tree + Array Dual Representation) */}
                <div className="flex-1 w-full min-h-0 overflow-hidden">
                  <HeapVisualizer
                    nodes={currentHeapStep?.nodes || []}
                    array={currentHeapStep?.array || []}
                    heapType={heapType}
                    operation={currentHeapStep?.operation || "init"}
                    activeIndices={currentHeapStep?.activeIndices}
                    swappedIndices={currentHeapStep?.swappedIndices}
                    theme={theme}
                  />
                </div>

                {/* Interactive Heap Operation Controls */}
                <HeapControls />
              </div>
            ) : isArray ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Array & Dynamic Array Visualizer */}
                <div className="flex-1 w-full min-h-0 overflow-hidden">
                  <DynamicArrayVisualizer
                    cells={currentDynamicArrayStep?.cells || []}
                    oldCells={currentDynamicArrayStep?.oldCells}
                    size={currentDynamicArrayStep?.size ?? 0}
                    capacity={currentDynamicArrayStep?.capacity ?? 0}
                    mode={dynamicArrayMode}
                    operation={currentDynamicArrayStep?.operation || "init"}
                    targetIndex={currentDynamicArrayStep?.targetIndex}
                    theme={theme}
                  />
                </div>

                {/* Interactive Dynamic Array Operation Controls */}
                <DynamicArrayControls />
              </div>
            ) : isStackQueue ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Stack & Queue Visualizer (LIFO Chamber & FIFO Pipeline) */}
                <div className="flex-1 w-full min-h-0 overflow-hidden">
                  <StackQueueVisualizer
                    items={currentStackQueueStep?.items || []}
                    mode={stackQueueMode}
                    maxCapacity={currentStackQueueStep?.maxCapacity || 8}
                    operation={currentStackQueueStep?.operation || "init"}
                    theme={theme}
                  />
                </div>

                {/* Interactive Stack & Queue Operation Controls */}
                <StackQueueControls />
              </div>
            ) : isLinkedList ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Linked List Visualizer */}
                <div className="flex-1 w-full min-h-0 overflow-hidden">
                  <LinkedListVisualizer
                    nodes={currentLinkedListStep?.nodes || []}
                    pointers={currentLinkedListStep?.pointers || {}}
                    listType={linkedListType}
                    theme={theme}
                  />
                </div>

                {/* Interactive Linked List Operation Controls */}
                <LinkedListControls />
              </div>
            ) : isGraph ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* 3D WebGL Graph Canvas with OrbitControls */}
                <div className="flex-1 w-full min-h-0 overflow-hidden">
                  <GraphVisualizer3D
                    nodes={currentGraphStep?.nodes || []}
                    edges={currentGraphStep?.edges || []}
                    theme={theme}
                  />
                </div>

                {/* Interactive Graph Operation Controls */}
                <GraphControls />
              </div>
            ) : isTree ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* 3D WebGL Canvas with OrbitControls */}
                <div className="flex-1 w-full min-h-0 overflow-hidden">
                  <TreeVisualizer3D
                    nodes={currentTreeStep?.nodes || []}
                    edges={currentTreeStep?.edges || []}
                    theme={theme}
                  />
                </div>

                {/* Interactive Tree Operation Controls (Insert, Search, Delete, Scrubber) */}
                <TreeControls />
              </div>
            ) : isCompareMode ? (
              <CompareVisualizer />
            ) : (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* 1. Canvas fills all vertical height */}
                <div className="flex-1 w-full min-h-0 overflow-hidden">
                  <Visualizer
                    array={currentStep?.arraySnapshot || []}
                    activeIndices={currentStep?.indices || []}
                    action={currentStep?.action || "default"}
                    sortedIndices={sortedIndicesSet}
                    theme={theme}
                    speed={playbackSpeed}
                  />
                </div>

                {/* 2. Legend as slim strip under canvas */}
                <LegendStrip />

                {/* 3. Array row of cells showing index + value, synced with bars & pointers */}
                <ArrayRow
                  array={currentStep?.arraySnapshot || []}
                  activeIndices={currentStep?.indices || []}
                  action={currentStep?.action || "default"}
                  pointers={currentStep?.pointers || {}}
                  sortedIndices={sortedIndicesSet}
                />

                {/* 4. Playback bar directly attached below with scrubber ticks */}
                <PlaybackBar />
              </div>
            )}
          </div>
        </main>

        {/* Right Stacked Panel: Top = Narration (last 3 history), Bottom = Code with inline vars */}
        <aside className="w-80 lg:w-96 shrink-0 border-l border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col overflow-hidden">
          {showComplexityTab ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-2 border-b border-[var(--border-color)] bg-[var(--bg-raised)] flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)]">Big-O & Loop Invariants</span>
                <button
                  onClick={() => setShowComplexityTab(false)}
                  className="text-xs text-[var(--accent)] font-semibold"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ComplexityPanel />
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Top Core View: Narration (current step + history of last 3) */}
              <div className="h-[42%] border-b border-[var(--border-color)] overflow-y-auto">
                <Narration />
              </div>

              {/* Bottom Core View: C++ Code with active line + inline variable values */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <CodePanel />
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Interactive Custom Array Input Builder */}
      <CustomArrayModal />
    </div>
  );
}
