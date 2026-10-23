import {
  StackQueueItem,
  StackQueueTraceStep,
  StackQueueMode,
} from "@/types/visualizer";

export const STACK_QUEUE_MAX_CAPACITY = 8;

export function createInitialItems(values: number[]): StackQueueItem[] {
  return values.map((val, idx) => ({
    id: `item-${idx}-${Date.now().toString().slice(-4)}`,
    val,
    state: "default",
    index: idx,
  }));
}

function cloneItems(items: StackQueueItem[]): StackQueueItem[] {
  return items.map((it, idx) => ({ ...it, index: idx }));
}

// ==========================================
// STACK OPERATIONS (LIFO - Last In, First Out)
// ==========================================

export function generateStackPushTrace(
  currentItems: StackQueueItem[],
  val: number,
  capacity: number = STACK_QUEUE_MAX_CAPACITY
): StackQueueTraceStep[] {
  const steps: StackQueueTraceStep[] = [];
  const items = cloneItems(currentItems);

  // Check Stack Overflow
  if (items.length >= capacity) {
    steps.push({
      stepIndex: 0,
      mode: "stack",
      operation: "overflow",
      items: cloneItems(items),
      maxCapacity: capacity,
      topIndex: items.length - 1,
      description: `Stack Overflow! Cannot push ${val}.`,
      reasoning: `The stack has reached maximum capacity (${capacity} items). Pushing to a full stack causes Stack Overflow.`,
      codeLine: 2,
      inlineVariables: { size: items.length, capacity, error: "STACK_OVERFLOW" },
    });
    return steps;
  }

  // Step 0: Initial state
  steps.push({
    stepIndex: 0,
    mode: "stack",
    operation: "push",
    items: cloneItems(items),
    maxCapacity: capacity,
    topIndex: items.length - 1,
    description: `Initiate push(${val}) onto stack.`,
    reasoning: `Stack operates on LIFO (Last In, First Out). The new element will become the new TOP.`,
    codeLine: 1,
    inlineVariables: { val, currentTop: items.length - 1 },
  });

  // Step 1: Entering above top
  const newItemId = `item-push-${Date.now().toString().slice(-4)}`;
  const newItem: StackQueueItem = {
    id: newItemId,
    val,
    state: "entering",
    index: items.length,
  };
  const withNew = [...items, newItem];

  steps.push({
    stepIndex: 1,
    mode: "stack",
    operation: "push",
    items: cloneItems(withNew),
    maxCapacity: capacity,
    topIndex: withNew.length - 1,
    activeVal: val,
    description: `Allocated element ${val} entering above current TOP.`,
    reasoning: `Preparing to push element ${val} at index ${withNew.length - 1}.`,
    codeLine: 3,
    inlineVariables: { val, targetIndex: withNew.length - 1 },
  });

  // Step 2: Settle at top
  newItem.state = "default";
  steps.push({
    stepIndex: 2,
    mode: "stack",
    operation: "push",
    items: cloneItems(withNew),
    maxCapacity: capacity,
    topIndex: withNew.length - 1,
    activeVal: val,
    description: `Pushed ${val} onto TOP. New stack height = ${withNew.length}.`,
    reasoning: `Element placed at TOP. LIFO invariant guarantees ${val} will be the very first element popped on next pop().`,
    codeLine: 5,
    inlineVariables: { "stack.top()": val, size: withNew.length },
  });

  return steps;
}

export function generateStackPopTrace(
  currentItems: StackQueueItem[],
  capacity: number = STACK_QUEUE_MAX_CAPACITY
): StackQueueTraceStep[] {
  const steps: StackQueueTraceStep[] = [];
  const items = cloneItems(currentItems);

  // Check Stack Underflow
  if (items.length === 0) {
    steps.push({
      stepIndex: 0,
      mode: "stack",
      operation: "underflow",
      items: [],
      maxCapacity: capacity,
      topIndex: -1,
      description: "Stack Underflow! Cannot pop from empty stack.",
      reasoning: "Attempted to pop from a stack with size 0. Causes Stack Underflow in runtime memory.",
      codeLine: 2,
      inlineVariables: { size: 0, error: "STACK_UNDERFLOW" },
    });
    return steps;
  }

  const topItem = items[items.length - 1];

  // Step 0: Identify Top
  topItem.state = "active";
  steps.push({
    stepIndex: 0,
    mode: "stack",
    operation: "pop",
    items: cloneItems(items),
    maxCapacity: capacity,
    topIndex: items.length - 1,
    activeVal: topItem.val,
    description: `Targeting TOP element ${topItem.val} at index ${items.length - 1}.`,
    reasoning: `LIFO rule dictates that only the topmost (most recently added) element can be popped.`,
    codeLine: 3,
    inlineVariables: { "popping": topItem.val, topIndex: items.length - 1 },
  });

  // Step 1: Leaving stack
  topItem.state = "leaving";
  steps.push({
    stepIndex: 1,
    mode: "stack",
    operation: "pop",
    items: cloneItems(items),
    maxCapacity: capacity,
    topIndex: items.length - 1,
    activeVal: topItem.val,
    description: `Lifting element ${topItem.val} out of stack buffer.`,
    reasoning: `Element is de-referenced from stack frame in O(1) time.`,
    codeLine: 4,
    inlineVariables: { poppedVal: topItem.val },
  });

  // Step 2: Removed, new top
  const remaining = items.slice(0, items.length - 1);
  steps.push({
    stepIndex: 2,
    mode: "stack",
    operation: "pop",
    items: cloneItems(remaining),
    maxCapacity: capacity,
    topIndex: remaining.length - 1,
    description: `Popped ${topItem.val}! New stack size = ${remaining.length}.`,
    reasoning: `Top pointer decremented. Next available element is now ${remaining.length > 0 ? remaining[remaining.length - 1].val : "empty"}.`,
    codeLine: 6,
    inlineVariables: { newTop: remaining.length > 0 ? remaining[remaining.length - 1].val : "empty", size: remaining.length },
  });

  return steps;
}

export function generateStackPeekTrace(
  currentItems: StackQueueItem[],
  capacity: number = STACK_QUEUE_MAX_CAPACITY
): StackQueueTraceStep[] {
  const steps: StackQueueTraceStep[] = [];
  const items = cloneItems(currentItems);

  if (items.length === 0) {
    steps.push({
      stepIndex: 0,
      mode: "stack",
      operation: "underflow",
      items: [],
      maxCapacity: capacity,
      topIndex: -1,
      description: "Cannot peek empty stack.",
      reasoning: "Stack has no elements.",
      codeLine: 1,
      inlineVariables: { size: 0 },
    });
    return steps;
  }

  const topItem = items[items.length - 1];
  topItem.state = "peek";

  steps.push({
    stepIndex: 0,
    mode: "stack",
    operation: "peek",
    items: cloneItems(items),
    maxCapacity: capacity,
    topIndex: items.length - 1,
    activeVal: topItem.val,
    description: `Peek() returns TOP element ${topItem.val} (index ${items.length - 1}).`,
    reasoning: `Peek inspects the topmost element in O(1) time without modifying or removing it.`,
    codeLine: 2,
    inlineVariables: { "stack.top()": topItem.val, size: items.length },
  });

  return steps;
}

// ==========================================
// QUEUE OPERATIONS (FIFO - First In, First Out)
// ==========================================

export function generateQueueEnqueueTrace(
  currentItems: StackQueueItem[],
  val: number,
  capacity: number = STACK_QUEUE_MAX_CAPACITY
): StackQueueTraceStep[] {
  const steps: StackQueueTraceStep[] = [];
  const items = cloneItems(currentItems);

  // Check Queue Overflow
  if (items.length >= capacity) {
    steps.push({
      stepIndex: 0,
      mode: "queue",
      operation: "overflow",
      items: cloneItems(items),
      maxCapacity: capacity,
      frontIndex: 0,
      rearIndex: items.length - 1,
      description: `Queue Overflow! Cannot enqueue ${val}.`,
      reasoning: `Queue buffer has reached maximum capacity (${capacity} items). Enqueuing causes Queue Overflow.`,
      codeLine: 2,
      inlineVariables: { size: items.length, capacity, error: "QUEUE_OVERFLOW" },
    });
    return steps;
  }

  // Step 0: Initial state
  steps.push({
    stepIndex: 0,
    mode: "queue",
    operation: "enqueue",
    items: cloneItems(items),
    maxCapacity: capacity,
    frontIndex: items.length > 0 ? 0 : -1,
    rearIndex: items.length > 0 ? items.length - 1 : -1,
    description: `Initiate enqueue(${val}) at REAR of queue.`,
    reasoning: `FIFO (First In, First Out) mandates all additions happen strictly at the REAR.`,
    codeLine: 1,
    inlineVariables: { val, rearIndex: items.length - 1 },
  });

  // Step 1: Entering at rear
  const newItemId = `item-enqueue-${Date.now().toString().slice(-4)}`;
  const newItem: StackQueueItem = {
    id: newItemId,
    val,
    state: "entering",
    index: items.length,
  };
  const withNew = [...items, newItem];

  steps.push({
    stepIndex: 1,
    mode: "queue",
    operation: "enqueue",
    items: cloneItems(withNew),
    maxCapacity: capacity,
    frontIndex: 0,
    rearIndex: withNew.length - 1,
    activeVal: val,
    description: `Element ${val} entering pipeline at REAR position.`,
    reasoning: `Positioned at index ${withNew.length - 1}. Awaiting pipeline admission.`,
    codeLine: 3,
    inlineVariables: { val, rear: withNew.length - 1 },
  });

  // Step 2: Settle
  newItem.state = "default";
  steps.push({
    stepIndex: 2,
    mode: "queue",
    operation: "enqueue",
    items: cloneItems(withNew),
    maxCapacity: capacity,
    frontIndex: 0,
    rearIndex: withNew.length - 1,
    activeVal: val,
    description: `Enqueued ${val} at REAR! Total queue length = ${withNew.length}.`,
    reasoning: `FIFO invariant: ${val} will only be served after all preceding ${withNew.length - 1} elements are dequeued.`,
    codeLine: 5,
    inlineVariables: { "queue.back()": val, size: withNew.length },
  });

  return steps;
}

export function generateQueueDequeueTrace(
  currentItems: StackQueueItem[],
  capacity: number = STACK_QUEUE_MAX_CAPACITY
): StackQueueTraceStep[] {
  const steps: StackQueueTraceStep[] = [];
  const items = cloneItems(currentItems);

  // Check Queue Underflow
  if (items.length === 0) {
    steps.push({
      stepIndex: 0,
      mode: "queue",
      operation: "underflow",
      items: [],
      maxCapacity: capacity,
      frontIndex: -1,
      rearIndex: -1,
      description: "Queue Underflow! Cannot dequeue from empty queue.",
      reasoning: "Attempted dequeue on empty pipeline.",
      codeLine: 2,
      inlineVariables: { size: 0, error: "QUEUE_UNDERFLOW" },
    });
    return steps;
  }

  const frontItem = items[0];

  // Step 0: Identify FRONT
  frontItem.state = "active";
  steps.push({
    stepIndex: 0,
    mode: "queue",
    operation: "dequeue",
    items: cloneItems(items),
    maxCapacity: capacity,
    frontIndex: 0,
    rearIndex: items.length - 1,
    activeVal: frontItem.val,
    description: `Targeting FRONT element ${frontItem.val} (index 0).`,
    reasoning: `FIFO rule dictates that the oldest element (first enqueued) must be served first.`,
    codeLine: 3,
    inlineVariables: { "queue.front()": frontItem.val, size: items.length },
  });

  // Step 1: Leaving queue
  frontItem.state = "leaving";
  steps.push({
    stepIndex: 1,
    mode: "queue",
    operation: "dequeue",
    items: cloneItems(items),
    maxCapacity: capacity,
    frontIndex: 0,
    rearIndex: items.length - 1,
    activeVal: frontItem.val,
    description: `Departing FRONT of queue: ${frontItem.val}.`,
    reasoning: `Element leaves pipeline in O(1) time.`,
    codeLine: 4,
    inlineVariables: { dequeuedVal: frontItem.val },
  });

  // Step 2: Removed, shift front
  const remaining = items.slice(1);
  steps.push({
    stepIndex: 2,
    mode: "queue",
    operation: "dequeue",
    items: cloneItems(remaining),
    maxCapacity: capacity,
    frontIndex: remaining.length > 0 ? 0 : -1,
    rearIndex: remaining.length > 0 ? remaining.length - 1 : -1,
    description: `Dequeued ${frontItem.val}! New FRONT = ${remaining.length > 0 ? remaining[0].val : "empty"}.`,
    reasoning: `Front pointer advanced. Next in line is now ${remaining.length > 0 ? remaining[0].val : "empty"}.`,
    codeLine: 6,
    inlineVariables: { newFront: remaining.length > 0 ? remaining[0].val : "empty", size: remaining.length },
  });

  return steps;
}

export function generateQueuePeekTrace(
  currentItems: StackQueueItem[],
  capacity: number = STACK_QUEUE_MAX_CAPACITY
): StackQueueTraceStep[] {
  const steps: StackQueueTraceStep[] = [];
  const items = cloneItems(currentItems);

  if (items.length === 0) {
    steps.push({
      stepIndex: 0,
      mode: "queue",
      operation: "underflow",
      items: [],
      maxCapacity: capacity,
      frontIndex: -1,
      rearIndex: -1,
      description: "Cannot peek empty queue.",
      reasoning: "Queue has no elements.",
      codeLine: 1,
      inlineVariables: { size: 0 },
    });
    return steps;
  }

  const frontItem = items[0];
  frontItem.state = "peek";

  steps.push({
    stepIndex: 0,
    mode: "queue",
    operation: "peek",
    items: cloneItems(items),
    maxCapacity: capacity,
    frontIndex: 0,
    rearIndex: items.length - 1,
    activeVal: frontItem.val,
    description: `Peek() returns FRONT element ${frontItem.val} (index 0).`,
    reasoning: `Inspects next in line without removing it from queue in O(1) time.`,
    codeLine: 2,
    inlineVariables: { "queue.front()": frontItem.val, size: items.length },
  });

  return steps;
}

