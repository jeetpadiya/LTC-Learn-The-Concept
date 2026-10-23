"use client";

import React, { useState, useMemo } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import {
  X,
  Search,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  BookOpen,
  Filter,
} from "lucide-react";

export interface DsaMatrixItem {
  id: string;
  name: string;
  category: "Sorting" | "Linear Buffers" | "Trees" | "Hashing & Tries" | "Graphs";
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  spaceAux: string;
  stable: boolean | "N/A";
  inPlace: boolean | "N/A";
  cacheLocality: "Excellent" | "High" | "Moderate" | "Poor";
  productionUseCase: string;
  interviewPatterns: string[];
  recommendedLeetCode: Array<{ id: number; title: string }>;
  keyInvariant: string;
  interviewTrap: string;
}

export const DSA_MATRIX_DATA: DsaMatrixItem[] = [
  {
    id: "bubble",
    name: "Bubble Sort",
    category: "Sorting",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    spaceAux: "O(1)",
    stable: true,
    inPlace: true,
    cacheLocality: "High",
    productionUseCase: "Educational baseline; early exit on nearly-sorted data with 0 swaps.",
    interviewPatterns: ["Two Pointers", "Adjacent Swaps", "Inversion Counting"],
    recommendedLeetCode: [
      { id: 283, title: "Move Zeroes" },
      { id: 75, title: "Sort Colors" },
    ],
    keyInvariant: "After pass p, the last p elements are permanently locked in sorted order.",
    interviewTrap: "Without an early-exit swapped boolean flag, best case degrades to O(n²).",
  },
  {
    id: "selection",
    name: "Selection Sort",
    category: "Sorting",
    timeBest: "O(n²)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    spaceAux: "O(1)",
    stable: false,
    inPlace: true,
    cacheLocality: "High",
    productionUseCase: "Flash/EEPROM memories where write operations wear out the hardware; strictly ≤ n swaps.",
    interviewPatterns: ["Extremum Selection", "Min/Max Boundary Partitioning"],
    recommendedLeetCode: [
      { id: 215, title: "Kth Largest Element (Selection variant)" },
      { id: 912, title: "Sort an Array" },
    ],
    keyInvariant: "Subarray [0..i-1] contains the smallest i elements of the array in sorted order.",
    interviewTrap: "Not stable: swapping min with boundary element can jump equal elements across long distances.",
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    category: "Sorting",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    spaceAux: "O(1)",
    stable: true,
    inPlace: true,
    cacheLocality: "High",
    productionUseCase: "Base case in hybrid sort engines (Timsort, std::sort Introsort for n ≤ 16) and online streams.",
    interviewPatterns: ["Online Stream Sorting", "Sublist Shifting"],
    recommendedLeetCode: [
      { id: 147, title: "Insertion Sort List" },
      { id: 75, title: "Sort Colors" },
    ],
    keyInvariant: "Prefix [0..i-1] is sorted at start of iteration i; item i is shifted into its correct place.",
    interviewTrap: "Reverse-sorted input forces worst-case n(n-1)/2 comparisons and element shifts.",
  },
  {
    id: "merge",
    name: "Merge Sort",
    category: "Sorting",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    spaceAux: "O(n)",
    stable: true,
    inPlace: false,
    cacheLocality: "Moderate",
    productionUseCase: "External file sorting (magnetic tape/disk), linked list sorting (std::list::sort).",
    interviewPatterns: ["Divide & Conquer", "Two-Way Merge", "Inversion Counting"],
    recommendedLeetCode: [
      { id: 148, title: "Sort List" },
      { id: 88, title: "Merge Sorted Array" },
      { id: 315, title: "Count of Smaller Numbers After Self" },
    ],
    keyInvariant: "Subarrays [L..M] and [M+1..R] are sorted before merge; stability preserved by favoring left on tie.",
    interviewTrap: "Requires O(n) auxiliary buffer allocation; cannot sort arrays strictly in-place with O(1) space.",
  },
  {
    id: "quick",
    name: "Quick Sort",
    category: "Sorting",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n²)",
    spaceAux: "O(log n)",
    stable: false,
    inPlace: true,
    cacheLocality: "Excellent",
    productionUseCase: "C++ std::sort (Introsort), general-purpose high-performance in-memory sorting.",
    interviewPatterns: ["Lomuto / Hoare Partition", "Quickselect O(n)", "3-Way Dutch Flag"],
    recommendedLeetCode: [
      { id: 215, title: "Kth Largest Element in an Array (Quickselect)" },
      { id: 75, title: "Sort Colors (3-Way Partition)" },
      { id: 912, title: "Sort an Array" },
    ],
    keyInvariant: "All elements left of pivot ≤ pivot, all elements right of pivot ≥ pivot; pivot position is permanent.",
    interviewTrap: "Degrades to O(n²) on sorted or duplicate-heavy inputs unless median-of-three or randomized pivot is used.",
  },
  {
    id: "heapsort",
    name: "Heap Sort",
    category: "Sorting",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    spaceAux: "O(1)",
    stable: false,
    inPlace: true,
    cacheLocality: "Poor",
    productionUseCase: "Real-time safety-critical systems requiring guaranteed O(n log n) with strictly O(1) memory overhead.",
    interviewPatterns: ["Max-Heap Sift-Down", "Priority Queue", "Top-K Suffix Extraction"],
    recommendedLeetCode: [
      { id: 215, title: "Kth Largest Element" },
      { id: 912, title: "Sort an Array" },
    ],
    keyInvariant: "Max-heap property holds for active heap [0..i]; extracted root locks into permanent sorted suffix [i..n-1].",
    interviewTrap: "Child lookups 2i+1 and 2i+2 skip cache lines, making it slower in practice than Quick Sort despite O(n log n) bound.",
  },
  {
    id: "radix",
    name: "Radix Sort (LSD)",
    category: "Sorting",
    timeBest: "O(d · (n + k))",
    timeAvg: "O(d · (n + k))",
    timeWorst: "O(d · (n + k))",
    spaceAux: "O(n + k)",
    stable: true,
    inPlace: false,
    cacheLocality: "Moderate",
    productionUseCase: "Fixed-width integer keys, IP network routing tables, suffix array construction.",
    interviewPatterns: ["Non-Comparative Sorting", "Counting Sort Subroutine", "Digit Bucketing"],
    recommendedLeetCode: [
      { id: 164, title: "Maximum Gap" },
      { id: 75, title: "Sort Colors" },
    ],
    keyInvariant: "After pass d, the entire array is stably sorted with respect to the least significant d digits.",
    interviewTrap: "Subroutine MUST be stable (e.g. Counting Sort) or higher-digit passes destroy lower-digit ordering.",
  },
  {
    id: "array",
    name: "Array & Dynamic Array",
    category: "Linear Buffers",
    timeBest: "O(1) Access",
    timeAvg: "Amortized O(1) Push",
    timeWorst: "O(n) Insert/Resize",
    spaceAux: "O(n) (Capacity C)",
    stable: "N/A",
    inPlace: true,
    cacheLocality: "Excellent",
    productionUseCase: "Default linear storage in modern systems (std::vector, Python list, Java ArrayList).",
    interviewPatterns: ["Two Pointers", "Sliding Window", "Prefix Sums", "Kadane's Algorithm"],
    recommendedLeetCode: [
      { id: 1, title: "Two Sum" },
      { id: 53, title: "Maximum Subarray" },
      { id: 15, title: "3Sum" },
      { id: 26, title: "Remove Duplicates" },
    ],
    keyInvariant: "Contiguous address offset: address(i) = base + i * sizeof(T); 2× geometric doubling bounds total resizing work.",
    interviewTrap: "Buffer reallocation copies all elements to a new heap block, invalidating all outstanding pointers and iterators.",
  },
  {
    id: "linkedlist",
    name: "Singly & Doubly Linked List",
    category: "Linear Buffers",
    timeBest: "O(1) Head/Tail",
    timeAvg: "O(n) Search/Access",
    timeWorst: "O(n) Search/Access",
    spaceAux: "O(n) (Node Pointers)",
    stable: "N/A",
    inPlace: true,
    cacheLocality: "Poor",
    productionUseCase: "LRU Cache (std::list + hash map), memory allocators (free lists), blockchain blocks.",
    interviewPatterns: ["Fast & Slow Pointers (Tortoise/Hare)", "Pointer Inversion", "Dummy Sentinel Head"],
    recommendedLeetCode: [
      { id: 141, title: "Linked List Cycle" },
      { id: 206, title: "Reverse Linked List" },
      { id: 146, title: "LRU Cache" },
      { id: 23, title: "Merge k Sorted Lists" },
    ],
    keyInvariant: "Nodes connected by explicit forward/backward pointers; splice/insert in O(1) without shifting neighbor elements.",
    interviewTrap: "Severe CPU cache misses due to scattered heap node allocations; loss of random O(1) index access.",
  },
  {
    id: "stackqueue",
    name: "Stack & Queue (LIFO/FIFO)",
    category: "Linear Buffers",
    timeBest: "O(1) Push/Enqueue",
    timeAvg: "O(1) Pop/Dequeue",
    timeWorst: "O(1) Peek",
    spaceAux: "O(n)",
    stable: "N/A",
    inPlace: true,
    cacheLocality: "High",
    productionUseCase: "Call stacks, syntax parsers, undo/redo history, BFS frontier queues, thread pool work scheduling.",
    interviewPatterns: ["Monotonic Stack", "Monotonic Queue", "BFS Level-Order", "Parenthesis Matching"],
    recommendedLeetCode: [
      { id: 20, title: "Valid Parentheses" },
      { id: 739, title: "Daily Temperatures" },
      { id: 84, title: "Largest Rectangle in Histogram" },
      { id: 239, title: "Sliding Window Maximum" },
    ],
    keyInvariant: "LIFO: Last inserted element is first to exit. FIFO: First inserted element is first to exit.",
    interviewTrap: "Unbounded recursion causing hardware stack overflow; ring-buffer queue off-by-one modulo wrap-around.",
  },
  {
    id: "bst",
    name: "Binary Search Tree (BST)",
    category: "Trees",
    timeBest: "O(log n)",
    timeAvg: "O(log n)",
    timeWorst: "O(n) (Degenerate)",
    spaceAux: "O(h) Recursion",
    stable: "N/A",
    inPlace: false,
    cacheLocality: "Poor",
    productionUseCase: "Self-balancing variants (AVL / Red-Black) power std::set, std::map, Linux CFS kernel scheduler.",
    interviewPatterns: ["Inorder Traversal (Sorted)", "LCA (Lowest Common Ancestor)", "Tree Validation", "Successor Search"],
    recommendedLeetCode: [
      { id: 98, title: "Validate Binary Search Tree" },
      { id: 235, title: "Lowest Common Ancestor of a BST" },
      { id: 450, title: "Delete Node in a BST" },
      { id: 230, title: "Kth Smallest Element in a BST" },
    ],
    keyInvariant: "For every node X: LeftSubtree(X) < X.val < RightSubtree(X); inorder traversal yields strictly sorted keys.",
    interviewTrap: "Sequential sorted insertions degrade BST into an O(n) linked list unless self-balancing rotations are enforced.",
  },
  {
    id: "heap",
    name: "Binary Heap & Priority Queue",
    category: "Trees",
    timeBest: "O(1) Peek",
    timeAvg: "O(log n) Push/Pop",
    timeWorst: "O(n) Heapify",
    spaceAux: "O(n) (Array Map)",
    stable: false,
    inPlace: true,
    cacheLocality: "High",
    productionUseCase: "Dijkstra's shortest path, Prim's MST, Huffman coding, OS process priority schedulers.",
    interviewPatterns: ["Top-K Elements", "Merge K-Way", "Two Heaps (Running Median)", "Greedy Interval Scheduling"],
    recommendedLeetCode: [
      { id: 295, title: "Find Median from Data Stream" },
      { id: 347, title: "Top K Frequent Elements" },
      { id: 23, title: "Merge k Sorted Lists" },
      { id: 621, title: "Task Scheduler" },
    ],
    keyInvariant: "Parent node at index i satisfies arr[i] ≤ children (Min-Heap) with zero pointer overhead via 2i+1, 2i+2 array mapping.",
    interviewTrap: "Building a heap bottom-up takes O(n) time, whereas inserting n items one-by-one costs O(n log n).",
  },
  {
    id: "hashtable",
    name: "Hash Table & Collisions",
    category: "Hashing & Tries",
    timeBest: "O(1) Lookup",
    timeAvg: "O(1) Insert/Delete",
    timeWorst: "O(n) Collisions",
    spaceAux: "O(n) (Load Factor α)",
    stable: "N/A",
    inPlace: false,
    cacheLocality: "High",
    productionUseCase: "Database index lookups, Redis key-value store, Python dictionaries, compiler symbol tables.",
    interviewPatterns: ["Complement Lookup (Two Sum)", "Frequency Map", "Prefix Sum + Hash Map", "Anagram Grouping"],
    recommendedLeetCode: [
      { id: 1, title: "Two Sum" },
      { id: 49, title: "Group Anagrams" },
      { id: 560, title: "Subarray Sum Equals K" },
      { id: 128, title: "Longest Consecutive Sequence" },
    ],
    keyInvariant: "Key mapped via h(k) mod M; dynamic 2× rehashing triggers when load factor α ≥ 0.75 to preserve O(1) bounds.",
    interviewTrap: "Open addressing deletions require a Tombstone marker ([DEL]) so probe chains for subsequent keys are not broken.",
  },
  {
    id: "trie",
    name: "Trie (Prefix Tree)",
    category: "Hashing & Tries",
    timeBest: "O(L) Word Search",
    timeAvg: "O(L) Prefix Match",
    timeWorst: "O(L) Insert",
    spaceAux: "O(Σ · L · N)",
    stable: "N/A",
    inPlace: false,
    cacheLocality: "Moderate",
    productionUseCase: "Search engine autocomplete queries, IP router longest prefix match, spell-checking engines, T9 text.",
    interviewPatterns: ["Prefix Matching", "DFS Autocomplete Traversal", "Bitwise Trie (Max XOR)", "Word Search Grid"],
    recommendedLeetCode: [
      { id: 208, title: "Implement Trie (Prefix Tree)" },
      { id: 211, title: "Design Add and Search Words" },
      { id: 212, title: "Word Search II" },
      { id: 421, title: "Maximum XOR of Two Numbers in an Array" },
    ],
    keyInvariant: "Nodes share common prefixes; isEndOfWord flag marks complete words while allowing outgoing branch extensions.",
    interviewTrap: "High memory overhead for large alphabets; word deletion requires bottom-up backtracking to prune empty branches.",
  },
  {
    id: "graph",
    name: "Graph (BFS, DFS, Dijkstra)",
    category: "Graphs",
    timeBest: "O(V + E) BFS/DFS",
    timeAvg: "O((V + E) log V)",
    timeWorst: "O(V²)",
    spaceAux: "O(V + E) Adj List",
    stable: "N/A",
    inPlace: false,
    cacheLocality: "Moderate",
    productionUseCase: "Google Maps route planning, social network connection graph, Git commit DAGs, build dependency graphs.",
    interviewPatterns: ["Shortest Path", "Connected Components", "Topological Sort", "Cycle Detection", "Bipartite Graph"],
    recommendedLeetCode: [
      { id: 200, title: "Number of Islands" },
      { id: 743, title: "Network Delay Time" },
      { id: 207, title: "Course Schedule" },
      { id: 785, title: "Is Graph Bipartite?" },
    ],
    keyInvariant: "BFS explores layer by layer (FIFO). DFS explores deepest paths (LIFO). Dijkstra greedily settles closest vertices.",
    interviewTrap: "Dijkstra produces incorrect shortest paths on graphs with negative edge weights (requires Bellman-Ford).",
  },
];

export default function DsaMatrixModal() {
  const { isCheatSheetOpen, closeCheatSheet, setTopic } = useVisualizerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = ["All", "Sorting", "Linear Buffers", "Trees", "Hashing & Tries", "Graphs"];

  const filteredItems = useMemo(() => {
    return DSA_MATRIX_DATA.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.timeAvg.toLowerCase().includes(q) ||
        item.spaceAux.toLowerCase().includes(q) ||
        item.productionUseCase.toLowerCase().includes(q) ||
        item.interviewPatterns.some((p) => p.toLowerCase().includes(q)) ||
        item.recommendedLeetCode.some((lc) => lc.title.toLowerCase().includes(q) || String(lc.id).includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const copyAsMarkdown = () => {
    let md = "| Algorithm / Data Structure | Category | Time (Best) | Time (Avg) | Time (Worst) | Space | Stable | In-Place | Cache Locality |\n";
    md += "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n";
    for (const item of filteredItems) {
      md += `| **${item.name}** | ${item.category} | \`${item.timeBest}\` | \`${item.timeAvg}\` | \`${item.timeWorst}\` | \`${item.spaceAux}\` | ${item.stable === true ? "Yes" : item.stable === false ? "No" : "N/A"} | ${item.inPlace === true ? "Yes" : item.inPlace === false ? "No" : "N/A"} | ${item.cacheLocality} |\n`;
    }

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSelectTopic = (topicId: string) => {
    setTopic(topicId);
    closeCheatSheet();
  };

  if (!isCheatSheetOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-color)] bg-[var(--bg-raised)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[var(--accent)] text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  DSA Mastery & Interview Cheat Sheet
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30">
                  15 Topics
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Big-O asymptotic bounds, cache locality, invariants & LeetCode patterns for all algorithms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyAsMarkdown}
              className="px-3 py-1.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
              title="Copy table formatted as Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
              <span>{copied ? "Copied Markdown!" : "Copy Table"}</span>
            </button>

            <button
              onClick={closeCheatSheet}
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-colors"
              title="Close Cheat Sheet"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Category Filter */}
        <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by algorithm, Big-O (e.g. O(n log n)), pattern (Two Pointers)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[var(--bg-raised)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {categories.map((cat) => {
              const count = cat === "All" ? DSA_MATRIX_DATA.length : DSA_MATRIX_DATA.filter((d) => d.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                    isSelected
                      ? "bg-[var(--accent)] text-white font-semibold shadow-2xs"
                      : "bg-[var(--bg-raised)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-[var(--bg-raised)] border-b border-[var(--border-color)] z-10 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Topic / Algorithm</th>
                <th className="py-2.5 px-3">Best Time</th>
                <th className="py-2.5 px-3">Average Time</th>
                <th className="py-2.5 px-3">Worst Time</th>
                <th className="py-2.5 px-3">Aux Space</th>
                <th className="py-2.5 px-3">Stable</th>
                <th className="py-2.5 px-3">In-Place</th>
                <th className="py-2.5 px-3">Cache Locality</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] font-mono text-[11px]">
              {filteredItems.map((item) => {
                const isExpanded = expandedRow === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <tr
                      onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                      className={`cursor-pointer transition-colors ${
                        isExpanded ? "bg-[var(--bg-raised)] font-medium" : "hover:bg-[var(--bg-raised)]/60"
                      }`}
                    >
                      {/* Name & Category */}
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-xs text-[var(--text-primary)]">{item.name}</span>
                            <span className="text-[10px] text-[var(--text-muted)] font-normal">{item.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Best */}
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-semibold text-[10.5px]">
                          {item.timeBest}
                        </span>
                      </td>

                      {/* Average */}
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 font-semibold text-[10.5px]">
                          {item.timeAvg}
                        </span>
                      </td>

                      {/* Worst */}
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 font-semibold text-[10.5px]">
                          {item.timeWorst}
                        </span>
                      </td>

                      {/* Space */}
                      <td className="py-3 px-3 text-[var(--text-secondary)]">{item.spaceAux}</td>

                      {/* Stable */}
                      <td className="py-3 px-3 font-sans">
                        {item.stable === true ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Yes</span>
                        ) : item.stable === false ? (
                          <span className="text-[var(--text-muted)]">No</span>
                        ) : (
                          <span className="text-[var(--text-muted)] opacity-60">—</span>
                        )}
                      </td>

                      {/* In-Place */}
                      <td className="py-3 px-3 font-sans">
                        {item.inPlace === true ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Yes</span>
                        ) : item.inPlace === false ? (
                          <span className="text-[var(--text-muted)]">No</span>
                        ) : (
                          <span className="text-[var(--text-muted)] opacity-60">—</span>
                        )}
                      </td>

                      {/* Cache Locality */}
                      <td className="py-3 px-3 font-sans">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            item.cacheLocality === "Excellent"
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                              : item.cacheLocality === "High"
                              ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800"
                              : item.cacheLocality === "Moderate"
                              ? "bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] border border-[var(--border-color)]"
                              : "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800"
                          }`}
                        >
                          {item.cacheLocality}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right font-sans" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectTopic(item.id)}
                          className="px-2.5 py-1 rounded bg-[var(--accent)] text-white text-[11px] font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-1"
                          title={`Open ${item.name} in interactive visualizer`}
                        >
                          <span>Visualize</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Detail Drawer */}
                    {isExpanded && (
                      <tr className="bg-[var(--bg-surface)]">
                        <td colSpan={9} className="p-4 border-y border-[var(--border-color)] font-sans">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                            {/* Panel 1: Key Invariant */}
                            <div className="p-3 rounded-md bg-[var(--bg-raised)] border border-[var(--border-color)] flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5 font-bold text-[11px] text-[var(--text-primary)]">
                                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                                <span>Core Invariant:</span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                {item.keyInvariant}
                              </p>
                            </div>

                            {/* Panel 2: Production Use Case */}
                            <div className="p-3 rounded-md bg-[var(--bg-raised)] border border-[var(--border-color)] flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5 font-bold text-[11px] text-[var(--text-primary)]">
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span>Where It's Used in Production:</span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                {item.productionUseCase}
                              </p>
                            </div>

                            {/* Panel 3: Common Interview Trap */}
                            <div className="p-3 rounded-md bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5 font-bold text-[11px] text-rose-700 dark:text-rose-400">
                                <span>⚠️ Interview Trap & Pitfall:</span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                {item.interviewTrap}
                              </p>
                            </div>

                            {/* Panel 4: Patterns & Recommended LeetCode */}
                            <div className="p-3 rounded-md bg-[var(--bg-raised)] border border-[var(--border-color)] flex flex-col gap-2">
                              <div>
                                <span className="font-bold text-[11px] text-[var(--text-primary)]">
                                  LeetCode Patterns:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.interviewPatterns.map((pat) => (
                                    <span
                                      key={pat}
                                      className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] font-mono"
                                    >
                                      {pat}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="font-bold text-[11px] text-[var(--text-primary)]">
                                  Top Interview Questions:
                                </span>
                                <div className="flex flex-col gap-1 mt-1 font-mono text-[11px]">
                                  {item.recommendedLeetCode.map((lc) => (
                                    <a
                                      key={lc.id}
                                      href={`https://leetcode.com/problems/${lc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[var(--accent)] hover:underline truncate flex items-center gap-1"
                                    >
                                      <span>LC #{lc.id}</span>
                                      <span className="font-sans font-medium text-[var(--text-secondary)] truncate">
                                        {lc.title}
                                      </span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-xs text-[var(--text-muted)] flex flex-col items-center gap-2">
              <Search className="w-6 h-6 opacity-40" />
              <span>No algorithms or patterns found matching "{searchTerm}".</span>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="mt-1 text-xs text-[var(--accent)] font-semibold underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--bg-raised)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <span>
              Showing <strong className="text-[var(--text-primary)]">{filteredItems.length}</strong> of{" "}
              {DSA_MATRIX_DATA.length} topics
            </span>
            <span className="hidden sm:inline">• Click any row to expand invariants, interview traps & LeetCode problems</span>
          </div>

          <button
            onClick={closeCheatSheet}
            className="px-3 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
