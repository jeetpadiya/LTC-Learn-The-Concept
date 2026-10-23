import {
  AvlNode3D,
  TreeEdge3D,
  AvlTraceStep,
  AvlRotationType,
  TreeNodeState,
} from "@/types/visualizer";

export interface AvlRawNode {
  id: string;
  value: number;
  height: number;
  left?: AvlRawNode;
  right?: AvlRawNode;
}

export function getHeight(node?: AvlRawNode): number {
  return node ? node.height : 0;
}

export function getBalanceFactor(node?: AvlRawNode): number {
  if (!node) return 0;
  return getHeight(node.left) - getHeight(node.right);
}

export function updateHeight(node: AvlRawNode): void {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

export function cloneAvlTree(root?: AvlRawNode): AvlRawNode | undefined {
  if (!root) return undefined;
  return {
    id: root.id,
    value: root.value,
    height: root.height,
    left: cloneAvlTree(root.left),
    right: cloneAvlTree(root.right),
  };
}

// 3D Tree Layout Generator for AVL Tree
export function layoutAvlTree(
  node: AvlRawNode | undefined,
  depth = 0,
  x = 0,
  xOffset = 3.8
): { nodes: AvlNode3D[]; edges: TreeEdge3D[] } {
  if (!node) return { nodes: [], edges: [] };

  const y = 2.8 - depth * 1.4;
  const z = depth * 0.15 * (x < 0 ? -1 : 1);

  const currentTreeNode: AvlNode3D = {
    id: node.id,
    value: node.value,
    height: node.height,
    balanceFactor: getBalanceFactor(node),
    x,
    y,
    z,
    leftId: node.left?.id,
    rightId: node.right?.id,
    state: "default",
  };

  const nextOffset = Math.max(0.7, xOffset * 0.52);

  const leftResult = layoutAvlTree(node.left, depth + 1, x - xOffset, nextOffset);
  const rightResult = layoutAvlTree(node.right, depth + 1, x + xOffset, nextOffset);

  const allNodes = [currentTreeNode, ...leftResult.nodes, ...rightResult.nodes];
  const allEdges: TreeEdge3D[] = [...leftResult.edges, ...rightResult.edges];

  if (node.left) {
    const leftChild = leftResult.nodes.find((n) => n.id === node.left?.id);
    if (leftChild) {
      allEdges.push({
        id: `${node.id}->${leftChild.id}`,
        from: node.id,
        to: leftChild.id,
        fromPos: [x, y, z],
        toPos: [leftChild.x, leftChild.y, leftChild.z],
        active: false,
      });
    }
  }

  if (node.right) {
    const rightChild = rightResult.nodes.find((n) => n.id === node.right?.id);
    if (rightChild) {
      allEdges.push({
        id: `${node.id}->${rightChild.id}`,
        from: node.id,
        to: rightChild.id,
        fromPos: [x, y, z],
        toPos: [rightChild.x, rightChild.y, rightChild.z],
        active: false,
      });
    }
  }

  return { nodes: allNodes, edges: allEdges };
}

// Rotations
export function rotateRight(y: AvlRawNode): AvlRawNode {
  const x = y.left!;
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  updateHeight(y);
  updateHeight(x);

  return x;
}

export function rotateLeft(x: AvlRawNode): AvlRawNode {
  const y = x.right!;
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  updateHeight(x);
  updateHeight(y);

  return y;
}

// ==========================================
// TRACE STEP GENERATOR: INSERTION WITH ROTATIONS
// ==========================================
export function generateAvlInsertTrace(
  root: AvlRawNode | undefined,
  val: number
): { steps: AvlTraceStep[]; newRoot: AvlRawNode } {
  const steps: AvlTraceStep[] = [];
  let workingRoot = cloneAvlTree(root);

  // Initial step
  const initLayout = layoutAvlTree(workingRoot);
  steps.push({
    stepIndex: 0,
    operation: "init",
    nodes: initLayout.nodes,
    edges: initLayout.edges,
    description: `Begin AVL Insertion of key ${val}.`,
    reasoning: "Traversing binary search tree to find leaf insertion slot.",
    codeLine: 1,
    inlineVariables: { insertVal: val },
  });

  function insertHelper(node: AvlRawNode | undefined): AvlRawNode {
    if (!node) {
      const newNode: AvlRawNode = {
        id: `node-${val}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        value: val,
        height: 1,
      };

      const tempTree = insertLeafIntoTree(cloneAvlTree(workingRoot), newNode, val);
      const layout = layoutAvlTree(tempTree);
      const inserted = layout.nodes.find((n) => n.id === newNode.id);
      if (inserted) inserted.state = "inserted";

      steps.push({
        stepIndex: steps.length,
        operation: "insert",
        nodes: layout.nodes,
        edges: layout.edges,
        activeNodeId: newNode.id,
        description: `Created new leaf node with value ${val}. Initial height = 1, Balance Factor = 0.`,
        reasoning: "New leaf inserted at open BST position. Next, re-trace ancestors to check balance factors.",
        codeLine: 7,
        inlineVariables: { insertedVal: val, height: 1, balanceFactor: 0 },
      });

      return newNode;
    }

    // Step down comparison
    const compLayout = layoutAvlTree(workingRoot);
    const currNode = compLayout.nodes.find((n) => n.id === node.id);
    if (currNode) currNode.state = "comparing";

    if (val < node.value) {
      steps.push({
        stepIndex: steps.length,
        operation: "insert",
        nodes: compLayout.nodes,
        edges: compLayout.edges,
        activeNodeId: node.id,
        description: `Comparing insert value ${val} < current node ${node.value} → moving to Left subtree.`,
        reasoning: `BST invariant: elements smaller than ${node.value} must reside in the left child.`,
        codeLine: 9,
        inlineVariables: { current: node.value, insertVal: val, direction: "Left" },
      });
      node.left = insertHelper(node.left);
    } else if (val > node.value) {
      steps.push({
        stepIndex: steps.length,
        operation: "insert",
        nodes: compLayout.nodes,
        edges: compLayout.edges,
        activeNodeId: node.id,
        description: `Comparing insert value ${val} > current node ${node.value} → moving to Right subtree.`,
        reasoning: `BST invariant: elements greater than ${node.value} must reside in the right child.`,
        codeLine: 12,
        inlineVariables: { current: node.value, insertVal: val, direction: "Right" },
      });
      node.right = insertHelper(node.right);
    } else {
      // Duplicate
      steps.push({
        stepIndex: steps.length,
        operation: "insert",
        nodes: compLayout.nodes,
        edges: compLayout.edges,
        activeNodeId: node.id,
        description: `Value ${val} is already present in AVL tree. No duplicate inserted.`,
        reasoning: "AVL Trees enforce unique keys.",
        codeLine: 15,
        inlineVariables: { duplicate: val },
      });
      return node;
    }

    // Update height
    updateHeight(node);
    const balance = getBalanceFactor(node);

    // Unwinding step: Inspect balance factor
    const checkLayout = layoutAvlTree(workingRoot);
    const inspectNode = checkLayout.nodes.find((n) => n.id === node.id);
    if (inspectNode) {
      inspectNode.state = Math.abs(balance) > 1 ? "imbalanced" : "found";
    }

    steps.push({
      stepIndex: steps.length,
      operation: "rebalance",
      nodes: checkLayout.nodes,
      edges: checkLayout.edges,
      activeNodeId: node.id,
      description: `Unwinding ancestor node ${node.value}: Height = ${node.height}, Balance Factor (Left - Right) = ${balance}.`,
      reasoning:
        Math.abs(balance) > 1
          ? `Balance Factor ${balance} violates AVL property (|BF| ≤ 1). Immediate rotation required!`
          : `Balance Factor ${balance} satisfies AVL property (-1 ≤ BF ≤ +1). Node is balanced.`,
      codeLine: 18,
      inlineVariables: {
        node: node.value,
        height: node.height,
        leftHeight: getHeight(node.left),
        rightHeight: getHeight(node.right),
        balanceFactor: balance,
      },
    });

    // 4 ROTATION CASES:
    // Case 1: Left-Left (LL)
    if (balance > 1 && val < node.left!.value) {
      steps.push({
        stepIndex: steps.length,
        operation: "rotate",
        rotationType: "LL",
        imbalancedNodeId: node.id,
        nodes: checkLayout.nodes,
        edges: checkLayout.edges,
        activeNodeId: node.id,
        description: `Detected Left-Left (LL) Imbalance at node ${node.value} (BF = +2). Executing Single Right Rotation.`,
        reasoning: `Left child ${node.left!.value} is heavy on its left branch. Rotating ${node.value} right elevates ${node.left!.value} as the new subtree root.`,
        codeLine: 22,
        inlineVariables: { rotation: "Right Rotation (LL)", pivot: node.value },
      });
      return rotateRight(node);
    }

    // Case 2: Right-Right (RR)
    if (balance < -1 && val > node.right!.value) {
      steps.push({
        stepIndex: steps.length,
        operation: "rotate",
        rotationType: "RR",
        imbalancedNodeId: node.id,
        nodes: checkLayout.nodes,
        edges: checkLayout.edges,
        activeNodeId: node.id,
        description: `Detected Right-Right (RR) Imbalance at node ${node.value} (BF = -2). Executing Single Left Rotation.`,
        reasoning: `Right child ${node.right!.value} is heavy on its right branch. Rotating ${node.value} left elevates ${node.right!.value} as the new subtree root.`,
        codeLine: 26,
        inlineVariables: { rotation: "Left Rotation (RR)", pivot: node.value },
      });
      return rotateLeft(node);
    }

    // Case 3: Left-Right (LR)
    if (balance > 1 && val > node.left!.value) {
      steps.push({
        stepIndex: steps.length,
        operation: "rotate",
        rotationType: "LR",
        imbalancedNodeId: node.id,
        nodes: checkLayout.nodes,
        edges: checkLayout.edges,
        activeNodeId: node.id,
        description: `Detected Left-Right (LR) Imbalance at node ${node.value}. Executing Double Rotation: Left on ${node.left!.value}, then Right on ${node.value}.`,
        reasoning: `Left child ${node.left!.value} is right-heavy. Rotating child left converts it to LL case, then rotating parent right balances the subtree.`,
        codeLine: 30,
        inlineVariables: { rotation: "Left-Right Double Rotation (LR)", pivot: node.value },
      });
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }

    // Case 4: Right-Left (RL)
    if (balance < -1 && val < node.right!.value) {
      steps.push({
        stepIndex: steps.length,
        operation: "rotate",
        rotationType: "RL",
        imbalancedNodeId: node.id,
        nodes: checkLayout.nodes,
        edges: checkLayout.edges,
        activeNodeId: node.id,
        description: `Detected Right-Left (RL) Imbalance at node ${node.value}. Executing Double Rotation: Right on ${node.right!.value}, then Left on ${node.value}.`,
        reasoning: `Right child ${node.right!.value} is left-heavy. Rotating child right converts it to RR case, then rotating parent left balances the subtree.`,
        codeLine: 35,
        inlineVariables: { rotation: "Right-Left Double Rotation (RL)", pivot: node.value },
      });
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }

    return node;
  }

  function insertLeafIntoTree(curr: AvlRawNode | undefined, leaf: AvlRawNode, v: number): AvlRawNode {
    if (!curr) return leaf;
    if (v < curr.value) {
      curr.left = insertLeafIntoTree(curr.left, leaf, v);
    } else {
      curr.right = insertLeafIntoTree(curr.right, leaf, v);
    }
    return curr;
  }

  workingRoot = insertHelper(workingRoot);

  // Final balanced layout step
  const finalLayout = layoutAvlTree(workingRoot);
  steps.push({
    stepIndex: steps.length,
    operation: "init",
    nodes: finalLayout.nodes,
    edges: finalLayout.edges,
    description: `AVL Tree is strictly balanced! All nodes satisfy |BF| ≤ 1. Height = ${workingRoot.height}.`,
    reasoning: `Guaranteed O(log n) search depth preserved across all subtrees. Maximum height strictly bounded by 1.44 log₂(n+2).`,
    codeLine: 40,
    inlineVariables: { treeHeight: workingRoot.height, totalNodes: finalLayout.nodes.length, status: "Balanced" },
  });

  return { steps, newRoot: workingRoot };
}

// Search
export function generateAvlSearchTrace(
  root: AvlRawNode | undefined,
  val: number
): AvlTraceStep[] {
  const steps: AvlTraceStep[] = [];
  const layout = layoutAvlTree(root);

  steps.push({
    stepIndex: 0,
    operation: "search",
    nodes: layout.nodes,
    edges: layout.edges,
    description: `Search for key ${val} in AVL Tree.`,
    reasoning: "AVL balance guarantees worst-case O(log n) comparisons.",
    codeLine: 1,
    inlineVariables: { target: val },
  });

  let curr = root;
  while (curr) {
    const stepLayout = layoutAvlTree(root);
    const active = stepLayout.nodes.find((n) => n.id === curr?.id);
    if (active) active.state = curr.value === val ? "found" : "comparing";

    if (curr.value === val) {
      steps.push({
        stepIndex: steps.length,
        operation: "search",
        nodes: stepLayout.nodes,
        edges: stepLayout.edges,
        activeNodeId: curr.id,
        description: `Found target key ${val} at node ${curr.id}!`,
        reasoning: "Key matches current node. Search succeeds.",
        codeLine: 5,
        inlineVariables: { found: val, height: curr.height, balanceFactor: getBalanceFactor(curr) },
      });
      return steps;
    }

    if (val < curr.value) {
      steps.push({
        stepIndex: steps.length,
        operation: "search",
        nodes: stepLayout.nodes,
        edges: stepLayout.edges,
        activeNodeId: curr.id,
        description: `Key ${val} < ${curr.value} → Traversed to Left Child.`,
        reasoning: "BST ordering property eliminates right subtree.",
        codeLine: 8,
        inlineVariables: { current: curr.value, target: val, next: "Left" },
      });
      curr = curr.left;
    } else {
      steps.push({
        stepIndex: steps.length,
        operation: "search",
        nodes: stepLayout.nodes,
        edges: stepLayout.edges,
        activeNodeId: curr.id,
        description: `Key ${val} > ${curr.value} → Traversed to Right Child.`,
        reasoning: "BST ordering property eliminates left subtree.",
        codeLine: 11,
        inlineVariables: { current: curr.value, target: val, next: "Right" },
      });
      curr = curr.right;
    }
  }

  // Not found
  const notFoundLayout = layoutAvlTree(root);
  steps.push({
    stepIndex: steps.length,
    operation: "search",
    nodes: notFoundLayout.nodes,
    edges: notFoundLayout.edges,
    description: `Key ${val} not found in the AVL tree.`,
    reasoning: "Reached null leaf pointer without finding matching key.",
    codeLine: 14,
    inlineVariables: { target: val, found: "false" },
  });

  return steps;
}

// Preset Generator
export const AVL_PRESETS: Record<string, { name: string; desc: string; values: number[] }> = {
  balanced: {
    name: "Balanced AVL (7 Nodes)",
    desc: "Perfect height-balanced tree with BF = 0 across all nodes",
    values: [40, 20, 60, 10, 30, 50, 70],
  },
  rrCase: {
    name: "RR Case: 10, 20, 30",
    desc: "Demonstrates single Left Rotation restoring balance",
    values: [10, 20, 30],
  },
  llCase: {
    name: "LL Case: 30, 20, 10",
    desc: "Demonstrates single Right Rotation restoring balance",
    values: [30, 20, 10],
  },
  lrCase: {
    name: "LR Case: 30, 10, 20",
    desc: "Demonstrates Double Rotation (Left on child, then Right on root)",
    values: [30, 10, 20],
  },
  rlCase: {
    name: "RL Case: 10, 30, 20",
    desc: "Demonstrates Double Rotation (Right on child, then Left on root)",
    values: [10, 30, 20],
  },
};

export function buildAvlTreeFromValues(values: number[]): { root: AvlRawNode; initialSteps: AvlTraceStep[] } {
  let root: AvlRawNode | undefined = undefined;
  let allSteps: AvlTraceStep[] = [];

  for (const v of values) {
    const res = generateAvlInsertTrace(root, v);
    root = res.newRoot;
    allSteps = res.steps;
  }

  return { root: root!, initialSteps: allSteps };
}

