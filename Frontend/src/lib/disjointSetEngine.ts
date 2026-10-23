import { DsuElement, DsuTraceStep } from "@/types/visualizer";

export const DSU_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export function createInitialDsu(size = 8): DsuElement[] {
  const count = Math.min(size, DSU_LABELS.length);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    label: DSU_LABELS[i],
    parent: i,
    rank: 0,
    size: 1,
    root: i,
    state: "default",
  }));
}

export function findRootInternal(elements: DsuElement[], id: number): number {
  let curr = id;
  while (elements[curr].parent !== curr) {
    curr = elements[curr].parent;
  }
  return curr;
}

export function updateRoots(elements: DsuElement[]): void {
  for (let i = 0; i < elements.length; i++) {
    elements[i].root = findRootInternal(elements, i);
  }
}

// ==========================================
// 1. FIND WITH PATH COMPRESSION TRACE
// ==========================================
export function generateFindTrace(
  currentElements: DsuElement[],
  targetId: number
): { steps: DsuTraceStep[]; finalElements: DsuElement[] } {
  const steps: DsuTraceStep[] = [];
  const elements: DsuElement[] = currentElements.map((el) => ({ ...el, state: "default" }));
  const path: number[] = [];

  // Step 0: Init
  steps.push({
    stepIndex: 0,
    operation: "init",
    elements: elements.map((e) => ({ ...e })),
    activeIds: [targetId],
    description: `Initiate Find operation on element ${elements[targetId].label} (id: ${targetId}).`,
    reasoning: "Find traverses parent pointers up to the representative root of the disjoint set.",
    codeLine: 1,
    inlineVariables: { query: elements[targetId].label },
  });

  // Step 1: Upward traversal to root
  let curr = targetId;
  while (elements[curr].parent !== curr) {
    path.push(curr);
    elements[curr].state = "querying";

    steps.push({
      stepIndex: steps.length,
      operation: "find",
      elements: elements.map((e) => ({ ...e })),
      activeIds: [curr, elements[curr].parent],
      description: `Element ${elements[curr].label} points to parent ${elements[elements[curr].parent].label}. Traversal continues upward.`,
      reasoning: "Node is not its own parent; climbing parent pointer hierarchy.",
      codeLine: 4,
      inlineVariables: { current: elements[curr].label, parent: elements[elements[curr].parent].label },
    });

    curr = elements[curr].parent;
  }

  // Found root
  path.push(curr);
  const rootId = curr;
  elements[rootId].state = "root";

  steps.push({
    stepIndex: steps.length,
    operation: "find",
    elements: elements.map((e) => ({ ...e })),
    activeIds: [rootId],
    rootX: rootId,
    description: `Reached Set Representative Root: ${elements[rootId].label} (parent[${rootId}] = ${rootId}).`,
    reasoning: `Root element found. Its set rank is ${elements[rootId].rank} and contains ${elements[rootId].size} total members.`,
    codeLine: 6,
    inlineVariables: { root: elements[rootId].label, rank: elements[rootId].rank, size: elements[rootId].size },
  });

  // Step 2: PATH COMPRESSION
  if (path.length > 2) {
    // Intermediates need flattening
    for (const nodeIdx of path) {
      if (nodeIdx !== rootId && elements[nodeIdx].parent !== rootId) {
        elements[nodeIdx].parent = rootId;
        elements[nodeIdx].state = "compressing";

        steps.push({
          stepIndex: steps.length,
          operation: "find",
          elements: elements.map((e) => ({ ...e })),
          activeIds: [nodeIdx, rootId],
          description: `⚡ Path Compression: Repointed parent of ${elements[nodeIdx].label} directly to root ${elements[rootId].label}.`,
          reasoning: "Path compression flattens the tree so all subsequent find() queries on this branch run in amortized O(1) time.",
          codeLine: 9,
          inlineVariables: { flattenedNode: elements[nodeIdx].label, newDirectParent: elements[rootId].label },
        });
      }
    }
  }

  updateRoots(elements);
  elements.forEach((e) => (e.state = "default"));

  steps.push({
    stepIndex: steps.length,
    operation: "find",
    elements: elements.map((e) => ({ ...e })),
    activeIds: [rootId],
    rootX: rootId,
    description: `Find(${elements[targetId].label}) complete. Root is ${elements[rootId].label}.`,
    reasoning: "Tree depth optimized. Amortized Inverse Ackermann complexity O(α(n)) achieved.",
    codeLine: 11,
    inlineVariables: { resultRoot: elements[rootId].label },
  });

  return { steps, finalElements: elements };
}

// ==========================================
// 2. UNION BY RANK / SIZE TRACE
// ==========================================
export function generateUnionTrace(
  currentElements: DsuElement[],
  xId: number,
  yId: number
): { steps: DsuTraceStep[]; finalElements: DsuElement[] } {
  const steps: DsuTraceStep[] = [];
  const elements: DsuElement[] = currentElements.map((el) => ({ ...el, state: "default" }));

  steps.push({
    stepIndex: 0,
    operation: "init",
    elements: elements.map((e) => ({ ...e })),
    activeIds: [xId, yId],
    description: `Begin Union(${elements[xId].label}, ${elements[yId].label}).`,
    reasoning: "First find the representatives of both elements to determine if they are in different sets.",
    codeLine: 14,
    inlineVariables: { x: elements[xId].label, y: elements[yId].label },
  });

  const rootX = findRootInternal(elements, xId);
  const rootY = findRootInternal(elements, yId);

  elements[rootX].state = "root";
  elements[rootY].state = "root";

  steps.push({
    stepIndex: steps.length,
    operation: "union",
    elements: elements.map((e) => ({ ...e })),
    activeIds: [rootX, rootY],
    rootX,
    rootY,
    description: `Found roots: Root(${elements[xId].label}) = ${elements[rootX].label} (Rank: ${elements[rootX].rank}), Root(${elements[yId].label}) = ${elements[rootY].label} (Rank: ${elements[rootY].rank}).`,
    reasoning:
      rootX === rootY
        ? `Both elements already belong to the same set (Root ${elements[rootX].label}). Union is a no-op (Cycle detected!).`
        : "Roots are distinct; proceeding with Union by Rank.",
    codeLine: 18,
    inlineVariables: {
      rootX: elements[rootX].label,
      rankX: elements[rootX].rank,
      rootY: elements[rootY].label,
      rankY: elements[rootY].rank,
    },
  });

  if (rootX === rootY) {
    elements.forEach((e) => (e.state = "default"));
    return { steps, finalElements: elements };
  }

  // Union by Rank logic
  if (elements[rootX].rank < elements[rootY].rank) {
    // Attach rootX under rootY
    elements[rootX].parent = rootY;
    elements[rootY].size += elements[rootX].size;
    elements[rootX].state = "unioning";

    steps.push({
      stepIndex: steps.length,
      operation: "union",
      elements: elements.map((e) => ({ ...e })),
      activeIds: [rootX, rootY],
      description: `Attached ${elements[rootX].label} under ${elements[rootY].label} because Rank(${elements[rootX].label}) < Rank(${elements[rootY].label}).`,
      reasoning: "Attaching the shallower tree under the deeper tree prevents tree height from increasing.",
      codeLine: 22,
      inlineVariables: { newParent: elements[rootY].label, child: elements[rootX].label, updatedSize: elements[rootY].size },
    });
  } else if (elements[rootX].rank > elements[rootY].rank) {
    // Attach rootY under rootX
    elements[rootY].parent = rootX;
    elements[rootX].size += elements[rootY].size;
    elements[rootY].state = "unioning";

    steps.push({
      stepIndex: steps.length,
      operation: "union",
      elements: elements.map((e) => ({ ...e })),
      activeIds: [rootX, rootY],
      description: `Attached ${elements[rootY].label} under ${elements[rootX].label} because Rank(${elements[rootY].label}) < Rank(${elements[rootX].label}).`,
      reasoning: "Attaching the shallower tree under the deeper tree maintains minimal overall depth.",
      codeLine: 25,
      inlineVariables: { newParent: elements[rootX].label, child: elements[rootY].label, updatedSize: elements[rootX].size },
    });
  } else {
    // Ranks equal: attach rootX under rootY, increment rank of rootY
    elements[rootX].parent = rootY;
    elements[rootY].rank += 1;
    elements[rootY].size += elements[rootX].size;
    elements[rootX].state = "unioning";

    steps.push({
      stepIndex: steps.length,
      operation: "union",
      elements: elements.map((e) => ({ ...e })),
      activeIds: [rootX, rootY],
      description: `Equal Ranks (${elements[rootY].rank - 1}): Attached ${elements[rootX].label} under ${elements[rootY].label} and incremented Rank(${elements[rootY].label}) to ${elements[rootY].rank}.`,
      reasoning: "When ranks are identical, joining trees increases height by exactly 1.",
      codeLine: 29,
      inlineVariables: { newRoot: elements[rootY].label, newRank: elements[rootY].rank, combinedSize: elements[rootY].size },
    });
  }

  updateRoots(elements);
  elements.forEach((e) => (e.state = "default"));

  steps.push({
    stepIndex: steps.length,
    operation: "union",
    elements: elements.map((e) => ({ ...e })),
    activeIds: [xId, yId],
    description: `Sets successfully merged! ${elements[xId].label} and ${elements[yId].label} now share Root ${elements[elements[xId].root].label}.`,
    reasoning: "Connected component updated. Both vertices now query to the same representative.",
    codeLine: 32,
    inlineVariables: { unifiedRoot: elements[elements[xId].root].label },
  });

  return { steps, finalElements: elements };
}

// Connected query
export function generateConnectedTrace(
  currentElements: DsuElement[],
  xId: number,
  yId: number
): DsuTraceStep[] {
  const steps: DsuTraceStep[] = [];
  const rootX = findRootInternal(currentElements, xId);
  const rootY = findRootInternal(currentElements, yId);
  const isConn = rootX === rootY;

  const elements = currentElements.map((e, idx) => ({
    ...e,
    state: (idx === rootX || idx === rootY ? "root" : idx === xId || idx === yId ? "querying" : "default") as any,
  }));

  steps.push({
    stepIndex: 0,
    operation: "connected",
    elements,
    activeIds: [xId, yId],
    rootX,
    rootY,
    connected: isConn,
    description: `Checking Connected(${elements[xId].label}, ${elements[yId].label}): Root(${elements[xId].label}) = ${elements[rootX].label}, Root(${elements[yId].label}) = ${elements[rootY].label}.`,
    reasoning: isConn
      ? `Both vertices share the same Root ${elements[rootX].label} → Connected = TRUE.`
      : `Vertices belong to different sets (Root ${elements[rootX].label} vs Root ${elements[rootY].label}) → Connected = FALSE.`,
    codeLine: 35,
    inlineVariables: {
      x: elements[xId].label,
      rootX: elements[rootX].label,
      y: elements[yId].label,
      rootY: elements[rootY].label,
      connected: isConn ? "true" : "false",
    },
  });

  return steps;
}

// Presets
export const DSU_PRESETS: Record<string, { name: string; desc: string; apply: () => DsuElement[] }> = {
  kruskal: {
    name: "Kruskal MST Edges",
    desc: "Simulates Kruskal's algorithm joining vertices into components",
    apply: () => {
      let dsu = createInitialDsu(8);
      // Union A-B, B-C, D-E, F-G
      dsu = generateUnionTrace(dsu, 0, 1).finalElements;
      dsu = generateUnionTrace(dsu, 1, 2).finalElements;
      dsu = generateUnionTrace(dsu, 3, 4).finalElements;
      dsu = generateUnionTrace(dsu, 5, 6).finalElements;
      return dsu;
    },
  },
  deepChain: {
    name: "Deep Chain (Compression)",
    desc: "Linear chain ready to demonstrate instant flattening via Find(D)",
    apply: () => {
      const dsu = createInitialDsu(6);
      // Chain: E -> D -> C -> B -> A
      dsu[4].parent = 3; // E -> D
      dsu[3].parent = 2; // D -> C
      dsu[2].parent = 1; // C -> B
      dsu[1].parent = 0; // B -> A
      dsu[0].rank = 4;
      updateRoots(dsu);
      return dsu;
    },
  },
  twoClusters: {
    name: "Two Large Clusters",
    desc: "Cluster {A, B, C, D} and Cluster {E, F, G, H}",
    apply: () => {
      let dsu = createInitialDsu(8);
      dsu = generateUnionTrace(dsu, 0, 1).finalElements;
      dsu = generateUnionTrace(dsu, 2, 3).finalElements;
      dsu = generateUnionTrace(dsu, 0, 2).finalElements;

      dsu = generateUnionTrace(dsu, 4, 5).finalElements;
      dsu = generateUnionTrace(dsu, 6, 7).finalElements;
      dsu = generateUnionTrace(dsu, 4, 6).finalElements;
      return dsu;
    },
  },
  reset: {
    name: "8 Singletons (Initial)",
    desc: "All elements start as isolated, individual singleton sets",
    apply: () => createInitialDsu(8),
  },
};
