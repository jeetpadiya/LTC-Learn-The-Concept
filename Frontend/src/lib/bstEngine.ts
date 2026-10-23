import { TreeNode3D, TreeEdge3D, TreeTraceStep } from "@/types/visualizer";

// Internal tree node representation for computations
export interface BstRawNode {
  id: string;
  value: number;
  left?: BstRawNode;
  right?: BstRawNode;
}

// Compute 3D layout coordinates for the tree
export function layoutBst(
  node: BstRawNode | undefined,
  depth = 0,
  x = 0,
  xOffset = 3.8
): { nodes: TreeNode3D[]; edges: TreeEdge3D[] } {
  if (!node) return { nodes: [], edges: [] };

  const y = 2.8 - depth * 1.4;
  const z = depth * 0.15 * (x < 0 ? -1 : 1); // Subtle 3D branch depth curve

  const currentTreeNode: TreeNode3D = {
    id: node.id,
    value: node.value,
    x,
    y,
    z,
    leftId: node.left?.id,
    rightId: node.right?.id,
    state: "default",
  };

  const nextOffset = Math.max(0.7, xOffset * 0.52);

  const leftResult = layoutBst(node.left, depth + 1, x - xOffset, nextOffset);
  const rightResult = layoutBst(node.right, depth + 1, x + xOffset, nextOffset);

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

// Clone tree helper
export function cloneTree(node: BstRawNode | undefined): BstRawNode | undefined {
  if (!node) return undefined;
  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

// Build initial tree from an array
export function buildBstFromArray(values: number[]): BstRawNode | undefined {
  let root: BstRawNode | undefined = undefined;
  let counter = 0;

  function insertRaw(node: BstRawNode | undefined, val: number): BstRawNode {
    if (!node) {
      counter++;
      return { id: `node-${counter}`, value: val };
    }
    if (val < node.value) {
      node.left = insertRaw(node.left, val);
    } else if (val > node.value) {
      node.right = insertRaw(node.right, val);
    }
    return node;
  }

  for (const v of values) {
    root = insertRaw(root, v);
  }
  return root;
}

// 1. INSERT OPERATION TRACE
export function generateBstInsertTrace(
  root: BstRawNode | undefined,
  valToInsert: number
): { steps: TreeTraceStep[]; newRoot: BstRawNode } {
  const steps: TreeTraceStep[] = [];
  const currentTree = cloneTree(root);
  let nodeCounter = 100 + Math.floor(Math.random() * 900);

  const initialLayout = layoutBst(currentTree);
  steps.push({
    stepIndex: 0,
    operation: "init",
    nodes: initialLayout.nodes,
    edges: initialLayout.edges,
    description: `Ready to insert value ${valToInsert} into Binary Search Tree.`,
    reasoning: `Beginning BST insertion for ${valToInsert}. Comparisons start at the root node.`,
    codeLine: 2,
    inlineVariables: { val: valToInsert },
  });

  if (!currentTree) {
    const freshRoot: BstRawNode = { id: `node-${nodeCounter}`, value: valToInsert };
    const freshLayout = layoutBst(freshRoot);
    freshLayout.nodes[0].state = "inserted";

    steps.push({
      stepIndex: 1,
      operation: "insert",
      nodes: freshLayout.nodes,
      edges: freshLayout.edges,
      activeNodeId: freshRoot.id,
      description: `Tree is empty. Inserted ${valToInsert} as the new root.`,
      reasoning: `Base case: empty tree → allocate new root node with value ${valToInsert}.`,
      codeLine: 4,
      inlineVariables: { rootVal: valToInsert },
    });

    return { steps, newRoot: freshRoot };
  }

  // Traverse tree to find insertion position
  let curr: BstRawNode | undefined = currentTree;
  let parent: BstRawNode | undefined = undefined;
  let isLeftChild = false;

  while (curr) {
    const layout = layoutBst(currentTree);
    const targetNode = layout.nodes.find((n) => n.id === curr?.id);
    if (targetNode) targetNode.state = "comparing";

    const compReason =
      valToInsert < curr.value
        ? `Compare ${valToInsert} vs ${curr.value} → ${valToInsert} < ${curr.value} → traverse left branch.`
        : valToInsert > curr.value
        ? `Compare ${valToInsert} vs ${curr.value} → ${valToInsert} > ${curr.value} → traverse right branch.`
        : `Value ${valToInsert} already exists in tree. BST duplicate avoided.`;

    steps.push({
      stepIndex: steps.length,
      operation: "insert",
      nodes: layout.nodes,
      edges: layout.edges,
      activeNodeId: curr.id,
      description: `Comparing insert value ${valToInsert} with current node ${curr.value}.`,
      reasoning: compReason,
      codeLine: valToInsert < curr.value ? 7 : 10,
      inlineVariables: { currentVal: curr.value, insertVal: valToInsert },
    });

    if (valToInsert === curr.value) {
      return { steps, newRoot: currentTree };
    }

    parent = curr;
    if (valToInsert < curr.value) {
      curr = curr.left;
      isLeftChild = true;
    } else {
      curr = curr.right;
      isLeftChild = false;
    }
  }

  // Create new child node
  const newNode: BstRawNode = { id: `node-${nodeCounter}`, value: valToInsert };
  if (parent) {
    if (isLeftChild) parent.left = newNode;
    else parent.right = newNode;
  }

  const finalLayout = layoutBst(currentTree);
  const insertedNode = finalLayout.nodes.find((n) => n.id === newNode.id);
  if (insertedNode) insertedNode.state = "inserted";

  steps.push({
    stepIndex: steps.length,
    operation: "insert",
    nodes: finalLayout.nodes,
    edges: finalLayout.edges,
    activeNodeId: newNode.id,
    description: `Inserted new leaf node (${valToInsert}) as ${isLeftChild ? "left" : "right"} child of ${parent?.value}.`,
    reasoning: `Reached empty pointer spot. Attached leaf node ${valToInsert}. BST invariant preserved.`,
    codeLine: 13,
    inlineVariables: { parent: parent?.value ?? 0, inserted: valToInsert },
  });

  return { steps, newRoot: currentTree };
}

// 2. SEARCH OPERATION TRACE
export function generateBstSearchTrace(
  root: BstRawNode | undefined,
  targetVal: number
): TreeTraceStep[] {
  const steps: TreeTraceStep[] = [];
  const currentTree = cloneTree(root);

  const initialLayout = layoutBst(currentTree);
  steps.push({
    stepIndex: 0,
    operation: "init",
    nodes: initialLayout.nodes,
    edges: initialLayout.edges,
    description: `Searching for target value ${targetVal} in BST.`,
    reasoning: `Beginning binary search at the root. Left subtree is strictly smaller; right is strictly larger.`,
    codeLine: 16,
    inlineVariables: { target: targetVal },
  });

  let curr = currentTree;
  let found = false;

  while (curr) {
    const layout = layoutBst(currentTree);
    const targetNode = layout.nodes.find((n) => n.id === curr?.id);

    if (curr.value === targetVal) {
      found = true;
      if (targetNode) targetNode.state = "found";

      steps.push({
        stepIndex: steps.length,
        operation: "search",
        nodes: layout.nodes,
        edges: layout.edges,
        activeNodeId: curr.id,
        description: `Target ${targetVal} FOUND at node ${curr.id}!`,
        reasoning: `Match confirmed: node value ${curr.value} == target ${targetVal}. Search successful in O(h) steps.`,
        codeLine: 18,
        inlineVariables: { foundAtNode: curr.value },
      });
      break;
    } else {
      if (targetNode) targetNode.state = "comparing";
      const goLeft = targetVal < curr.value;

      steps.push({
        stepIndex: steps.length,
        operation: "search",
        nodes: layout.nodes,
        edges: layout.edges,
        activeNodeId: curr.id,
        description: `Comparing target ${targetVal} with node ${curr.value}.`,
        reasoning: goLeft
          ? `Target ${targetVal} < ${curr.value} → target must be in left subtree.`
          : `Target ${targetVal} > ${curr.value} → target must be in right subtree.`,
        codeLine: goLeft ? 21 : 23,
        inlineVariables: { currentVal: curr.value, target: targetVal },
      });

      curr = goLeft ? curr.left : curr.right;
    }
  }

  if (!found) {
    const layout = layoutBst(currentTree);
    steps.push({
      stepIndex: steps.length,
      operation: "search",
      nodes: layout.nodes,
      edges: layout.edges,
      description: `Target value ${targetVal} was NOT found in the tree.`,
      reasoning: `Reached null leaf branch without finding ${targetVal}. Target is not present in this BST.`,
      codeLine: 26,
      inlineVariables: { result: "Not Found" },
    });
  }

  return steps;
}

// 3. DELETE OPERATION TRACE
export function generateBstDeleteTrace(
  root: BstRawNode | undefined,
  valToDelete: number
): { steps: TreeTraceStep[]; newRoot: BstRawNode | undefined } {
  const steps: TreeTraceStep[] = [];
  let currentTree = cloneTree(root);

  const initialLayout = layoutBst(currentTree);
  steps.push({
    stepIndex: 0,
    operation: "init",
    nodes: initialLayout.nodes,
    edges: initialLayout.edges,
    description: `Initiating deletion for value ${valToDelete}.`,
    reasoning: `Searching for node ${valToDelete}. Will handle one of 3 cases: leaf, single child, or two children.`,
    codeLine: 28,
    inlineVariables: { deleteVal: valToDelete },
  });

  function deleteNodeRec(node: BstRawNode | undefined, val: number): BstRawNode | undefined {
    if (!node) return undefined;

    if (val < node.value) {
      node.left = deleteNodeRec(node.left, val);
    } else if (val > node.value) {
      node.right = deleteNodeRec(node.right, val);
    } else {
      // Found the node to delete!
      // Case 1 & 2: 0 or 1 child
      if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      }

      // Case 3: 2 children. Find inorder successor (minimum in right subtree)
      let succ = node.right;
      while (succ.left) {
        succ = succ.left;
      }
      node.value = succ.value;
      node.right = deleteNodeRec(node.right, succ.value);
    }
    return node;
  }

  currentTree = deleteNodeRec(currentTree, valToDelete);
  const finalLayout = layoutBst(currentTree);

  steps.push({
    stepIndex: steps.length,
    operation: "delete",
    nodes: finalLayout.nodes,
    edges: finalLayout.edges,
    description: `Node with value ${valToDelete} has been successfully deleted.`,
    reasoning: `Deletion complete. Replaced/reconnected pointers and preserved BST order invariant.`,
    codeLine: 35,
    inlineVariables: { deleted: valToDelete },
  });

  return { steps, newRoot: currentTree };
}

