import {
  LinkedListNode,
  LinkedListPointers,
  LinkedListTraceStep,
  LinkedListType,
} from "@/types/visualizer";

let addrCounter = 0x100;
function nextAddress(): string {
  addrCounter += 0x20;
  return `0x${addrCounter.toString(16).toUpperCase()}`;
}

// Build initial list from an array of numbers
export function createInitialList(values: number[], isDoubly: boolean = false): LinkedListNode[] {
  if (values.length === 0) return [];

  const nodes: LinkedListNode[] = values.map((val, idx) => ({
    id: `node-${idx}-${Date.now().toString().slice(-4)}`,
    val,
    address: nextAddress(),
    state: "default",
    isHead: idx === 0,
    isTail: idx === values.length - 1,
    nextId: null,
    prevId: null,
  }));

  for (let i = 0; i < nodes.length; i++) {
    if (i < nodes.length - 1) {
      nodes[i].nextId = nodes[i + 1].id;
    }
    if (isDoubly && i > 0) {
      nodes[i].prevId = nodes[i - 1].id;
    }
  }

  return nodes;
}

function cloneNodes(nodes: LinkedListNode[]): LinkedListNode[] {
  return nodes.map((n) => ({ ...n }));
}

// ==========================================
// 1. INSERT AT HEAD (O(1))
// ==========================================
export function generateInsertHeadTrace(
  initialNodes: LinkedListNode[],
  val: number,
  isDoubly: boolean
): LinkedListTraceStep[] {
  const steps: LinkedListTraceStep[] = [];
  const listType: LinkedListType = isDoubly ? "doubly" : "singly";

  // Step 0: Initial state
  const nodes = cloneNodes(initialNodes);
  const oldHeadId = nodes.find((n) => n.isHead)?.id || null;

  steps.push({
    stepIndex: 0,
    operation: "insert_head",
    listType,
    nodes: cloneNodes(nodes),
    pointers: { head: oldHeadId },
    description: `Begin insertion of value ${val} at HEAD.`,
    reasoning: `Insert at head is an O(1) pointer assignment without shifting subsequent elements.`,
    codeLine: 1,
    inlineVariables: { val, head: oldHeadId ? "Node" : "nullptr" },
  });

  // Step 1: Allocate new node
  const newNodeId = `node-new-${Date.now().toString().slice(-4)}`;
  const newNode: LinkedListNode = {
    id: newNodeId,
    val,
    address: nextAddress(),
    state: "creating",
    nextId: null,
    prevId: null,
    isHead: false,
    isTail: nodes.length === 0,
  };

  const withNewNode = [newNode, ...nodes];
  steps.push({
    stepIndex: 1,
    operation: "insert_head",
    listType,
    nodes: cloneNodes(withNewNode),
    pointers: { temp: newNodeId, head: oldHeadId },
    activeNodeId: newNodeId,
    description: `Allocated new ListNode(${val}) at memory address ${newNode.address}.`,
    reasoning: `Heap memory allocated. Node created with val = ${val}, next = nullptr.`,
    codeLine: 2,
    inlineVariables: { "newNode->val": val, "newNode->address": newNode.address },
  });

  // Step 2: Link newNode->next = head
  newNode.nextId = oldHeadId;
  newNode.state = "reconnecting";

  steps.push({
    stepIndex: 2,
    operation: "insert_head",
    listType,
    nodes: cloneNodes(withNewNode),
    pointers: { temp: newNodeId, head: oldHeadId },
    activeNodeId: newNodeId,
    description: `Assigned newNode->next = head (${oldHeadId ? "points to previous head" : "nullptr"}).`,
    reasoning: `Connecting newNode to current head preserves the remaining chain before moving head.`,
    codeLine: 3,
    inlineVariables: { "newNode->next": oldHeadId ? "head" : "nullptr" },
  });

  // Step 3 (if doubly): Link oldHead->prev = newNode
  if (isDoubly && oldHeadId) {
    const oldHead = withNewNode.find((n) => n.id === oldHeadId);
    if (oldHead) oldHead.prevId = newNodeId;

    steps.push({
      stepIndex: 3,
      operation: "insert_head",
      listType,
      nodes: cloneNodes(withNewNode),
      pointers: { temp: newNodeId, head: oldHeadId },
      activeNodeId: oldHeadId,
      description: `Assigned old head->prev = newNode for bidirectional traversal.`,
      reasoning: `Doubly linked list requires both forward and backward pointer integrity.`,
      codeLine: 4,
      inlineVariables: { "head->prev": newNode.address },
    });
  }

  // Step 4: Move head pointer to newNode
  for (const n of withNewNode) {
    n.isHead = n.id === newNodeId;
    n.state = "default";
  }

  steps.push({
    stepIndex: steps.length,
    operation: "insert_head",
    listType,
    nodes: cloneNodes(withNewNode),
    pointers: { head: newNodeId },
    activeNodeId: newNodeId,
    description: `Updated head = newNode. Insertion complete!`,
    reasoning: `Head pointer now designates the new node. Entire operation completed in strictly O(1) time.`,
    codeLine: 5,
    inlineVariables: { head: newNode.address, listLength: withNewNode.length },
  });

  return steps;
}

// ==========================================
// 2. INSERT AT TAIL (O(1) with Tail / O(n))
// ==========================================
export function generateInsertTailTrace(
  initialNodes: LinkedListNode[],
  val: number,
  isDoubly: boolean
): LinkedListTraceStep[] {
  if (initialNodes.length === 0) {
    return generateInsertHeadTrace(initialNodes, val, isDoubly);
  }

  const steps: LinkedListTraceStep[] = [];
  const listType: LinkedListType = isDoubly ? "doubly" : "singly";
  const nodes = cloneNodes(initialNodes);

  const headId = nodes.find((n) => n.isHead)?.id || null;
  const oldTail = nodes.find((n) => n.isTail)!;

  steps.push({
    stepIndex: 0,
    operation: "insert_tail",
    listType,
    nodes: cloneNodes(nodes),
    pointers: { head: headId, tail: oldTail.id },
    description: `Begin insertion of value ${val} at TAIL.`,
    reasoning: `Using the tail pointer allows direct O(1) appending at the end of the list.`,
    codeLine: 1,
    inlineVariables: { val, tail: oldTail.address },
  });

  // Step 1: Allocate newNode
  const newNodeId = `node-tail-${Date.now().toString().slice(-4)}`;
  const newNode: LinkedListNode = {
    id: newNodeId,
    val,
    address: nextAddress(),
    state: "creating",
    nextId: null,
    prevId: isDoubly ? oldTail.id : null,
    isHead: false,
    isTail: false,
  };

  const withNewNode = [...nodes, newNode];

  steps.push({
    stepIndex: 1,
    operation: "insert_tail",
    listType,
    nodes: cloneNodes(withNewNode),
    pointers: { head: headId, tail: oldTail.id, temp: newNodeId },
    activeNodeId: newNodeId,
    description: `Allocated new ListNode(${val}) at ${newNode.address}.`,
    reasoning: `Node created. Next pointer initialized to nullptr.`,
    codeLine: 2,
    inlineVariables: { "newNode->val": val },
  });

  // Step 2: Link tail->next = newNode
  oldTail.nextId = newNodeId;
  oldTail.state = "reconnecting";

  steps.push({
    stepIndex: 2,
    operation: "insert_tail",
    listType,
    nodes: cloneNodes(withNewNode),
    pointers: { head: headId, tail: oldTail.id, temp: newNodeId },
    activeNodeId: oldTail.id,
    description: `Linked tail->next = newNode (${oldTail.val} → ${newNode.val}).`,
    reasoning: `End of current list now extends to the newly allocated node.`,
    codeLine: 3,
    inlineVariables: { "tail->next": newNode.address },
  });

  // Step 3 (if doubly): newNode->prev = tail
  if (isDoubly) {
    newNode.prevId = oldTail.id;
    steps.push({
      stepIndex: 3,
      operation: "insert_tail",
      listType,
      nodes: cloneNodes(withNewNode),
      pointers: { head: headId, tail: oldTail.id, temp: newNodeId },
      activeNodeId: newNodeId,
      description: `Linked newNode->prev = tail (${newNode.val} ← ${oldTail.val}).`,
      reasoning: `Doubly linked list backwards link verified.`,
      codeLine: 4,
      inlineVariables: { "newNode->prev": oldTail.address },
    });
  }

  // Step 4: Advance tail pointer
  for (const n of withNewNode) {
    n.isTail = n.id === newNodeId;
    n.state = "default";
  }

  steps.push({
    stepIndex: steps.length,
    operation: "insert_tail",
    listType,
    nodes: cloneNodes(withNewNode),
    pointers: { head: headId, tail: newNodeId },
    activeNodeId: newNodeId,
    description: `Advanced tail pointer = newNode. Append finished!`,
    reasoning: `Tail pointer is updated to the new last node in O(1) time.`,
    codeLine: 5,
    inlineVariables: { tail: newNode.address, totalNodes: withNewNode.length },
  });

  return steps;
}

// ==========================================
// 3. DELETE NODE BY VALUE
// ==========================================
export function generateDeleteTrace(
  initialNodes: LinkedListNode[],
  targetVal: number,
  isDoubly: boolean
): LinkedListTraceStep[] {
  const steps: LinkedListTraceStep[] = [];
  const listType: LinkedListType = isDoubly ? "doubly" : "singly";
  const nodes = cloneNodes(initialNodes);

  if (nodes.length === 0) {
    steps.push({
      stepIndex: 0,
      operation: "delete",
      listType,
      nodes: [],
      pointers: {},
      description: "List is empty. Nothing to delete.",
      reasoning: "Attempted deletion on empty list.",
      codeLine: 1,
      inlineVariables: {},
    });
    return steps;
  }

  const headId = nodes.find((n) => n.isHead)?.id || null;

  steps.push({
    stepIndex: 0,
    operation: "delete",
    listType,
    nodes: cloneNodes(nodes),
    pointers: { head: headId, curr: headId },
    description: `Begin search & delete for node with value ${targetVal}.`,
    reasoning: `Traverse list from head to locate target node, maintaining previous pointer to rewire links.`,
    codeLine: 1,
    inlineVariables: { targetVal, head: headId || "null" },
  });

  let currIdx = 0;
  let prevId: string | null = null;
  let found = false;

  while (currIdx < nodes.length) {
    const curr = nodes[currIdx];
    curr.state = "active";

    steps.push({
      stepIndex: steps.length,
      operation: "delete",
      listType,
      nodes: cloneNodes(nodes),
      pointers: { head: headId, prev: prevId, curr: curr.id },
      activeNodeId: curr.id,
      description: `Checking node at ${curr.address}: val (${curr.val}) ${curr.val === targetVal ? "==" : "!="} ${targetVal}.`,
      reasoning: curr.val === targetVal
        ? `Match found! Node with value ${targetVal} located.`
        : `Value mismatch. Advance pointers: prev = curr, curr = curr->next.`,
      codeLine: 3,
      inlineVariables: { "curr->val": curr.val, targetVal },
    });

    if (curr.val === targetVal) {
      found = true;
      curr.state = "target";
      break;
    }

    curr.state = "default";
    prevId = curr.id;
    currIdx++;
  }

  if (!found) {
    steps.push({
      stepIndex: steps.length,
      operation: "delete",
      listType,
      nodes: cloneNodes(nodes),
      pointers: { head: headId },
      description: `Value ${targetVal} not found in linked list.`,
      reasoning: `Reached end of list (curr == nullptr). No nodes deleted.`,
      codeLine: 6,
      inlineVariables: { searchResult: "Not found" },
    });
    return steps;
  }

  const targetNode = nodes[currIdx];

  // Case 1: Deleting Head Node
  if (currIdx === 0) {
    const nextNode = nodes[1];
    steps.push({
      stepIndex: steps.length,
      operation: "delete",
      listType,
      nodes: cloneNodes(nodes),
      pointers: { curr: targetNode.id, next: nextNode?.id || null },
      activeNodeId: targetNode.id,
      description: `Target is HEAD. Updating head = head->next (${nextNode ? nextNode.address : "nullptr"}).`,
      reasoning: `Bypassing head node directly updates list entry point in O(1) time.`,
      codeLine: 7,
      inlineVariables: { "newHead": nextNode?.address || "nullptr" },
    });

    targetNode.state = "deleted";
    const remaining = nodes.slice(1);
    if (remaining.length > 0) {
      remaining[0].isHead = true;
      if (isDoubly) remaining[0].prevId = null;
    }

    steps.push({
      stepIndex: steps.length,
      operation: "delete",
      listType,
      nodes: cloneNodes(remaining),
      pointers: { head: remaining[0]?.id || null },
      description: `Deallocated node at ${targetNode.address} (delete curr). Deletion complete!`,
      reasoning: `Memory freed. Head pointer re-anchored. Remaining list intact.`,
      codeLine: 9,
      inlineVariables: { freedMemory: targetNode.address, remainingNodes: remaining.length },
    });

    return steps;
  }

  // Case 2: Deleting Intermediate or Tail Node
  const prevNode = nodes.find((n) => n.id === prevId)!;
  const nextNode = nodes.find((n) => n.id === targetNode.nextId);

  prevNode.nextId = targetNode.nextId;
  prevNode.state = "reconnecting";

  steps.push({
    stepIndex: steps.length,
    operation: "delete",
    listType,
    nodes: cloneNodes(nodes),
    pointers: { head: headId, prev: prevId, curr: targetNode.id, next: nextNode?.id || null },
    activeNodeId: prevNode.id,
    description: `Bypassed target: prev->next = curr->next (${prevNode.val} → ${nextNode ? nextNode.val : "nullptr"}).`,
    reasoning: `Rewiring prev->next cuts target node out of the forward traversal chain.`,
    codeLine: 10,
    inlineVariables: { "prev->next": nextNode ? nextNode.address : "nullptr" },
  });

  if (isDoubly && nextNode) {
    nextNode.prevId = prevId;
    steps.push({
      stepIndex: steps.length,
      operation: "delete",
      listType,
      nodes: cloneNodes(nodes),
      pointers: { head: headId, prev: prevId, curr: targetNode.id, next: nextNode.id },
      activeNodeId: nextNode.id,
      description: `Bypassed target in reverse: next->prev = prev (${nextNode.val} ← ${prevNode.val}).`,
      reasoning: `Backward link rewired for bidirectional consistency.`,
      codeLine: 11,
      inlineVariables: { "next->prev": prevNode.address },
    });
  }

  targetNode.state = "deleted";
  const remaining = nodes.filter((n) => n.id !== targetNode.id);
  if (remaining.length > 0) {
    remaining[remaining.length - 1].isTail = true;
  }

  steps.push({
    stepIndex: steps.length,
    operation: "delete",
    listType,
    nodes: cloneNodes(remaining),
    pointers: { head: headId, tail: remaining[remaining.length - 1]?.id || null },
    description: `Freed memory for node ${targetVal} (${targetNode.address}). Deletion complete!`,
    reasoning: `delete curr; prevents memory leaks. List invariants fully satisfied.`,
    codeLine: 13,
    inlineVariables: { freedMemory: targetNode.address, remainingCount: remaining.length },
  });

  return steps;
}

// ==========================================
// 4. REVERSE LIST (In-Place, 3 Pointers)
// ==========================================
export function generateReverseTrace(
  initialNodes: LinkedListNode[],
  isDoubly: boolean
): LinkedListTraceStep[] {
  const steps: LinkedListTraceStep[] = [];
  const listType: LinkedListType = isDoubly ? "doubly" : "singly";
  const nodes = cloneNodes(initialNodes);

  if (nodes.length <= 1) {
    steps.push({
      stepIndex: 0,
      operation: "reverse",
      listType,
      nodes: cloneNodes(nodes),
      pointers: { head: nodes[0]?.id || null },
      description: "List has 0 or 1 elements. Already reversed.",
      reasoning: "Trivial base case.",
      codeLine: 1,
      inlineVariables: {},
    });
    return steps;
  }

  steps.push({
    stepIndex: 0,
    operation: "reverse",
    listType,
    nodes: cloneNodes(nodes),
    pointers: { prev: null, curr: nodes[0].id, next: null },
    description: "Begin in-place list reversal using 3 pointers (prev, curr, next).",
    reasoning: "Iterative reversal flips each next pointer backwards without allocating additional memory (O(1) space).",
    codeLine: 2,
    inlineVariables: { prev: "nullptr", curr: nodes[0].address },
  });

  let prevId: string | null = null;
  let currIndex = 0;

  // We maintain logical next IDs to simulate reversing the chain step by step
  while (currIndex < nodes.length) {
    const curr = nodes[currIndex];
    const originalNextId: string | null = curr.nextId ?? null;

    curr.state = "active";

    // 1. next = curr->next
    steps.push({
      stepIndex: steps.length,
      operation: "reverse",
      listType,
      nodes: cloneNodes(nodes),
      pointers: { prev: prevId, curr: curr.id, next: originalNextId },
      activeNodeId: curr.id,
      description: `Save next pointer: next = curr->next (${originalNextId ? "Node" : "nullptr"}).`,
      reasoning: `Must save pointer to rest of list before overwriting curr->next, or we lose remaining nodes!`,
      codeLine: 4,
      inlineVariables: { "curr->val": curr.val, next: originalNextId || "nullptr" },
    });

    // 2. curr->next = prev
    curr.nextId = prevId;
    if (isDoubly) {
      curr.prevId = originalNextId;
    }
    curr.state = "reconnecting";

    steps.push({
      stepIndex: steps.length,
      operation: "reverse",
      listType,
      nodes: cloneNodes(nodes),
      pointers: { prev: prevId, curr: curr.id, next: originalNextId },
      activeNodeId: curr.id,
      description: `Reversed pointer: curr->next = prev (${curr.val} points backwards to ${prevId ? "prev" : "nullptr"}).`,
      reasoning: `Pointer reversal step: link now directs backwards towards the new head.`,
      codeLine: 5,
      inlineVariables: { "curr->next": prevId || "nullptr" },
    });

    // 3. prev = curr, curr = next
    prevId = curr.id;
    curr.state = "default";
    currIndex++;

    steps.push({
      stepIndex: steps.length,
      operation: "reverse",
      listType,
      nodes: cloneNodes(nodes),
      pointers: { prev: prevId, curr: originalNextId, next: null },
      description: `Advance window: prev = curr, curr = next.`,
      reasoning: `Pointers step forward one position along the original chain.`,
      codeLine: 7,
      inlineVariables: { prev: prevId, curr: originalNextId || "nullptr" },
    });
  }

  // Final Step: head = prev
  // Reverse the visual array representation so nodes render in their new order
  const reversedNodes = [...nodes].reverse();
  for (let i = 0; i < reversedNodes.length; i++) {
    reversedNodes[i].isHead = i === 0;
    reversedNodes[i].isTail = i === reversedNodes.length - 1;
  }

  steps.push({
    stepIndex: steps.length,
    operation: "reverse",
    listType,
    nodes: cloneNodes(reversedNodes),
    pointers: { head: reversedNodes[0].id, tail: reversedNodes[reversedNodes.length - 1].id },
    description: `Reversal complete! Updated head pointer = prev (${reversedNodes[0].val}).`,
    reasoning: `The former tail is now the new head. Entire list reversed in O(n) time, O(1) space.`,
    codeLine: 9,
    inlineVariables: { newHead: reversedNodes[0].address, totalReversed: reversedNodes.length },
  });

  return steps;
}

