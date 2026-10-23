"use client";

import React from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { ALGORITHMS } from "@/lib/algorithms";
import { History, Eye, ArrowRightLeft, Check, Compass } from "lucide-react";

export default function Narration() {
  const {
    steps,
    currentStepIndex,
    selectedTopic,
    treeSteps,
    currentTreeStepIndex,
    graphSteps,
    currentGraphStepIndex,
    linkedListSteps,
    currentLinkedListStepIndex,
    stackQueueSteps,
    currentStackQueueStepIndex,
    dynamicArraySteps,
    currentDynamicArrayStepIndex,
    heapSteps,
    currentHeapStepIndex,
    hashTableSteps,
    currentHashTableStepIndex,
  } = useVisualizerStore();

  const isHashTable = selectedTopic === "hashtable";
  const isHeap = selectedTopic === "heap";
  const isArray = selectedTopic === "array";
  const isTree = selectedTopic === "bst";
  const isGraph = selectedTopic === "graph";
  const isLinkedList = selectedTopic === "linkedlist";
  const isStackQueue = selectedTopic === "stackqueue";

  const activeStep = isHashTable
    ? hashTableSteps[currentHashTableStepIndex] || hashTableSteps[0]
    : isHeap
    ? heapSteps[currentHeapStepIndex] || heapSteps[0]
    : isArray
    ? dynamicArraySteps[currentDynamicArrayStepIndex] || dynamicArraySteps[0]
    : isStackQueue
    ? stackQueueSteps[currentStackQueueStepIndex] || stackQueueSteps[0]
    : isLinkedList
    ? linkedListSteps[currentLinkedListStepIndex] || linkedListSteps[0]
    : isGraph
    ? graphSteps[currentGraphStepIndex] || graphSteps[0]
    : isTree
    ? treeSteps[currentTreeStepIndex] || treeSteps[0]
    : steps[currentStepIndex] || steps[0];

  // Retrieve last 3 steps history (excluding current step)
  const historySteps = React.useMemo(() => {
    const list = [];
    if (isHashTable) {
      for (let i = currentHashTableStepIndex - 1; i >= Math.max(0, currentHashTableStepIndex - 3); i--) {
        list.push(hashTableSteps[i]);
      }
    } else if (isHeap) {
      for (let i = currentHeapStepIndex - 1; i >= Math.max(0, currentHeapStepIndex - 3); i--) {
        list.push(heapSteps[i]);
      }
    } else if (isArray) {
      for (let i = currentDynamicArrayStepIndex - 1; i >= Math.max(0, currentDynamicArrayStepIndex - 3); i--) {
        list.push(dynamicArraySteps[i]);
      }
    } else if (isStackQueue) {
      for (let i = currentStackQueueStepIndex - 1; i >= Math.max(0, currentStackQueueStepIndex - 3); i--) {
        list.push(stackQueueSteps[i]);
      }
    } else if (isLinkedList) {
      for (let i = currentLinkedListStepIndex - 1; i >= Math.max(0, currentLinkedListStepIndex - 3); i--) {
        list.push(linkedListSteps[i]);
      }
    } else if (isGraph) {
      for (let i = currentGraphStepIndex - 1; i >= Math.max(0, currentGraphStepIndex - 3); i--) {
        list.push(graphSteps[i]);
      }
    } else if (isTree) {
      for (let i = currentTreeStepIndex - 1; i >= Math.max(0, currentTreeStepIndex - 3); i--) {
        list.push(treeSteps[i]);
      }
    } else {
      for (let i = currentStepIndex - 1; i >= Math.max(0, currentStepIndex - 3); i--) {
        list.push(steps[i]);
      }
    }
    return list;
  }, [isHashTable, isHeap, isArray, isStackQueue, isLinkedList, isGraph, isTree, steps, currentStepIndex, treeSteps, currentTreeStepIndex, graphSteps, currentGraphStepIndex, linkedListSteps, currentLinkedListStepIndex, stackQueueSteps, currentStackQueueStepIndex, dynamicArraySteps, currentDynamicArrayStepIndex, heapSteps, currentHeapStepIndex, hashTableSteps, currentHashTableStepIndex]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "compare":
      case "examining":
      case "peek":
      case "access":
      case "search":
        return <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />;
      case "swap":
      case "relaxed":
      case "reverse":
      case "pop":
      case "dequeue":
      case "pop_back":
      case "shift_right":
      case "sift_down":
      case "sift_up":
      case "extract":
      case "delete":
        return <ArrowRightLeft className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />;
      case "sorted":
      case "found":
      case "settled":
      case "path":
        return <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0" />;
      case "pivot":
      case "insert":
      case "insert_head":
      case "insert_tail":
      case "push":
      case "enqueue":
      case "push_back":
      case "insert_at":
      case "resize":
      case "heapify":
      case "rehash":
        return <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col p-3 gap-2 text-xs">
      {/* Current Step Narration */}
      <div className="p-3 rounded-md bg-[var(--bg-raised)] border border-[var(--border-color)] flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <span>
            STEP {activeStep?.stepIndex ?? 0}
            {!isTree && !isGraph && !isLinkedList && !isStackQueue && !isArray && !isHeap && !isHashTable && ` • PASS ${(activeStep as any)?.pass ?? 1}`}
          </span>
          <span className="uppercase font-semibold tracking-wider text-[var(--accent)]">
            {(activeStep as any)?.action || (activeStep as any)?.operation || (activeStep as any)?.algorithm || (activeStep as any)?.mode || "STEP"}
          </span>
        </div>

        {/* Primary templated deduction */}
        <p className="font-semibold text-sm text-[var(--text-primary)] leading-snug">
          {activeStep?.reasoning}
        </p>

        {/* Invariant anchor */}
        <div className="pt-1.5 border-t border-[var(--border-color)] text-[11px] text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">Invariant: </span>
          <span>{activeStep?.description}</span>
        </div>
      </div>

      {/* Short History of Last 3 Steps */}
      {historySteps.length > 0 && (
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
            <History className="w-3 h-3" />
            <span>Recent History</span>
          </div>

          <div className="space-y-1">
            {historySteps.map((hStep: any) => (
              <div
                key={hStep.stepIndex}
                className="px-2 py-1.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-start gap-2 text-[11px] text-[var(--text-secondary)] opacity-80"
              >
                {getActionIcon(hStep.action || hStep.operation)}
                <div className="flex-1 truncate">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] mr-1.5">
                    #{hStep.stepIndex}
                  </span>
                  <span>{hStep.reasoning}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

