export type ActionType = "init" | "compare" | "swap" | "overwrite" | "pivot" | "sorted";

export interface StepPointers {
  i?: number;
  j?: number;
  min?: number;
  pivot?: number;
  k?: number;
}

export interface StepCounters {
  comparisons: number;
  swaps: number;
}

export interface AlgorithmTraceStep {
  stepIndex: number;
  action: ActionType;
  indices: number[];
  values: number[]; // Values of elements at indices
  arraySnapshot: number[];
  pointers: StepPointers;
  codeLine: number; // 1-indexed line in C++ code
  counters: StepCounters;
  pass: number;
  sortedIndices: number[]; // All indices locked in sorted region
  description: string;
  reasoning: string; // Plain-language invariant reason
  inlineVariables: Record<string, string | number>;
}

// 3D Tree Types for Hierarchical Data Structures
export type TreeNodeState = "default" | "comparing" | "found" | "inserted" | "deleted" | "successor";

export interface TreeNode3D {
  id: string;
  value: number;
  x: number;
  y: number;
  z: number;
  leftId?: string;
  rightId?: string;
  state: TreeNodeState;
}

export interface TreeEdge3D {
  id: string;
  from: string;
  to: string;
  fromPos: [number, number, number];
  toPos: [number, number, number];
  active: boolean;
}

export interface TreeTraceStep {
  stepIndex: number;
  operation: "insert" | "search" | "delete" | "traverse" | "init";
  nodes: TreeNode3D[];
  edges: TreeEdge3D[];
  activeNodeId?: string;
  description: string;
  reasoning: string;
  codeLine: number;
  inlineVariables: Record<string, string | number>;
}

// 3D Graph Types for Network Data Structures (BFS, DFS, Dijkstra)
export type GraphNodeState = "unvisited" | "frontier" | "visiting" | "visited" | "settled" | "path";

export interface GraphNode3D {
  id: string; // e.g. "A", "B", "C"
  label: string;
  x: number;
  y: number;
  z: number;
  state: GraphNodeState;
  dist: number; // For Dijkstra / BFS hop distance (-1 or Infinity if unreached)
  parent?: string; // For shortest path tree reconstruction
}

export interface GraphEdge3D {
  id: string; // e.g. "A-B"
  from: string;
  to: string;
  fromPos: [number, number, number];
  toPos: [number, number, number];
  weight: number;
  state: "default" | "examining" | "relaxed" | "path";
  directed?: boolean;
}

export type GraphAlgorithmType = "bfs" | "dfs" | "dijkstra";

export interface GraphTraceStep {
  stepIndex: number;
  algorithm: GraphAlgorithmType;
  nodes: GraphNode3D[];
  edges: GraphEdge3D[];
  activeNodeId?: string;
  activeEdgeId?: string;
  frontierItems: string[]; // Queue (BFS), Call Stack (DFS), or Priority Queue (Dijkstra)
  visitedOrder: string[];
  description: string;
  reasoning: string;
  codeLine: number;
  inlineVariables: Record<string, string | number>;
}

// Linked List Types (Singly & Doubly Linked List)
export type LinkedListType = "singly" | "doubly";
export type LinkedListNodeState = "default" | "active" | "creating" | "target" | "deleted" | "reconnecting";

export interface LinkedListNode {
  id: string;
  val: number;
  address: string; // Simulated memory address (e.g. 0x1A4)
  state: LinkedListNodeState;
  nextId?: string | null;
  prevId?: string | null;
  isHead?: boolean;
  isTail?: boolean;
}

export interface LinkedListPointers {
  curr?: string | null;
  prev?: string | null;
  next?: string | null;
  temp?: string | null;
  head?: string | null;
  tail?: string | null;
}

export interface LinkedListTraceStep {
  stepIndex: number;
  operation: "insert_head" | "insert_tail" | "insert_at" | "delete" | "search" | "reverse" | "init";
  listType: LinkedListType;
  nodes: LinkedListNode[];
  pointers: LinkedListPointers;
  activeNodeId?: string;
  description: string;
  reasoning: string;
  codeLine: number;
  inlineVariables: Record<string, string | number>;
}

// Stack & Queue Types (LIFO & FIFO)
export type StackQueueMode = "stack" | "queue";
export type BufferItemState = "default" | "entering" | "active" | "leaving" | "peek";

export interface StackQueueItem {
  id: string;
  val: number;
  state: BufferItemState;
  index: number;
}

export interface StackQueueTraceStep {
  stepIndex: number;
  mode: StackQueueMode;
  operation: "push" | "pop" | "peek" | "enqueue" | "dequeue" | "init" | "overflow" | "underflow";
  items: StackQueueItem[];
  maxCapacity: number;
  topIndex?: number;
  frontIndex?: number;
  rearIndex?: number;
  activeVal?: number;
  description: string;
  reasoning: string;
  codeLine: number;
  inlineVariables: Record<string, string | number>;
}

// Array & Dynamic Array Types
export type ArrayVisualMode = "dynamic" | "static";
export type ArrayCellState = "default" | "active" | "copying" | "shifting" | "new" | "deleted" | "empty";

export interface ArrayVisualCell {
  id: string;
  val: number | null;
  index: number;
  address: string; // e.g. "0x2000"
  state: ArrayCellState;
  isReserved?: boolean; // Reserved capacity slot (not yet populated)
}

export interface DynamicArrayTraceStep {
  stepIndex: number;
  mode: ArrayVisualMode;
  operation: "push_back" | "pop_back" | "insert_at" | "delete_at" | "access" | "resize" | "init";
  cells: ArrayVisualCell[];
  size: number;
  capacity: number;
  oldCells?: ArrayVisualCell[]; // For visualizing old buffer copying to new buffer during geometric resize
  activeIndices?: number[];
  targetIndex?: number;
  activeVal?: number;
  description: string;
  reasoning: string;
  codeLine: number;
  inlineVariables: Record<string, string | number>;
}

// ==========================================
// BINARY HEAP & PRIORITY QUEUE TYPES
// ==========================================
export type HeapType = "min" | "max";

export type HeapNodeState = "default" | "active" | "comparing" | "swapping" | "settled" | "new";

export interface HeapNode {
  id: string;
  val: number;
  index: number;
  parentIndex: number | null;
  leftChildIndex: number | null;
  rightChildIndex: number | null;
  x: number;
  y: number;
  state: HeapNodeState;
}

export interface HeapTraceStep {
  stepIndex: number;
  heapType: HeapType;
  operation: "init" | "insert" | "extract" | "heapify" | "sift_up" | "sift_down" | "peek";
  array: number[];
  nodes: HeapNode[];
  activeIndices?: number[];
  swappedIndices?: [number, number];
  activeVal?: number;
  description: string;
  reasoning: string;
  codeLine: number;
  inlineVariables: Record<string, string | number>;
}

// ==========================================
// HASH TABLE & COLLISION RESOLUTION TYPES
// ==========================================
export type HashCollisionStrategy = "chaining" | "linear_probing";

export interface HashNode {
  id: string;
  key: number;
  value?: string;
  state: "default" | "active" | "comparing" | "inserted" | "deleted" | "tombstone";
}

export interface HashBucket {
  index: number;
  nodes: HashNode[];
  isOccupied: boolean;
  isTombstone?: boolean;
  state: "default" | "active" | "target" | "collision" | "comparing";
}

export interface HashTableTraceStep {
  stepIndex: number;
  strategy: HashCollisionStrategy;
  operation: "init" | "insert" | "search" | "delete" | "rehash";
  buckets: HashBucket[];
  oldBuckets?: HashBucket[];
  keyCount: number;
  capacity: number;
  loadFactor: number;
  activeKey?: number;
  computedHash?: number;
  probeSequence?: number[];
  description: string;
  reasoning: string;
  codeLine: number;
  inlineVariables: Record<string, string | number>;
}

// ==========================================
// TRIE (PREFIX TREE) TYPES
// ==========================================
export type TrieNodeState = "default" | "active" | "comparing" | "inserted" | "found" | "not_found";

export interface TrieNodeVisual {
  id: string;
  char: string;
  isEndOfWord: boolean;
  word?: string;
  parentId: string | null;
  childIds: string[];
  childrenChars: string[];
  x: number;
  y: number;
  level: number;
  state: TrieNodeState;
}

export interface TrieTraceStep {
  stepIndex: number;
  operation: "init" | "insert" | "search" | "startsWith" | "autocomplete" | "delete";
  nodes: Record<string, TrieNodeVisual>;
  wordList: string[];
  activeNodeId?: string;
  activeChar?: string;
  charIndex?: number;
  targetWord?: string;
  suggestions?: string[];
  description: string;
  reasoning: string;
  codeLine: number;
  inlineVariables: Record<string, string | number>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: "Sorting" | "Data Structures";
  summary: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable?: boolean;
  inPlace?: boolean;
  cppCode: string;
  keyInvariants: string[];
  quiz: QuizQuestion[];
}

export type ArrayPreset = "random" | "sorted" | "reversed" | "few-unique" | "custom";

// AVL & Balanced Tree Types
export type AvlRotationType = "none" | "LL" | "RR" | "LR" | "RL";

export interface AvlNode3D {
  id: string;
  value: number;
  height: number;
  balanceFactor: number;
  x: number;
  y: number;
  z: number;
  leftId?: string;
  rightId?: string;
  state: TreeNodeState | "imbalanced" | "rotating";
}

export interface AvlTraceStep {
  stepIndex: number;
  operation: "insert" | "search" | "delete" | "rotate" | "rebalance" | "init";
  nodes: AvlNode3D[];
  edges: TreeEdge3D[];
  activeNodeId?: string;
  rotationType?: AvlRotationType;
  imbalancedNodeId?: string;
  description: string;
  reasoning: string;
  codeLine: number;
  inlineVariables: Record<string, string | number>;
}

// Disjoint Set Union (DSU / Union-Find) Types
export type DsuItemState = "default" | "querying" | "compressing" | "unioning" | "root";

export interface DsuElement {
  id: number;
  label: string;
  parent: number;
  rank: number;
  size: number;
  root: number;
  state: DsuItemState;
}

export interface DsuTraceStep {
  stepIndex: number;
  operation: "find" | "union" | "connected" | "init";
  elements: DsuElement[];
  activeIds?: number[];
  rootX?: number;
  rootY?: number;
  connected?: boolean;
  description: string;
  reasoning: string;
  codeLine: number;
  inlineVariables: Record<string, string | number>;
}
