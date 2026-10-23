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
  merge: {
    id: "merge",
    name: "Merge Sort",
    category: "Sorting",
    summary:
      "Divide-and-conquer algorithm that recursively splits the array into single-element subarrays, then merges pairs of sorted subarrays using an auxiliary buffer. Guarantees O(n log n) in all cases and preserves stability.",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    spaceComplexity: "O(n)",
    stable: true,
    inPlace: false,
    keyInvariants: [
      "Divide and Conquer: Subarrays [L..M] and [M+1..R] are recursively sorted before the merge phase begins.",
      "Two-Pointer Auxiliary Merge: Comparing elements from both sorted halves and picking the smaller element preserves original relative order (stability).",
      "Guaranteed O(n log n): Tree recursion depth is strictly ⌈log₂ n⌉ levels, each processing n total elements.",
    ],
    cppCode: `void merge(std::vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1, n2 = right - mid;
    std::vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; ++i) L[i] = arr[left + i];
    for (int j = 0; j < n2; ++j) R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,
    quiz: [
      {
        id: "m1",
        question: "Why is Merge Sort preferred over Quick Sort for sorting linked lists?",
        options: [
          "Merge Sort does not require random access (no pointer arithmetic) and can merge linked list nodes in-place without auxiliary array allocation.",
          "Quick Sort is mathematically impossible on linked lists.",
          "Linked lists have O(1) random access.",
          "Merge Sort runs in O(log n) time on linked lists.",
        ],
        correctIndex: 0,
        explanation:
          "Because linked list nodes can be spliced and rewired by changing pointers, Merge Sort operates in-place without the O(n) array copy overhead, and avoids the need for random indexing.",
      },
      {
        id: "m2",
        question: "What gives Merge Sort a guaranteed O(n log n) time complexity even in the worst case?",
        options: [
          "The array is always split exactly in half, guaranteeing a recursion tree depth of ⌈log₂ n⌉ with O(n) work per level.",
          "It uses a CPU hardware accelerator.",
          "It skips duplicate elements.",
          "Because it sorts two elements simultaneously.",
        ],
        correctIndex: 0,
        explanation:
          "Unlike Quick Sort where bad pivot choice can create unbalanced partitions of size 1 and n-1, Merge Sort unconditionally divides at mid = (left + right) / 2, ensuring exactly log₂ n levels of n work each.",
      },
    ],
  },
  heapsort: {
    id: "heapsort",
    name: "Heap Sort",
    category: "Sorting",
    summary:
      "Comparison-based sorting algorithm using a binary max-heap. It first builds a max-heap in O(n) time, then repeatedly extracts the root maximum element to the end of the unsorted boundary, maintaining the heap with O(log n) sift-downs.",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    spaceComplexity: "O(1)",
    stable: false,
    inPlace: true,
    keyInvariants: [
      "Max-Heap Invariant: Every parent node at index i satisfies arr[i] >= arr[2i+1] and arr[i] >= arr[2i+2] within the active heap boundary [0..heapSize-1].",
      "Linear-Time Build: Floyd's bottom-up heapify runs in strictly O(n) time by sifting down from ⌊n/2⌋ - 1 down to 0.",
      "Sorted Suffix: After extracting k elements, the suffix [n-k..n-1] is permanently sorted and never modified.",
    ],
    cppCode: `void heapify(std::vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; --i)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; --i) {
        std::swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
    quiz: [
      {
        id: "hs1",
        question: "Why does building a binary max-heap take O(n) time rather than O(n log n)?",
        options: [
          "Floyd's bottom-up heapify does more work on deeper levels with fewer nodes: the sum ∑(h / 2^h) mathematically converges to 2.",
          "It uses a hash table internally.",
          "It ignores child comparisons for leaf nodes.",
          "Binary heaps only operate on power-of-two arrays.",
        ],
        correctIndex: 0,
        explanation:
          "Leaves require 0 sifts, nodes at height 1 require 1 sift, etc. The summation of node count × height across all levels bounds the total work strictly to O(n).",
      },
      {
        id: "hs2",
        question: "Why is Heap Sort NOT a stable sorting algorithm?",
        options: [
          "Sift-down swaps elements across long distances (indices 2i+1 and 2i+2), disrupting the relative order of identical values.",
          "Because it runs in O(n log n) time.",
          "It requires negative numbers to be stable.",
          "Because max-heapify always reverses the entire array.",
        ],
        correctIndex: 0,
        explanation:
          "Tree swaps between parents and distant child indices across non-adjacent positions do not preserve original input indices of duplicate items.",
      },
    ],
  },
  radix: {
    id: "radix",
    name: "Radix Sort",
    category: "Sorting",
    summary:
      "Non-comparative integer sorting algorithm that sorts numbers digit by digit from least significant digit (LSD) to most significant digit (MSD) using a stable Counting Sort subroutine. Bypasses the Ω(n log n) comparison lower bound.",
    timeComplexity: {
      best: "O(d · (n + k))",
      average: "O(d · (n + k))",
      worst: "O(d · (n + k))",
    },
    spaceComplexity: "O(n + k)",
    stable: true,
    inPlace: false,
    keyInvariants: [
      "Subroutine Stability: The digit sorting subroutine (Counting Sort) MUST be stable to preserve relative order of previous digits.",
      "Digit Induction: After pass d (for base 10 exponent 10^d), the entire array is stably sorted by the lower d digits.",
      "Non-Comparative Efficiency: Operates in linear time O(d · (n + k)) where d is the maximum digit length and k is radix base (10).",
    ],
    cppCode: `void countingSortByDigit(std::vector<int>& arr, int n, int exp) {
    std::vector<int> output(n);
    int count[10] = {0};
    for (int i = 0; i < n; ++i)
        count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; ++i)
        count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; --i) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    for (int i = 0; i < n; ++i)
        arr[i] = output[i];
}

void radixSort(std::vector<int>& arr) {
    if (arr.empty()) return;
    int maxVal = *std::max_element(arr.begin(), arr.end());
    for (int exp = 1; maxVal / exp > 0; exp *= 10)
        countingSortByDigit(arr, arr.size(), exp);
}`,
    quiz: [
      {
        id: "rs1",
        question: "Why must the digit-sorting subroutine in LSD Radix Sort be stable?",
        options: [
          "To preserve the sorted order established by previous, less-significant digit passes.",
          "To prevent integer overflow.",
          "To avoid allocating auxiliary memory.",
          "Counting Sort cannot run without stability.",
        ],
        correctIndex: 0,
        explanation:
          "If two keys share the same digit at the current place value, stability guarantees their relative order (sorted by prior digit passes) is maintained.",
      },
      {
        id: "rs2",
        question: "When does Radix Sort significantly outperform comparison sorts like Quick Sort or Merge Sort?",
        options: [
          "When key length or digit count d is small/constant (d << log n) relative to large array size n.",
          "When the array is already sorted in reverse order.",
          "When sorting floating point numbers of infinite precision.",
          "Only when n <= 5.",
        ],
        correctIndex: 0,
        explanation:
          "With fixed-size integers (e.g. 32-bit keys with d bounded), O(d · (n + k)) scales linearly O(n), beating O(n log n) comparison sorts for large n.",
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
  trie: {
    id: "trie",
    name: "Trie (Prefix Tree) & Autocomplete",
    category: "Data Structures",
    summary:
      "Tree structure where edges represent characters. Compactly stores dictionaries by sharing common prefixes. Guarantees O(L) insert, search, and prefix matching where L is word length, regardless of dictionary size N.",
    timeComplexity: {
      best: "O(L)",
      average: "O(L)",
      worst: "O(L)",
    },
    spaceComplexity: "O(Σ · L · N)",
    stable: true,
    inPlace: false,
    keyInvariants: [
      "Prefix Sharing: Words sharing common prefixes share the same path from the root down to the branch point (e.g. 'cat', 'car', 'cart').",
      "Terminal Word Marker (isEndOfWord): A boolean flag distinguishing complete dictionary words from intermediate prefixes.",
      "Autocomplete via Subtree DFS: All words completing prefix P are gathered by traversing the subtree rooted at node P in O(P + K) time.",
    ],
    cppCode: `// C++ Trie Implementation (Prefix Tree)
#include <string>
#include <vector>

struct TrieNode {
    TrieNode* children[26] = {nullptr};
    bool isEndOfWord = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() : root(new TrieNode()) {}

    // O(L) Insert
    void insert(const std::string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!curr->children[idx]) {
                curr->children[idx] = new TrieNode();
            }
            curr = curr->children[idx];
        }
        curr->isEndOfWord = true;
    }

    // O(L) Search
    bool search(const std::string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return curr->isEndOfWord;
    }

    // O(P) Prefix Match
    bool startsWith(const std::string& prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return true;
    }
};`,
    quiz: [
      {
        id: "trie1",
        question:
          "Why is searching a word of length L in a Trie strictly O(L) time, even if the dictionary contains 10 million words?",
        options: [
          "Because each character match is an O(1) branch traversal down the tree, taking exactly L steps independent of total word count N.",
          "Because Tries compress words into binary numbers.",
          "Because compilers hash strings automatically.",
          "It is only O(L) if the dictionary has fewer than 1000 words.",
        ],
        correctIndex: 0,
        explanation:
          "A Trie traverses at most one edge per character of the query string. For a word of length L, at most L pointer dereferences are made, achieving strictly O(L) time.",
      },
      {
        id: "trie2",
        question:
          "What distinguishes a prefix that exists in a Trie from an actual full dictionary word?",
        options: [
          "The terminal node of a full word has its isEndOfWord boolean flag set to true.",
          "Full words are always leaf nodes with zero children.",
          "Prefixes are stored in an auxiliary hash table.",
          "Words must contain at least 5 characters.",
        ],
        correctIndex: 0,
        explanation:
          "A node can have children and still be a full word (e.g., 'car' is a word, but also prefixes 'cart'). The isEndOfWord marker designates that the path from root constitutes a complete stored word.",
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

export function generateMergeSortTrace(initialArray: number[]): AlgorithmTraceStep[] {
  const steps: AlgorithmTraceStep[] = [];
  const arr = [...initialArray];
  let comparisons = 0;
  let swaps = 0;
  let currentPass = 0;
  const sorted: number[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    action: "init",
    indices: [],
    values: [],
    arraySnapshot: [...arr],
    pointers: {},
    codeLine: 18,
    counters: { comparisons, swaps },
    pass: 0,
    sortedIndices: [],
    description: `Initial unsorted array of length N = ${arr.length}.`,
    reasoning:
      "Merge Sort recursively divides the array in half down to single-element subarrays, then merges pairs in sorted order.",
    inlineVariables: { arraySize: arr.length },
  });

  function merge(left: number, mid: number, right: number) {
    currentPass++;
    const leftCopy = arr.slice(left, mid + 1);
    const rightCopy = arr.slice(mid + 1, right + 1);

    steps.push({
      stepIndex: steps.length,
      action: "init",
      indices: [left, right],
      values: [arr[left], arr[right]],
      arraySnapshot: [...arr],
      pointers: { i: left, j: mid + 1, k: left },
      codeLine: 1,
      counters: { comparisons, swaps },
      pass: currentPass,
      sortedIndices: [...sorted],
      description: `Begin merge on range [${left}..${right}] (Left: [${left}..${mid}], Right: [${mid + 1}..${right}]).`,
      reasoning: `Allocated auxiliary buffer of size ${right - left + 1}. Two-pointer comparison begins.`,
      inlineVariables: { left, mid, right, leftLen: leftCopy.length, rightLen: rightCopy.length },
    });

    let pL = 0;
    let pR = 0;
    let k = left;

    while (pL < leftCopy.length && pR < rightCopy.length) {
      comparisons++;
      const vL = leftCopy[pL];
      const vR = rightCopy[pR];

      steps.push({
        stepIndex: steps.length,
        action: "compare",
        indices: [left + pL, mid + 1 + pR],
        values: [vL, vR],
        arraySnapshot: [...arr],
        pointers: { i: left + pL, j: mid + 1 + pR, k },
        codeLine: 8,
        counters: { comparisons, swaps },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Comparing left element (${vL}) vs right element (${vR}).`,
        reasoning:
          vL <= vR
            ? `Left element ${vL} <= ${vR}. Stability preserved: picking left element first. Placing at index ${k}.`
            : `Right element ${vR} < ${vL}. Placing ${vR} at index ${k}.`,
        inlineVariables: { leftVal: vL, rightVal: vR, targetIndex: k },
      });

      if (vL <= vR) {
        arr[k] = vL;
        pL++;
      } else {
        arr[k] = vR;
        pR++;
      }
      swaps++;

      steps.push({
        stepIndex: steps.length,
        action: "overwrite",
        indices: [k],
        values: [arr[k]],
        arraySnapshot: [...arr],
        pointers: { k },
        codeLine: 9,
        counters: { comparisons, swaps },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Placed ${arr[k]} into merged array at index ${k}.`,
        reasoning: `Element placed in sorted order within subarray [${left}..${right}].`,
        inlineVariables: { placedVal: arr[k], targetIndex: k },
      });
      k++;
    }

    while (pL < leftCopy.length) {
      arr[k] = leftCopy[pL];
      swaps++;
      steps.push({
        stepIndex: steps.length,
        action: "overwrite",
        indices: [k],
        values: [arr[k]],
        arraySnapshot: [...arr],
        pointers: { k },
        codeLine: 14,
        counters: { comparisons, swaps },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Copied remaining left element (${arr[k]}) into [${k}].`,
        reasoning: `Right subarray exhausted; remaining left elements are already in sorted order.`,
        inlineVariables: { placedVal: arr[k], targetIndex: k },
      });
      pL++;
      k++;
    }

    while (pR < rightCopy.length) {
      arr[k] = rightCopy[pR];
      swaps++;
      steps.push({
        stepIndex: steps.length,
        action: "overwrite",
        indices: [k],
        values: [arr[k]],
        arraySnapshot: [...arr],
        pointers: { k },
        codeLine: 15,
        counters: { comparisons, swaps },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Copied remaining right element (${arr[k]}) into [${k}].`,
        reasoning: `Left subarray exhausted; remaining right elements copied directly.`,
        inlineVariables: { placedVal: arr[k], targetIndex: k },
      });
      pR++;
      k++;
    }

    if (left === 0 && right === arr.length - 1) {
      for (let idx = 0; idx < arr.length; idx++) {
        if (!sorted.includes(idx)) sorted.push(idx);
      }
    }
  }

  function sort(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({
        stepIndex: steps.length,
        action: "compare",
        indices: [left, right],
        values: [arr[left], arr[right]],
        arraySnapshot: [...arr],
        pointers: { i: left, j: right },
        codeLine: 20,
        counters: { comparisons, swaps },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Divide: Halving range [${left}..${right}] at mid index ${mid}.`,
        reasoning: `Recursively dividing array into subproblems of size ${mid - left + 1} and ${right - mid}.`,
        inlineVariables: { left, mid, right },
      });

      sort(left, mid);
      sort(mid + 1, right);
      merge(left, mid, right);
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
    codeLine: 23,
    counters: { comparisons, swaps },
    pass: currentPass,
    sortedIndices: [...sorted],
    description: "Array is fully sorted via Merge Sort.",
    reasoning: "All recursive divide-and-conquer subproblems merged in guaranteed O(n log n) time.",
    inlineVariables: { status: "Complete", totalComparisons: comparisons, totalOverwrites: swaps },
  });

  return steps;
}

export function generateHeapSortTrace(array: number[]): AlgorithmTraceStep[] {
  const steps: AlgorithmTraceStep[] = [];
  const arr = [...array];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let currentPass = 0;
  const sorted: number[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    action: "init",
    indices: [],
    values: [],
    arraySnapshot: [...arr],
    pointers: {},
    codeLine: 16,
    counters: { comparisons, swaps },
    pass: 0,
    sortedIndices: [],
    description: `Initial unsorted array of length N = ${n}.`,
    reasoning:
      "Heap Sort first converts the array into a max-heap in O(n) time, then repeatedly extracts the root max element to the sorted suffix.",
    inlineVariables: { arraySize: n, phase: "Build-Heap" },
  });

  if (n <= 1) {
    steps.push({
      stepIndex: steps.length,
      action: "sorted",
      indices: Array.from({ length: n }, (_, k) => k),
      values: [...arr],
      arraySnapshot: [...arr],
      pointers: {},
      codeLine: 22,
      counters: { comparisons, swaps },
      pass: 0,
      sortedIndices: Array.from({ length: n }, (_, k) => k),
      description: "Array is sorted.",
      reasoning: "Array with length <= 1 is trivially sorted.",
      inlineVariables: { status: "Complete" },
    });
    return steps;
  }

  function heapify(heapSize: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < heapSize) {
      comparisons++;
      steps.push({
        stepIndex: steps.length,
        action: "compare",
        indices: [largest, left],
        values: [arr[largest], arr[left]],
        arraySnapshot: [...arr],
        pointers: { i: largest, j: left },
        codeLine: 5,
        counters: { comparisons, swaps },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Comparing parent arr[${largest}]=${arr[largest]} with left child arr[${left}]=${arr[left]}.`,
        reasoning:
          arr[left] > arr[largest]
            ? `Left child ${arr[left]} exceeds parent ${arr[largest]}; candidate for promotion.`
            : `Parent ${arr[largest]} satisfies heap property against left child ${arr[left]}.`,
        inlineVariables: { parent: largest, leftChild: left, heapBoundary: heapSize },
      });
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < heapSize) {
      comparisons++;
      steps.push({
        stepIndex: steps.length,
        action: "compare",
        indices: [largest, right],
        values: [arr[largest], arr[right]],
        arraySnapshot: [...arr],
        pointers: { i: largest, j: right },
        codeLine: 7,
        counters: { comparisons, swaps },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Comparing current largest arr[${largest}]=${arr[largest]} with right child arr[${right}]=${arr[right]}.`,
        reasoning:
          arr[right] > arr[largest]
            ? `Right child ${arr[right]} exceeds largest element ${arr[largest]}; candidate for promotion.`
            : `Right child ${arr[right]} does not exceed largest element ${arr[largest]}.`,
        inlineVariables: { largest, rightChild: right, heapBoundary: heapSize },
      });
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      swaps++;
      const valI = arr[i];
      const valL = arr[largest];
      arr[i] = valL;
      arr[largest] = valI;

      steps.push({
        stepIndex: steps.length,
        action: "swap",
        indices: [i, largest],
        values: [arr[i], arr[largest]],
        arraySnapshot: [...arr],
        pointers: { i, j: largest },
        codeLine: 10,
        counters: { comparisons, swaps },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Swapped arr[${i}]=${valI} with larger child arr[${largest}]=${valL} to restore max-heap invariant.`,
        reasoning: `Max-heap requires parent to be greater than or equal to both children. Sifting down to subtree at index ${largest}.`,
        inlineVariables: { swappedParent: i, swappedChild: largest, heapBoundary: heapSize },
      });

      heapify(heapSize, largest);
    }
  }

  // Phase 1: Build Max-Heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    currentPass++;
    heapify(n, i);
  }

  // Phase 2: Extraction
  for (let i = n - 1; i > 0; i--) {
    currentPass++;
    swaps++;
    const rootVal = arr[0];
    const boundaryVal = arr[i];
    arr[0] = boundaryVal;
    arr[i] = rootVal;

    steps.push({
      stepIndex: steps.length,
      action: "swap",
      indices: [0, i],
      values: [arr[0], arr[i]],
      arraySnapshot: [...arr],
      pointers: { i: 0, j: i },
      codeLine: 20,
      counters: { comparisons, swaps },
      pass: currentPass,
      sortedIndices: [...sorted],
      description: `Extracted max root element (${rootVal}) to boundary index ${i}.`,
      reasoning:
        "The root of a max-heap is guaranteed to be the maximum among all remaining heap elements. Moving it to its final sorted position.",
      inlineVariables: { maxExtracted: rootVal, targetIndex: i, remainingHeapSize: i },
    });

    sorted.unshift(i);

    steps.push({
      stepIndex: steps.length,
      action: "sorted",
      indices: [i],
      values: [arr[i]],
      arraySnapshot: [...arr],
      pointers: { j: i },
      codeLine: 20,
      counters: { comparisons, swaps },
      pass: currentPass,
      sortedIndices: [...sorted],
      description: `Index ${i} (${arr[i]}) locked into sorted suffix.`,
      reasoning: `The suffix [${i}..${n - 1}] is permanently sorted. Active heap reduced to [0..${i - 1}].`,
      inlineVariables: { lockedIndex: i, remainingHeapSize: i },
    });

    heapify(i, 0);
  }

  sorted.unshift(0);

  steps.push({
    stepIndex: steps.length,
    action: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    values: [...arr],
    arraySnapshot: [...arr],
    pointers: {},
    codeLine: 22,
    counters: { comparisons, swaps },
    pass: currentPass,
    sortedIndices: [...sorted],
    description: "Array is completely sorted via Heap Sort.",
    reasoning:
      "All elements extracted from binary max-heap. In-place O(n log n) sorting complete with O(1) auxiliary space.",
    inlineVariables: { status: "Complete", totalComparisons: comparisons, totalSwaps: swaps },
  });

  return steps;
}

export function generateRadixSortTrace(array: number[]): AlgorithmTraceStep[] {
  const steps: AlgorithmTraceStep[] = [];
  const arr = [...array];
  const n = arr.length;
  let comparisons = 0;
  let overwrites = 0;
  let currentPass = 0;
  const sorted: number[] = [];

  // Step 0: Initial
  steps.push({
    stepIndex: 0,
    action: "init",
    indices: [],
    values: [],
    arraySnapshot: [...arr],
    pointers: {},
    codeLine: 18,
    counters: { comparisons, swaps: overwrites },
    pass: 0,
    sortedIndices: [],
    description: `Initial unsorted array of length N = ${n}.`,
    reasoning:
      "LSD Radix Sort sorts keys digit-by-digit from least significant to most significant using stable Counting Sort passes.",
    inlineVariables: { arraySize: n, algorithm: "LSD Radix Sort" },
  });

  if (n <= 1) {
    steps.push({
      stepIndex: steps.length,
      action: "sorted",
      indices: Array.from({ length: n }, (_, k) => k),
      values: [...arr],
      arraySnapshot: [...arr],
      pointers: {},
      codeLine: 22,
      counters: { comparisons, swaps: overwrites },
      pass: 0,
      sortedIndices: Array.from({ length: n }, (_, k) => k),
      description: "Array is sorted.",
      reasoning: "Array with length <= 1 is trivially sorted.",
      inlineVariables: { status: "Complete" },
    });
    return steps;
  }

  const maxVal = Math.max(...arr);

  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    currentPass++;
    const placeName =
      exp === 1 ? "1s (units)" : exp === 10 ? "10s (tens)" : exp === 100 ? "100s (hundreds)" : `${exp}s`;

    // Counting phase
    const count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) {
      comparisons++;
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;

      steps.push({
        stepIndex: steps.length,
        action: "compare",
        indices: [i],
        values: [arr[i]],
        arraySnapshot: [...arr],
        pointers: { i },
        codeLine: 5,
        counters: { comparisons, swaps: overwrites },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Inspecting ${arr[i]} at ${placeName} place: digit = ${digit}.`,
        reasoning: `Bucketing key into count frequency array for digit ${digit}.`,
        inlineVariables: { element: arr[i], digit, exponent: exp, countForDigit: count[digit] },
      });
    }

    // Prefix sum / cumulative positions
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Output array construction (iterating backwards to preserve stability!)
    const output = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    // Overwrite back to array
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      overwrites++;

      steps.push({
        stepIndex: steps.length,
        action: "overwrite",
        indices: [i],
        values: [arr[i]],
        arraySnapshot: [...arr],
        pointers: { k: i },
        codeLine: 14,
        counters: { comparisons, swaps: overwrites },
        pass: currentPass,
        sortedIndices: [...sorted],
        description: `Placed ${arr[i]} into index ${i} sorted stably by ${placeName} digit.`,
        reasoning: `Values stably relocated according to cumulative frequency offsets for digit place ${exp}.`,
        inlineVariables: { placedValue: arr[i], targetIndex: i, digitPlace: exp },
      });
    }
  }

  // All passes complete, array is fully sorted
  const allIndices = Array.from({ length: n }, (_, k) => k);
  steps.push({
    stepIndex: steps.length,
    action: "sorted",
    indices: allIndices,
    values: [...arr],
    arraySnapshot: [...arr],
    pointers: {},
    codeLine: 22,
    counters: { comparisons, swaps: overwrites },
    pass: currentPass,
    sortedIndices: allIndices,
    description: "Array is completely sorted via LSD Radix Sort.",
    reasoning: "All digit places processed stably. Linear O(d · (n + k)) non-comparative sort completed.",
    inlineVariables: { status: "Complete", totalDigits: currentPass, totalOverwrites: overwrites },
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
    case "merge":
      return generateMergeSortTrace(array);
    case "heapsort":
      return generateHeapSortTrace(array);
    case "radix":
      return generateRadixSortTrace(array);
    default:
      return generateBubbleSortTrace(array);
  }
}
