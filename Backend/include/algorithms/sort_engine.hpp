#pragma once

#include <vector>
#include <string>
#include <sstream>
#include "crow/crow_all.h"

namespace dsa {

struct TraceStep {
    int stepIndex;
    std::string action; // "init", "compare", "swap", "overwrite", "pivot", "sorted"
    std::vector<int> indices;
    std::vector<int> arraySnapshot;
    std::string description;
    int codeLine;

    crow::json::wvalue toJson() const {
        crow::json::wvalue json;
        json["stepIndex"] = stepIndex;
        json["action"] = action;

        // Serialize indices
        std::vector<crow::json::wvalue> idxList;
        for (int idx : indices) {
            idxList.emplace_back(idx);
        }
        json["indices"] = std::move(idxList);

        // Serialize array snapshot
        std::vector<crow::json::wvalue> snapList;
        for (int val : arraySnapshot) {
            snapList.emplace_back(val);
        }
        json["arraySnapshot"] = std::move(snapList);

        json["description"] = description;
        json["codeLine"] = codeLine;
        return json;
    }
};

class SortEngine {
public:
    static std::vector<TraceStep> bubbleSort(std::vector<int> arr) {
        std::vector<TraceStep> steps;
        int n = static_cast<int>(arr.size());

        steps.push_back({0, "init", {}, arr, "Initial unsorted array", 2});

        for (int i = 0; i < n - 1; ++i) {
            for (int j = 0; j < n - i - 1; ++j) {
                std::ostringstream compDesc;
                compDesc << "Comparing elements arr[" << j << "]=" << arr[j]
                         << " and arr[" << (j + 1) << "]=" << arr[j + 1];
                steps.push_back({
                    static_cast<int>(steps.size()),
                    "compare",
                    {j, j + 1},
                    arr,
                    compDesc.str(),
                    5
                });

                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    std::swap(arr[j], arr[j + 1]);

                    std::ostringstream swapDesc;
                    swapDesc << "Swapped arr[" << j << "] and arr[" << (j + 1)
                             << "] because " << temp << " > " << arr[j];
                    steps.push_back({
                        static_cast<int>(steps.size()),
                        "swap",
                        {j, j + 1},
                        arr,
                        swapDesc.str(),
                        6
                    });
                }
            }

            std::ostringstream sortedDesc;
            sortedDesc << "Element at index " << (n - 1 - i) << " is locked in sorted position";
            steps.push_back({
                static_cast<int>(steps.size()),
                "sorted",
                {n - 1 - i},
                arr,
                sortedDesc.str(),
                4
            });
        }

        steps.push_back({
            static_cast<int>(steps.size()),
            "sorted",
            {0},
            arr,
            "Array is completely sorted!",
            9
        });

        return steps;
    }

    static std::vector<TraceStep> selectionSort(std::vector<int> arr) {
        std::vector<TraceStep> steps;
        int n = static_cast<int>(arr.size());

        steps.push_back({0, "init", {}, arr, "Initial unsorted array", 2});

        for (int i = 0; i < n - 1; ++i) {
            int minIdx = i;
            std::ostringstream pivDesc;
            pivDesc << "Assuming index " << minIdx << " (" << arr[minIdx] << ") as current minimum";
            steps.push_back({
                static_cast<int>(steps.size()),
                "pivot",
                {minIdx},
                arr,
                pivDesc.str(),
                4
            });

            for (int j = i + 1; j < n; ++j) {
                std::ostringstream compDesc;
                compDesc << "Comparing arr[" << j << "]=" << arr[j]
                         << " with current minimum arr[" << minIdx << "]=" << arr[minIdx];
                steps.push_back({
                    static_cast<int>(steps.size()),
                    "compare",
                    {j, minIdx},
                    arr,
                    compDesc.str(),
                    6
                });

                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                    std::ostringstream newMinDesc;
                    newMinDesc << "New minimum found at index " << minIdx << " (" << arr[minIdx] << ")";
                    steps.push_back({
                        static_cast<int>(steps.size()),
                        "pivot",
                        {minIdx},
                        arr,
                        newMinDesc.str(),
                        7
                    });
                }
            }

            if (minIdx != i) {
                std::swap(arr[i], arr[minIdx]);
                std::ostringstream swapDesc;
                swapDesc << "Swapped index " << i << " with minimum at index " << minIdx;
                steps.push_back({
                    static_cast<int>(steps.size()),
                    "swap",
                    {i, minIdx},
                    arr,
                    swapDesc.str(),
                    11
                });
            }

            std::ostringstream sortedDesc;
            sortedDesc << "Index " << i << " locked in sorted position";
            steps.push_back({
                static_cast<int>(steps.size()),
                "sorted",
                {i},
                arr,
                sortedDesc.str(),
                3
            });
        }

        steps.push_back({
            static_cast<int>(steps.size()),
            "sorted",
            {n - 1},
            arr,
            "Array is completely sorted!",
            14
        });

        return steps;
    }

    static std::vector<TraceStep> insertionSort(std::vector<int> arr) {
        std::vector<TraceStep> steps;
        int n = static_cast<int>(arr.size());

        steps.push_back({0, "init", {}, arr, "Initial unsorted array", 2});

        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;

            std::ostringstream keyDesc;
            keyDesc << "Selected key = " << key << " at index " << i;
            steps.push_back({
                static_cast<int>(steps.size()),
                "pivot",
                {i},
                arr,
                keyDesc.str(),
                4
            });

            while (j >= 0) {
                std::ostringstream compDesc;
                compDesc << "Comparing arr[" << j << "]=" << arr[j] << " with key=" << key;
                steps.push_back({
                    static_cast<int>(steps.size()),
                    "compare",
                    {j, j + 1},
                    arr,
                    compDesc.str(),
                    6
                });

                if (arr[j] > key) {
                    arr[j + 1] = arr[j];
                    std::ostringstream shiftDesc;
                    shiftDesc << "Shifted arr[" << j << "]=" << arr[j] << " right to index " << (j + 1);
                    steps.push_back({
                        static_cast<int>(steps.size()),
                        "overwrite",
                        {j + 1},
                        arr,
                        shiftDesc.str(),
                        7
                    });
                    j--;
                } else {
                    break;
                }
            }

            arr[j + 1] = key;
            std::ostringstream placeDesc;
            placeDesc << "Placed key=" << key << " at position " << (j + 1);
            steps.push_back({
                static_cast<int>(steps.size()),
                "overwrite",
                {j + 1},
                arr,
                placeDesc.str(),
                10
            });
        }

        std::vector<int> allIndices(n);
        for (int k = 0; k < n; ++k) allIndices[k] = k;
        steps.push_back({
            static_cast<int>(steps.size()),
            "sorted",
            allIndices,
            arr,
            "Array is completely sorted!",
            12
        });

        return steps;
    }

    static std::vector<TraceStep> quickSort(std::vector<int> arr) {
        std::vector<TraceStep> steps;
        steps.push_back({0, "init", {}, arr, "Initial unsorted array", 14});

        quickSortHelper(arr, 0, static_cast<int>(arr.size()) - 1, steps);

        std::vector<int> allIndices(arr.size());
        for (size_t k = 0; k < arr.size(); ++k) allIndices[k] = static_cast<int>(k);
        steps.push_back({
            static_cast<int>(steps.size()),
            "sorted",
            allIndices,
            arr,
            "Array is completely sorted!",
            18
        });

        return steps;
    }

    static std::vector<TraceStep> mergeSort(std::vector<int> arr) {
        std::vector<TraceStep> steps;
        steps.push_back({0, "init", {}, arr, "Initial unsorted array", 2});
        if (!arr.empty()) {
            mergeSortHelper(arr, 0, static_cast<int>(arr.size()) - 1, steps);
        }
        std::vector<int> allIndices(arr.size());
        for (size_t k = 0; k < arr.size(); ++k) allIndices[k] = static_cast<int>(k);
        steps.push_back({
            static_cast<int>(steps.size()),
            "sorted",
            allIndices,
            arr,
            "Array is fully sorted via Merge Sort",
            30
        });
        return steps;
    }

    static std::vector<TraceStep> heapSort(std::vector<int> arr) {
        std::vector<TraceStep> steps;
        int n = static_cast<int>(arr.size());
        steps.push_back({0, "init", {}, arr, "Initial unsorted array", 2});
        if (n <= 1) {
            std::vector<int> allIndices(n);
            for (int k = 0; k < n; ++k) allIndices[k] = k;
            steps.push_back({static_cast<int>(steps.size()), "sorted", allIndices, arr, "Array is sorted", 28});
            return steps;
        }

        // Phase 1: Build max heap
        for (int i = n / 2 - 1; i >= 0; --i) {
            heapify(arr, n, i, steps);
        }

        // Phase 2: One by one extract elements
        std::vector<int> sortedIndices;
        for (int i = n - 1; i > 0; --i) {
            std::swap(arr[0], arr[i]);
            std::ostringstream swapDesc;
            swapDesc << "Swapped root max " << arr[i] << " with boundary element at index " << i;
            steps.push_back({
                static_cast<int>(steps.size()),
                "swap",
                {0, i},
                arr,
                swapDesc.str(),
                18
            });

            sortedIndices.push_back(i);
            steps.push_back({
                static_cast<int>(steps.size()),
                "sorted",
                sortedIndices,
                arr,
                "Element locked in final sorted position",
                20
            });

            heapify(arr, i, 0, steps);
        }

        sortedIndices.push_back(0);
        steps.push_back({
            static_cast<int>(steps.size()),
            "sorted",
            sortedIndices,
            arr,
            "Array is completely sorted via Heap Sort!",
            28
        });

        return steps;
    }

    static std::vector<TraceStep> radixSort(std::vector<int> arr) {
        std::vector<TraceStep> steps;
        int n = static_cast<int>(arr.size());
        steps.push_back({0, "init", {}, arr, "Initial unsorted array", 2});
        if (n <= 1) {
            std::vector<int> allIndices(n);
            for (int k = 0; k < n; ++k) allIndices[k] = k;
            steps.push_back({static_cast<int>(steps.size()), "sorted", allIndices, arr, "Array is sorted", 28});
            return steps;
        }

        int maxVal = arr[0];
        for (int i = 1; i < n; ++i) {
            if (arr[i] > maxVal) maxVal = arr[i];
        }

        for (int exp = 1; maxVal / exp > 0; exp *= 10) {
            radixCountSort(arr, n, exp, steps);
        }

        std::vector<int> allIndices(n);
        for (int k = 0; k < n; ++k) allIndices[k] = k;
        steps.push_back({
            static_cast<int>(steps.size()),
            "sorted",
            allIndices,
            arr,
            "Array is completely sorted via LSD Radix Sort!",
            28
        });

        return steps;
    }

private:
    static int partition(std::vector<int>& arr, int low, int high, std::vector<TraceStep>& steps) {
        int pivot = arr[high];
        std::ostringstream pivDesc;
        pivDesc << "Chosen pivot arr[" << high << "] = " << pivot;
        steps.push_back({
            static_cast<int>(steps.size()),
            "pivot",
            {high},
            arr,
            pivDesc.str(),
            2
        });

        int i = low - 1;

        for (int j = low; j < high; ++j) {
            std::ostringstream compDesc;
            compDesc << "Comparing arr[" << j << "]=" << arr[j] << " with pivot=" << pivot;
            steps.push_back({
                static_cast<int>(steps.size()),
                "compare",
                {j, high},
                arr,
                compDesc.str(),
                5
            });

            if (arr[j] < pivot) {
                i++;
                if (i != j) {
                    std::swap(arr[i], arr[j]);
                    std::ostringstream swapDesc;
                    swapDesc << "Swapped smaller element arr[" << j << "] into lower partition index " << i;
                    steps.push_back({
                        static_cast<int>(steps.size()),
                        "swap",
                        {i, j},
                        arr,
                        swapDesc.str(),
                        7
                    });
                }
            }
        }

        std::swap(arr[i + 1], arr[high]);
        std::ostringstream pivotPlaceDesc;
        pivotPlaceDesc << "Placed pivot " << pivot << " at partition boundary index " << (i + 1);
        steps.push_back({
            static_cast<int>(steps.size()),
            "swap",
            {i + 1, high},
            arr,
            pivotPlaceDesc.str(),
            10
        });

        steps.push_back({
            static_cast<int>(steps.size()),
            "sorted",
            {i + 1},
            arr,
            "Pivot is locked in sorted partition position",
            11
        });

        return i + 1;
    }

    static void quickSortHelper(std::vector<int>& arr, int low, int high, std::vector<TraceStep>& steps) {
        if (low < high) {
            int pi = partition(arr, low, high, steps);
            quickSortHelper(arr, low, pi - 1, steps);
            quickSortHelper(arr, pi + 1, high, steps);
        } else if (low == high && low >= 0 && low < static_cast<int>(arr.size())) {
            steps.push_back({
                static_cast<int>(steps.size()),
                "sorted",
                {low},
                arr,
                "Single element sub-array is sorted",
                16
            });
        }
    }

    static void merge(std::vector<int>& arr, int left, int mid, int right, std::vector<TraceStep>& steps) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        std::vector<int> L(n1), R(n2);
        for (int i = 0; i < n1; ++i) L[i] = arr[left + i];
        for (int j = 0; j < n2; ++j) R[j] = arr[mid + 1 + j];

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            std::ostringstream compDesc;
            compDesc << "Comparing left[" << (left + i) << "]=" << L[i]
                     << " vs right[" << (mid + 1 + j) << "]=" << R[j];
            steps.push_back({
                static_cast<int>(steps.size()),
                "compare",
                {left + i, mid + 1 + j},
                arr,
                compDesc.str(),
                14
            });

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }

            std::ostringstream placeDesc;
            placeDesc << "Copied " << arr[k] << " into merged array at index " << k;
            steps.push_back({
                static_cast<int>(steps.size()),
                "overwrite",
                {k},
                arr,
                placeDesc.str(),
                18
            });
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            steps.push_back({
                static_cast<int>(steps.size()),
                "overwrite",
                {k},
                arr,
                "Copied remaining left element",
                22
            });
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            steps.push_back({
                static_cast<int>(steps.size()),
                "overwrite",
                {k},
                arr,
                "Copied remaining right element",
                25
            });
            j++;
            k++;
        }
    }

    static void mergeSortHelper(std::vector<int>& arr, int left, int right, std::vector<TraceStep>& steps) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSortHelper(arr, left, mid, steps);
            mergeSortHelper(arr, mid + 1, right, steps);
            merge(arr, left, mid, right, steps);
        }
    }

    static void heapify(std::vector<int>& arr, int n, int i, std::vector<TraceStep>& steps) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n) {
            std::ostringstream compDesc;
            compDesc << "Comparing root arr[" << largest << "]=" << arr[largest] << " with left child arr[" << left << "]=" << arr[left];
            steps.push_back({
                static_cast<int>(steps.size()),
                "compare",
                {largest, left},
                arr,
                compDesc.str(),
                6
            });
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }

        if (right < n) {
            std::ostringstream compDesc;
            compDesc << "Comparing current largest arr[" << largest << "]=" << arr[largest] << " with right child arr[" << right << "]=" << arr[right];
            steps.push_back({
                static_cast<int>(steps.size()),
                "compare",
                {largest, right},
                arr,
                compDesc.str(),
                9
            });
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }

        if (largest != i) {
            std::swap(arr[i], arr[largest]);
            std::ostringstream swapDesc;
            swapDesc << "Swapped arr[" << i << "] with larger child arr[" << largest << "]";
            steps.push_back({
                static_cast<int>(steps.size()),
                "swap",
                {i, largest},
                arr,
                swapDesc.str(),
                12
            });

            heapify(arr, n, largest, steps);
        }
    }

    static void radixCountSort(std::vector<int>& arr, int n, int exp, std::vector<TraceStep>& steps) {
        std::vector<int> output(n);
        int count[10] = {0};

        for (int i = 0; i < n; ++i) {
            int digit = (arr[i] / exp) % 10;
            count[digit]++;
            std::ostringstream desc;
            desc << "Inspecting digit of arr[" << i << "]=" << arr[i] << " at place " << exp << ": digit=" << digit;
            steps.push_back({
                static_cast<int>(steps.size()),
                "compare",
                {i},
                arr,
                desc.str(),
                8
            });
        }

        for (int i = 1; i < 10; ++i) {
            count[i] += count[i - 1];
        }

        for (int i = n - 1; i >= 0; --i) {
            int digit = (arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }

        for (int i = 0; i < n; ++i) {
            arr[i] = output[i];
            std::ostringstream desc;
            desc << "Placed " << arr[i] << " at index " << i << " sorted by digit place " << exp;
            steps.push_back({
                static_cast<int>(steps.size()),
                "overwrite",
                {i},
                arr,
                desc.str(),
                18
            });
        }
    }
};

} // namespace dsa

