import { create } from "zustand";
import {
  AlgorithmTraceStep,
  ArrayPreset,
  TreeTraceStep,
  GraphTraceStep,
  GraphAlgorithmType,
  LinkedListTraceStep,
  LinkedListType,
  StackQueueTraceStep,
  StackQueueMode,
  DynamicArrayTraceStep,
  ArrayVisualMode,
  HeapTraceStep,
  HeapType,
  HashTableTraceStep,
  HashCollisionStrategy,
  TrieTraceStep,
  AvlTraceStep,
  DsuElement,
  DsuTraceStep,
} from "@/types/visualizer";
import { ALGORITHMS, createArrayFromPreset, getAlgorithmTrace } from "@/lib/algorithms";
import {
  BstRawNode,
  buildBstFromArray,
  generateBstInsertTrace,
  generateBstSearchTrace,
  generateBstDeleteTrace,
  layoutBst,
} from "@/lib/bstEngine";
import {
  GRAPH_PRESETS,
  GraphModel,
  GRAPH_SANDBOX_TEMPLATES,
  layoutGraphNodes,
  createGraphEdge,
  recalculateEdgePositions,
  generateBfsTrace,
  generateDfsTrace,
  generateDijkstraTrace,
} from "@/lib/graphEngine";
import {
  createInitialList,
  generateInsertHeadTrace,
  generateInsertTailTrace,
  generateDeleteTrace,
  generateReverseTrace,
} from "@/lib/linkedListEngine";
import {
  createInitialItems,
  generateStackPushTrace,
  generateStackPopTrace,
  generateStackPeekTrace,
  generateQueueEnqueueTrace,
  generateQueueDequeueTrace,
  generateQueuePeekTrace,
  STACK_QUEUE_MAX_CAPACITY,
} from "@/lib/stackQueueEngine";
import {
  createArrayCells,
  generatePushBackTrace,
  generatePopBackTrace,
  generateInsertAtIndexTrace,
  generateAccessTrace,
} from "@/lib/dynamicArrayEngine";
import {
  generateHeapNodes,
  generateInsertTrace,
  generateExtractTrace,
  generateHeapifyTrace,
  generatePeekTrace,
} from "@/lib/heapEngine";
import {
  createInitialBuckets,
  generateInsertTrace as generateHashInsertTrace,
  generateSearchTrace as generateHashSearchTrace,
  generateDeleteTrace as generateHashDeleteTrace,
  generateRehashTrace,
  countKeys as countHashKeys,
} from "@/lib/hashTableEngine";
import {
  buildTrieFromWords,
  generateTrieInsertTrace,
  generateTrieSearchTrace,
  generateTrieStartsWithTrace,
  generateTrieAutocompleteTrace,
  generateTrieDeleteTrace,
} from "@/lib/trieEngine";
import {
  AvlRawNode,
  AVL_PRESETS,
  buildAvlTreeFromValues,
  generateAvlInsertTrace,
  generateAvlSearchTrace,
} from "@/lib/avlEngine";
import {
  DSU_PRESETS,
  createInitialDsu,
  generateFindTrace,
  generateUnionTrace,
  generateConnectedTrace,
} from "@/lib/disjointSetEngine";
import { ThemeMode } from "@/styles/tokens";

interface PredictState {
  isActive: boolean;
  question: string;
  expectedWillSwap: boolean;
  userChoice: boolean | null;
  isCorrect: boolean | null;
  score: number;
  total: number;
}

interface VisualizerStore {
  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // Navigation & Topics
  selectedTopic: string;
  setTopic: (topicId: string) => void;
  topicProgress: Record<string, boolean>;
  markTopicComplete: (topicId: string) => void;

  // Array Data
  array: number[];
  arraySize: number;
  inputPreset: ArrayPreset;
  customInputStr: string;
  setArrayPreset: (preset: ArrayPreset, size?: number, customStr?: string) => void;
  isCustomModalOpen: boolean;
  openCustomModal: () => void;
  closeCustomModal: () => void;
  applyCustomArray: (arr: number[]) => void;

  // Steps & Playback
  steps: AlgorithmTraceStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  stepForward: () => void;
  stepBackward: () => void;
  resetPlayback: () => void;
  seekStep: (index: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: number) => void;

  // Learning UX: Predict Mode
  isPredictMode: boolean;
  togglePredictMode: () => void;
  predictState: PredictState;
  submitPrediction: (willSwap: boolean) => void;
  dismissPrediction: () => void;

  // Learning UX: Compare Mode
  isCompareMode: boolean;
  toggleCompareMode: () => void;
  compareAlgoId: string;
  setCompareAlgoId: (id: string) => void;
  compareSteps: AlgorithmTraceStep[];

  // Learning UX: Inline Quiz
  showInlineQuiz: boolean;
  setShowInlineQuiz: (show: boolean) => void;
  quizScores: Record<string, { score: number; total: number }>;
  recordQuizScore: (topicId: string, score: number, total: number) => void;

  // Right Panel: Complexity View Toggle
  showComplexityTab: boolean;
  setShowComplexityTab: (show: boolean) => void;

  // Shortcuts Popover
  showShortcutsHelp: boolean;
  setShowShortcutsHelp: (show: boolean) => void;

  // 3D Tree State & Actions
  treeSteps: TreeTraceStep[];
  currentTreeStepIndex: number;
  insertIntoTree: (val: number) => void;
  searchInTree: (val: number) => void;
  deleteFromTree: (val: number) => void;
  resetTree: (values?: number[]) => void;
  seekTreeStep: (index: number) => void;
  stepForwardTree: () => void;
  stepBackwardTree: () => void;

  // 3D Graph State & Actions
  graphSteps: GraphTraceStep[];
  currentGraphStepIndex: number;
  graphAlgorithm: GraphAlgorithmType;
  graphStartNode: string;
  graphTargetNode: string;
  graphPresetId: string;
  customGraph: GraphModel | null;
  isGraphSandboxOpen: boolean;
  toggleGraphSandbox: () => void;
  getActiveGraphModel: () => GraphModel;
  addCustomGraphNode: () => void;
  removeCustomGraphNode: (id: string) => void;
  addCustomGraphEdge: (from: string, to: string, weight: number, bidirectional?: boolean) => void;
  removeCustomGraphEdge: (edgeId: string) => void;
  loadCustomGraphTemplate: (templateKey: string) => void;
  clearCustomGraph: () => void;
  setGraphAlgorithm: (algo: GraphAlgorithmType) => void;
  setGraphStartNode: (id: string) => void;
  setGraphTargetNode: (id: string) => void;
  runGraphAlgorithm: (algo?: GraphAlgorithmType, startId?: string, targetId?: string) => void;
  resetGraphPreset: (presetId?: string) => void;
  seekGraphStep: (index: number) => void;
  stepForwardGraph: () => void;
  stepBackwardGraph: () => void;

  // Cheat Sheet / Comparison Matrix Modal
  isCheatSheetOpen: boolean;
  openCheatSheet: () => void;
  closeCheatSheet: () => void;

  // Linked List State & Actions
  linkedListSteps: LinkedListTraceStep[];
  currentLinkedListStepIndex: number;
  linkedListType: LinkedListType;
  setLinkedListType: (type: LinkedListType) => void;
  insertHeadLinkedList: (val: number) => void;
  insertTailLinkedList: (val: number) => void;
  deleteLinkedListNode: (val: number) => void;
  reverseLinkedList: () => void;
  resetLinkedListPreset: (values?: number[]) => void;
  seekLinkedListStep: (index: number) => void;
  stepForwardLinkedList: () => void;
  stepBackwardLinkedList: () => void;

  // Stack & Queue State & Actions
  stackQueueSteps: StackQueueTraceStep[];
  currentStackQueueStepIndex: number;
  stackQueueMode: StackQueueMode;
  setStackQueueMode: (mode: StackQueueMode) => void;
  pushStack: (val: number) => void;
  popStack: () => void;
  peekStack: () => void;
  enqueueQueue: (val: number) => void;
  dequeueQueue: () => void;
  peekQueue: () => void;
  resetStackQueuePreset: (values?: number[]) => void;
  seekStackQueueStep: (index: number) => void;
  stepForwardStackQueue: () => void;
  stepBackwardStackQueue: () => void;

  // Array & Dynamic Array State & Actions
  dynamicArraySteps: DynamicArrayTraceStep[];
  currentDynamicArrayStepIndex: number;
  dynamicArrayMode: ArrayVisualMode;
  setDynamicArrayMode: (mode: ArrayVisualMode) => void;
  pushBackDynamicArray: (val: number) => void;
  popBackDynamicArray: () => void;
  insertAtDynamicArray: (val: number, index: number) => void;
  accessIndexDynamicArray: (index: number) => void;
  resetDynamicArrayPreset: (values?: number[], capacity?: number) => void;
  seekDynamicArrayStep: (index: number) => void;
  stepForwardDynamicArray: () => void;
  stepBackwardDynamicArray: () => void;

  // Binary Heap State & Actions
  heapSteps: HeapTraceStep[];
  currentHeapStepIndex: number;
  heapType: HeapType;
  setHeapType: (type: HeapType) => void;
  insertIntoHeap: (val: number) => void;
  extractFromHeap: () => void;
  buildHeap: (arr?: number[]) => void;
  peekHeap: () => void;
  resetHeapPreset: (values?: number[]) => void;
  seekHeapStep: (index: number) => void;
  stepForwardHeap: () => void;
  stepBackwardHeap: () => void;

  // Hash Table State & Actions
  hashTableSteps: HashTableTraceStep[];
  currentHashTableStepIndex: number;
  hashStrategy: HashCollisionStrategy;
  setHashStrategy: (strategy: HashCollisionStrategy) => void;
  insertIntoHashTable: (key: number) => void;
  searchInHashTable: (key: number) => void;
  deleteFromHashTable: (key: number) => void;
  rehashTable: () => void;
  resetHashTablePreset: (keys?: number[]) => void;
  seekHashTableStep: (index: number) => void;
  stepForwardHashTable: () => void;
  stepBackwardHashTable: () => void;

  // Trie (Prefix Tree) State & Actions
  trieSteps: TrieTraceStep[];
  currentTrieStepIndex: number;
  insertIntoTrie: (word: string) => void;
  searchInTrie: (word: string) => void;
  startsWithTrie: (prefix: string) => void;
  autocompleteTrie: (prefix: string) => void;
  deleteFromTrie: (word: string) => void;
  resetTriePreset: (words?: string[]) => void;
  seekTrieStep: (index: number) => void;
  stepForwardTrie: () => void;
  stepBackwardTrie: () => void;

  // AVL & Balanced Tree State & Actions
  avlSteps: AvlTraceStep[];
  currentAvlStepIndex: number;
  insertIntoAvlTree: (val: number) => void;
  searchInAvlTree: (val: number) => void;
  resetAvlTreePreset: (presetKey?: string) => void;
  seekAvlStep: (index: number) => void;
  stepForwardAvl: () => void;
  stepBackwardAvl: () => void;

  // Disjoint Set Union (DSU) State & Actions
  dsuSteps: DsuTraceStep[];
  currentDsuStepIndex: number;
  findInDsu: (id: number) => void;
  unionInDsu: (x: number, y: number) => void;
  checkConnectedDsu: (x: number, y: number) => void;
  resetDsuPreset: (presetKey?: string) => void;
  seekDsuStep: (index: number) => void;
  stepForwardDsu: () => void;
  stepBackwardDsu: () => void;

  // Backend C++ Status
  isBackendOnline: boolean;
  useBackend: boolean;
  checkBackendHealth: () => Promise<void>;
  toggleUseBackend: () => void;
}

const DEFAULT_ARRAY = [45, 22, 89, 34, 67, 12, 78, 56, 90, 29];

export const useVisualizerStore = create<VisualizerStore>((set, get) => ({
  // Theme
  theme: "light",
  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";
    if (typeof document !== "undefined") {
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    set({ theme: nextTheme });
  },

  // Navigation
  selectedTopic: "bubble",
  setTopic: (topicId) => {
    const arr = get().array;
    const isSorting = ALGORITHMS[topicId]?.category === "Sorting";
    const nextSteps = isSorting ? getAlgorithmTrace(topicId, arr) : get().steps;
    const compareAlgo = get().compareAlgoId;
    const compareNextSteps = isSorting ? getAlgorithmTrace(compareAlgo, arr) : get().compareSteps;

    set({
      selectedTopic: topicId,
      steps: nextSteps,
      compareSteps: compareNextSteps,
      currentStepIndex: 0,
      currentTreeStepIndex: 0,
      currentGraphStepIndex: 0,
      currentLinkedListStepIndex: 0,
      currentStackQueueStepIndex: 0,
      currentDynamicArrayStepIndex: 0,
      currentHeapStepIndex: 0,
      currentHashTableStepIndex: 0,
      currentTrieStepIndex: 0,
      isPlaying: false,
      showInlineQuiz: false,
    });
  },
  topicProgress: {},
  markTopicComplete: (topicId) => {
    const updated = { ...get().topicProgress, [topicId]: true };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ltc_progress", JSON.stringify(updated));
      } catch {}
    }
    set({ topicProgress: updated });
  },

  // Array Data
  array: DEFAULT_ARRAY,
  arraySize: 10,
  inputPreset: "random",
  customInputStr: "45, 22, 89, 34, 67, 12, 78, 56, 90, 29",
  setArrayPreset: (preset, size, customStr) => {
    const nextSize = size ?? get().arraySize;
    const nextCustomStr = customStr ?? get().customInputStr;
    const newArr = createArrayFromPreset(preset, nextSize, nextCustomStr);
    const topic = get().selectedTopic;
    const isSorting = Boolean(ALGORITHMS[topic]);
    const nextSteps = isSorting ? getAlgorithmTrace(topic, newArr) : [];
    const compareNextSteps = isSorting ? getAlgorithmTrace(get().compareAlgoId, newArr) : [];

    set({
      inputPreset: preset,
      arraySize: nextSize,
      customInputStr: nextCustomStr,
      array: newArr,
      steps: nextSteps,
      compareSteps: compareNextSteps,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  isCustomModalOpen: false,
  openCustomModal: () => set({ isCustomModalOpen: true }),
  closeCustomModal: () => set({ isCustomModalOpen: false }),

  applyCustomArray: (newArr) => {
    const validArr = newArr.length > 0 ? newArr.slice(0, 24) : DEFAULT_ARRAY;
    const topic = get().selectedTopic;
    const isSorting = Boolean(ALGORITHMS[topic]);
    const nextSteps = isSorting ? getAlgorithmTrace(topic, validArr) : [];
    const compareNextSteps = isSorting ? getAlgorithmTrace(get().compareAlgoId, validArr) : [];

    set({
      inputPreset: "custom",
      array: validArr,
      arraySize: validArr.length,
      customInputStr: validArr.join(", "),
      steps: nextSteps,
      compareSteps: compareNextSteps,
      currentStepIndex: 0,
      isPlaying: false,
      isCustomModalOpen: false,
    });
  },

  // Playback & Steps
  steps: getAlgorithmTrace("bubble", DEFAULT_ARRAY),
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,

  stepForward: () => {
    const { currentStepIndex, steps, isPredictMode, predictState } = get();
    if (currentStepIndex >= steps.length - 1) {
      set({ isPlaying: false });
      return;
    }

    const nextIdx = currentStepIndex + 1;
    const nextStep = steps[nextIdx];

    // Predict Mode: Pause and ask before compare/swap
    if (isPredictMode && nextStep?.action === "compare" && !predictState.isActive) {
      const valA = nextStep.values[0] ?? nextStep.arraySnapshot[nextStep.indices[0]];
      const valB = nextStep.values[1] ?? nextStep.arraySnapshot[nextStep.indices[1]];
      const wouldSwap = valA > valB;

      set({
        isPlaying: false,
        predictState: {
          ...predictState,
          isActive: true,
          question: `Compare ${valA} vs ${valB}. Will these elements swap?`,
          expectedWillSwap: wouldSwap,
          userChoice: null,
          isCorrect: null,
        },
      });
      return;
    }

    set({ currentStepIndex: nextIdx });
  },

  stepBackward: () => {
    set((s) => ({ currentStepIndex: Math.max(0, s.currentStepIndex - 1) }));
  },

  resetPlayback: () => {
    set({ currentStepIndex: 0, isPlaying: false });
  },

  seekStep: (index) => {
    const { steps } = get();
    const clamped = Math.max(0, Math.min(index, steps.length - 1));
    set({ currentStepIndex: clamped, isPlaying: false });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  // Predict Mode
  isPredictMode: false,
  togglePredictMode: () => set((s) => ({ isPredictMode: !s.isPredictMode })),
  predictState: {
    isActive: false,
    question: "",
    expectedWillSwap: false,
    userChoice: null,
    isCorrect: null,
    score: 0,
    total: 0,
  },
  submitPrediction: (willSwap) => {
    const { predictState, currentStepIndex, steps } = get();
    const isCorrect = willSwap === predictState.expectedWillSwap;

    set({
      predictState: {
        ...predictState,
        userChoice: willSwap,
        isCorrect,
        score: predictState.score + (isCorrect ? 1 : 0),
        total: predictState.total + 1,
      },
    });

    setTimeout(() => {
      set({
        currentStepIndex: Math.min(steps.length - 1, currentStepIndex + 1),
        predictState: {
          ...get().predictState,
          isActive: false,
          question: "",
          expectedWillSwap: false,
          userChoice: null,
          isCorrect: null,
        },
      });
    }, 900);
  },
  dismissPrediction: () => {
    set({
      predictState: {
        ...get().predictState,
        isActive: false,
        question: "",
        userChoice: null,
        isCorrect: null,
      },
    });
  },

  // Compare Mode
  isCompareMode: false,
  toggleCompareMode: () => {
    const nextVal = !get().isCompareMode;
    const arr = get().array;
    set({
      isCompareMode: nextVal,
      compareSteps: getAlgorithmTrace(get().compareAlgoId, arr),
    });
  },
  compareAlgoId: "quick",
  setCompareAlgoId: (id) => {
    const arr = get().array;
    set({
      compareAlgoId: id,
      compareSteps: getAlgorithmTrace(id, arr),
      currentStepIndex: 0,
      isPlaying: false,
    });
  },
  compareSteps: getAlgorithmTrace("quick", DEFAULT_ARRAY),

  // Inline Quiz
  showInlineQuiz: false,
  setShowInlineQuiz: (show) => set({ showInlineQuiz: show }),
  quizScores: {},
  recordQuizScore: (topicId, score, total) => {
    const updated = { ...get().quizScores, [topicId]: { score, total } };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ltc_quiz_scores", JSON.stringify(updated));
      } catch {}
    }
    set({ quizScores: updated });
    get().markTopicComplete(topicId);
  },

  // Complexity Tab
  showComplexityTab: false,
  setShowComplexityTab: (show) => set({ showComplexityTab: show }),

  // Shortcuts popover
  showShortcutsHelp: false,
  setShowShortcutsHelp: (show) => set({ showShortcutsHelp: show }),

  // 3D Tree State & Actions
  treeSteps: (() => {
    const raw = buildBstFromArray([50, 30, 70, 20, 40, 60, 80]);
    const layout = layoutBst(raw);
    return [
      {
        stepIndex: 0,
        operation: "init" as const,
        nodes: layout.nodes,
        edges: layout.edges,
        description: "Balanced Binary Search Tree loaded with 7 nodes.",
        reasoning: "BST initialized: root is 50, left subtree < 50, right subtree > 50.",
        codeLine: 1,
        inlineVariables: { root: 50, nodeCount: 7 },
      },
    ];
  })(),
  currentTreeStepIndex: 0,
  insertIntoTree: (val) => {
    const lastStep = get().treeSteps[get().treeSteps.length - 1];
    const nodeValues = lastStep.nodes.map((n) => n.value);
    const root = buildBstFromArray(nodeValues);
    const { steps } = generateBstInsertTrace(root, val);
    set({
      treeSteps: steps,
      currentTreeStepIndex: 0,
      isPlaying: false,
    });
  },
  searchInTree: (val) => {
    const lastStep = get().treeSteps[get().treeSteps.length - 1];
    const nodeValues = lastStep.nodes.map((n) => n.value);
    const root = buildBstFromArray(nodeValues);
    const steps = generateBstSearchTrace(root, val);
    set({
      treeSteps: steps,
      currentTreeStepIndex: 0,
      isPlaying: false,
    });
  },
  deleteFromTree: (val) => {
    const lastStep = get().treeSteps[get().treeSteps.length - 1];
    const nodeValues = lastStep.nodes.map((n) => n.value);
    const root = buildBstFromArray(nodeValues);
    const { steps } = generateBstDeleteTrace(root, val);
    set({
      treeSteps: steps,
      currentTreeStepIndex: 0,
      isPlaying: false,
    });
  },
  resetTree: (values = [50, 30, 70, 20, 40, 60, 80]) => {
    const root = buildBstFromArray(values);
    const layout = layoutBst(root);
    set({
      treeSteps: [
        {
          stepIndex: 0,
          operation: "init",
          nodes: layout.nodes,
          edges: layout.edges,
          description: `Reset tree with ${values.length} nodes.`,
          reasoning: "Loaded fresh BST. Root and subtrees satisfy binary search property.",
          codeLine: 1,
          inlineVariables: { nodeCount: values.length },
        },
      ],
      currentTreeStepIndex: 0,
      isPlaying: false,
    });
  },
  seekTreeStep: (index) => {
    const total = get().treeSteps.length;
    set({ currentTreeStepIndex: Math.max(0, Math.min(index, total - 1)), isPlaying: false });
  },
  stepForwardTree: () => {
    const { currentTreeStepIndex, treeSteps } = get();
    if (currentTreeStepIndex < treeSteps.length - 1) {
      set({ currentTreeStepIndex: currentTreeStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },
  stepBackwardTree: () => {
    set((s) => ({ currentTreeStepIndex: Math.max(0, s.currentTreeStepIndex - 1) }));
  },

  // Cheat Sheet / Comparison Matrix Modal
  isCheatSheetOpen: false,
  openCheatSheet: () => set({ isCheatSheetOpen: true }),
  closeCheatSheet: () => set({ isCheatSheetOpen: false }),

  // 3D Graph State & Actions
  graphSteps: (() => {
    const { nodes, edges } = GRAPH_PRESETS.classic.model();
    return generateDijkstraTrace(nodes, edges, "A", "F");
  })(),
  currentGraphStepIndex: 0,
  graphAlgorithm: "dijkstra",
  graphStartNode: "A",
  graphTargetNode: "F",
  graphPresetId: "classic",
  customGraph: null,
  isGraphSandboxOpen: false,
  toggleGraphSandbox: () => set((s) => ({ isGraphSandboxOpen: !s.isGraphSandboxOpen })),

  getActiveGraphModel: () => {
    const { graphPresetId, customGraph } = get();
    if (graphPresetId === "custom" && customGraph) {
      return customGraph;
    }
    const preset = GRAPH_PRESETS[graphPresetId] || GRAPH_PRESETS.classic;
    return preset.model();
  },

  addCustomGraphNode: () => {
    const active = get().getActiveGraphModel();
    const existingIds = active.nodes.map((n) => n.id);
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const nextId = alphabet.find((ch) => !existingIds.includes(ch));
    if (!nextId) return; // Limit to 10 nodes for clean 3D visibility

    const updatedIds = [...existingIds, nextId];
    const newNodes = layoutGraphNodes(updatedIds);
    const updatedEdges = recalculateEdgePositions(newNodes, active.edges);

    // If there's an existing node, connect the new node with an initial edge
    if (existingIds.length > 0) {
      const connectTo = existingIds[existingIds.length - 1];
      const newEdge = createGraphEdge(connectTo, nextId, 3, newNodes, false);
      if (newEdge) updatedEdges.push(newEdge);
    }

    const newModel = { nodes: newNodes, edges: updatedEdges };
    set({ customGraph: newModel, graphPresetId: "custom" });
    get().runGraphAlgorithm(get().graphAlgorithm, get().graphStartNode, get().graphTargetNode);
  },

  removeCustomGraphNode: (nodeId: string) => {
    const active = get().getActiveGraphModel();
    if (active.nodes.length <= 2) return; // Minimum 2 nodes

    const remainingIds = active.nodes.map((n) => n.id).filter((id) => id !== nodeId);
    const newNodes = layoutGraphNodes(remainingIds);
    const filteredEdges = active.edges.filter((e) => e.from !== nodeId && e.to !== nodeId);
    const updatedEdges = recalculateEdgePositions(newNodes, filteredEdges);

    const newModel = { nodes: newNodes, edges: updatedEdges };
    const nextStart = get().graphStartNode === nodeId ? remainingIds[0] : get().graphStartNode;
    const nextTarget =
      get().graphTargetNode === nodeId ? remainingIds[remainingIds.length - 1] : get().graphTargetNode;

    set({
      customGraph: newModel,
      graphPresetId: "custom",
      graphStartNode: nextStart,
      graphTargetNode: nextTarget,
    });
    get().runGraphAlgorithm(get().graphAlgorithm, nextStart, nextTarget);
  },

  addCustomGraphEdge: (from: string, to: string, weight: number, bidirectional: boolean = true) => {
    if (from === to) return;
    const active = get().getActiveGraphModel();
    const existing = active.edges.find(
      (e) => (e.from === from && e.to === to) || (!e.directed && e.from === to && e.to === from)
    );
    if (existing) {
      const updatedEdges = active.edges.map((e) => (e.id === existing.id ? { ...e, weight } : e));
      const newModel = { ...active, edges: updatedEdges };
      set({ customGraph: newModel, graphPresetId: "custom" });
      get().runGraphAlgorithm();
      return;
    }

    const newEdge = createGraphEdge(from, to, weight, active.nodes, !bidirectional);
    if (!newEdge) return;

    const newModel = { ...active, edges: [...active.edges, newEdge] };
    set({ customGraph: newModel, graphPresetId: "custom" });
    get().runGraphAlgorithm();
  },

  removeCustomGraphEdge: (edgeId: string) => {
    const active = get().getActiveGraphModel();
    const newModel = { ...active, edges: active.edges.filter((e) => e.id !== edgeId) };
    set({ customGraph: newModel, graphPresetId: "custom" });
    get().runGraphAlgorithm();
  },

  loadCustomGraphTemplate: (templateKey: string) => {
    const template = GRAPH_SANDBOX_TEMPLATES[templateKey] || GRAPH_SANDBOX_TEMPLATES.triangle;
    const model = template.getModel();
    const start = model.nodes[0]?.id || "A";
    const target = model.nodes[model.nodes.length - 1]?.id || "C";
    set({
      customGraph: model,
      graphPresetId: "custom",
      graphStartNode: start,
      graphTargetNode: target,
    });
    get().runGraphAlgorithm(get().graphAlgorithm, start, target);
  },

  clearCustomGraph: () => {
    const model = GRAPH_SANDBOX_TEMPLATES.blank.getModel();
    set({
      customGraph: model,
      graphPresetId: "custom",
      graphStartNode: "A",
      graphTargetNode: "B",
    });
    get().runGraphAlgorithm(get().graphAlgorithm, "A", "B");
  },

  setGraphAlgorithm: (algo) => {
    const { graphStartNode, graphTargetNode } = get();
    const { nodes, edges } = get().getActiveGraphModel();

    let steps: GraphTraceStep[] = [];
    if (algo === "bfs") {
      steps = generateBfsTrace(nodes, edges, graphStartNode);
    } else if (algo === "dfs") {
      steps = generateDfsTrace(nodes, edges, graphStartNode);
    } else {
      steps = generateDijkstraTrace(nodes, edges, graphStartNode, graphTargetNode);
    }

    set({
      graphAlgorithm: algo,
      graphSteps: steps,
      currentGraphStepIndex: 0,
      isPlaying: false,
    });
  },

  setGraphStartNode: (id) => {
    set({ graphStartNode: id });
    get().runGraphAlgorithm(get().graphAlgorithm, id, get().graphTargetNode);
  },

  setGraphTargetNode: (id) => {
    set({ graphTargetNode: id });
    if (get().graphAlgorithm === "dijkstra") {
      get().runGraphAlgorithm("dijkstra", get().graphStartNode, id);
    }
  },

  runGraphAlgorithm: (algo, startId, targetId) => {
    const selectedAlgo = algo || get().graphAlgorithm;
    const { nodes, edges } = get().getActiveGraphModel();
    const nodeIds = nodes.map((n) => n.id);
    const validStart = nodeIds.includes(startId || get().graphStartNode)
      ? startId || get().graphStartNode
      : nodeIds[0] || "A";
    const validTarget = nodeIds.includes(targetId || get().graphTargetNode)
      ? targetId || get().graphTargetNode
      : nodeIds[nodeIds.length - 1] || "B";

    let steps: GraphTraceStep[] = [];
    if (selectedAlgo === "bfs") {
      steps = generateBfsTrace(nodes, edges, validStart);
    } else if (selectedAlgo === "dfs") {
      steps = generateDfsTrace(nodes, edges, validStart);
    } else {
      steps = generateDijkstraTrace(nodes, edges, validStart, validTarget);
    }

    set({
      graphAlgorithm: selectedAlgo,
      graphStartNode: validStart,
      graphTargetNode: validTarget,
      graphSteps: steps,
      currentGraphStepIndex: 0,
      isPlaying: false,
    });
  },

  resetGraphPreset: (presetId = "classic") => {
    const preset = GRAPH_PRESETS[presetId] || GRAPH_PRESETS.classic;
    const { nodes, edges } = preset.model();
    const start = nodes[0]?.id || "A";
    const target = nodes[nodes.length - 1]?.id || "F";
    const algo = get().graphAlgorithm;

    let steps: GraphTraceStep[] = [];
    if (algo === "bfs") {
      steps = generateBfsTrace(nodes, edges, start);
    } else if (algo === "dfs") {
      steps = generateDfsTrace(nodes, edges, start);
    } else {
      steps = generateDijkstraTrace(nodes, edges, start, target);
    }

    set({
      graphPresetId: presetId,
      customGraph: null,
      graphStartNode: start,
      graphTargetNode: target,
      graphSteps: steps,
      currentGraphStepIndex: 0,
      isPlaying: false,
    });
  },

  seekGraphStep: (index) => {
    const total = get().graphSteps.length;
    set({ currentGraphStepIndex: Math.max(0, Math.min(index, total - 1)), isPlaying: false });
  },

  stepForwardGraph: () => {
    const { currentGraphStepIndex, graphSteps } = get();
    if (currentGraphStepIndex < graphSteps.length - 1) {
      set({ currentGraphStepIndex: currentGraphStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackwardGraph: () => {
    set((s) => ({ currentGraphStepIndex: Math.max(0, s.currentGraphStepIndex - 1) }));
  },

  // Linked List State & Actions
  linkedListSteps: (() => {
    const nodes = createInitialList([12, 99, 37, 45], false);
    return [
      {
        stepIndex: 0,
        operation: "init" as const,
        listType: "singly" as const,
        nodes,
        pointers: { head: nodes[0]?.id || null, tail: nodes[nodes.length - 1]?.id || null },
        description: "Singly Linked List initialized with 4 nodes.",
        reasoning: "Head points to 12. Each node contains a value and a next pointer terminating at nullptr.",
        codeLine: 1,
        inlineVariables: { length: 4, head: "0x120" },
      },
    ];
  })(),
  currentLinkedListStepIndex: 0,
  linkedListType: "singly",

  setLinkedListType: (type) => {
    const lastStep = get().linkedListSteps[get().linkedListSteps.length - 1];
    const vals = lastStep?.nodes.map((n) => n.val) || [12, 99, 37, 45];
    const nodes = createInitialList(vals, type === "doubly");
    set({
      linkedListType: type,
      linkedListSteps: [
        {
          stepIndex: 0,
          operation: "init",
          listType: type,
          nodes,
          pointers: { head: nodes[0]?.id || null, tail: nodes[nodes.length - 1]?.id || null },
          description: `${type === "doubly" ? "Doubly" : "Singly"} Linked List initialized with ${nodes.length} nodes.`,
          reasoning: type === "doubly" ? "Nodes now maintain both next and prev pointers." : "Nodes maintain forward next pointers.",
          codeLine: 1,
          inlineVariables: { length: nodes.length },
        },
      ],
      currentLinkedListStepIndex: 0,
      isPlaying: false,
    });
  },

  insertHeadLinkedList: (val) => {
    const lastStep = get().linkedListSteps[get().linkedListSteps.length - 1];
    const currentNodes = lastStep?.nodes || [];
    const isDoubly = get().linkedListType === "doubly";
    const steps = generateInsertHeadTrace(currentNodes, val, isDoubly);
    set({
      linkedListSteps: steps,
      currentLinkedListStepIndex: 0,
      isPlaying: false,
    });
  },

  insertTailLinkedList: (val) => {
    const lastStep = get().linkedListSteps[get().linkedListSteps.length - 1];
    const currentNodes = lastStep?.nodes || [];
    const isDoubly = get().linkedListType === "doubly";
    const steps = generateInsertTailTrace(currentNodes, val, isDoubly);
    set({
      linkedListSteps: steps,
      currentLinkedListStepIndex: 0,
      isPlaying: false,
    });
  },

  deleteLinkedListNode: (val) => {
    const lastStep = get().linkedListSteps[get().linkedListSteps.length - 1];
    const currentNodes = lastStep?.nodes || [];
    const isDoubly = get().linkedListType === "doubly";
    const steps = generateDeleteTrace(currentNodes, val, isDoubly);
    set({
      linkedListSteps: steps,
      currentLinkedListStepIndex: 0,
      isPlaying: false,
    });
  },

  reverseLinkedList: () => {
    const lastStep = get().linkedListSteps[get().linkedListSteps.length - 1];
    const currentNodes = lastStep?.nodes || [];
    const isDoubly = get().linkedListType === "doubly";
    const steps = generateReverseTrace(currentNodes, isDoubly);
    set({
      linkedListSteps: steps,
      currentLinkedListStepIndex: 0,
      isPlaying: false,
    });
  },

  resetLinkedListPreset: (values = [12, 99, 37, 45]) => {
    const isDoubly = get().linkedListType === "doubly";
    const nodes = createInitialList(values, isDoubly);
    set({
      linkedListSteps: [
        {
          stepIndex: 0,
          operation: "init",
          listType: get().linkedListType,
          nodes,
          pointers: { head: nodes[0]?.id || null, tail: nodes[nodes.length - 1]?.id || null },
          description: `Loaded list with ${nodes.length} nodes.`,
          reasoning: "Fresh linked list ready for pointer operations.",
          codeLine: 1,
          inlineVariables: { length: nodes.length },
        },
      ],
      currentLinkedListStepIndex: 0,
      isPlaying: false,
    });
  },

  seekLinkedListStep: (index) => {
    const total = get().linkedListSteps.length;
    set({ currentLinkedListStepIndex: Math.max(0, Math.min(index, total - 1)), isPlaying: false });
  },

  stepForwardLinkedList: () => {
    const { currentLinkedListStepIndex, linkedListSteps } = get();
    if (currentLinkedListStepIndex < linkedListSteps.length - 1) {
      set({ currentLinkedListStepIndex: currentLinkedListStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackwardLinkedList: () => {
    set((s) => ({ currentLinkedListStepIndex: Math.max(0, s.currentLinkedListStepIndex - 1) }));
  },

  // Stack & Queue State & Actions
  stackQueueSteps: (() => {
    const items = createInitialItems([15, 30, 45, 60]);
    return [
      {
        stepIndex: 0,
        mode: "stack" as StackQueueMode,
        operation: "init" as const,
        items,
        maxCapacity: STACK_QUEUE_MAX_CAPACITY,
        topIndex: items.length - 1,
        description: `Stack initialized with ${items.length} items.`,
        reasoning: "Stack operating on LIFO discipline. Ready for Push, Pop, and Peek.",
        codeLine: 1,
        inlineVariables: { size: items.length, capacity: STACK_QUEUE_MAX_CAPACITY },
      },
    ];
  })(),
  currentStackQueueStepIndex: 0,
  stackQueueMode: "stack",

  setStackQueueMode: (mode) => {
    const lastStep = get().stackQueueSteps[get().stackQueueSteps.length - 1];
    const vals = lastStep?.items.map((it) => it.val) || [15, 30, 45, 60];
    const items = createInitialItems(vals);
    set({
      stackQueueMode: mode,
      stackQueueSteps: [
        {
          stepIndex: 0,
          mode,
          operation: "init",
          items,
          maxCapacity: STACK_QUEUE_MAX_CAPACITY,
          topIndex: mode === "stack" ? items.length - 1 : undefined,
          frontIndex: mode === "queue" ? 0 : undefined,
          rearIndex: mode === "queue" ? items.length - 1 : undefined,
          description: `${mode === "stack" ? "Stack (LIFO)" : "Queue (FIFO)"} initialized with ${items.length} items.`,
          reasoning: mode === "stack"
            ? "Last-In, First-Out: additions & removals strictly occur at TOP."
            : "First-In, First-Out: additions occur at REAR, removals occur at FRONT.",
          codeLine: 1,
          inlineVariables: { mode, size: items.length, capacity: STACK_QUEUE_MAX_CAPACITY },
        },
      ],
      currentStackQueueStepIndex: 0,
      isPlaying: false,
    });
  },

  pushStack: (val) => {
    const lastStep = get().stackQueueSteps[get().stackQueueSteps.length - 1];
    const currentItems = lastStep?.items || [];
    const steps = generateStackPushTrace(currentItems, val, STACK_QUEUE_MAX_CAPACITY);
    set({
      stackQueueSteps: steps,
      currentStackQueueStepIndex: 0,
      isPlaying: false,
    });
  },

  popStack: () => {
    const lastStep = get().stackQueueSteps[get().stackQueueSteps.length - 1];
    const currentItems = lastStep?.items || [];
    const steps = generateStackPopTrace(currentItems, STACK_QUEUE_MAX_CAPACITY);
    set({
      stackQueueSteps: steps,
      currentStackQueueStepIndex: 0,
      isPlaying: false,
    });
  },

  peekStack: () => {
    const lastStep = get().stackQueueSteps[get().stackQueueSteps.length - 1];
    const currentItems = lastStep?.items || [];
    const steps = generateStackPeekTrace(currentItems, STACK_QUEUE_MAX_CAPACITY);
    set({
      stackQueueSteps: steps,
      currentStackQueueStepIndex: 0,
      isPlaying: false,
    });
  },

  enqueueQueue: (val) => {
    const lastStep = get().stackQueueSteps[get().stackQueueSteps.length - 1];
    const currentItems = lastStep?.items || [];
    const steps = generateQueueEnqueueTrace(currentItems, val, STACK_QUEUE_MAX_CAPACITY);
    set({
      stackQueueSteps: steps,
      currentStackQueueStepIndex: 0,
      isPlaying: false,
    });
  },

  dequeueQueue: () => {
    const lastStep = get().stackQueueSteps[get().stackQueueSteps.length - 1];
    const currentItems = lastStep?.items || [];
    const steps = generateQueueDequeueTrace(currentItems, STACK_QUEUE_MAX_CAPACITY);
    set({
      stackQueueSteps: steps,
      currentStackQueueStepIndex: 0,
      isPlaying: false,
    });
  },

  peekQueue: () => {
    const lastStep = get().stackQueueSteps[get().stackQueueSteps.length - 1];
    const currentItems = lastStep?.items || [];
    const steps = generateQueuePeekTrace(currentItems, STACK_QUEUE_MAX_CAPACITY);
    set({
      stackQueueSteps: steps,
      currentStackQueueStepIndex: 0,
      isPlaying: false,
    });
  },

  resetStackQueuePreset: (values = [15, 30, 45, 60]) => {
    const mode = get().stackQueueMode;
    const items = createInitialItems(values);
    set({
      stackQueueSteps: [
        {
          stepIndex: 0,
          mode,
          operation: "init",
          items,
          maxCapacity: STACK_QUEUE_MAX_CAPACITY,
          topIndex: mode === "stack" ? items.length - 1 : undefined,
          frontIndex: mode === "queue" ? 0 : undefined,
          rearIndex: mode === "queue" ? items.length - 1 : undefined,
          description: `Loaded ${mode === "stack" ? "stack" : "queue"} with ${items.length} items.`,
          reasoning: "Fresh buffer ready for operations.",
          codeLine: 1,
          inlineVariables: { size: items.length },
        },
      ],
      currentStackQueueStepIndex: 0,
      isPlaying: false,
    });
  },

  seekStackQueueStep: (index) => {
    const total = get().stackQueueSteps.length;
    set({ currentStackQueueStepIndex: Math.max(0, Math.min(index, total - 1)), isPlaying: false });
  },

  stepForwardStackQueue: () => {
    const { currentStackQueueStepIndex, stackQueueSteps } = get();
    if (currentStackQueueStepIndex < stackQueueSteps.length - 1) {
      set({ currentStackQueueStepIndex: currentStackQueueStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackwardStackQueue: () => {
    set((s) => ({ currentStackQueueStepIndex: Math.max(0, s.currentStackQueueStepIndex - 1) }));
  },

  // Array & Dynamic Array State & Actions
  dynamicArraySteps: (() => {
    const values = [10, 20, 30];
    const capacity = 4;
    const cells = createArrayCells(values, capacity);
    return [
      {
        stepIndex: 0,
        mode: "dynamic" as ArrayVisualMode,
        operation: "init" as const,
        cells,
        size: values.length,
        capacity,
        description: `Dynamic Array initialized (Size: ${values.length}, Capacity: ${capacity}).`,
        reasoning: "Headroom available (1 reserved slot). Click Push Back to demonstrate 2x capacity doubling upon filling.",
        codeLine: 1,
        inlineVariables: { size: values.length, capacity },
      },
    ];
  })(),
  currentDynamicArrayStepIndex: 0,
  dynamicArrayMode: "dynamic",

  setDynamicArrayMode: (mode) => {
    const lastStep = get().dynamicArraySteps[get().dynamicArraySteps.length - 1];
    const values = lastStep?.cells.filter((c) => c.val !== null).map((c) => c.val!) || [10, 20, 30];
    const capacity = lastStep?.capacity || 4;
    const cells = createArrayCells(values, capacity);
    set({
      dynamicArrayMode: mode,
      dynamicArraySteps: [
        {
          stepIndex: 0,
          mode,
          operation: "init",
          cells,
          size: values.length,
          capacity,
          description: `Switched to ${mode === "dynamic" ? "Dynamic Array (std::vector)" : "Fixed Static Array"} mode.`,
          reasoning: mode === "dynamic"
            ? "Dynamic arrays automatically resize by geometric doubling (2x) when full."
            : "Static arrays have a fixed allocated size and cannot resize.",
          codeLine: 1,
          inlineVariables: { mode, size: values.length, capacity },
        },
      ],
      currentDynamicArrayStepIndex: 0,
      isPlaying: false,
    });
  },

  pushBackDynamicArray: (val) => {
    const lastStep = get().dynamicArraySteps[get().dynamicArraySteps.length - 1];
    const currentValues = lastStep?.cells.filter((c) => c.val !== null).map((c) => c.val!) || [];
    const capacity = lastStep?.capacity || 4;
    const steps = generatePushBackTrace(currentValues, capacity, val, get().dynamicArrayMode);
    set({
      dynamicArraySteps: steps,
      currentDynamicArrayStepIndex: 0,
      isPlaying: false,
    });
  },

  popBackDynamicArray: () => {
    const lastStep = get().dynamicArraySteps[get().dynamicArraySteps.length - 1];
    const currentValues = lastStep?.cells.filter((c) => c.val !== null).map((c) => c.val!) || [];
    const capacity = lastStep?.capacity || 4;
    const steps = generatePopBackTrace(currentValues, capacity, get().dynamicArrayMode);
    set({
      dynamicArraySteps: steps,
      currentDynamicArrayStepIndex: 0,
      isPlaying: false,
    });
  },

  insertAtDynamicArray: (val, index) => {
    const lastStep = get().dynamicArraySteps[get().dynamicArraySteps.length - 1];
    const currentValues = lastStep?.cells.filter((c) => c.val !== null).map((c) => c.val!) || [];
    const capacity = lastStep?.capacity || 4;
    const steps = generateInsertAtIndexTrace(currentValues, capacity, val, index, get().dynamicArrayMode);
    set({
      dynamicArraySteps: steps,
      currentDynamicArrayStepIndex: 0,
      isPlaying: false,
    });
  },

  accessIndexDynamicArray: (index) => {
    const lastStep = get().dynamicArraySteps[get().dynamicArraySteps.length - 1];
    const currentValues = lastStep?.cells.filter((c) => c.val !== null).map((c) => c.val!) || [];
    const capacity = lastStep?.capacity || 4;
    const steps = generateAccessTrace(currentValues, capacity, index);
    set({
      dynamicArraySteps: steps,
      currentDynamicArrayStepIndex: 0,
      isPlaying: false,
    });
  },

  resetDynamicArrayPreset: (values = [10, 20, 30], capacity = 4) => {
    const cells = createArrayCells(values, capacity);
    set({
      dynamicArraySteps: [
        {
          stepIndex: 0,
          mode: get().dynamicArrayMode,
          operation: "init",
          cells,
          size: values.length,
          capacity,
          description: `Loaded array with ${values.length} items (Capacity: ${capacity}).`,
          reasoning: "Contiguous memory allocated. Ready for array operations.",
          codeLine: 1,
          inlineVariables: { size: values.length, capacity },
        },
      ],
      currentDynamicArrayStepIndex: 0,
      isPlaying: false,
    });
  },

  seekDynamicArrayStep: (index) => {
    const total = get().dynamicArraySteps.length;
    set({ currentDynamicArrayStepIndex: Math.max(0, Math.min(index, total - 1)), isPlaying: false });
  },

  stepForwardDynamicArray: () => {
    const { currentDynamicArrayStepIndex, dynamicArraySteps } = get();
    if (currentDynamicArrayStepIndex < dynamicArraySteps.length - 1) {
      set({ currentDynamicArrayStepIndex: currentDynamicArrayStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackwardDynamicArray: () => {
    set((s) => ({ currentDynamicArrayStepIndex: Math.max(0, s.currentDynamicArrayStepIndex - 1) }));
  },

  // Binary Heap State & Actions
  heapSteps: (() => {
    const arr = [10, 20, 25, 40, 50, 30, 35];
    const nodes = generateHeapNodes(arr);
    return [
      {
        stepIndex: 0,
        heapType: "min" as HeapType,
        operation: "init" as const,
        array: arr,
        nodes,
        description: "Min-Heap initialized with 7 elements (Balanced complete binary tree).",
        reasoning: "Every parent node is ≤ its children: A[i] ≤ A[2i+1] and A[i] ≤ A[2i+2].",
        codeLine: 1,
        inlineVariables: { size: arr.length, root: arr[0], heapType: "min" },
      },
    ];
  })(),
  currentHeapStepIndex: 0,
  heapType: "min",

  setHeapType: (type) => {
    const lastStep = get().heapSteps[get().heapSteps.length - 1];
    const currentArr = lastStep?.array || [10, 20, 25, 40, 50, 30, 35];
    const steps = generateHeapifyTrace(currentArr, type);
    set({
      heapType: type,
      heapSteps: steps,
      currentHeapStepIndex: 0,
      isPlaying: false,
    });
  },

  insertIntoHeap: (val) => {
    const lastStep = get().heapSteps[get().heapSteps.length - 1];
    const currentArr = lastStep?.array || [];
    const steps = generateInsertTrace(currentArr, val, get().heapType);
    set({
      heapSteps: steps,
      currentHeapStepIndex: 0,
      isPlaying: false,
    });
  },

  extractFromHeap: () => {
    const lastStep = get().heapSteps[get().heapSteps.length - 1];
    const currentArr = lastStep?.array || [];
    const steps = generateExtractTrace(currentArr, get().heapType);
    set({
      heapSteps: steps,
      currentHeapStepIndex: 0,
      isPlaying: false,
    });
  },

  buildHeap: (arr) => {
    const lastStep = get().heapSteps[get().heapSteps.length - 1];
    const targetArr = arr || lastStep?.array || [65, 12, 89, 23, 45, 78, 34, 9];
    const steps = generateHeapifyTrace(targetArr, get().heapType);
    set({
      heapSteps: steps,
      currentHeapStepIndex: 0,
      isPlaying: false,
    });
  },

  peekHeap: () => {
    const lastStep = get().heapSteps[get().heapSteps.length - 1];
    const currentArr = lastStep?.array || [];
    const steps = generatePeekTrace(currentArr, get().heapType);
    set({
      heapSteps: steps,
      currentHeapStepIndex: 0,
      isPlaying: false,
    });
  },

  resetHeapPreset: (values = [10, 20, 25, 40, 50, 30, 35]) => {
    const nodes = generateHeapNodes(values);
    set({
      heapSteps: [
        {
          stepIndex: 0,
          heapType: get().heapType,
          operation: "init",
          array: values,
          nodes,
          description: `Loaded Heap preset with ${values.length} elements.`,
          reasoning: "Array memory initialized and mapped to complete binary tree.",
          codeLine: 1,
          inlineVariables: { size: values.length, root: values[0] },
        },
      ],
      currentHeapStepIndex: 0,
      isPlaying: false,
    });
  },

  seekHeapStep: (index) => {
    const total = get().heapSteps.length;
    set({ currentHeapStepIndex: Math.max(0, Math.min(index, total - 1)), isPlaying: false });
  },

  stepForwardHeap: () => {
    const { currentHeapStepIndex, heapSteps } = get();
    if (currentHeapStepIndex < heapSteps.length - 1) {
      set({ currentHeapStepIndex: currentHeapStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackwardHeap: () => {
    set((s) => ({ currentHeapStepIndex: Math.max(0, s.currentHeapStepIndex - 1) }));
  },

  // Hash Table State & Actions
  hashTableSteps: (() => {
    const capacity = 7;
    const initialKeys = [10, 22, 31, 4, 17];
    const buckets = createInitialBuckets(capacity);
    initialKeys.forEach((k) => {
      const h = ((k % capacity) + capacity) % capacity;
      buckets[h].nodes.push({ id: `init-${k}`, key: k, state: "default" });
      buckets[h].isOccupied = true;
    });
    const keyCount = initialKeys.length;
    const loadFactor = parseFloat((keyCount / capacity).toFixed(2));
    return [
      {
        stepIndex: 0,
        strategy: "chaining" as HashCollisionStrategy,
        operation: "init" as const,
        buckets,
        capacity,
        keyCount,
        loadFactor,
        description: `Hash Table initialized with ${capacity} buckets (Separate Chaining).`,
        reasoning: "Loaded 5 initial keys. Bucket index determined by h(k) = k % 7.",
        codeLine: 1,
        inlineVariables: { capacity, keyCount, loadFactor },
      },
    ];
  })(),
  currentHashTableStepIndex: 0,
  hashStrategy: "chaining",

  setHashStrategy: (strategy) => {
    const lastStep = get().hashTableSteps[get().hashTableSteps.length - 1];
    const capacity = lastStep?.capacity || 7;
    const keys: number[] = [];
    (lastStep?.buckets || []).forEach((b) => {
      b.nodes.forEach((n) => {
        if (!b.isTombstone) keys.push(n.key);
      });
    });

    const newBuckets = createInitialBuckets(capacity);
    keys.forEach((k) => {
      const h = ((k % capacity) + capacity) % capacity;
      if (strategy === "chaining") {
        newBuckets[h].nodes.push({ id: `sw-${k}`, key: k, state: "default" });
        newBuckets[h].isOccupied = true;
      } else {
        let p = h;
        while (newBuckets[p].isOccupied) {
          p = (p + 1) % capacity;
        }
        newBuckets[p].isOccupied = true;
        newBuckets[p].nodes = [{ id: `sw-${k}`, key: k, state: "default" }];
      }
    });

    const keyCount = keys.length;
    const loadFactor = parseFloat((keyCount / capacity).toFixed(2));

    set({
      hashStrategy: strategy,
      hashTableSteps: [
        {
          stepIndex: 0,
          strategy,
          operation: "init",
          buckets: newBuckets,
          capacity,
          keyCount,
          loadFactor,
          description: `Switched collision strategy to ${strategy === "chaining" ? "Separate Chaining" : "Linear Probing"}.`,
          reasoning: strategy === "chaining"
            ? "Collided keys will append to linked list chains."
            : "Collided keys will probe subsequent slots until an empty slot is found.",
          codeLine: 1,
          inlineVariables: { strategy, capacity, keyCount, loadFactor },
        },
      ],
      currentHashTableStepIndex: 0,
      isPlaying: false,
    });
  },

  insertIntoHashTable: (key) => {
    const lastStep = get().hashTableSteps[get().hashTableSteps.length - 1];
    const capacity = lastStep?.capacity || 7;
    const buckets = lastStep?.buckets || createInitialBuckets(capacity);
    const steps = generateHashInsertTrace(buckets, capacity, key, get().hashStrategy);
    set({
      hashTableSteps: steps,
      currentHashTableStepIndex: 0,
      isPlaying: false,
    });
  },

  searchInHashTable: (key) => {
    const lastStep = get().hashTableSteps[get().hashTableSteps.length - 1];
    const capacity = lastStep?.capacity || 7;
    const buckets = lastStep?.buckets || createInitialBuckets(capacity);
    const steps = generateHashSearchTrace(buckets, capacity, key, get().hashStrategy);
    set({
      hashTableSteps: steps,
      currentHashTableStepIndex: 0,
      isPlaying: false,
    });
  },

  deleteFromHashTable: (key) => {
    const lastStep = get().hashTableSteps[get().hashTableSteps.length - 1];
    const capacity = lastStep?.capacity || 7;
    const buckets = lastStep?.buckets || createInitialBuckets(capacity);
    const steps = generateHashDeleteTrace(buckets, capacity, key, get().hashStrategy);
    set({
      hashTableSteps: steps,
      currentHashTableStepIndex: 0,
      isPlaying: false,
    });
  },

  rehashTable: () => {
    const lastStep = get().hashTableSteps[get().hashTableSteps.length - 1];
    const capacity = lastStep?.capacity || 7;
    const buckets = lastStep?.buckets || createInitialBuckets(capacity);
    const steps = generateRehashTrace(buckets, capacity, get().hashStrategy);
    set({
      hashTableSteps: steps,
      currentHashTableStepIndex: 0,
      isPlaying: false,
    });
  },

  resetHashTablePreset: (keys = [10, 22, 31, 4, 17]) => {
    const capacity = 7;
    const buckets = createInitialBuckets(capacity);
    const strat = get().hashStrategy;
    keys.forEach((k) => {
      const h = ((k % capacity) + capacity) % capacity;
      if (strat === "chaining") {
        buckets[h].nodes.push({ id: `preset-${k}`, key: k, state: "default" });
        buckets[h].isOccupied = true;
      } else {
        let p = h;
        while (buckets[p].isOccupied) {
          p = (p + 1) % capacity;
        }
        buckets[p].isOccupied = true;
        buckets[p].nodes = [{ id: `preset-${k}`, key: k, state: "default" }];
      }
    });

    const keyCount = keys.length;
    const loadFactor = parseFloat((keyCount / capacity).toFixed(2));

    set({
      hashTableSteps: [
        {
          stepIndex: 0,
          strategy: strat,
          operation: "init",
          buckets,
          capacity,
          keyCount,
          loadFactor,
          description: `Loaded preset with ${keys.length} keys (Capacity: ${capacity}).`,
          reasoning: "Table populated with preset keys. Ready for insertions, searches, and collisions.",
          codeLine: 1,
          inlineVariables: { capacity, keyCount, loadFactor },
        },
      ],
      currentHashTableStepIndex: 0,
      isPlaying: false,
    });
  },

  seekHashTableStep: (index) => {
    const total = get().hashTableSteps.length;
    set({ currentHashTableStepIndex: Math.max(0, Math.min(index, total - 1)), isPlaying: false });
  },

  stepForwardHashTable: () => {
    const { currentHashTableStepIndex, hashTableSteps } = get();
    if (currentHashTableStepIndex < hashTableSteps.length - 1) {
      set({ currentHashTableStepIndex: currentHashTableStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackwardHashTable: () => {
    set((s) => ({ currentHashTableStepIndex: Math.max(0, s.currentHashTableStepIndex - 1) }));
  },

  // Trie (Prefix Tree) State & Actions
  trieSteps: (() => {
    const initialWords = ["cat", "car", "cart", "dog", "dot"];
    const { nodes, wordList } = buildTrieFromWords(initialWords);
    return [
      {
        stepIndex: 0,
        operation: "init" as const,
        nodes,
        wordList,
        description: `Trie initialized with ${wordList.length} words: [${wordList.join(", ")}].`,
        reasoning: "Trie compactly merges shared prefixes. Root holds starting branches.",
        codeLine: 1,
        inlineVariables: { wordCount: wordList.length, totalNodes: Object.keys(nodes).length },
      },
    ];
  })(),
  currentTrieStepIndex: 0,

  insertIntoTrie: (word) => {
    const lastStep = get().trieSteps[get().trieSteps.length - 1];
    const currentNodes = lastStep?.nodes || buildTrieFromWords([]).nodes;
    const words = lastStep?.wordList || [];
    const steps = generateTrieInsertTrace(currentNodes, words, word);
    set({
      trieSteps: steps,
      currentTrieStepIndex: 0,
      isPlaying: false,
    });
  },

  searchInTrie: (word) => {
    const lastStep = get().trieSteps[get().trieSteps.length - 1];
    const currentNodes = lastStep?.nodes || buildTrieFromWords([]).nodes;
    const words = lastStep?.wordList || [];
    const steps = generateTrieSearchTrace(currentNodes, words, word);
    set({
      trieSteps: steps,
      currentTrieStepIndex: 0,
      isPlaying: false,
    });
  },

  startsWithTrie: (prefix) => {
    const lastStep = get().trieSteps[get().trieSteps.length - 1];
    const currentNodes = lastStep?.nodes || buildTrieFromWords([]).nodes;
    const words = lastStep?.wordList || [];
    const steps = generateTrieStartsWithTrace(currentNodes, words, prefix);
    set({
      trieSteps: steps,
      currentTrieStepIndex: 0,
      isPlaying: false,
    });
  },

  autocompleteTrie: (prefix) => {
    const lastStep = get().trieSteps[get().trieSteps.length - 1];
    const currentNodes = lastStep?.nodes || buildTrieFromWords([]).nodes;
    const words = lastStep?.wordList || [];
    const steps = generateTrieAutocompleteTrace(currentNodes, words, prefix);
    set({
      trieSteps: steps,
      currentTrieStepIndex: 0,
      isPlaying: false,
    });
  },

  deleteFromTrie: (word) => {
    const lastStep = get().trieSteps[get().trieSteps.length - 1];
    const currentNodes = lastStep?.nodes || buildTrieFromWords([]).nodes;
    const words = lastStep?.wordList || [];
    const steps = generateTrieDeleteTrace(currentNodes, words, word);
    set({
      trieSteps: steps,
      currentTrieStepIndex: 0,
      isPlaying: false,
    });
  },

  resetTriePreset: (words = ["cat", "car", "cart", "dog", "dot"]) => {
    const { nodes, wordList } = buildTrieFromWords(words);
    set({
      trieSteps: [
        {
          stepIndex: 0,
          operation: "init",
          nodes,
          wordList,
          description: `Loaded Trie preset with ${wordList.length} words: [${wordList.join(", ")}].`,
          reasoning: "Trie rebuilt with preset vocabulary. Common prefixes shared across branches.",
          codeLine: 1,
          inlineVariables: { wordCount: wordList.length, totalNodes: Object.keys(nodes).length },
        },
      ],
      currentTrieStepIndex: 0,
      isPlaying: false,
    });
  },

  seekTrieStep: (index) => {
    const total = get().trieSteps.length;
    set({ currentTrieStepIndex: Math.max(0, Math.min(index, total - 1)), isPlaying: false });
  },

  stepForwardTrie: () => {
    const { currentTrieStepIndex, trieSteps } = get();
    if (currentTrieStepIndex < trieSteps.length - 1) {
      set({ currentTrieStepIndex: currentTrieStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackwardTrie: () => {
    set((s) => ({ currentTrieStepIndex: Math.max(0, s.currentTrieStepIndex - 1) }));
  },

  // AVL & Balanced Tree State & Actions
  avlSteps: (() => {
    const { initialSteps } = buildAvlTreeFromValues(AVL_PRESETS.balanced.values);
    return initialSteps;
  })(),
  currentAvlStepIndex: 0,
  _avlRoot: (() => {
    const { root } = buildAvlTreeFromValues(AVL_PRESETS.balanced.values);
    return root;
  })() as AvlRawNode | undefined,

  insertIntoAvlTree: (val) => {
    const currentRoot = (get() as any)._avlRoot;
    const { steps, newRoot } = generateAvlInsertTrace(currentRoot, val);
    set({
      _avlRoot: newRoot,
      avlSteps: steps,
      currentAvlStepIndex: 0,
      isPlaying: false,
    } as any);
  },

  searchInAvlTree: (val) => {
    const currentRoot = (get() as any)._avlRoot;
    const steps = generateAvlSearchTrace(currentRoot, val);
    set({
      avlSteps: steps,
      currentAvlStepIndex: 0,
      isPlaying: false,
    });
  },

  resetAvlTreePreset: (presetKey = "balanced") => {
    const preset = AVL_PRESETS[presetKey] || AVL_PRESETS.balanced;
    const { root, initialSteps } = buildAvlTreeFromValues(preset.values);
    set({
      _avlRoot: root,
      avlSteps: initialSteps,
      currentAvlStepIndex: 0,
      isPlaying: false,
    } as any);
  },

  seekAvlStep: (index) => {
    const total = get().avlSteps.length;
    set({ currentAvlStepIndex: Math.max(0, Math.min(index, total - 1)), isPlaying: false });
  },

  stepForwardAvl: () => {
    const { currentAvlStepIndex, avlSteps } = get();
    if (currentAvlStepIndex < avlSteps.length - 1) {
      set({ currentAvlStepIndex: currentAvlStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackwardAvl: () => {
    set((s) => ({ currentAvlStepIndex: Math.max(0, s.currentAvlStepIndex - 1) }));
  },

  // Disjoint Set Union (DSU) State & Actions
  dsuSteps: (() => {
    const initialElements = createInitialDsu(8);
    return [
      {
        stepIndex: 0,
        operation: "init" as const,
        elements: initialElements,
        description: "Initialized Disjoint Set Union with 8 singleton sets (A through H).",
        reasoning: "Each element i starts as its own representative root (parent[i] == i, rank = 0, size = 1).",
        codeLine: 1,
        inlineVariables: { totalSets: 8 },
      },
    ];
  })(),
  currentDsuStepIndex: 0,
  _dsuElements: createInitialDsu(8),

  findInDsu: (id) => {
    const currentElements = (get() as any)._dsuElements || createInitialDsu(8);
    const { steps, finalElements } = generateFindTrace(currentElements, id);
    set({
      _dsuElements: finalElements,
      dsuSteps: steps,
      currentDsuStepIndex: 0,
      isPlaying: false,
    } as any);
  },

  unionInDsu: (x, y) => {
    const currentElements = (get() as any)._dsuElements || createInitialDsu(8);
    const { steps, finalElements } = generateUnionTrace(currentElements, x, y);
    set({
      _dsuElements: finalElements,
      dsuSteps: steps,
      currentDsuStepIndex: 0,
      isPlaying: false,
    } as any);
  },

  checkConnectedDsu: (x, y) => {
    const currentElements = (get() as any)._dsuElements || createInitialDsu(8);
    const steps = generateConnectedTrace(currentElements, x, y);
    set({
      dsuSteps: steps,
      currentDsuStepIndex: 0,
      isPlaying: false,
    });
  },

  resetDsuPreset: (presetKey = "reset") => {
    const preset = DSU_PRESETS[presetKey] || DSU_PRESETS.reset;
    const elements = preset.apply();
    const initialStep: DsuTraceStep = {
      stepIndex: 0,
      operation: "init",
      elements,
      description: `Loaded DSU preset: ${preset.name}.`,
      reasoning: preset.desc,
      codeLine: 1,
      inlineVariables: { preset: preset.name, totalElements: elements.length },
    };
    set({
      _dsuElements: elements,
      dsuSteps: [initialStep],
      currentDsuStepIndex: 0,
      isPlaying: false,
    } as any);
  },

  seekDsuStep: (index) => {
    const total = get().dsuSteps.length;
    set({ currentDsuStepIndex: Math.max(0, Math.min(index, total - 1)), isPlaying: false });
  },

  stepForwardDsu: () => {
    const { currentDsuStepIndex, dsuSteps } = get();
    if (currentDsuStepIndex < dsuSteps.length - 1) {
      set({ currentDsuStepIndex: currentDsuStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackwardDsu: () => {
    set((s) => ({ currentDsuStepIndex: Math.max(0, s.currentDsuStepIndex - 1) }));
  },

  // Backend C++ Status
  isBackendOnline: false,
  useBackend: false,
  checkBackendHealth: async () => {
    try {
      const res = await fetch("http://localhost:18080/health", { mode: "cors" });
      set({ isBackendOnline: res.ok });
    } catch {
      set({ isBackendOnline: false, useBackend: false });
    }
  },
  toggleUseBackend: () => {
    const { isBackendOnline, useBackend } = get();
    if (isBackendOnline) {
      set({ useBackend: !useBackend });
    }
  },
}));
