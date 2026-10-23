import {
  ArrayVisualCell,
  DynamicArrayTraceStep,
  ArrayVisualMode,
} from "@/types/visualizer";

export function createArrayCells(
  values: number[],
  capacity: number,
  baseAddr: number = 0x2000
): ArrayVisualCell[] {
  const cap = Math.max(values.length, capacity);
  const cells: ArrayVisualCell[] = [];

  for (let i = 0; i < cap; i++) {
    const isPopulated = i < values.length;
    const addr = `0x${(baseAddr + i * 4).toString(16).toUpperCase()}`;
    cells.push({
      id: `cell-${i}-${Date.now().toString().slice(-4)}`,
      val: isPopulated ? values[i] : null,
      index: i,
      address: addr,
      state: isPopulated ? "default" : "empty",
      isReserved: !isPopulated,
    });
  }

  return cells;
}

function cloneCells(cells: ArrayVisualCell[]): ArrayVisualCell[] {
  return cells.map((c) => ({ ...c }));
}

// ==========================================
// 1. PUSH BACK (Amortized O(1), Geometric 2× Resizing)
// ==========================================
export function generatePushBackTrace(
  currentValues: number[],
  currentCapacity: number,
  val: number,
  mode: ArrayVisualMode = "dynamic"
): DynamicArrayTraceStep[] {
  const steps: DynamicArrayTraceStep[] = [];
  const size = currentValues.length;

  // Case A: Fixed Static Array at Capacity
  if (mode === "static" && size >= currentCapacity) {
    const cells = createArrayCells(currentValues, currentCapacity);
    steps.push({
      stepIndex: 0,
      mode: "static",
      operation: "push_back",
      cells,
      size,
      capacity: currentCapacity,
      activeVal: val,
      description: `Static Array Overflow! Cannot append ${val}.`,
      reasoning: `Static arrays have a fixed size (${currentCapacity}). They cannot grow dynamically.`,
      codeLine: 2,
      inlineVariables: { size, capacity: currentCapacity, error: "FIXED_CAPACITY_EXCEEDED" },
    });
    return steps;
  }

  // Case B: Dynamic Array with Headroom (size < capacity)
  if (size < currentCapacity) {
    const initialCells = createArrayCells(currentValues, currentCapacity);

    // Step 0: Initial
    steps.push({
      stepIndex: 0,
      mode,
      operation: "push_back",
      cells: cloneCells(initialCells),
      size,
      capacity: currentCapacity,
      activeVal: val,
      description: `Push back ${val} (capacity headroom available: ${currentCapacity - size} empty slots).`,
      reasoning: `Size (${size}) < Capacity (${currentCapacity}). No reallocation needed; element will be written directly to reserved slot.`,
      codeLine: 2,
      inlineVariables: { val, currentSize: size, capacity: currentCapacity },
    });

    // Step 1: Target slot
    initialCells[size].state = "active";
    steps.push({
      stepIndex: 1,
      mode,
      operation: "push_back",
      cells: cloneCells(initialCells),
      size,
      capacity: currentCapacity,
      targetIndex: size,
      activeVal: val,
      description: `Targeting reserved slot at index ${size} (${initialCells[size].address}).`,
      reasoning: `Direct pointer calculation: base + ${size} * sizeof(int). Instant O(1) slot location.`,
      codeLine: 9,
      inlineVariables: { targetIndex: size, address: initialCells[size].address },
    });

    // Step 2: Settle
    const finalValues = [...currentValues, val];
    const finalCells = createArrayCells(finalValues, currentCapacity);
    finalCells[size].state = "new";

    steps.push({
      stepIndex: 2,
      mode,
      operation: "push_back",
      cells: cloneCells(finalCells),
      size: finalValues.length,
      capacity: currentCapacity,
      targetIndex: size,
      activeVal: val,
      description: `Element ${val} stored at index ${size}. New size = ${finalValues.length}.`,
      reasoning: `Operation took strictly O(1) time without element copying. Headroom remaining: ${currentCapacity - finalValues.length}.`,
      codeLine: 9,
      inlineVariables: { newSize: finalValues.length, capacity: currentCapacity },
    });

    return steps;
  }

  // Case C: Dynamic Array FULL (size == capacity) -> GEOMETRIC CAPACITY DOUBLING (2x)
  const newCapacity = currentCapacity === 0 ? 2 : currentCapacity * 2;
  const oldCells = createArrayCells(currentValues, currentCapacity, 0x2000);
  const newBaseAddr = 0x5000; // New contiguous heap block

  // Step 0: Capacity Reached
  steps.push({
    stepIndex: 0,
    mode: "dynamic",
    operation: "resize",
    cells: cloneCells(oldCells),
    size,
    capacity: currentCapacity,
    activeVal: val,
    description: `Buffer FULL (${size}/${currentCapacity})! Capacity doubling triggered.`,
    reasoning: `Size (${size}) equals Capacity (${currentCapacity}). std::vector allocates a new contiguous block of size 2 × ${currentCapacity} = ${newCapacity}.`,
    codeLine: 3,
    inlineVariables: { oldCapacity: currentCapacity, newCapacity },
  });

  // Step 1: Allocate new 2x buffer
  const emptyNewCells = createArrayCells([], newCapacity, newBaseAddr);
  steps.push({
    stepIndex: 1,
    mode: "dynamic",
    operation: "resize",
    cells: cloneCells(emptyNewCells),
    oldCells: cloneCells(oldCells),
    size,
    capacity: newCapacity,
    activeVal: val,
    description: `Allocated new contiguous heap block at ${emptyNewCells[0].address} (Capacity: ${newCapacity}).`,
    reasoning: `New buffer allocated in heap. Ready to copy existing ${size} elements to the new address space.`,
    codeLine: 5,
    inlineVariables: { newBase: emptyNewCells[0].address, newCapacity },
  });

  // Step 2: Copy elements one by one (simulating element copy)
  const copiedValues: number[] = [];
  for (let i = 0; i < currentValues.length; i++) {
    copiedValues.push(currentValues[i]);
    const inProgressCells = createArrayCells(copiedValues, newCapacity, newBaseAddr);
    inProgressCells[i].state = "copying";

    steps.push({
      stepIndex: steps.length,
      mode: "dynamic",
      operation: "resize",
      cells: cloneCells(inProgressCells),
      oldCells: cloneCells(oldCells),
      size: copiedValues.length,
      capacity: newCapacity,
      activeIndices: [i],
      description: `Copied element [${i}] (${currentValues[i]}) to new buffer.`,
      reasoning: `Copying existing elements costs O(n) work during a resize event.`,
      codeLine: 6,
      inlineVariables: { copiedIndex: i, value: currentValues[i] },
    });
  }

  // Step 3: Insert new value in the 2x buffer
  const finalValues = [...currentValues, val];
  const finalNewCells = createArrayCells(finalValues, newCapacity, newBaseAddr);
  finalNewCells[size].state = "new";

  steps.push({
    stepIndex: steps.length,
    mode: "dynamic",
    operation: "push_back",
    cells: cloneCells(finalNewCells),
    oldCells: cloneCells(oldCells),
    size: finalValues.length,
    capacity: newCapacity,
    targetIndex: size,
    activeVal: val,
    description: `Appended new value ${val} at index ${size}. Freed old buffer!`,
    reasoning: `Old buffer at 0x2000 is deallocated. Geometric doubling ensures n insertions total O(n) work -> Amortized O(1).`,
    codeLine: 9,
    inlineVariables: { newSize: finalValues.length, newCapacity },
  });

  return steps;
}

// ==========================================
// 2. POP BACK (Strictly O(1))
// ==========================================
export function generatePopBackTrace(
  currentValues: number[],
  currentCapacity: number,
  mode: ArrayVisualMode = "dynamic"
): DynamicArrayTraceStep[] {
  const steps: DynamicArrayTraceStep[] = [];
  const size = currentValues.length;

  if (size === 0) {
    steps.push({
      stepIndex: 0,
      mode,
      operation: "pop_back",
      cells: createArrayCells([], currentCapacity),
      size: 0,
      capacity: currentCapacity,
      description: "Array is empty. Nothing to pop.",
      reasoning: "Attempted pop_back on empty array.",
      codeLine: 3,
      inlineVariables: { size: 0 },
    });
    return steps;
  }

  const cells = createArrayCells(currentValues, currentCapacity);
  const lastIndex = size - 1;
  const poppedVal = currentValues[lastIndex];

  // Step 0: Identify last element
  cells[lastIndex].state = "active";
  steps.push({
    stepIndex: 0,
    mode,
    operation: "pop_back",
    cells: cloneCells(cells),
    size,
    capacity: currentCapacity,
    targetIndex: lastIndex,
    activeVal: poppedVal,
    description: `Targeting last element [${lastIndex}] = ${poppedVal}.`,
    reasoning: `pop_back only modifies the size counter in O(1) time without deallocating capacity.`,
    codeLine: 2,
    inlineVariables: { lastIndex, poppedVal },
  });

  // Step 1: Removed
  const remainingValues = currentValues.slice(0, lastIndex);
  const finalCells = createArrayCells(remainingValues, currentCapacity);

  steps.push({
    stepIndex: 1,
    mode,
    operation: "pop_back",
    cells: cloneCells(finalCells),
    size: remainingValues.length,
    capacity: currentCapacity,
    activeVal: poppedVal,
    description: `Popped ${poppedVal}! New size = ${remainingValues.length} (capacity stays ${currentCapacity}).`,
    reasoning: `Element removed in strictly O(1) time. Slot becomes reserved capacity for future insertions.`,
    codeLine: 4,
    inlineVariables: { newSize: remainingValues.length, capacity: currentCapacity },
  });

  return steps;
}

// ==========================================
// 3. INSERT AT ARBITRARY INDEX (O(n) Shifting)
// ==========================================
export function generateInsertAtIndexTrace(
  currentValues: number[],
  currentCapacity: number,
  val: number,
  targetIndex: number,
  mode: ArrayVisualMode = "dynamic"
): DynamicArrayTraceStep[] {
  const steps: DynamicArrayTraceStep[] = [];
  const size = currentValues.length;
  const clampedIndex = Math.max(0, Math.min(targetIndex, size));

  // If buffer full, first double capacity
  let cap = currentCapacity;
  let values = [...currentValues];
  if (size >= cap) {
    cap = cap === 0 ? 2 : cap * 2;
  }

  const cells = createArrayCells(values, cap);

  steps.push({
    stepIndex: 0,
    mode,
    operation: "insert_at",
    cells: cloneCells(cells),
    size,
    capacity: cap,
    targetIndex: clampedIndex,
    activeVal: val,
    description: `Begin insertion of ${val} at index ${clampedIndex}.`,
    reasoning: `Inserting at arbitrary index requires shifting all elements from [${clampedIndex}..${size - 1}] to the right by 1 position (O(n) work).`,
    codeLine: 2,
    inlineVariables: { val, targetIndex: clampedIndex, elementsToShift: size - clampedIndex },
  });

  // Shift elements right from size-1 down to clampedIndex
  const shiftedValues = [...values];
  for (let i = size - 1; i >= clampedIndex; i--) {
    shiftedValues[i + 1] = shiftedValues[i];
    const shiftCells = createArrayCells(shiftedValues.slice(0, i + 2), cap);
    shiftCells[i + 1].state = "shifting";
    shiftCells[i].state = "active";

    steps.push({
      stepIndex: steps.length,
      mode,
      operation: "insert_at",
      cells: cloneCells(shiftCells),
      size,
      capacity: cap,
      targetIndex: clampedIndex,
      activeIndices: [i, i + 1],
      description: `Shifted element from index [${i}] (${values[i]}) → [${i + 1}].`,
      reasoning: `Making room for insertion at index ${clampedIndex}. Element moves to adjacent contiguous address.`,
      codeLine: 6,
      inlineVariables: { shiftedFrom: i, shiftedTo: i + 1, val: values[i] },
    });
  }

  // Insert value into opened slot
  const finalValues = [...currentValues];
  finalValues.splice(clampedIndex, 0, val);
  const finalCells = createArrayCells(finalValues, cap);
  finalCells[clampedIndex].state = "new";

  steps.push({
    stepIndex: steps.length,
    mode,
    operation: "insert_at",
    cells: cloneCells(finalCells),
    size: finalValues.length,
    capacity: cap,
    targetIndex: clampedIndex,
    activeVal: val,
    description: `Inserted ${val} into vacated slot [${clampedIndex}]. Insertion complete!`,
    reasoning: `Shift completed and new element written. Total time complexity = O(n) due to linear shifting.`,
    codeLine: 8,
    inlineVariables: { targetIndex: clampedIndex, newSize: finalValues.length },
  });

  return steps;
}

// ==========================================
// 4. RANDOM ACCESS VIA MEMORY ADDRESS (O(1))
// ==========================================
export function generateAccessTrace(
  currentValues: number[],
  currentCapacity: number,
  index: number
): DynamicArrayTraceStep[] {
  const steps: DynamicArrayTraceStep[] = [];
  const size = currentValues.length;

  if (size === 0) {
    steps.push({
      stepIndex: 0,
      mode: "dynamic",
      operation: "access",
      cells: createArrayCells([], currentCapacity),
      size: 0,
      capacity: currentCapacity,
      description: "Array is empty. Index out of bounds.",
      reasoning: "Index out of bounds exception.",
      codeLine: 2,
      inlineVariables: {},
    });
    return steps;
  }

  const clampedIndex = Math.max(0, Math.min(index, size - 1));
  const cells = createArrayCells(currentValues, currentCapacity);
  const targetCell = cells[clampedIndex];
  targetCell.state = "active";

  const baseAddr = 0x2000;
  const offset = clampedIndex * 4;
  const computedAddr = `0x${(baseAddr + offset).toString(16).toUpperCase()}`;

  steps.push({
    stepIndex: 0,
    mode: "dynamic",
    operation: "access",
    cells: cloneCells(cells),
    size,
    capacity: currentCapacity,
    targetIndex: clampedIndex,
    activeVal: targetCell.val || 0,
    description: `Accessing arr[${clampedIndex}] = ${targetCell.val}. Address = ${computedAddr}.`,
    reasoning: `Direct pointer arithmetic: base (0x2000) + ${clampedIndex} × 4 bytes = ${computedAddr}. Strictly O(1) random access!`,
    codeLine: 4,
    inlineVariables: { index: clampedIndex, "arr[index]": targetCell.val || 0, calculatedAddress: computedAddr },
  });

  return steps;
}

