import { AlgorithmMeta, AlgorithmTraceStep, ArrayPreset } from "@/types/visualizer";

export const ALGORITHMS: Record<string, AlgorithmMeta> = {
  bubble: {
    id: "bubble",
    name: "Bubble Sort",
    category: "Sorting",
    summary:
      "Scans adjacent pairs from left to right, swapping out-of-order items. In each pass, the largest unsorted element bubbles up to its final rightmost position.",
    timeComplexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true,
    keyInvariants: [
      "After pass p, the last p elements are permanently sorted in their final positions.",
      "Adjacent inversions are resolved one by one until no adjacent pairs are inverted.",
      "If an entire pass performs zero swaps, the array is already sorted and halts early.",
    ],
    cppCode: `void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    quiz: [
      {
        id: "b1",
        question: "What is the worst-case comparison count for an array of length n?",
        options: ["n - 1", "n log n", "n(n - 1) / 2", "2^n"],
        correctIndex: 2,
        explanation: "When reverse sorted, the outer loop executes n-1 times and inner loop performs (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparisons.",
      },
      {
        id: "b2",
        question: "Why is Bubble Sort a stable algorithm?",
        options: [
          "It never swaps elements with identical values.",
          "It allocates extra memory to remember original order.",
          "It only runs on small arrays.",
          "It compares elements from right to left.",
        ],
        correctIndex: 0,
        explanation: "Because swaps only happen when arr[j] > arr[j+1] strictly, identical elements never pass each other.",
      },
      {
        id: "b3",
        question: "How does the optimized Bubble Sort achieve O(n) best-case time?",
        options: [
          "By using binary search.",
          "By tracking if any swap occurred in the first pass.",
          "By dividing the array in half.",
          "By jumping over every second item.",
        ],
        correctIndex: 1,
        explanation: "A boolean flag detects if 0 swaps occurred during the initial pass, triggering an immediate early return.",
      },
    ],
  },
  selection: {
    id: "selection",
    name: "Selection Sort",
    category: "Sorting",
    summary:
      "Divides array into sorted prefix and unsorted suffix. Scans unsorted suffix to locate the minimum element, then performs a single swap to place it at the sorted boundary.",
    timeComplexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
    stable: false,
    inPlace: true,
    keyInvariants: [
      "Prefix A[0...i-1] contains the smallest i elements in final sorted order.",
      "Guarantees at most n - 1 swaps total, minimizing write wear on memory.",
      "Comparisons are always n(n-1)/2 regardless of initial order.",
    ],
    cppCode: `void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        int minIdx = i;
        for (int j = i + 1; j < n; ++j) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            std::swap(arr[i], arr[minIdx]);
        }
    }
}`,
    quiz: [
      {
        id: "s1",
        question: "How many swaps does Selection Sort execute in the worst case?",
        options: ["O(n²)", "At most n - 1", "O(1)", "n log n"],
        correctIndex: 1,
        explanation: "Selection Sort only performs 1 swap per outer loop pass, so it never exceeds n - 1 swaps total.",
      },
      {
        id: "s2",
        question: "Why is standard Selection Sort unstable?",
        options: [
          "It uses too much recursion.",
          "A long-distance swap can jump a duplicate element behind an identical one.",
          "It only works with numbers.",
          "It does not use pointers.",
        ],
        correctIndex: 1,
        explanation: "Swapping the minimum element into index i can leapfrog over an identical element in between.",
      },
    ],
  },
  insertion: {
    id: "insertion",
    name: "Insertion Sort",
    category: "Sorting",
    summary:
      "Builds sorted array one element at a time by picking key item and shifting greater elements right to make room for insertion.",
    timeComplexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true,
    keyInvariants: [
      "Prefix A[0...i] is always sorted relative to itself at each step.",
      "Total number of shifts equals the exact number of inversions in the original input.",
      "Online algorithm: can sort a streaming input as items arrive.",
    ],
    cppCode: `void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    quiz: [
      {
        id: "i1",
        question: "When is Insertion Sort chosen in production systems?",
        options: [
          "For massive unordered datasets with millions of elements.",
          "When the array is already nearly sorted or small (n ≤ 16).",
          "When memory is unlimited.",
          "When worst-case time must be O(n log n).",
        ],
        correctIndex: 1,
        explanation: "Due to small constant factors and O(n) performance on near-sorted arrays, hybrid sorts like Timsort use Insertion Sort for small segments.",
      },
    ],
  },
  quick: {
    id: "quick",
    name: "Quick Sort",
    category: "Sorting",
    summary:
      "Selects a pivot element and partitions array into items smaller than pivot (left) and greater (right). Recursively repeats for each partition.",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(log n)",
    stable: false,
    inPlace: true,
    keyInvariants: [
      "After partitioning, the pivot element is in its permanent sorted location.",
      "All elements left of pivot are ≤ pivot; all elements right are ≥ pivot.",
      "Recursion tree depth is O(log n) on balanced partitions, requiring O(log n) stack memory.",
    ],
    cppCode: `int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; ++j) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    quiz: [
      {
        id: "q1",
        question: "What causes Quick Sort to degrade to O(n²) worst-case time?",
        options: [
          "Balanced median pivot selection.",
          "Repeatedly choosing the extreme minimum or maximum as pivot (unbalanced partitions).",
          "Using an even array size.",
          "Sorting floats instead of integers.",
        ],
        correctIndex: 1,
        explanation: "When partitions have size 0 and n-1, recursion depth degrades to n, taking n * n / 2 comparisons.",
      },
    ],
  },
  bst: {
    id: "bst",
    name: "Binary Search Tree (BST)",
    category: "Data Structures",
    summary:
      "A hierarchical node-based binary tree data structure. For every node, all values in its left subtree are strictly less, and all values in its right subtree are strictly greater.",
    timeComplexity: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(n)",
    },
    spaceComplexity: "O(h)",
    stable: true,
    inPlace: false,
    keyInvariants: [
      "For every node X, all values in LeftSubtree(X) < X.val < all values in RightSubtree(X).",
      "An inorder traversal of a BST yields all elements in strictly ascending sorted order.",
      "Operations take time proportional to the height of the tree (O(log n) when balanced, O(n) when degenerate).",
    ],
    cppCode: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val)
        root->left = insert(root->left, val);
    else if (val > root->val)
        root->right = insert(root->right, val);
    return root;
}

TreeNode* search(TreeNode* root, int val) {
    if (!root || root->val == val) return root;
    if (val < root->val)
        return search(root->left, val);
    return search(root->right, val);
}`,
    quiz: [
      {
        id: "bst1",
        question: "What traversal order on a Binary Search Tree produces values in strictly sorted order?",
        options: ["Preorder", "Inorder (Left-Root-Right)", "Postorder", "Level-order BFS"],
        correctIndex: 1,
        explanation: "By visiting Left Subtree (smaller), then Root (current), then Right Subtree (larger), Inorder traversal yields values in non-decreasing order.",
      },
      {
        id: "bst2",
        question: "When does search/insertion in a standard BST degrade to O(n) worst-case time?",
        options: [
          "When the tree has an even number of nodes.",
          "When elements are inserted in already-sorted or reverse-sorted order, creating a degenerate skewed line.",
          "When all values are prime numbers.",
          "When searching for the root element.",
        ],
        correctIndex: 1,
        explanation: "Inserting sorted elements (1, 2, 3, 4, 5...) results in a tree that looks like a linked list with height n.",
      },
    ],
  },
  graph: {
    id: "graph",
    name: "Graph: BFS, DFS, Dijkstra",
    category: "Data Structures",
    summary:
      "Non-linear network of vertices and edges. Supports layer-order BFS, deep branch DFS, and Dijkstra's single-source shortest path using edge relaxation.",
    timeComplexity: {
      best: "O(V + E)",
      average: "O((V + E) log V)",
      worst: "O((V + E) log V)",
    },
    spaceComplexity: "O(V + E)",
    stable: true,
    inPlace: false,
    keyInvariants: [
      "Dijkstra Greedy Invariant: The vertex with minimum tentative distance in the priority queue is permanently optimal and settled.",
      "Edge Relaxation: dist[v] is updated if and only if dist[u] + weight(u, v) < dist[v].",
      "BFS Frontier Invariant: Discovers vertices in strictly increasing order of unweighted hop distance.",
    ],
    cppCode: `// Dijkstra's Single-Source Shortest Path
void dijkstra(int start, int V, const vector<vector<pair<int,int>>>& adj) {
    vector<int> dist(V, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;

    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;

        for (const auto& [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}`,
    quiz: [
      {
        id: "g1",
        question: "Why can Dijkstra's algorithm fail on graphs with negative edge weights?",
        options: [
          "It causes an infinite loop in undirected graphs.",
          "The greedy choice assumption (a settled node's distance is optimal) is violated by future negative edge reductions.",
          "Priority queue cannot hold negative values.",
          "Graph becomes disconnected.",
        ],
        correctIndex: 1,
        explanation:
          "Once a vertex is settled, Dijkstra assumes its distance is final. A negative edge later could offer a shorter path, breaking this invariant (use Bellman-Ford instead).",
      },
      {
        id: "g2",
        question: "What data structure guarantees level-by-level frontier expansion in Breadth-First Search (BFS)?",
        options: ["Stack (LIFO)", "Queue (FIFO)", "Min-Heap", "Disjoint Set Union (DSU)"],
        correctIndex: 1,
        explanation:
          "A First-In-First-Out (FIFO) queue guarantees that all vertices at hop distance d are processed before any vertices at distance d+1.",
      },
    ],
  },
  linkedlist: {
    id: "linkedlist",
    name: "Singly & Doubly Linked List",
    category: "Data Structures",
    summary:
      "A linear data structure where elements are not stored at contiguous memory locations. Instead, each element contains a data field and one or two pointers linking to neighboring nodes.",
    timeComplexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
    },
    spaceComplexity: "O(n)",
    stable: true,
    inPlace: true,
    keyInvariants: [
      "Head Invariant: The head pointer must always point to the first valid node, or nullptr if the list is empty.",
      "Pointer Preservation: Always cache `next = curr->next` before modifying `curr->next` to avoid dropping the downstream chain.",
      "Doubly Consistency: If node X->next == Y, then Y->prev must strictly equal X.",
    ],
    cppCode: `// Singly Linked List Structure & Operations
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Insert at Head - O(1) Time, O(1) Space
ListNode* insertHead(ListNode* head, int val) {
    ListNode* newNode = new ListNode(val);
    newNode->next = head;
    return newNode;
}

// In-Place List Reversal - O(n) Time, O(1) Space
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
}`,
    quiz: [
      {
        id: "ll1",
        question: "What is the time complexity to insert a new node at the HEAD of a linked list compared to a dynamic array?",
        options: [
          "O(1) for linked list vs O(n) for array (due to shifting all n elements)",
          "O(n) for linked list vs O(1) for array",
          "O(log n) for linked list",
          "O(1) for both",
        ],
        correctIndex: 0,
        explanation:
          "In a linked list, inserting at head only rewires two pointers in O(1) time. An array requires shifting all n existing elements right by one position.",
      },
      {
        id: "ll2",
        question: "What fatal bug occurs if you reassign `curr->next = prev;` before saving `next = curr->next;`?",
        options: [
          "You permanently drop the pointer to the rest of the list, leaking memory and cutting traversal short.",
          "The list automatically becomes circular.",
          "Segmentation fault on assignment.",
          "Stack overflow.",
        ],
        correctIndex: 0,
        explanation:
          "Overwriting curr->next destroys the only pointer to the downstream chain. Always cache `next = curr->next` first.",
      },
    ],
  },
  stackqueue: {
    id: "stackqueue",
    name: "Stack & Queue (LIFO & FIFO)",
    category: "Data Structures",
    summary:
      "Linear memory buffer abstract data types. Stack enforces Last-In First-Out (LIFO) access at TOP. Queue enforces First-In First-Out (FIFO) access through enqueue at REAR and dequeue at FRONT.",
    timeComplexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
    },
    spaceComplexity: "O(n)",
    stable: true,
    inPlace: true,
    keyInvariants: [
      "LIFO Invariant (Stack): The element most recently pushed is always the first one popped.",
      "FIFO Invariant (Queue): The element waiting the longest in the buffer is always the first one served.",
      "Buffer Integrity: Operations are strictly O(1) time complexity with guarded Underflow and Overflow checks.",
    ],
    cppCode: `// C++ STL Stack & Queue Operations
#include <stack>
#include <queue>

// 1. Stack Operations (LIFO)
void stackDemo() {
    std::stack<int> s;
    s.push(10);           // O(1) Push onto TOP
    s.push(20);
    int topVal = s.top(); // O(1) Peek TOP (20)
    s.pop();              // O(1) Pop TOP (removes 20)
}

// 2. Queue Operations (FIFO)
void queueDemo() {
    std::queue<int> q;
    q.push(10);             // O(1) Enqueue at REAR
    q.push(20);
    int frontVal = q.front(); // O(1) Peek FRONT (10)
    q.pop();                // O(1) Dequeue FRONT (removes 10)
}`,
    quiz: [
      {
        id: "sq1",
        question: "Which computer system component relies directly on a Stack (LIFO) discipline?",
        options: [
          "Function call execution stack and Undo/Redo history",
          "CPU round-robin process scheduling",
          "Network packet buffer in a router",
          "Printer document print queue",
        ],
        correctIndex: 0,
        explanation:
          "When a function calls another function, the return address and local variables are pushed onto the call stack. When it returns, the stack pops the topmost frame (LIFO).",
      },
      {
        id: "sq2",
        question: "What occurs when an application attempts to pop or dequeue from an empty data structure?",
        options: [
          "Underflow error / exception",
          "Overflow error",
          "Buffer automatically wraps around to index 0",
          "Memory leak",
        ],
        correctIndex: 0,
        explanation:
          "Popping from an empty stack or queue is a classic Underflow condition. In production code, always check `!empty()` first.",
      },
    ],
  },
  array: {
    id: "array",
    name: "Array & Dynamic Array",
    category: "Data Structures",
    summary:
      "Contiguous block of memory supporting O(1) random access by index. Dynamic arrays automatically double capacity (2×) upon filling, yielding amortized O(1) push_back operations.",
    timeComplexity: {
      best: "O(1)",
      average: "Amortized O(1)",
      worst: "O(n)",
    },
    spaceComplexity: "O(n)",
    stable: true,
    inPlace: true,
    keyInvariants: [
      "Contiguous Memory: Elements reside sequentially in heap memory; address = base + index * sizeof(T).",
      "Geometric Doubling (2×): Doubling capacity upon resize guarantees that n insertions require O(n) total work -> Amortized O(1).",
      "Linear Shifting: Insertion or deletion at index k shifts all (n - k) subsequent elements.",
    ],
    cppCode: `// C++ Dynamic Array (std::vector) Operations
#include <vector>

void vectorOperations() {
    std::vector<int> arr = {10, 20, 30};

    // 1. O(1) Random Access via direct pointer offset
    int val = arr[1]; // 20

    // 2. Amortized O(1) Push Back (doubles capacity when full)
    arr.push_back(40);

    // 3. O(n) Insert at Index (shifts elements to the right)
    arr.insert(arr.begin() + 1, 15);

    // 4. O(1) Pop Back
    arr.pop_back();
}`,
    quiz: [
      {
        id: "arr1",
        question: "Why do dynamic arrays double their capacity (2×) upon resizing instead of incrementing by a constant amount (e.g. +10 elements)?",
        options: [
          "Geometric doubling ensures amortized O(1) insertion time, whereas constant increments degrade to worst-case O(n²) total work for n insertions.",
          "Computer hardware only permits power-of-two memory allocations.",
          "It reduces CPU cache misses by 50%.",
          "It minimizes memory footprint.",
        ],
        correctIndex: 0,
        explanation:
          "Incrementing capacity by a constant requires reallocating and copying every few insertions, totaling O(n²) work. Doubling does only log₂(n) resizes totaling 2n work -> Amortized O(1) per append.",
      },
      {
        id: "arr2",
        question: "Why does an array support strictly O(1) random access for any valid index k?",
        options: [
          "Memory is contiguous, allowing instant address computation: base + k * sizeof(T).",
          "An array uses an internal hash table index.",
          "Because arrays only store integers.",
          "Only the first and last elements are O(1).",
        ],
        correctIndex: 0,
        explanation:
          "Because memory slots are contiguous and uniform in size, any index can be reached with a single multiplication and addition without traversal.",
      },
    ],
  },
  heap: {
    id: "heap",
    name: "Binary Heap & Priority Queue",
    category: "Data Structures",
    summary:
      "Complete binary tree stored in contiguous array without pointer overhead (left=2i+1, right=2i+2). Supports O(log n) insert and extract, O(1) peek, and O(n) bottom-up heap construction.",
    timeComplexity: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
    },
    spaceComplexity: "O(n)",
    stable: false,
    inPlace: true,
    keyInvariants: [
      "Complete Binary Tree: Every level is filled except possibly the last (left-to-right). Indexed as left=2i+1, right=2i+2, parent=⌊(i-1)/2⌋.",
      "Heap Order Property: For all i > 0, Min-Heap enforces A[parent(i)] ≤ A[i], whereas Max-Heap enforces A[parent(i)] ≥ A[i].",
      "Linear Heapify: Converting an arbitrary n-element array into a heap bottom-up takes strictly O(n) time, outperforming n sequential insertions (O(n log n)).",
    ],
    cppCode: `// C++ Binary Min-Heap (Priority Queue)
#include <vector>
#include <algorithm>

class MinHeap {
    std::vector<int> heap;
public:
    void push(int val) {
        heap.push_back(val);
        int i = heap.size() - 1;
        // Sift-Up: restore heap property towards root
        while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
            std::swap(heap[(i - 1) / 2], heap[i]);
            i = (i - 1) / 2;
        }
    }

    int pop() {
        if (heap.empty()) return -1;
        int root = heap.front();
        heap[0] = heap.back();
        heap.pop_back();
        // Sift-Down: restore heap property towards leaves
        int i = 0, n = heap.size();
        while (2 * i + 1 < n) {
            int left = 2 * i + 1, right = 2 * i + 2, target = left;
            if (right < n && heap[right] < heap[left]) target = right;
            if (heap[i] <= heap[target]) break;
            std::swap(heap[i], heap[target]);
            i = target;
        }
        return root;
    }
};`,
    quiz: [
      {
        id: "heap1",
        question:
          "Why can a complete binary tree with n nodes be stored in a contiguous array without any pointers?",
        options: [
          "Because the complete tree structure guarantees zero holes; children are always located at exactly 2i + 1 and 2i + 2.",
          "Because compilers convert tree structs into arrays automatically.",
          "Only trees with power-of-two nodes can be stored in an array.",
          "Array-based trees always require 2x extra dummy elements.",
        ],
        correctIndex: 0,
        explanation:
          "Because a complete binary tree fills levels strictly from top-to-bottom and left-to-right, every node corresponds to index i, left child to 2i+1, and right child to 2i+2 with no gaps.",
      },
      {
        id: "heap2",
        question:
          "What is the mathematical time complexity of building a heap from an arbitrary array using bottom-up heapify?",
        options: [
          "O(n) linear time, because node heights form a converging geometric series where most nodes are near the leaves and do few swaps.",
          "O(n log n), because each of the n nodes takes O(log n) work.",
          "O(n²) quadratic time.",
          "O(1) constant time.",
        ],
        correctIndex: 0,
        explanation:
          "Summing the work across all levels: Σ (h * n/2^(h+1)) converges to O(n). Most nodes reside in lower levels (height 0 and 1) requiring few or no swaps.",
      },
    ],
  },
  hashtable: {
    id: "hashtable",
    name: "Hash Table & Collision Resolution",
    category: "Data Structures",
    summary:
      "Associative memory using hash function h(k) = k % M. Compares Separate Chaining (linked list chains) against Open Addressing (Linear Probing with Tombstones) and dynamic 2× rehashing upon load factor saturation (α ≥ 0.75).",
    timeComplexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(n)",
    },
    spaceComplexity: "O(n)",
    stable: false,
    inPlace: false,
    keyInvariants: [
      "Hash Uniformity: Keys are mapped to buckets via h(k) = k % M; a good hash function distributes keys uniformly to minimize collisions.",
      "Collision Strategies: Separate Chaining stores collisions in per-bucket linked lists; Linear Probing searches adjacent slots (h + i) % M.",
      "Tombstone Invariant: In Open Addressing, deletions must leave a Tombstone marker ([DEL]) so searches for elements collided past that slot do not terminate early.",
      "Amortized O(1) via Rehashing: When load factor α = n/M ≥ 0.75, doubling capacity (2M) and re-inserting elements guarantees O(1) average lookup.",
    ],
    cppCode: `// C++ Hash Table (std::unordered_map) Operations
#include <vector>
#include <list>

class HashTable {
    int capacity = 7;
    std::vector<std::list<int>> table;
public:
    HashTable() : table(capacity) {}

    // Hash Function: h(k) = k % M
    int hash(int key) {
        return (key % capacity + capacity) % capacity;
    }

    // Separate Chaining Insert - O(1) Avg
    void insert(int key) {
        int h = hash(key);
        table[h].push_back(key);
    }

    // Search - O(1) Avg, O(n) Worst
    bool search(int key) {
        int h = hash(key);
        for (int val : table[h]) {
            if (val == key) return true;
        }
        return false; // Not found
    }
};`,
    quiz: [
      {
        id: "hash1",
        question:
          "Why must Open Addressing (Linear Probing) place a 'Tombstone' marker upon deletion instead of simply marking the slot as empty?",
        options: [
          "Because an empty slot terminates search probe sequences prematurely, causing collided keys placed further down to become unreachable.",
          "Because computer hardware cannot erase allocated integers.",
          "To preserve the hash function seed value.",
          "It is only done to prevent memory fragmentation.",
        ],
        correctIndex: 0,
        explanation:
          "Linear probing stops searching as soon as it encounters an empty slot. If a deleted item were marked empty, searches for keys inserted past that slot would stop early and mistakenly report 'not found'. A Tombstone allows searches to continue through it.",
      },
      {
        id: "hash2",
        question:
          "What is the role of the Load Factor (α = n / M) in Hash Tables, and why do implementations rehash at α ≈ 0.75?",
        options: [
          "α measures table density; rehashing at 0.75 reclaims O(1) expected time before collision chains or probe clusters degrade lookup to O(n).",
          "α indicates how many hash functions are active.",
          "Rehashing is required because prime-numbered buckets overflow at 75%.",
          "It reduces RAM usage by 50%.",
        ],
        correctIndex: 0,
        explanation:
          "As α increases, collisions escalate rapidly. Rehashing at α ≈ 0.75 doubles capacity, halving α back down to ~0.375 and maintaining amortized O(1) time.",
      },
    ],
  },
};

export function createArrayFromPreset(preset: ArrayPreset, size: number, customStr?: string): number[] {
  if (preset === "custom" && customStr) {
    const parsed = customStr
      .split(/[, \t\n]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);
    if (parsed.length > 0) return parsed.slice(0, 24);
  }

  const n = Math.max(5, Math.min(size, 24));
  switch (preset) {
    case "sorted": {
      const step = Math.floor(70 / n);
      return Array.from({ length: n }, (_, i) => 15 + i * step);
    }
    case "reversed": {
      const step = Math.floor(70 / n);
      return Array.from({ length: n }, (_, i) => 85 - i * step);
    }
    case "few-unique": {
      const vals = [25, 50, 75];
      return Array.from({ length: n }, (_, i) => vals[i % vals.length]);
    }
    case "random":
    default: {
      const result: number[] = [];
      for (let i = 0; i < n; i++) {
        result.push(Math.floor(Math.random() * 75) + 15);
      }
      return result;
    }
  }
}

// BUBBLE SORT TRACE
export function generateBubbleSortTrace(initialArray: number[]): AlgorithmTraceStep[] {
  const steps: AlgorithmTraceStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted: number[] = [];

  steps.push({
    stepIndex: 0,
    action: "init",
    indices: [],
    values: [],
    arraySnapshot: [...arr],
    pointers: { i: 0, j: 0 },
    codeLine: 2,
    counters: { comparisons: 0, swaps: 0 },
    pass: 1,
    sortedIndices: [],
    description: `Initialized array with ${n} elements.`,
    reasoning: "Beginning Bubble Sort pass 1. Unsorted elements will compare adjacent pairs.",
    inlineVariables: { n },
  });

  for (let i = 0; i < n - 1; i++) {
    const pass = i + 1;
    let passSwapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const valA = arr[j];
      const valB = arr[j + 1];
      const willSwap = valA > valB;

      steps.push({
        stepIndex: steps.length,
        action: "compare",
        indices: [j, j + 1],
        values: [valA, valB],
        arraySnapshot: [...arr],
        pointers: { i, j },
        codeLine: 6,
        counters: { comparisons, swaps },
        pass,
        sortedIndices: [...sorted],
        description: `Compare ${valA} vs ${valB}.`,
        reasoning: willSwap
          ? `Compare ${valA} vs ${valB} → ${valA} > ${valB} → swap.`
          : `Compare ${valA} vs ${valB} → ${valA} ≤ ${valB} → keep order.`,
        inlineVariables: { i, j, "arr[j]": valA, "arr[j+1]": valB },
      });

      if (willSwap) {
        swaps++;
        arr[j] = valB;
        arr[j + 1] = valA;
        passSwapped = true;

        steps.push({
          stepIndex: steps.length,
          action: "swap",
          indices: [j, j + 1],
          values: [valB, valA],
          arraySnapshot: [...arr],
          pointers: { i, j },
          codeLine: 7,
          counters: { comparisons, swaps },
          pass,
          sortedIndices: [...sorted],
          description: `Swap ${valA} and ${valB}.`,
          reasoning: `Swapped ${valA} with ${valB} → larger unsorted value moves right.`,
          inlineVariables: { i, j, "arr[j]": valB, "arr[j+1]": valA },
        });
      }
    }

    const lockedIdx = n - 1 - i;
    sorted.push(lockedIdx);

    steps.push({
      stepIndex: steps.length,
      action: "sorted",
      indices: [lockedIdx],
      values: [arr[lockedIdx]],
      arraySnapshot: [...arr],
      pointers: { i },
      codeLine: 4,
      counters: { comparisons, swaps },
      pass,
      sortedIndices: [...sorted],
      description: `Index ${lockedIdx} (${arr[lockedIdx]}) locked in sorted position.`,
      reasoning: `Pass ${pass} complete: largest unsorted element reached index ${lockedIdx}.`,
      inlineVariables: { i, "sortedIdx": lockedIdx, value: arr[lockedIdx] },
    });

    if (!passSwapped) break;
  }

  // Ensure all marked sorted
  for (let k = 0; k < n; k++) {
    if (!sorted.includes(k)) sorted.push(k);
  }

  steps.push({
    stepIndex: steps.length,
    action: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    values: [...arr],
    arraySnapshot: [...arr],
    pointers: {},
    codeLine: 12,
    counters: { comparisons, swaps },
    pass: n - 1,
    sortedIndices: [...sorted],
    description: "Array is fully sorted.",
    reasoning: "All elements satisfy invariant A[k] ≤ A[k+1]. Sorting complete.",
    inlineVariables: { status: "Complete" },
  });

  return steps;
}

// SELECTION SORT TRACE
export function generateSelectionSortTrace(initialArray: number[]): AlgorithmTraceStep[] {
  const steps: AlgorithmTraceStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted: number[] = [];

  steps.push({
    stepIndex: 0,
    action: "init",
    indices: [],
    values: [],
    arraySnapshot: [...arr],
    pointers: { i: 0, min: 0 },
    codeLine: 2,
    counters: { comparisons: 0, swaps: 0 },
    pass: 1,
    sortedIndices: [],
    description: `Initialized array with ${n} elements.`,
    reasoning: "Beginning Selection Sort. Searching for minimum element in each pass.",
    inlineVariables: { n },
  });

  for (let i = 0; i < n - 1; i++) {
    const pass = i + 1;
    let minIdx = i;

    steps.push({
      stepIndex: steps.length,
      action: "pivot",
      indices: [minIdx],
      values: [arr[minIdx]],
      arraySnapshot: [...arr],
      pointers: { i, min: minIdx },
      codeLine: 4,
      counters: { comparisons, swaps },
      pass,
      sortedIndices: [...sorted],
      description: `Current minimum candidate: arr[${minIdx}] = ${arr[minIdx]}.`,
      reasoning: `Starting pass ${pass} with candidate minimum ${arr[minIdx]} at index ${minIdx}.`,
      inlineVariables: { i, minIdx, "arr[minIdx]": arr[minIdx] },
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const isSmaller = arr[j] < arr[minIdx];

      steps.push({
        stepIndex: steps.length,
        action: "compare",
        indices: [j, minIdx],
        values: [arr[j], arr[minIdx]],
        arraySnapshot: [...arr],
        pointers: { i, j, min: minIdx },
        codeLine: 6,
        counters: { comparisons, swaps },
        pass,
        sortedIndices: [...sorted],
        description: `Compare arr[${j}] (${arr[j]}) vs min arr[${minIdx}] (${arr[minIdx]}).`,
        reasoning: isSmaller
          ? `Compare ${arr[j]} vs ${arr[minIdx]} → ${arr[j]} < ${arr[minIdx]} → new minimum found.`
          : `Compare ${arr[j]} vs ${arr[minIdx]} → ${arr[j]} ≥ ${arr[minIdx]} → keep minimum.`,
        inlineVariables: { i, j, minIdx, "arr[j]": arr[j], "arr[minIdx]": arr[minIdx] },
      });

      if (isSmaller) {
        minIdx = j;
        steps.push({
          stepIndex: steps.length,
          action: "pivot",
          indices: [minIdx],
          values: [arr[minIdx]],
          arraySnapshot: [...arr],
          pointers: { i, j, min: minIdx },
          codeLine: 7,
          counters: { comparisons, swaps },
          pass,
          sortedIndices: [...sorted],
          description: `Updated minimum candidate: arr[${minIdx}] = ${arr[minIdx]}.`,
          reasoning: `Found smaller unsorted item ${arr[minIdx]} at index ${minIdx}.`,
          inlineVariables: { i, j, minIdx, "arr[minIdx]": arr[minIdx] },
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      const valA = arr[i];
      const valB = arr[minIdx];
      arr[i] = valB;
      arr[minIdx] = valA;

      steps.push({
        stepIndex: steps.length,
        action: "swap",
        indices: [i, minIdx],
        values: [valB, valA],
        arraySnapshot: [...arr],
        pointers: { i, min: minIdx },
        codeLine: 11,
        counters: { comparisons, swaps },
        pass,
        sortedIndices: [...sorted],
        description: `Swap index ${i} (${valA}) with minimum at index ${minIdx} (${valB}).`,
        reasoning: `Placed minimum unsorted value (${valB}) at sorted boundary index ${i}.`,
        inlineVariables: { i, minIdx, "arr[i]": valB, "arr[minIdx]": valA },
      });
    }

    sorted.push(i);
    steps.push({
      stepIndex: steps.length,
      action: "sorted",
      indices: [i],
      values: [arr[i]],
      arraySnapshot: [...arr],
      pointers: { i },
      codeLine: 3,
      counters: { comparisons, swaps },
      pass,
      sortedIndices: [...sorted],
      description: `Index ${i} (${arr[i]}) locked in sorted prefix.`,
      reasoning: `Prefix A[0...${i}] is now guaranteed sorted and smallest.`,
      inlineVariables: { sortedPrefixLength: i + 1 },
    });
  }

  sorted.push(n - 1);
  steps.push({
    stepIndex: steps.length,
    action: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    values: [...arr],
    arraySnapshot: [...arr],
    pointers: {},
    codeLine: 14,
    counters: { comparisons, swaps },
    pass: n - 1,
    sortedIndices: [...sorted],
    description: "Array is fully sorted.",
    reasoning: "Selection Sort complete. Handled n - 1 passes.",
    inlineVariables: { status: "Complete" },
  });

  return steps;
}

// INSERTION SORT TRACE
export function generateInsertionSortTrace(initialArray: number[]): AlgorithmTraceStep[] {
  const steps: AlgorithmTraceStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted: number[] = [0];

  steps.push({
    stepIndex: 0,
    action: "init",
    indices: [],
    values: [],
    arraySnapshot: [...arr],
    pointers: { i: 1 },
    codeLine: 2,
    counters: { comparisons: 0, swaps: 0 },
    pass: 1,
    sortedIndices: [0],
    description: `Initialized array. Index 0 is trivially sorted.`,
    reasoning: "Beginning Insertion Sort. Inserting items one-by-one into sorted prefix.",
    inlineVariables: { n },
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      stepIndex: steps.length,
      action: "pivot",
      indices: [i],
      values: [key],
      arraySnapshot: [...arr],
      pointers: { i, j },
      codeLine: 4,
      counters: { comparisons, swaps },
      pass: i,
      sortedIndices: [...sorted],
      description: `Selected key = ${key} at index ${i}.`,
      reasoning: `Finding insertion spot for key=${key} inside sorted prefix A[0...${i - 1}].`,
      inlineVariables: { i, key, j },
    });

    while (j >= 0) {
      comparisons++;
      const willShift = arr[j] > key;

      steps.push({
        stepIndex: steps.length,
        action: "compare",
        indices: [j, j + 1],
        values: [arr[j], key],
        arraySnapshot: [...arr],
        pointers: { i, j },
        codeLine: 6,
        counters: { comparisons, swaps },
        pass: i,
        sortedIndices: [...sorted],
        description: `Compare arr[${j}] (${arr[j]}) vs key (${key}).`,
        reasoning: willShift
          ? `Compare ${arr[j]} vs ${key} → ${arr[j]} > ${key} → shift right.`
          : `Compare ${arr[j]} vs ${key} → ${arr[j]} ≤ ${key} → correct spot found.`,
        inlineVariables: { i, j, "arr[j]": arr[j], key },
      });

      if (willShift) {
        swaps++;
        arr[j + 1] = arr[j];

        steps.push({
          stepIndex: steps.length,
          action: "overwrite",
          indices: [j + 1],
          values: [arr[j]],
          arraySnapshot: [...arr],
          pointers: { i, j },
          codeLine: 7,
          counters: { comparisons, swaps },
          pass: i,
          sortedIndices: [...sorted],
          description: `Shifted ${arr[j]} right to index ${j + 1}.`,
          reasoning: `Shifted element right to make space for key=${key}.`,
          inlineVariables: { i, j, shiftedValue: arr[j] },
        });
        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    sorted.push(i);

    steps.push({
      stepIndex: steps.length,
      action: "overwrite",
      indices: [j + 1],
      values: [key],
      arraySnapshot: [...arr],
      pointers: { i, j: j + 1 },
      codeLine: 10,
      counters: { comparisons, swaps },
      pass: i,
      sortedIndices: [...sorted],
      description: `Inserted key=${key} at position ${j + 1}.`,
      reasoning: `Inserted key into position ${j + 1}. Prefix A[0...${i}] is now ordered.`,
      inlineVariables: { insertedAt: j + 1, key },
    });
  }

  steps.push({
    stepIndex: steps.length,
    action: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    values: [...arr],
    arraySnapshot: [...arr],
    pointers: {},
    codeLine: 12,
    counters: { comparisons, swaps },
    pass: n - 1,
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: "Array is fully sorted.",
    reasoning: "Insertion Sort complete. All inversions eliminated.",
    inlineVariables: { status: "Complete" },
  });

  return steps;
}

// QUICK SORT TRACE
export function generateQuickSortTrace(initialArray: number[]): AlgorithmTraceStep[] {
  const steps: AlgorithmTraceStep[] = [];
  const arr = [...initialArray];
  let comparisons = 0;
  let swaps = 0;
  const sorted: number[] = [];
  let currentPass = 1;

  steps.push({
    stepIndex: 0,
    action: "init",
    indices: [],
    values: [],
    arraySnapshot: [...arr],
    pointers: { i: 0, pivot: arr.length - 1 },
    codeLine: 14,
    counters: { comparisons: 0, swaps: 0 },
    pass: 1,
    sortedIndices: [],
    description: `Initialized array for Quick Sort.`,
    reasoning: "Beginning Quick Sort with Lomuto partitioning.",
    inlineVariables: { length: arr.length },
  });

  function partition(low: number, high: number): number {
    currentPass++;
    const pivot = arr[high];

    steps.push({
      stepIndex: steps.length,
      action: "pivot",
      indices: [high],
      values: [pivot],
      arraySnapshot: [...arr],
      pointers: { pivot: high },
      codeLine: 2,
      counters: { comparisons, swaps },
      pass: currentPass,
      sortedIndices: [...sorted],
      description: `Partition range [${low}...${high}] with pivot arr[${high}]=${pivot}.`,
      reasoning: `Chosen pivot = ${pivot}. Elements < ${pivot} will move to the left.`,
      inlineVariables: { low, high, pivot },
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      const isSmaller = arr[j] < pivot;

      steps.push({
        stepIndex: steps.length,
        action: "compare",
        indices: [j, high],
        values: [arr[j], pivot],
        arraySnapshot: [...arr],
        pointers: { i: i >= 0 ? i : undefined, j, pivot: high },
        codeLine: 5,
        counters: { comparisons, swaps },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Compare arr[${j}] (${arr[j]}) vs pivot (${pivot}).`,
        reasoning: isSmaller
          ? `Compare ${arr[j]} vs ${pivot} → ${arr[j]} < ${pivot} → element belongs in lower partition.`
          : `Compare ${arr[j]} vs ${pivot} → ${arr[j]} ≥ ${pivot} → element belongs in higher partition.`,
        inlineVariables: { i, j, "arr[j]": arr[j], pivot },
      });

      if (isSmaller) {
        i++;
        if (i !== j) {
          swaps++;
          const valA = arr[i];
          const valB = arr[j];
          arr[i] = valB;
          arr[j] = valA;

          steps.push({
            stepIndex: steps.length,
            action: "swap",
            indices: [i, j],
            values: [valB, valA],
            arraySnapshot: [...arr],
            pointers: { i, j, pivot: high },
            codeLine: 7,
            counters: { comparisons, swaps },
            pass: currentPass,
            sortedIndices: [...sorted],
            description: `Swap arr[${i}] (${valA}) and arr[${j}] (${valB}).`,
            reasoning: `Moved smaller element into the lower partition boundary index ${i}.`,
            inlineVariables: { i, j, "arr[i]": valB, "arr[j]": valA },
          });
        }
      }
    }

    swaps++;
    const valA = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = valA;
    const finalPivotIdx = i + 1;
    sorted.push(finalPivotIdx);

    steps.push({
      stepIndex: steps.length,
      action: "swap",
      indices: [finalPivotIdx, high],
      values: [pivot, valA],
      arraySnapshot: [...arr],
      pointers: { pivot: finalPivotIdx },
      codeLine: 10,
      counters: { comparisons, swaps },
      pass: currentPass,
      sortedIndices: [...sorted],
      description: `Placed pivot ${pivot} at boundary index ${finalPivotIdx}.`,
      reasoning: `Pivot ${pivot} is now in its permanent final sorted index ${finalPivotIdx}.`,
      inlineVariables: { pivotIndex: finalPivotIdx, pivotValue: pivot },
    });

    return finalPivotIdx;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high && low >= 0 && low < arr.length) {
      if (!sorted.includes(low)) sorted.push(low);
    }
  }

  sort(0, arr.length - 1);

  for (let k = 0; k < arr.length; k++) {
    if (!sorted.includes(k)) sorted.push(k);
  }

  steps.push({
    stepIndex: steps.length,
    action: "sorted",
    indices: Array.from({ length: arr.length }, (_, k) => k),
    values: [...arr],
    arraySnapshot: [...arr],
    pointers: {},
    codeLine: 18,
    counters: { comparisons, swaps },
    pass: currentPass,
    sortedIndices: [...sorted],
    description: "Array is fully sorted.",
    reasoning: "All sub-partitions resolved. Quick Sort completed.",
    inlineVariables: { status: "Complete" },
  });

  return steps;
}

export function getAlgorithmTrace(algorithmId: string, array: number[]): AlgorithmTraceStep[] {
  switch (algorithmId) {
    case "bubble":
      return generateBubbleSortTrace(array);
    case "selection":
      return generateSelectionSortTrace(array);
    case "insertion":
      return generateInsertionSortTrace(array);
    case "quick":
      return generateQuickSortTrace(array);
    default:
      return generateBubbleSortTrace(array);
  }
}
