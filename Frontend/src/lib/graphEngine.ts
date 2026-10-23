import { GraphNode3D, GraphEdge3D, GraphTraceStep, GraphAlgorithmType } from "@/types/visualizer";

// Initial Pre-computed 3D Coordinates for Graph Presets
// Polyhedral / circular 3D arrangement with depth (z-variation) for rich 3D OrbitControls view
export interface GraphModel {
  nodes: GraphNode3D[];
  edges: GraphEdge3D[];
}

export const GRAPH_PRESETS: Record<string, { name: string; description: string; model: () => GraphModel }> = {
  classic: {
    name: "Classic 6-Node Network",
    description: "Weighted network ideal for shortest-path Dijkstra vs BFS/DFS traversals.",
    model: () => {
      const nodes: GraphNode3D[] = [
        { id: "A", label: "A", x: -3.2, y: 0.2, z: 0.0, state: "unvisited", dist: Infinity },
        { id: "B", label: "B", x: -1.2, y: 1.8, z: 0.8, state: "unvisited", dist: Infinity },
        { id: "C", label: "C", x: -1.2, y: -1.5, z: -0.6, state: "unvisited", dist: Infinity },
        { id: "D", label: "D", x: 1.4, y: 1.6, z: -0.5, state: "unvisited", dist: Infinity },
        { id: "E", label: "E", x: 1.3, y: -1.6, z: 0.7, state: "unvisited", dist: Infinity },
        { id: "F", label: "F", x: 3.4, y: 0.1, z: 0.0, state: "unvisited", dist: Infinity },
      ];

      const rawEdges: Array<{ from: string; to: string; weight: number }> = [
        { from: "A", to: "B", weight: 4 },
        { from: "A", to: "C", weight: 2 },
        { from: "B", to: "C", weight: 1 },
        { from: "B", to: "D", weight: 5 },
        { from: "C", to: "D", weight: 8 },
        { from: "C", to: "E", weight: 10 },
        { from: "D", to: "E", weight: 2 },
        { from: "D", to: "F", weight: 6 },
        { from: "E", to: "F", weight: 3 },
      ];

      const nodeMap = new Map(nodes.map((n) => [n.id, n]));
      const edges: GraphEdge3D[] = rawEdges.map((e) => {
        const u = nodeMap.get(e.from)!;
        const v = nodeMap.get(e.to)!;
        return {
          id: `${e.from}-${e.to}`,
          from: e.from,
          to: e.to,
          fromPos: [u.x, u.y, u.z],
          toPos: [v.x, v.y, v.z],
          weight: e.weight,
          state: "default",
        };
      });

      return { nodes, edges };
    },
  },

  cyclic: {
    name: "3D Cyclic Ring Network",
    description: "Symmetric ring with cross-chords demonstrating cycle exploration and layer expansions.",
    model: () => {
      const nodeLabels = ["A", "B", "C", "D", "E", "F", "G"];
      const radius = 2.8;
      const nodes: GraphNode3D[] = nodeLabels.map((lbl, idx) => {
        const theta = (idx / nodeLabels.length) * 2 * Math.PI - Math.PI / 2;
        const z = Math.sin(idx * 1.5) * 0.9;
        return {
          id: lbl,
          label: lbl,
          x: Math.cos(theta) * radius,
          y: Math.sin(theta) * radius,
          z,
          state: "unvisited",
          dist: Infinity,
        };
      });

      const rawEdges: Array<{ from: string; to: string; weight: number }> = [
        { from: "A", to: "B", weight: 3 },
        { from: "B", to: "C", weight: 2 },
        { from: "C", to: "D", weight: 4 },
        { from: "D", to: "E", weight: 1 },
        { from: "E", to: "F", weight: 5 },
        { from: "F", to: "G", weight: 2 },
        { from: "G", to: "A", weight: 6 },
        // Cross chords
        { from: "B", to: "F", weight: 4 },
        { from: "C", to: "E", weight: 3 },
      ];

      const nodeMap = new Map(nodes.map((n) => [n.id, n]));
      const edges: GraphEdge3D[] = rawEdges.map((e) => {
        const u = nodeMap.get(e.from)!;
        const v = nodeMap.get(e.to)!;
        return {
          id: `${e.from}-${e.to}`,
          from: e.from,
          to: e.to,
          fromPos: [u.x, u.y, u.z],
          toPos: [v.x, v.y, v.z],
          weight: e.weight,
          state: "default",
        };
      });

      return { nodes, edges };
    },
  },

  denseDag: {
    name: "Directed Flow Graph (DAG)",
    description: "Directed acyclic network with distinct stages from source to sink.",
    model: () => {
      const nodes: GraphNode3D[] = [
        { id: "S", label: "S", x: -3.0, y: 0.0, z: 0.0, state: "unvisited", dist: Infinity },
        { id: "A", label: "A", x: -1.0, y: 1.6, z: 0.7, state: "unvisited", dist: Infinity },
        { id: "B", label: "B", x: -1.0, y: -1.6, z: -0.7, state: "unvisited", dist: Infinity },
        { id: "C", label: "C", x: 1.0, y: 1.6, z: -0.7, state: "unvisited", dist: Infinity },
        { id: "D", label: "D", x: 1.0, y: -1.6, z: 0.7, state: "unvisited", dist: Infinity },
        { id: "T", label: "T", x: 3.0, y: 0.0, z: 0.0, state: "unvisited", dist: Infinity },
      ];

      const rawEdges: Array<{ from: string; to: string; weight: number }> = [
        { from: "S", to: "A", weight: 5 },
        { from: "S", to: "B", weight: 3 },
        { from: "A", to: "C", weight: 6 },
        { from: "A", to: "D", weight: 2 },
        { from: "B", to: "A", weight: 1 },
        { from: "B", to: "D", weight: 4 },
        { from: "C", to: "T", weight: 2 },
        { from: "D", to: "T", weight: 7 },
      ];

      const nodeMap = new Map(nodes.map((n) => [n.id, n]));
      const edges: GraphEdge3D[] = rawEdges.map((e) => {
        const u = nodeMap.get(e.from)!;
        const v = nodeMap.get(e.to)!;
        return {
          id: `${e.from}-${e.to}`,
          from: e.from,
          to: e.to,
          fromPos: [u.x, u.y, u.z],
          toPos: [v.x, v.y, v.z],
          weight: e.weight,
          state: "default",
          directed: true,
        };
      });

      return { nodes, edges };
    },
  },
};

// Helper: Build adjacency map with edge references
export function buildAdjacencyList(nodes: GraphNode3D[], edges: GraphEdge3D[]) {
  const adj = new Map<string, Array<{ neighborId: string; weight: number; edgeId: string }>>();
  for (const n of nodes) {
    adj.set(n.id, []);
  }

  for (const e of edges) {
    adj.get(e.from)?.push({ neighborId: e.to, weight: e.weight, edgeId: e.id });
    if (!e.directed) {
      adj.get(e.to)?.push({ neighborId: e.from, weight: e.weight, edgeId: e.id });
    }
  }

  return adj;
}

// Deep clone snapshot helper
function cloneGraph(nodes: GraphNode3D[], edges: GraphEdge3D[]) {
  return {
    nodes: nodes.map((n) => ({ ...n })),
    edges: edges.map((e) => ({ ...e })),
  };
}

// ==========================================
// 1. BREADTH-FIRST SEARCH (BFS)
// ==========================================
export function generateBfsTrace(
  initialNodes: GraphNode3D[],
  initialEdges: GraphEdge3D[],
  startId: string = "A"
): GraphTraceStep[] {
  const steps: GraphTraceStep[] = [];
  const { nodes, edges } = cloneGraph(initialNodes, initialEdges);
  const adj = buildAdjacencyList(nodes, edges);

  // Initialize start node
  const startNode = nodes.find((n) => n.id === startId) || nodes[0];
  startNode.dist = 0;
  startNode.state = "frontier";

  const queue: string[] = [startNode.id];
  const visitedOrder: string[] = [];
  const visitedSet = new Set<string>();

  steps.push({
    stepIndex: 0,
    algorithm: "bfs",
    nodes: nodes.map((n) => ({ ...n })),
    edges: edges.map((e) => ({ ...e })),
    activeNodeId: startNode.id,
    frontierItems: [...queue],
    visitedOrder: [...visitedOrder],
    description: `BFS initialized at source vertex ${startNode.id}.`,
    reasoning: `Queue initialized with source vertex [${startNode.id}]. Distance set to 0.`,
    codeLine: 2,
    inlineVariables: { start: startNode.id, queueSize: 1 },
  });

  while (queue.length > 0) {
    const uId = queue.shift()!;
    visitedSet.add(uId);
    visitedOrder.push(uId);

    const uNode = nodes.find((n) => n.id === uId)!;
    uNode.state = "visiting";

    steps.push({
      stepIndex: steps.length,
      algorithm: "bfs",
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      activeNodeId: uId,
      frontierItems: [...queue],
      visitedOrder: [...visitedOrder],
      description: `Dequeued vertex ${uId} (Hop distance: ${uNode.dist}).`,
      reasoning: `FIFO queue extracts vertex ${uId} at current frontier. Exploring unvisited incident edges...`,
      codeLine: 6,
      inlineVariables: { u: uId, dist: uNode.dist, queueSize: queue.length },
    });

    const neighbors = adj.get(uId) || [];
    for (const { neighborId, edgeId } of neighbors) {
      const vNode = nodes.find((n) => n.id === neighborId)!;
      const edge = edges.find((e) => e.id === edgeId)!;

      // Highlight examining edge
      const prevEdgeState = edge.state;
      edge.state = "examining";

      if (!visitedSet.has(neighborId) && !queue.includes(neighborId)) {
        vNode.dist = uNode.dist + 1;
        vNode.parent = uId;
        vNode.state = "frontier";
        queue.push(neighborId);
        edge.state = "relaxed";

        steps.push({
          stepIndex: steps.length,
          algorithm: "bfs",
          nodes: nodes.map((n) => ({ ...n })),
          edges: edges.map((e) => ({ ...e })),
          activeNodeId: neighborId,
          activeEdgeId: edgeId,
          frontierItems: [...queue],
          visitedOrder: [...visitedOrder],
          description: `Discovered neighbor ${neighborId} via edge ${edgeId}.`,
          reasoning: `Neighbor ${neighborId} is unvisited → set hop distance = ${vNode.dist} and push into FIFO queue.`,
          codeLine: 10,
          inlineVariables: { u: uId, v: neighborId, "dist[v]": vNode.dist },
        });
      } else {
        steps.push({
          stepIndex: steps.length,
          algorithm: "bfs",
          nodes: nodes.map((n) => ({ ...n })),
          edges: edges.map((e) => ({ ...e })),
          activeNodeId: uId,
          activeEdgeId: edgeId,
          frontierItems: [...queue],
          visitedOrder: [...visitedOrder],
          description: `Edge (${uId}, ${neighborId}) points to already discovered vertex.`,
          reasoning: `Neighbor ${neighborId} is already in frontier or visited → skip edge.`,
          codeLine: 8,
          inlineVariables: { u: uId, v: neighborId, status: "Already seen" },
        });
        edge.state = prevEdgeState;
      }
    }

    uNode.state = "visited";
  }

  steps.push({
    stepIndex: steps.length,
    algorithm: "bfs",
    nodes: nodes.map((n) => ({ ...n })),
    edges: edges.map((e) => ({ ...e })),
    frontierItems: [],
    visitedOrder: [...visitedOrder],
    description: `BFS complete! All reachable vertices discovered.`,
    reasoning: `Queue is empty. BFS guarantees shortest hop counts in unweighted graphs in O(V + E) time.`,
    codeLine: 14,
    inlineVariables: { totalVisited: visitedOrder.length },
  });

  return steps;
}

// ==========================================
// 2. DEPTH-FIRST SEARCH (DFS)
// ==========================================
export function generateDfsTrace(
  initialNodes: GraphNode3D[],
  initialEdges: GraphEdge3D[],
  startId: string = "A"
): GraphTraceStep[] {
  const steps: GraphTraceStep[] = [];
  const { nodes, edges } = cloneGraph(initialNodes, initialEdges);
  const adj = buildAdjacencyList(nodes, edges);

  const startNode = nodes.find((n) => n.id === startId) || nodes[0];
  const callStack: string[] = [];
  const visitedSet = new Set<string>();
  const visitedOrder: string[] = [];

  function dfsVisit(uId: string) {
    visitedSet.add(uId);
    visitedOrder.push(uId);
    callStack.push(uId);

    const uNode = nodes.find((n) => n.id === uId)!;
    uNode.state = "visiting";

    steps.push({
      stepIndex: steps.length,
      algorithm: "dfs",
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      activeNodeId: uId,
      frontierItems: [...callStack],
      visitedOrder: [...visitedOrder],
      description: `Entering dfs(${uId}). Call stack depth: ${callStack.length}.`,
      reasoning: `Pushed ${uId} onto execution stack. Visiting deepest unvisited branch first.`,
      codeLine: 3,
      inlineVariables: { u: uId, stackDepth: callStack.length },
    });

    const neighbors = adj.get(uId) || [];
    for (const { neighborId, edgeId } of neighbors) {
      const edge = edges.find((e) => e.id === edgeId)!;
      const vNode = nodes.find((n) => n.id === neighborId)!;

      const prevEdgeState = edge.state;
      edge.state = "examining";

      if (!visitedSet.has(neighborId)) {
        edge.state = "relaxed";
        vNode.parent = uId;

        steps.push({
          stepIndex: steps.length,
          algorithm: "dfs",
          nodes: nodes.map((n) => ({ ...n })),
          edges: edges.map((e) => ({ ...e })),
          activeNodeId: neighborId,
          activeEdgeId: edgeId,
          frontierItems: [...callStack],
          visitedOrder: [...visitedOrder],
          description: `Discovered tree edge (${uId} → ${neighborId}). Recursing...`,
          reasoning: `${neighborId} is unvisited. Recursive dive continues deeper into ${neighborId}.`,
          codeLine: 7,
          inlineVariables: { u: uId, v: neighborId, edgeType: "Tree Edge" },
        });

        dfsVisit(neighborId);
      } else {
        steps.push({
          stepIndex: steps.length,
          algorithm: "dfs",
          nodes: nodes.map((n) => ({ ...n })),
          edges: edges.map((e) => ({ ...e })),
          activeNodeId: uId,
          activeEdgeId: edgeId,
          frontierItems: [...callStack],
          visitedOrder: [...visitedOrder],
          description: `Back/Cross edge (${uId} → ${neighborId}) already visited.`,
          reasoning: `Neighbor ${neighborId} is already in visited set → no recursion needed.`,
          codeLine: 6,
          inlineVariables: { u: uId, v: neighborId, status: "Already visited" },
        });
        edge.state = prevEdgeState;
      }
    }

    // Backtrack
    callStack.pop();
    uNode.state = "visited";

    steps.push({
      stepIndex: steps.length,
      algorithm: "dfs",
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      activeNodeId: uId,
      frontierItems: [...callStack],
      visitedOrder: [...visitedOrder],
      description: `Finished exploration of ${uId}. Backtracking...`,
      reasoning: `All incident branches from ${uId} explored. Popping ${uId} from stack.`,
      codeLine: 11,
      inlineVariables: { u: uId, stackDepth: callStack.length },
    });
  }

  // Initial step
  steps.push({
    stepIndex: 0,
    algorithm: "dfs",
    nodes: nodes.map((n) => ({ ...n })),
    edges: edges.map((e) => ({ ...e })),
    activeNodeId: startNode.id,
    frontierItems: [],
    visitedOrder: [],
    description: `DFS traversal initiated at vertex ${startNode.id}.`,
    reasoning: `Depth-First Search traverses as deep as possible along each branch before backtracking.`,
    codeLine: 1,
    inlineVariables: { start: startNode.id },
  });

  dfsVisit(startNode.id);

  steps.push({
    stepIndex: steps.length,
    algorithm: "dfs",
    nodes: nodes.map((n) => ({ ...n })),
    edges: edges.map((e) => ({ ...e })),
    frontierItems: [],
    visitedOrder: [...visitedOrder],
    description: `DFS traversal complete!`,
    reasoning: `Recursion stack is empty. Graph traversal completed in O(V + E) time.`,
    codeLine: 13,
    inlineVariables: { totalVisited: visitedOrder.length },
  });

  return steps;
}

// ==========================================
// 3. DIJKSTRA'S SHORTEST PATH ALGORITHM
// ==========================================
export function generateDijkstraTrace(
  initialNodes: GraphNode3D[],
  initialEdges: GraphEdge3D[],
  startId: string = "A",
  targetId: string = "F"
): GraphTraceStep[] {
  const steps: GraphTraceStep[] = [];
  const { nodes, edges } = cloneGraph(initialNodes, initialEdges);
  const adj = buildAdjacencyList(nodes, edges);

  const startNode = nodes.find((n) => n.id === startId) || nodes[0];
  startNode.dist = 0;

  // Min-Priority Queue simulated by array of { id, dist }
  const pq: Array<{ id: string; dist: number }> = [{ id: startNode.id, dist: 0 }];
  const settledSet = new Set<string>();
  const visitedOrder: string[] = [];

  steps.push({
    stepIndex: 0,
    algorithm: "dijkstra",
    nodes: nodes.map((n) => ({ ...n })),
    edges: edges.map((e) => ({ ...e })),
    activeNodeId: startNode.id,
    frontierItems: pq.map((p) => `${p.id}(d:${p.dist})`),
    visitedOrder: [...visitedOrder],
    description: `Dijkstra initialized with source vertex ${startNode.id}.`,
    reasoning: `Source distance d[${startNode.id}] = 0. All other tentative distances set to ∞.`,
    codeLine: 3,
    inlineVariables: { source: startNode.id, "dist[start]": 0 },
  });

  while (pq.length > 0) {
    // Extract min distance
    pq.sort((a, b) => a.dist - b.dist);
    const { id: uId, dist: uDist } = pq.shift()!;

    if (settledSet.has(uId)) continue;
    settledSet.add(uId);
    visitedOrder.push(uId);

    const uNode = nodes.find((n) => n.id === uId)!;
    uNode.state = "settled";

    steps.push({
      stepIndex: steps.length,
      algorithm: "dijkstra",
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      activeNodeId: uId,
      frontierItems: pq.map((p) => `${p.id}(d:${p.dist})`),
      visitedOrder: [...visitedOrder],
      description: `Extracted minimum tentative vertex ${uId} (d = ${uDist}).`,
      reasoning: `Greedy choice invariant: Distance to ${uId} (${uDist}) is now permanently optimal and settled.`,
      codeLine: 7,
      inlineVariables: { u: uId, "minDist": uDist, pqSize: pq.length },
    });

    // Check neighbors for edge relaxation
    const neighbors = adj.get(uId) || [];
    for (const { neighborId, weight, edgeId } of neighbors) {
      if (settledSet.has(neighborId)) continue;

      const vNode = nodes.find((n) => n.id === neighborId)!;
      const edge = edges.find((e) => e.id === edgeId)!;

      const oldDist = vNode.dist;
      const newDist = uDist + weight;

      edge.state = "examining";

      if (newDist < oldDist) {
        vNode.dist = newDist;
        vNode.parent = uId;
        vNode.state = "frontier";
        edge.state = "relaxed";
        pq.push({ id: neighborId, dist: newDist });

        steps.push({
          stepIndex: steps.length,
          algorithm: "dijkstra",
          nodes: nodes.map((n) => ({ ...n })),
          edges: edges.map((e) => ({ ...e })),
          activeNodeId: neighborId,
          activeEdgeId: edgeId,
          frontierItems: pq.map((p) => `${p.id}(d:${p.dist})`),
          visitedOrder: [...visitedOrder],
          description: `Relaxed edge (${uId} → ${neighborId}): dist ${oldDist === Infinity ? "∞" : oldDist} → ${newDist}.`,
          reasoning: `dist[${uId}] + weight (${uDist} + ${weight} = ${newDist}) < dist[${neighborId}] (${oldDist === Infinity ? "∞" : oldDist}) → Shorter path found! Updated distance & pushed to priority queue.`,
          codeLine: 11,
          inlineVariables: { u: uId, v: neighborId, weight, "newDist": newDist },
        });
      } else {
        steps.push({
          stepIndex: steps.length,
          algorithm: "dijkstra",
          nodes: nodes.map((n) => ({ ...n })),
          edges: edges.map((e) => ({ ...e })),
          activeNodeId: uId,
          activeEdgeId: edgeId,
          frontierItems: pq.map((p) => `${p.id}(d:${p.dist})`),
          visitedOrder: [...visitedOrder],
          description: `No relaxation for edge (${uId} → ${neighborId}): ${uDist} + ${weight} ≥ ${oldDist}.`,
          reasoning: `Path through ${uId} gives ${newDist}, which is not strictly better than existing tentative distance ${oldDist}.`,
          codeLine: 13,
          inlineVariables: { u: uId, v: neighborId, "candidateDist": newDist, "existingDist": oldDist },
        });
        edge.state = "default";
      }
    }
  }

  // Highlight shortest path to target if target specified
  const targetNode = nodes.find((n) => n.id === targetId);
  if (targetNode && targetNode.dist < Infinity) {
    let curr: string | undefined = targetId;
    const pathEdges = new Set<string>();
    const pathNodes = new Set<string>();

    while (curr) {
      pathNodes.add(curr);
      const node = nodes.find((n) => n.id === curr);
      if (node && node.parent) {
        const edge = edges.find(
          (e) =>
            (e.from === curr && e.to === node.parent) ||
            (e.from === node.parent && e.to === curr)
        );
        if (edge) pathEdges.add(edge.id);
        curr = node.parent;
      } else {
        curr = undefined;
      }
    }

    for (const n of nodes) {
      if (pathNodes.has(n.id)) n.state = "path";
    }
    for (const e of edges) {
      if (pathEdges.has(e.id)) e.state = "path";
    }

    steps.push({
      stepIndex: steps.length,
      algorithm: "dijkstra",
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      frontierItems: [],
      visitedOrder: [...visitedOrder],
      description: `Shortest path to ${targetId} reconstructed! Total distance: ${targetNode.dist}.`,
      reasoning: `Backtracking parent pointers from ${targetId} to ${startId} yields the provably optimal shortest path.`,
      codeLine: 17,
      inlineVariables: { target: targetId, shortestDistance: targetNode.dist },
    });
  }

  return steps;
}

