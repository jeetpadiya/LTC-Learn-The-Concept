import { HeapNode, HeapNodeState, HeapTraceStep, HeapType } from "@/types/visualizer";

export function parentIdx(i: number): number | null {
  return i === 0 ? null : Math.floor((i - 1) / 2);
}

export function leftIdx(i: number, n: number): number | null {
  const left = 2 * i + 1;
  return left < n ? left : null;
}

export function rightIdx(i: number, n: number): number | null {
  const right = 2 * i + 2;
  return right < n ? right : null;
}

export function generateHeapNodes(
  arr: number[],
  activeIndices: number[] = [],
  swappedIndices?: [number, number],
  stateOverrides?: Record<number, HeapNodeState>
): HeapNode[] {
  const n = arr.length;
  const nodes: HeapNode[] = [];

  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const nodesInLevel = Math.pow(2, level);
    const posInLevel = i - (nodesInLevel - 1);

    // Compute 2D SVG canvas position (800x320 view box)
    const slotWidth = 800 / nodesInLevel;
    const x = (posInLevel + 0.5) * slotWidth;
    const y = 35 + level * 65;

    let state: HeapNodeState = "default";
    if (stateOverrides && stateOverrides[i]) {
      state = stateOverrides[i];
    } else if (swappedIndices && (swappedIndices[0] === i || swappedIndices[1] === i)) {
      state = "swapping";
    } else if (activeIndices.includes(i)) {
      state = "active";
    }

    nodes.push({
      id: `heap-node-${i}-${arr[i]}`,
      val: arr[i],
      index: i,
      parentIndex: parentIdx(i),
      leftChildIndex: leftIdx(i, n),
      rightChildIndex: rightIdx(i, n),
      x,
      y,
      state,
    });
  }

  return nodes;
}

function shouldSwap(childVal: number, parentVal: number, type: HeapType): boolean {
  return type === "min" ? childVal < parentVal : childVal > parentVal;
}

// ==========================================
// 1. INSERT (Sift-Up, O(log n))
// ==========================================
export function generateInsertTrace(
  currentArr: number[],
  val: number,
  type: HeapType
): HeapTraceStep[] {
  const steps: HeapTraceStep[] = [];
  const arr = [...currentArr, val];
  let curr = arr.length - 1;

  // Step 0: Append at leaf slot
  steps.push({
    stepIndex: 0,
    heapType: type,
    operation: "insert",
    array: [...arr],
    nodes: generateHeapNodes(arr, [curr], undefined, { [curr]: "new" }),
    activeIndices: [curr],
    activeVal: val,
    description: `Inserted ${val} at index ${curr} (first available leaf slot).`,
    reasoning: `Appended ${val} at index ${curr} to maintain the Complete Binary Tree property. Sift-up will restore heap order.`,
    codeLine: 2,
    inlineVariables: { insertedVal: val, atIndex: curr, heapSize: arr.length },
  });

  // Sift-Up loop
  while (curr > 0) {
    const p = Math.floor((curr - 1) / 2);

    // Step A: Compare with parent
    steps.push({
      stepIndex: steps.length,
      heapType: type,
      operation: "sift_up",
      array: [...arr],
      nodes: generateHeapNodes(arr, [curr, p], undefined, { [curr]: "comparing", [p]: "comparing" }),
      activeIndices: [curr, p],
      activeVal: val,
      description: `Comparing child [${curr}] (${arr[curr]}) with parent [${p}] (${arr[p]}).`,
      reasoning: type === "min"
        ? `Min-Heap Invariant check: Parent (${arr[p]}) must be ≤ Child (${arr[curr]}).`
        : `Max-Heap Invariant check: Parent (${arr[p]}) must be ≥ Child (${arr[curr]}).`,
      codeLine: 5,
      inlineVariables: { childIdx: curr, childVal: arr[curr], parentIdx: p, parentVal: arr[p] },
    });

    if (shouldSwap(arr[curr], arr[p], type)) {
      // Step B: Swap with parent
      const temp = arr[curr];
      arr[curr] = arr[p];
      arr[p] = temp;

      steps.push({
        stepIndex: steps.length,
        heapType: type,
        operation: "sift_up",
        array: [...arr],
        nodes: generateHeapNodes(arr, [], [curr, p]),
        activeIndices: [p],
        swappedIndices: [curr, p],
        activeVal: val,
        description: `Swapped [${curr}] (${arr[curr]}) with parent [${p}] (${arr[p]}).`,
        reasoning: `Violation detected (${type === "min" ? "child < parent" : "child > parent"}). Sift-up swap restores local heap order.`,
        codeLine: 7,
        inlineVariables: { swappedFrom: curr, swappedTo: p, val: temp },
      });

      curr = p;
    } else {
      // Invariant holds
      steps.push({
        stepIndex: steps.length,
        heapType: type,
        operation: "sift_up",
        array: [...arr],
        nodes: generateHeapNodes(arr, [curr], undefined, { [curr]: "settled" }),
        activeIndices: [curr],
        activeVal: val,
        description: `Heap order holds! Child (${arr[curr]}) satisfies ${type === "min" ? "≥" : "≤"} parent (${arr[p]}).`,
        reasoning: `No violation found. Subtree rooted at parent satisfies the ${type}-heap property. Sift-up terminates.`,
        codeLine: 9,
        inlineVariables: { settledIndex: curr },
      });
      break;
    }
  }

  // Final Step: Settled
  steps.push({
    stepIndex: steps.length,
    heapType: type,
    operation: "insert",
    array: [...arr],
    nodes: generateHeapNodes(arr, [curr], undefined, { [curr]: "settled" }),
    activeIndices: [curr],
    activeVal: val,
    description: `Insertion complete! Value ${val} settled at index ${curr}.`,
    reasoning: `Heap invariant restored across all levels. Sift-up took at most O(log n) swaps (height of tree = ⌊log₂ n⌋).`,
    codeLine: 10,
    inlineVariables: { finalIndex: curr, totalElements: arr.length },
  });

  return steps;
}

// ==========================================
// 2. EXTRACT ROOT (Sift-Down, O(log n))
// ==========================================
export function generateExtractTrace(
  currentArr: number[],
  type: HeapType
): HeapTraceStep[] {
  const steps: HeapTraceStep[] = [];
  if (currentArr.length === 0) {
    return [
      {
        stepIndex: 0,
        heapType: type,
        operation: "extract",
        array: [],
        nodes: [],
        description: "Heap is empty. Cannot extract root.",
        reasoning: "Extract called on an empty heap buffer.",
        codeLine: 1,
        inlineVariables: { size: 0 },
      },
    ];
  }

  const arr = [...currentArr];
  const extractedRoot = arr[0];

  if (arr.length === 1) {
    steps.push({
      stepIndex: 0,
      heapType: type,
      operation: "extract",
      array: [extractedRoot],
      nodes: generateHeapNodes(arr, [0], undefined, { 0: "active" }),
      activeIndices: [0],
      activeVal: extractedRoot,
      description: `Extracted only element ${extractedRoot}. Heap is now empty.`,
      reasoning: "Single node extracted in strictly O(1) time.",
      codeLine: 2,
      inlineVariables: { extractedVal: extractedRoot, remaining: 0 },
    });
    return steps;
  }

  const lastLeaf = arr[arr.length - 1];

  // Step 0: Identify root to extract and last leaf
  steps.push({
    stepIndex: 0,
    heapType: type,
    operation: "extract",
    array: [...arr],
    nodes: generateHeapNodes(arr, [0, arr.length - 1], undefined, { 0: "active", [arr.length - 1]: "comparing" }),
    activeIndices: [0, arr.length - 1],
    activeVal: extractedRoot,
    description: `Extracting root ${extractedRoot} (${type === "min" ? "minimum" : "maximum"}). Swap with last leaf [${arr.length - 1}] (${lastLeaf}).`,
    reasoning: `To maintain the complete binary tree structure, root is replaced with the last element (${lastLeaf}), then popped.`,
    codeLine: 3,
    inlineVariables: { rootVal: extractedRoot, lastLeafVal: lastLeaf },
  });

  // Step 1: Replace root with last element and pop
  arr[0] = lastLeaf;
  arr.pop();

  steps.push({
    stepIndex: 1,
    heapType: type,
    operation: "extract",
    array: [...arr],
    nodes: generateHeapNodes(arr, [0], undefined, { 0: "new" }),
    activeIndices: [0],
    activeVal: extractedRoot,
    description: `Root replaced with ${lastLeaf}. Popped old leaf. Sift-down beginning from root [0].`,
    reasoning: `Root element is now ${lastLeaf}, which likely violates the ${type}-heap property. Sift-down will demote it to its valid position.`,
    codeLine: 5,
    inlineVariables: { newRootVal: lastLeaf, newSize: arr.length },
  });

  // Sift-Down loop
  let curr = 0;
  const n = arr.length;

  while (curr < n) {
    const left = 2 * curr + 1;
    const right = 2 * curr + 2;
    let target = curr;

    if (left < n && shouldSwap(arr[left], arr[target], type)) {
      target = left;
    }
    if (right < n && shouldSwap(arr[right], arr[target], type)) {
      target = right;
    }

    if (target === curr) {
      // Invariant holds
      steps.push({
        stepIndex: steps.length,
        heapType: type,
        operation: "sift_down",
        array: [...arr],
        nodes: generateHeapNodes(arr, [curr], undefined, { [curr]: "settled" }),
        activeIndices: [curr],
        activeVal: extractedRoot,
        description: `Heap property satisfied at index [${curr}]. Node ${arr[curr]} dominates both children.`,
        reasoning: `No violation detected with left or right children. Sift-down terminates in O(log n).`,
        codeLine: 9,
        inlineVariables: { settledIndex: curr, val: arr[curr] },
      });
      break;
    }

    // Step: Compare current with children
    const compareIndices = [curr, left];
    if (right < n) compareIndices.push(right);

    steps.push({
      stepIndex: steps.length,
      heapType: type,
      operation: "sift_down",
      array: [...arr],
      nodes: generateHeapNodes(arr, compareIndices, undefined, {
        [curr]: "comparing",
        [left]: left === target ? "active" : "comparing",
        ...(right < n ? { [right]: right === target ? "active" : "comparing" } : {}),
      }),
      activeIndices: compareIndices,
      activeVal: extractedRoot,
      description: `Comparing [${curr}] (${arr[curr]}) with ${target === left ? "left" : "right"} child [${target}] (${arr[target]}).`,
      reasoning: `${type === "min" ? "Smallest" : "Largest"} child is [${target}] (${arr[target]}). Violation detected!`,
      codeLine: 11,
      inlineVariables: { currentVal: arr[curr], bestChildIdx: target, bestChildVal: arr[target] },
    });

    // Step: Swap with target child
    const temp = arr[curr];
    arr[curr] = arr[target];
    arr[target] = temp;

    steps.push({
      stepIndex: steps.length,
      heapType: type,
      operation: "sift_down",
      array: [...arr],
      nodes: generateHeapNodes(arr, [], [curr, target]),
      activeIndices: [target],
      swappedIndices: [curr, target],
      activeVal: extractedRoot,
      description: `Swapped [${curr}] (${arr[curr]}) with [${target}] (${arr[target]}).`,
      reasoning: `Demoted ${temp} to level ${Math.floor(Math.log2(target + 1))}. Continues downward if necessary.`,
      codeLine: 13,
      inlineVariables: { swappedFrom: curr, swappedTo: target },
    });

    curr = target;
  }

  // Final Step: Done
  steps.push({
    stepIndex: steps.length,
    heapType: type,
    operation: "extract",
    array: [...arr],
    nodes: generateHeapNodes(arr, [0], undefined, { 0: "settled" }),
    activeIndices: [0],
    activeVal: extractedRoot,
    description: `Extract complete! Extracted value was ${extractedRoot}. Root is now ${arr[0]}.`,
    reasoning: `Extracted root in O(log n) worst-case time by traversing from root to leaf along tree height.`,
    codeLine: 15,
    inlineVariables: { extractedVal: extractedRoot, finalRoot: arr[0], remainingSize: arr.length },
  });

  return steps;
}

// ==========================================
// 3. HEAPIFY / BUILD HEAP (Linear O(n) Bottom-Up)
// ==========================================
export function generateHeapifyTrace(
  inputArray: number[],
  type: HeapType
): HeapTraceStep[] {
  const steps: HeapTraceStep[] = [];
  const arr = [...inputArray];
  const n = arr.length;

  if (n <= 1) {
    return [
      {
        stepIndex: 0,
        heapType: type,
        operation: "heapify",
        array: [...arr],
        nodes: generateHeapNodes(arr),
        description: "Array has 1 or fewer elements. Already a valid heap.",
        reasoning: "Trivially satisfied heap invariant.",
        codeLine: 1,
        inlineVariables: { size: n },
      },
    ];
  }

  const lastInternalIdx = Math.floor((n - 2) / 2);

  steps.push({
    stepIndex: 0,
    heapType: type,
    operation: "heapify",
    array: [...arr],
    nodes: generateHeapNodes(arr, [lastInternalIdx]),
    activeIndices: [lastInternalIdx],
    description: `Starting Bottom-Up Heapify from last internal parent at index [${lastInternalIdx}] down to root [0].`,
    reasoning: `Leaves at indices [${lastInternalIdx + 1}..${n - 1}] are trivial 1-element heaps. Sifting down parents in reverse order builds the heap in strictly O(n) time!`,
    codeLine: 2,
    inlineVariables: { lastParent: lastInternalIdx, totalNodes: n },
  });

  // Bottom-up sift-down for each internal node
  for (let i = lastInternalIdx; i >= 0; i--) {
    let curr = i;

    while (curr < n) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let target = curr;

      if (left < n && shouldSwap(arr[left], arr[target], type)) {
        target = left;
      }
      if (right < n && shouldSwap(arr[right], arr[target], type)) {
        target = right;
      }

      if (target === curr) {
        break;
      }

      const temp = arr[curr];
      arr[curr] = arr[target];
      arr[target] = temp;

      steps.push({
        stepIndex: steps.length,
        heapType: type,
        operation: "heapify",
        array: [...arr],
        nodes: generateHeapNodes(arr, [], [curr, target]),
        activeIndices: [target],
        swappedIndices: [curr, target],
        description: `Heapify pass at parent [${i}]: swapped with [${target}] (${arr[curr]} ↔ ${arr[target]}).`,
        reasoning: `Sift-down ensures subtree rooted at index ${curr} satisfies ${type}-heap ordering.`,
        codeLine: 6,
        inlineVariables: { parentIdx: curr, targetIdx: target },
      });

      curr = target;
    }
  }

  steps.push({
    stepIndex: steps.length,
    heapType: type,
    operation: "heapify",
    array: [...arr],
    nodes: generateHeapNodes(arr, [0], undefined, { 0: "settled" }),
    activeIndices: [0],
    description: `Bottom-Up Heapify complete! Array successfully transformed into a valid ${type.toUpperCase()}-HEAP.`,
    reasoning: `Total work: Σ (h * n/2^(h+1)) = O(n). Strictly faster than n sequential insertions (O(n log n)).`,
    codeLine: 10,
    inlineVariables: { rootVal: arr[0], heapType: type, size: n },
  });

  return steps;
}

// ==========================================
// 4. PEEK ROOT (Strictly O(1))
// ==========================================
export function generatePeekTrace(
  currentArr: number[],
  type: HeapType
): HeapTraceStep[] {
  if (currentArr.length === 0) {
    return [
      {
        stepIndex: 0,
        heapType: type,
        operation: "peek",
        array: [],
        nodes: [],
        description: "Heap is empty. Nothing to peek.",
        reasoning: "Empty buffer check.",
        codeLine: 1,
        inlineVariables: { size: 0 },
      },
    ];
  }

  return [
    {
      stepIndex: 0,
      heapType: type,
      operation: "peek",
      array: [...currentArr],
      nodes: generateHeapNodes(currentArr, [0], undefined, { 0: "active" }),
      activeIndices: [0],
      activeVal: currentArr[0],
      description: `Peek Root: ${currentArr[0]} (Index 0).`,
      reasoning: `Priority Queue top element is always at index 0. Instant O(1) random access without tree traversal.`,
      codeLine: 1,
      inlineVariables: { rootIndex: 0, rootValue: currentArr[0], heapType: type },
    },
  ];
}

