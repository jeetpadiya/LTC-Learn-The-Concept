"use client";

import React, { useState } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { ALGORITHMS } from "@/lib/algorithms";
import { Copy, Check, Terminal } from "lucide-react";

const BFS_CPP_CODE = `// Breadth-First Search (FIFO Queue)
void bfs(int start, int V, const vector<vector<int>>& adj) {
    vector<bool> visited(V, false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`;

const DFS_CPP_CODE = `// Depth-First Search (Call Stack Recursion)
void dfs(int u, vector<bool>& visited, const vector<vector<int>>& adj) {
    visited[u] = true;

    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, visited, adj);
        }
    }
}`;

const LINKED_LIST_REVERSE_CPP = `// In-Place List Reversal (O(n) Time, O(1) Space)
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`;

const LINKED_LIST_DELETE_CPP = `// Delete Node by Value
void deleteNode(ListNode*& head, int targetVal) {
    if (!head) return;
    if (head->val == targetVal) {
        ListNode* toDelete = head;
        head = head->next;
        delete toDelete;
        return;
    }
    ListNode* prev = head;
    ListNode* curr = head->next;
    while (curr && curr->val != targetVal) {
        prev = curr;
        curr = curr->next;
    }
    if (curr) {
        prev->next = curr->next;
        delete curr;
    }
}`;

const LINKED_LIST_INSERT_CPP = `// Insert at Head / Tail
ListNode* insertHead(ListNode* head, int val) {
    ListNode* newNode = new ListNode(val);
    newNode->next = head;
    head = newNode;
    return head;
}

void insertTail(ListNode* tail, int val) {
    ListNode* newNode = new ListNode(val);
    tail->next = newNode;
    tail = newNode;
}`;

const STACK_CPP_CODE = `// C++ Stack Implementation (LIFO)
class Stack {
private:
    std::vector<int> data;
public:
    void push(int val) {
        data.push_back(val); // O(1) Push onto TOP
    }

    void pop() {
        if (!data.empty()) {
            data.pop_back();  // O(1) Pop from TOP
        }
    }

    int top() {
        return data.back();   // O(1) Peek TOP
    }
};`;

const QUEUE_CPP_CODE = `// C++ Queue Implementation (FIFO)
class Queue {
private:
    std::deque<int> data;
public:
    void enqueue(int val) {
        data.push_back(val);  // O(1) Push at REAR
    }

    void dequeue() {
        if (!data.empty()) {
            data.pop_front(); // O(1) Pop from FRONT
        }
    }

    int front() {
        return data.front();  // O(1) Peek FRONT
    }
};`;

const DYNAMIC_ARRAY_PUSH_BACK_CPP = `// Dynamic Array (std::vector::push_back) - Amortized O(1)
void push_back(int val) {
    if (size == capacity) {
        int newCap = (capacity == 0) ? 2 : capacity * 2;
        int* newBuf = new int[newCap];
        for (int i = 0; i < size; ++i) newBuf[i] = data[i];
        delete[] data; data = newBuf; capacity = newCap;
    }
    data[size++] = val; // Direct write at offset
}`;

const DYNAMIC_ARRAY_POP_BACK_CPP = `// Dynamic Array (std::vector::pop_back) - O(1) Time
void pop_back() {
    if (size == 0) return;
    --size; // Decrement logical size
    // Capacity remains unchanged for reuse
}`;

const DYNAMIC_ARRAY_INSERT_CPP = `// Dynamic Array (std::vector::insert) - O(n) Time
void insert(int index, int val) {
    if (size == capacity) reserve(capacity * 2);
    // Shift elements right to open slot
    for (int i = size - 1; i >= index; --i) {
        data[i + 1] = data[i];
    }
    data[index] = val; // Place new element
    ++size;
}`;

const DYNAMIC_ARRAY_ACCESS_CPP = `// Dynamic Array Random Access - Strictly O(1)
int operator[](size_t index) const {
    // Direct pointer arithmetic: base + index * sizeof(T)
    return *(data + index);
}`;

const HEAP_INSERT_CPP = `// Binary Heap Insert & Sift-Up - O(log n) Time
void push(int val) {
    heap.push_back(val); // Insert at end (leaf slot)
    int i = heap.size() - 1;
    // Sift-Up: restore heap property towards root
    while (i > 0 && shouldSwap(heap[i], heap[(i - 1) / 2])) {
        std::swap(heap[i], heap[(i - 1) / 2]);
        i = (i - 1) / 2; // Move up to parent
    }
}`;

const HEAP_EXTRACT_CPP = `// Binary Heap Extract Root & Sift-Down - O(log n)
int pop() {
    if (heap.empty()) return -1;
    int root = heap[0];
    heap[0] = heap.back(); // Replace root with last leaf
    heap.pop_back();
    // Sift-Down: restore heap property towards leaves
    int i = 0, n = heap.size();
    while (2 * i + 1 < n) {
        int bestChild = getBestChild(i, n);
        if (!shouldSwap(heap[bestChild], heap[i])) break;
        std::swap(heap[i], heap[bestChild]);
        i = bestChild; // Move down to child
    }
    return root;
}`;

const HEAP_HEAPIFY_CPP = `// Bottom-Up Heapify - Strictly Linear O(n) Time
void buildHeap(std::vector<int>& arr) {
    int n = arr.size();
    // Sift down all non-leaf nodes in reverse order
    for (int i = (n - 2) / 2; i >= 0; --i) {
        siftDown(arr, i, n);
    }
    // Total work = O(n), mathematically faster than n pushes
}`;

const HASH_CHAINING_CPP = `// Separate Chaining Hash Table (std::vector<std::list<int>>)
void insert(int key) {
    int h = hash(key); // h(k) = k % M
    // Check if key already exists in bucket chain
    for (int val : table[h]) {
        if (val == key) return; // Duplicate
    }
    table[h].push_back(key); // Append to chain: O(1) avg
}

bool search(int key) {
    int h = hash(key);
    for (int val : table[h]) {
        if (val == key) return true; // Found
    }
    return false; // Not found
}`;

const HASH_PROBING_CPP = `// Open Addressing (Linear Probing with Tombstones)
void insert(int key) {
    int h = hash(key);
    for (int i = 0; i < capacity; ++i) {
        int probe = (h + i) % capacity;
        if (!table[probe].occupied || table[probe].isTombstone) {
            table[probe] = {key, true, false}; // Insert
            return;
        }
    }
}

void remove(int key) {
    int h = hash(key);
    for (int i = 0; i < capacity; ++i) {
        int probe = (h + i) % capacity;
        if (!table[probe].occupied) return; // Not found
        if (table[probe].key == key) {
            table[probe].isTombstone = true; // [DEL] marker
            return;
        }
    }
}`;

const HASH_REHASH_CPP = `// Dynamic Rehashing (2x Capacity) - Amortized O(1)
void rehash() {
    int newCap = capacity * 2;
    std::vector<Bucket> newTable(newCap);
    // Redistribute all keys with new modulus formula
    for (int key : existingKeys) {
        int newHash = key % newCap;
        insertInto(newTable, newHash, key);
    }
    table = std::move(newTable);
    capacity = newCap;
}`;

const TRIE_INSERT_CPP = `// Trie Word Insertion - O(L) Time (L = Word Length)
void insert(const std::string& word) {
    TrieNode* curr = root;
    for (char c : word) {
        int idx = c - 'a';
        if (!curr->children[idx]) {
            curr->children[idx] = new TrieNode(); // New branch
        }
        curr = curr->children[idx]; // Traverse down
    }
    curr->isEndOfWord = true; // Mark terminal
}`;

const TRIE_SEARCH_CPP = `// Trie Word Search - O(L) Time
bool search(const std::string& word) {
    TrieNode* curr = root;
    for (char c : word) {
        int idx = c - 'a';
        if (!curr->children[idx]) return false; // Missing branch
        curr = curr->children[idx];
    }
    return curr->isEndOfWord; // Must be complete word
}`;

const TRIE_PREFIX_CPP = `// Trie Prefix Match & Autocomplete - O(P) Time
bool startsWith(const std::string& prefix) {
    TrieNode* curr = root;
    for (char c : prefix) {
        int idx = c - 'a';
        if (!curr->children[idx]) return false;
        curr = curr->children[idx];
    }
    return true; // Prefix path exists
}

void collectWords(TrieNode* node, string prefix, vector<string>& results) {
    if (node->isEndOfWord) results.push_back(prefix);
    for (int i = 0; i < 26; ++i) {
        if (node->children[i]) {
            collectWords(node->children[i], prefix + char('a' + i), results);
        }
    }
}`;

export default function CodePanel() {
  const {
    selectedTopic,
    steps,
    currentStepIndex,
    treeSteps,
    currentTreeStepIndex,
    graphSteps,
    currentGraphStepIndex,
    graphAlgorithm,
    linkedListSteps,
    currentLinkedListStepIndex,
    stackQueueSteps,
    currentStackQueueStepIndex,
    stackQueueMode,
    dynamicArraySteps,
    currentDynamicArrayStepIndex,
    heapSteps,
    currentHeapStepIndex,
    hashTableSteps,
    currentHashTableStepIndex,
    hashStrategy,
    trieSteps,
    currentTrieStepIndex,
    avlSteps,
    currentAvlStepIndex,
    dsuSteps,
    currentDsuStepIndex,
  } = useVisualizerStore();

  const isAvl = selectedTopic === "avltree";
  const isDisjointSet = selectedTopic === "disjointset";
  const isTrie = selectedTopic === "trie";
  const isHashTable = selectedTopic === "hashtable";
  const isHeap = selectedTopic === "heap";
  const isArray = selectedTopic === "array";
  const isTree = selectedTopic === "bst";
  const isGraph = selectedTopic === "graph";
  const isLinkedList = selectedTopic === "linkedlist";
  const isStackQueue = selectedTopic === "stackqueue";
  const algorithm = ALGORITHMS[selectedTopic];

  const activeStep = isAvl
    ? avlSteps[currentAvlStepIndex]
    : isDisjointSet
    ? dsuSteps[currentDsuStepIndex]
    : isTrie
    ? trieSteps[currentTrieStepIndex]
    : isHashTable
    ? hashTableSteps[currentHashTableStepIndex]
    : isHeap
    ? heapSteps[currentHeapStepIndex]
    : isArray
    ? dynamicArraySteps[currentDynamicArrayStepIndex]
    : isStackQueue
    ? stackQueueSteps[currentStackQueueStepIndex]
    : isLinkedList
    ? linkedListSteps[currentLinkedListStepIndex]
    : isGraph
    ? graphSteps[currentGraphStepIndex]
    : isTree
    ? treeSteps[currentTreeStepIndex]
    : steps[currentStepIndex];

  const activeLine = activeStep?.codeLine ?? 0;
  const inlineVars = activeStep?.inlineVariables ?? {};

  const [copied, setCopied] = useState(false);

  const displayCode = React.useMemo(() => {
    if (isTrie) {
      const op = (activeStep as any)?.operation;
      if (op === "search") return TRIE_SEARCH_CPP;
      if (op === "startsWith" || op === "autocomplete") return TRIE_PREFIX_CPP;
      return TRIE_INSERT_CPP;
    }
    if (isHashTable) {
      const op = (activeStep as any)?.operation;
      if (op === "rehash") return HASH_REHASH_CPP;
      return hashStrategy === "chaining" ? HASH_CHAINING_CPP : HASH_PROBING_CPP;
    }
    if (isHeap) {
      const op = (activeStep as any)?.operation;
      if (op === "extract" || op === "sift_down") return HEAP_EXTRACT_CPP;
      if (op === "heapify") return HEAP_HEAPIFY_CPP;
      return HEAP_INSERT_CPP;
    }
    if (isArray) {
      const op = (activeStep as any)?.operation;
      if (op === "pop_back") return DYNAMIC_ARRAY_POP_BACK_CPP;
      if (op === "insert_at") return DYNAMIC_ARRAY_INSERT_CPP;
      if (op === "access") return DYNAMIC_ARRAY_ACCESS_CPP;
      return DYNAMIC_ARRAY_PUSH_BACK_CPP;
    }
    if (isGraph) {
      if (graphAlgorithm === "bfs") return BFS_CPP_CODE;
      if (graphAlgorithm === "dfs") return DFS_CPP_CODE;
    }
    if (isLinkedList) {
      const op = (activeStep as any)?.operation;
      if (op === "reverse") return LINKED_LIST_REVERSE_CPP;
      if (op === "delete") return LINKED_LIST_DELETE_CPP;
      return LINKED_LIST_INSERT_CPP;
    }
    if (isStackQueue) {
      return stackQueueMode === "stack" ? STACK_CPP_CODE : QUEUE_CPP_CODE;
    }
    return algorithm?.cppCode || "";
  }, [isTrie, isHashTable, hashStrategy, isHeap, isArray, isGraph, graphAlgorithm, isLinkedList, isStackQueue, stackQueueMode, activeStep, algorithm]);

  const handleCopy = () => {
    if (!displayCode) return;
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const codeLines = displayCode.split("\n");

  return (
    <div className="flex flex-col h-full text-xs bg-[var(--bg-surface)]">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-y border-[var(--border-color)] bg-[var(--bg-raised)]">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-secondary)]">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>C++ Engine Trace</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] transition-colors text-[10px]"
          title="Copy C++ implementation"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Code Lines with Synced Execution Highlight & Inline Variables */}
      <div className="flex-1 p-2.5 overflow-y-auto font-mono text-[11px] leading-relaxed">
        {codeLines.map((line, idx) => {
          const lineNum = idx + 1;
          const isCurrent = lineNum === activeLine;

          return (
            <div key={lineNum} className="flex flex-col">
              <div
                className={`flex items-start px-1.5 py-0.5 rounded transition-colors ${
                  isCurrent
                    ? "bg-amber-500/15 border-l-2 border-amber-500 text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]"
                }`}
              >
                <span className="w-6 select-none text-[var(--text-muted)] text-right pr-2 text-[10px]">
                  {lineNum}
                </span>
                <span className="whitespace-pre flex-1">{line}</span>
              </div>

              {/* Inline variable values display */}
              {isCurrent && Object.keys(inlineVars).length > 0 && (
                <div className="ml-8 my-1 p-1 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] flex flex-wrap items-center gap-2 text-[10px] text-[var(--text-primary)]">
                  <span className="text-[var(--text-muted)] font-semibold">Live Scope:</span>
                  {Object.entries(inlineVars).map(([key, val]) => (
                    <span
                      key={key}
                      className="px-1.5 py-0.2 rounded bg-[var(--bg-surface)] border border-[var(--border-strong)] font-mono"
                    >
                      <span className="text-[var(--accent)]">{key}</span> ={" "}
                      <span className="font-bold">{String(val)}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
