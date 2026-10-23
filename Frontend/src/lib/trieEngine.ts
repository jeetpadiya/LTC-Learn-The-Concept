import { TrieNodeVisual, TrieNodeState, TrieTraceStep } from "@/types/visualizer";

// Deep clone nodes dictionary
function cloneNodes(nodes: Record<string, TrieNodeVisual>): Record<string, TrieNodeVisual> {
  const result: Record<string, TrieNodeVisual> = {};
  for (const [id, node] of Object.entries(nodes)) {
    result[id] = {
      ...node,
      childIds: [...node.childIds],
      childrenChars: [...node.childrenChars],
    };
  }
  return result;
}

// Tree Layout Position Calculator (Subtree-based non-overlapping coordinates)
export function layoutTrie(nodes: Record<string, TrieNodeVisual>): Record<string, TrieNodeVisual> {
  const cloned = cloneNodes(nodes);
  const root = cloned["root"];
  if (!root) return cloned;

  // 1. Calculate leaf weight for each node
  const weights: Record<string, number> = {};
  function calcWeight(id: string): number {
    const node = cloned[id];
    if (!node || node.childIds.length === 0) {
      weights[id] = 1;
      return 1;
    }
    let w = 0;
    for (const childId of node.childIds) {
      w += calcWeight(childId);
    }
    weights[id] = Math.max(1, w);
    return weights[id];
  }
  calcWeight("root");

  // 2. Position nodes horizontally based on leaf weights
  const totalWeight = weights["root"] || 1;
  const canvasWidth = 760;
  const leftMargin = 20;

  function assignPositions(id: string, left: number, right: number, level: number) {
    const node = cloned[id];
    if (!node) return;

    node.x = (left + right) / 2;
    node.y = 35 + level * 56;
    node.level = level;

    let currentLeft = left;
    const parentWeight = weights[id] || 1;

    for (const childId of node.childIds) {
      const childWeight = weights[childId] || 1;
      const childWidth = (childWeight / parentWeight) * (right - left);
      assignPositions(childId, currentLeft, currentLeft + childWidth, level + 1);
      currentLeft += childWidth;
    }
  }

  assignPositions("root", leftMargin, leftMargin + canvasWidth, 0);
  return cloned;
}

// Initialize empty Trie with root node
export function createEmptyTrie(): Record<string, TrieNodeVisual> {
  return {
    root: {
      id: "root",
      char: "ROOT",
      isEndOfWord: false,
      parentId: null,
      childIds: [],
      childrenChars: [],
      x: 400,
      y: 35,
      level: 0,
      state: "default",
    },
  };
}

// Build Trie from initial word array
export function buildTrieFromWords(words: string[]): {
  nodes: Record<string, TrieNodeVisual>;
  wordList: string[];
} {
  let nodes = createEmptyTrie();
  const wordList: string[] = [];

  for (const rawWord of words) {
    const word = rawWord.toLowerCase().trim().replace(/[^a-z]/g, "");
    if (!word) continue;

    wordList.push(word);
    let currId = "root";
    let prefix = "";

    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      prefix += ch;
      const childId = `node-${prefix}`;

      if (!nodes[currId].childIds.includes(childId)) {
        nodes[currId].childIds.push(childId);
        nodes[currId].childrenChars.push(ch);

        nodes[childId] = {
          id: childId,
          char: ch,
          isEndOfWord: i === word.length - 1,
          word: i === word.length - 1 ? word : undefined,
          parentId: currId,
          childIds: [],
          childrenChars: [],
          x: 400,
          y: 35,
          level: i + 1,
          state: "default",
        };
      } else if (i === word.length - 1) {
        nodes[childId].isEndOfWord = true;
        nodes[childId].word = word;
      }

      currId = childId;
    }
  }

  nodes = layoutTrie(nodes);
  return { nodes, wordList };
}

// ==========================================
// 1. INSERT WORD (O(L) Time, L = Word Length)
// ==========================================
export function generateTrieInsertTrace(
  currentNodes: Record<string, TrieNodeVisual>,
  currentWords: string[],
  rawWord: string
): TrieTraceStep[] {
  const steps: TrieTraceStep[] = [];
  const word = rawWord.toLowerCase().trim().replace(/[^a-z]/g, "");
  if (!word) return steps;

  let nodes = cloneNodes(currentNodes);
  const words = currentWords.includes(word) ? [...currentWords] : [...currentWords, word];

  // Step 0: Start at Root
  nodes["root"].state = "active";
  steps.push({
    stepIndex: 0,
    operation: "insert",
    nodes: layoutTrie(cloneNodes(nodes)),
    wordList: [...currentWords],
    activeNodeId: "root",
    targetWord: word,
    charIndex: -1,
    description: `Begin insertion of '${word}' at Root. Length L = ${word.length}.`,
    reasoning: `Trie insertion traverses character by character from the Root. Time complexity is strictly O(L) independent of dictionary size!`,
    codeLine: 2,
    inlineVariables: { word, wordLength: word.length, atNode: "root" },
  });
  nodes["root"].state = "default";

  let currId = "root";
  let prefix = "";

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    prefix += ch;
    const childId = `node-${prefix}`;
    const isLast = i === word.length - 1;

    if (nodes[currId].childIds.includes(childId)) {
      // Branch already exists
      nodes[childId].state = "comparing";
      steps.push({
        stepIndex: steps.length,
        operation: "insert",
        nodes: layoutTrie(cloneNodes(nodes)),
        wordList: [...currentWords],
        activeNodeId: childId,
        activeChar: ch,
        charIndex: i,
        targetWord: word,
        description: `Character [${i}] '${ch}' already exists! Shared prefix '${prefix}'.`,
        reasoning: `Trie shares common prefixes. No new node allocation needed for character '${ch}'. Traversing down.`,
        codeLine: 4,
        inlineVariables: { char: ch, prefix, sharedBranch: childId },
      });

      if (isLast) {
        nodes[childId].isEndOfWord = true;
        nodes[childId].word = word;
      }
      nodes[childId].state = "default";
      currId = childId;
    } else {
      // Create new character branch
      nodes[currId].childIds.push(childId);
      nodes[currId].childrenChars.push(ch);

      nodes[childId] = {
        id: childId,
        char: ch,
        isEndOfWord: isLast,
        word: isLast ? word : undefined,
        parentId: currId,
        childIds: [],
        childrenChars: [],
        x: 400,
        y: 35,
        level: i + 1,
        state: "inserted",
      };

      steps.push({
        stepIndex: steps.length,
        operation: "insert",
        nodes: layoutTrie(cloneNodes(nodes)),
        wordList: [...currentWords],
        activeNodeId: childId,
        activeChar: ch,
        charIndex: i,
        targetWord: word,
        description: `Created new branch for character [${i}] '${ch}' → '${prefix}'.`,
        reasoning: `Character '${ch}' did not exist at this prefix. Allocated new child node.`,
        codeLine: 6,
        inlineVariables: { char: ch, createdNode: childId, prefix },
      });

      nodes[childId].state = "default";
      currId = childId;
    }
  }

  // Final step: Settled with terminal word flag
  nodes[currId].state = "found";
  nodes[currId].isEndOfWord = true;
  nodes[currId].word = word;

  steps.push({
    stepIndex: steps.length,
    operation: "insert",
    nodes: layoutTrie(cloneNodes(nodes)),
    wordList: words,
    activeNodeId: currId,
    targetWord: word,
    charIndex: word.length - 1,
    description: `Word '${word}' inserted successfully! Terminal word marker enabled (isEndOfWord = true).`,
    reasoning: `Insertion complete in strictly O(L) time. Node '${currId}' is now a complete word terminal. Total words in Trie = ${words.length}.`,
    codeLine: 8,
    inlineVariables: { insertedWord: word, totalWords: words.length },
  });

  return steps;
}

// ==========================================
// 2. SEARCH WORD (Exact Match, O(L))
// ==========================================
export function generateTrieSearchTrace(
  currentNodes: Record<string, TrieNodeVisual>,
  words: string[],
  rawWord: string
): TrieTraceStep[] {
  const steps: TrieTraceStep[] = [];
  const word = rawWord.toLowerCase().trim().replace(/[^a-z]/g, "");
  if (!word) return steps;

  const nodes = cloneNodes(currentNodes);

  // Step 0: Start at Root
  nodes["root"].state = "active";
  steps.push({
    stepIndex: 0,
    operation: "search",
    nodes: layoutTrie(cloneNodes(nodes)),
    wordList: words,
    activeNodeId: "root",
    targetWord: word,
    description: `Begin search for exact word '${word}' at Root.`,
    reasoning: `Word search checks for a complete path of characters ending with isEndOfWord == true.`,
    codeLine: 2,
    inlineVariables: { targetWord: word, start: "root" },
  });
  nodes["root"].state = "default";

  let currId = "root";
  let prefix = "";
  let notFound = false;

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    prefix += ch;
    const childId = `node-${prefix}`;

    if (!nodes[currId] || !nodes[currId].childIds.includes(childId)) {
      notFound = true;
      steps.push({
        stepIndex: steps.length,
        operation: "search",
        nodes: layoutTrie(cloneNodes(nodes)),
        wordList: words,
        activeNodeId: currId,
        activeChar: ch,
        charIndex: i,
        targetWord: word,
        description: `Character '${ch}' NOT FOUND at prefix '${prefix.slice(0, -1)}'. Search stopped.`,
        reasoning: `Branch for character '${ch}' does not exist. Word '${word}' is absent from the Trie.`,
        codeLine: 5,
        inlineVariables: { missingChar: ch, failedAtPrefix: prefix.slice(0, -1) },
      });
      break;
    }

    nodes[childId].state = "comparing";
    steps.push({
      stepIndex: steps.length,
      operation: "search",
      nodes: layoutTrie(cloneNodes(nodes)),
      wordList: words,
      activeNodeId: childId,
      activeChar: ch,
      charIndex: i,
      targetWord: word,
      description: `Matched character [${i}] '${ch}' → prefix '${prefix}'.`,
      reasoning: `Character found in child branches. Advancing to next character.`,
      codeLine: 4,
      inlineVariables: { matchedChar: ch, currentPrefix: prefix },
    });

    nodes[childId].state = "default";
    currId = childId;
  }

  if (!notFound) {
    const terminalNode = nodes[currId];
    if (terminalNode.isEndOfWord) {
      terminalNode.state = "found";
      steps.push({
        stepIndex: steps.length,
        operation: "search",
        nodes: layoutTrie(cloneNodes(nodes)),
        wordList: words,
        activeNodeId: currId,
        targetWord: word,
        description: `Word '${word}' FOUND! Terminal marker isEndOfWord is TRUE.`,
        reasoning: `All ${word.length} characters matched and node is marked as an end of word. Search took O(L) = O(${word.length}) time.`,
        codeLine: 7,
        inlineVariables: { searchResult: "FOUND", isEndOfWord: "true" },
      });
    } else {
      terminalNode.state = "not_found";
      steps.push({
        stepIndex: steps.length,
        operation: "search",
        nodes: layoutTrie(cloneNodes(nodes)),
        wordList: words,
        activeNodeId: currId,
        targetWord: word,
        description: `Prefix '${word}' exists, but NOT marked as a complete word (isEndOfWord = false).`,
        reasoning: `The prefix exists as part of other words, but '${word}' was never inserted as a standalone word.`,
        codeLine: 8,
        inlineVariables: { searchResult: "PREFIX_ONLY", isEndOfWord: "false" },
      });
    }
  }

  return steps;
}

// ==========================================
// 3. PREFIX SEARCH (startsWith, O(P))
// ==========================================
export function generateTrieStartsWithTrace(
  currentNodes: Record<string, TrieNodeVisual>,
  words: string[],
  rawPrefix: string
): TrieTraceStep[] {
  const steps: TrieTraceStep[] = [];
  const prefixQuery = rawPrefix.toLowerCase().trim().replace(/[^a-z]/g, "");
  if (!prefixQuery) return steps;

  const nodes = cloneNodes(currentNodes);
  let currId = "root";
  let prefix = "";
  let notFound = false;

  steps.push({
    stepIndex: 0,
    operation: "startsWith",
    nodes: layoutTrie(cloneNodes(nodes)),
    wordList: words,
    activeNodeId: "root",
    targetWord: prefixQuery,
    description: `Checking if any dictionary word starts with prefix '${prefixQuery}'.`,
    reasoning: `Prefix checking only requires traversing to the prefix node; does not require isEndOfWord == true.`,
    codeLine: 2,
    inlineVariables: { prefixQuery },
  });

  for (let i = 0; i < prefixQuery.length; i++) {
    const ch = prefixQuery[i];
    prefix += ch;
    const childId = `node-${prefix}`;

    if (!nodes[currId] || !nodes[currId].childIds.includes(childId)) {
      notFound = true;
      steps.push({
        stepIndex: steps.length,
        operation: "startsWith",
        nodes: layoutTrie(cloneNodes(nodes)),
        wordList: words,
        activeNodeId: currId,
        targetWord: prefixQuery,
        description: `Prefix character '${ch}' not found. No words start with '${prefixQuery}'.`,
        reasoning: `Branch broken at character '${ch}'. startsWith returns FALSE.`,
        codeLine: 5,
        inlineVariables: { result: "FALSE" },
      });
      break;
    }

    nodes[childId].state = "comparing";
    steps.push({
      stepIndex: steps.length,
      operation: "startsWith",
      nodes: layoutTrie(cloneNodes(nodes)),
      wordList: words,
      activeNodeId: childId,
      activeChar: ch,
      targetWord: prefixQuery,
      description: `Prefix match: character '${ch}' found at node '${childId}'.`,
      reasoning: `Traversing path of prefix '${prefix}'.`,
      codeLine: 4,
      inlineVariables: { matchedPrefix: prefix },
    });
    nodes[childId].state = "default";
    currId = childId;
  }

  if (!notFound) {
    nodes[currId].state = "found";
    steps.push({
      stepIndex: steps.length,
      operation: "startsWith",
      nodes: layoutTrie(cloneNodes(nodes)),
      wordList: words,
      activeNodeId: currId,
      targetWord: prefixQuery,
      description: `Prefix '${prefixQuery}' EXISTS in Trie! Words branch out from this node.`,
      reasoning: `Subtree rooted at '${currId}' contains at least one full word. startsWith returns TRUE.`,
      codeLine: 6,
      inlineVariables: { result: "TRUE", prefixNode: currId },
    });
  }

  return steps;
}

// ==========================================
// 4. AUTOCOMPLETE SUGGESTIONS (DFS Subtree Traversal)
// ==========================================
export function generateTrieAutocompleteTrace(
  currentNodes: Record<string, TrieNodeVisual>,
  words: string[],
  rawPrefix: string
): TrieTraceStep[] {
  const steps: TrieTraceStep[] = [];
  const prefixQuery = rawPrefix.toLowerCase().trim().replace(/[^a-z]/g, "");
  const nodes = cloneNodes(currentNodes);

  // 1. Traverse to prefix node
  let currId = "root";
  let prefix = "";
  let notFound = false;

  for (let i = 0; i < prefixQuery.length; i++) {
    const ch = prefixQuery[i];
    prefix += ch;
    const childId = `node-${prefix}`;
    if (!nodes[currId] || !nodes[currId].childIds.includes(childId)) {
      notFound = true;
      break;
    }
    currId = childId;
  }

  if (notFound || !nodes[currId]) {
    steps.push({
      stepIndex: 0,
      operation: "autocomplete",
      nodes: layoutTrie(cloneNodes(nodes)),
      wordList: words,
      targetWord: prefixQuery,
      suggestions: [],
      description: `No suggestions found for prefix '${prefixQuery}'.`,
      reasoning: `Prefix node does not exist in Trie.`,
      codeLine: 3,
      inlineVariables: { prefix: prefixQuery, matches: 0 },
    });
    return steps;
  }

  // 2. DFS from prefix node to gather all descending words
  const suggestions: string[] = [];
  const highlightedNodeIds: string[] = [];

  function collectWords(id: string) {
    const n = nodes[id];
    if (!n) return;
    highlightedNodeIds.push(id);
    if (n.isEndOfWord && n.word) {
      suggestions.push(n.word);
    }
    for (const childId of n.childIds) {
      collectWords(childId);
    }
  }

  collectWords(currId);

  // Mark all traversed nodes
  for (const id of highlightedNodeIds) {
    nodes[id].state = "active";
  }
  nodes[currId].state = "found";

  steps.push({
    stepIndex: 0,
    operation: "autocomplete",
    nodes: layoutTrie(cloneNodes(nodes)),
    wordList: words,
    activeNodeId: currId,
    targetWord: prefixQuery,
    suggestions,
    description: `Found ${suggestions.length} autocomplete word(s) for prefix '${prefixQuery}': [${suggestions.join(", ")}].`,
    reasoning: `Traversed subtree below prefix node '${currId}' using DFS to harvest all valid terminal words.`,
    codeLine: 5,
    inlineVariables: { prefix: prefixQuery, totalSuggestions: suggestions.length },
  });

  return steps;
}

// ==========================================
// 5. DELETE WORD (Pruning Unused Nodes)
// ==========================================
export function generateTrieDeleteTrace(
  currentNodes: Record<string, TrieNodeVisual>,
  currentWords: string[],
  rawWord: string
): TrieTraceStep[] {
  const steps: TrieTraceStep[] = [];
  const word = rawWord.toLowerCase().trim().replace(/[^a-z]/g, "");
  if (!word || !currentWords.includes(word)) {
    return [
      {
        stepIndex: 0,
        operation: "delete",
        nodes: layoutTrie(cloneNodes(currentNodes)),
        wordList: currentWords,
        targetWord: word,
        description: `Word '${word}' not in dictionary. Nothing deleted.`,
        reasoning: "Delete called on non-existent word.",
        codeLine: 1,
        inlineVariables: { error: "NOT_FOUND" },
      },
    ];
  }

  const nodes = cloneNodes(currentNodes);
  const words = currentWords.filter((w) => w !== word);

  // Find terminal node
  let currId = "root";
  let prefix = "";
  const path: string[] = ["root"];

  for (let i = 0; i < word.length; i++) {
    prefix += word[i];
    const childId = `node-${prefix}`;
    if (nodes[currId].childIds.includes(childId)) {
      path.push(childId);
      currId = childId;
    }
  }

  // Step 0: Unset isEndOfWord
  nodes[currId].isEndOfWord = false;
  nodes[currId].word = undefined;
  nodes[currId].state = "comparing";

  steps.push({
    stepIndex: 0,
    operation: "delete",
    nodes: layoutTrie(cloneNodes(nodes)),
    wordList: words,
    activeNodeId: currId,
    targetWord: word,
    description: `Unmarked terminal word flag for '${word}'. Checking for pruneable leaf nodes...`,
    reasoning: `Word '${word}' is no longer terminal. If this node has no children and is not part of another word, it can be pruned safely.`,
    codeLine: 3,
    inlineVariables: { targetWord: word, isEndOfWord: "false" },
  });

  // Prune unused nodes from bottom up
  for (let i = path.length - 1; i > 0; i--) {
    const nodeId = path[i];
    const node = nodes[nodeId];
    if (!node) continue;

    if (!node.isEndOfWord && node.childIds.length === 0) {
      const parentNode = nodes[node.parentId!];
      if (parentNode) {
        parentNode.childIds = parentNode.childIds.filter((id) => id !== nodeId);
        parentNode.childrenChars = parentNode.childrenChars.filter((ch) => ch !== node.char);
      }
      delete nodes[nodeId];
    } else {
      // Node is still needed by other words
      break;
    }
  }

  steps.push({
    stepIndex: 1,
    operation: "delete",
    nodes: layoutTrie(cloneNodes(nodes)),
    wordList: words,
    targetWord: word,
    description: `Deletion and tree pruning complete for '${word}'. Remaining words: ${words.length}.`,
    reasoning: `Pruned trailing characters with zero other references. Trie compactness maintained!`,
    codeLine: 6,
    inlineVariables: { remainingWords: words.length },
  });

  return steps;
}

