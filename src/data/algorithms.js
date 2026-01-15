/**
 * AlgoPiece MVP - Algorithm Mock Data
 * Comprehensive catalog of algorithms with metadata
 */

export const algorithmCategories = [
    {
        id: 'searching',
        name: 'Searching Algorithms',
        icon: '🔍',
        description: 'Find elements in data structures efficiently',
        color: '#3b82f6',
        algorithms: [
            {
                id: 'linear-search',
                name: 'Linear Search',
                difficulty: 'Easy',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                description: 'Find an element by checking each item sequentially from start to end.',
                longDescription: `Linear Search is the simplest searching algorithm. It works by sequentially checking each element of the list until a match is found or the entire list has been searched.

**How it works:**
1. Start from the first element
2. Compare the target value with the current element
3. If they match, return the index
4. If not, move to the next element
5. Repeat until found or end of list

**Best used when:**
- The list is small
- The list is unsorted
- You're searching only once`,
                code: {
                    javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
                    python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`
                }
            },
            {
                id: 'binary-search',
                name: 'Binary Search',
                difficulty: 'Medium',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(1)',
                description: 'Find an element in a sorted array by repeatedly dividing the search space in half.',
                longDescription: `Binary Search is a highly efficient searching algorithm that works on sorted arrays. It repeatedly divides the search interval in half.

**How it works:**
1. Start with the middle element
2. If target equals middle, we're done
3. If target is less, search the left half
4. If target is greater, search the right half
5. Repeat until found or search space is empty

**Requirements:**
- The array must be sorted

**Best used when:**
- The list is large
- The list is sorted
- Multiple searches will be performed`,
                code: {
                    javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}`,
                    python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`
                }
            }
        ]
    },
    {
        id: 'sorting',
        name: 'Sorting Algorithms',
        icon: '📊',
        description: 'Arrange elements in a specific order',
        color: '#7c3aed',
        algorithms: [
            {
                id: 'bubble-sort',
                name: 'Bubble Sort',
                difficulty: 'Easy',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                description: 'Compare adjacent elements and swap them if they are in the wrong order.',
                longDescription: `Bubble Sort is one of the simplest sorting algorithms. It repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order.

**How it works:**
1. Start at the beginning of the array
2. Compare adjacent elements
3. Swap if they're in the wrong order
4. Move to the next pair
5. Repeat until no swaps are needed

**Why it's called "Bubble":**
Smaller elements "bubble" to the top (beginning) of the list with each iteration.

**Best used for:**
- Educational purposes
- Small datasets
- Nearly sorted arrays`,
                code: {
                    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`,
                    python: `def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    
    return arr`
                }
            },
            {
                id: 'insertion-sort',
                name: 'Insertion Sort',
                difficulty: 'Easy',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                description: 'Build the sorted array one item at a time by inserting each element in its correct position.',
                longDescription: `Insertion Sort builds the final sorted array one item at a time. It's much like sorting playing cards in your hands.

**How it works:**
1. Start with the second element
2. Compare it with elements before it
3. Shift larger elements to the right
4. Insert the element in its correct position
5. Move to the next unsorted element

**Best used for:**
- Small datasets
- Nearly sorted arrays
- Online sorting (data coming in streams)`,
                code: {
                    javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
  }
  
  return arr;
}`,
                    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        arr[j + 1] = key
    
    return arr`
                }
            },
            {
                id: 'merge-sort',
                name: 'Merge Sort',
                difficulty: 'Medium',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                description: 'Divide the array into halves, sort each half, then merge them back together.',
                longDescription: `Merge Sort is an efficient, stable, divide-and-conquer sorting algorithm. It divides the input into smaller subproblems and merges sorted solutions.

**How it works:**
1. Divide the array into two halves
2. Recursively sort each half
3. Merge the sorted halves
4. The merge step compares elements and combines them in order

**Key characteristics:**
- Stable sort (maintains relative order of equal elements)
- Consistent O(n log n) performance
- Requires additional space for merging`,
                code: {
                    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
                    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    return result + left[i:] + right[j:]`
                }
            },
            {
                id: 'quick-sort',
                name: 'Quick Sort',
                difficulty: 'Medium',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(log n)',
                description: 'Pick a pivot element and partition the array around it, then recursively sort partitions.',
                longDescription: `Quick Sort is a highly efficient sorting algorithm that uses divide-and-conquer. It picks a pivot and partitions the array around it.

**How it works:**
1. Choose a pivot element
2. Partition: elements smaller than pivot go left, larger go right
3. Recursively apply to left and right partitions
4. Combine the results

**Key characteristics:**
- In-place sorting (low space complexity)
- Average case O(n log n), but O(n²) worst case
- Not stable (may change order of equal elements)`,
                code: {
                    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
                    python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`
                }
            }
        ]
    },
    {
        id: 'graph',
        name: 'Graph Algorithms',
        icon: '🌐',
        description: 'Traverse and analyze graph structures',
        color: '#10b981',
        algorithms: [
            {
                id: 'bfs',
                name: 'Breadth First Search',
                difficulty: 'Medium',
                timeComplexity: 'O(V + E)',
                spaceComplexity: 'O(V)',
                description: 'Explore a graph level by level, visiting all neighbors before moving deeper.',
                longDescription: `Breadth First Search (BFS) explores a graph layer by layer. It visits all vertices at the current depth before moving to vertices at the next depth level.

**How it works:**
1. Start at a source vertex
2. Visit all immediate neighbors
3. Then visit all neighbors of those neighbors
4. Continue until all reachable vertices are visited
5. Uses a queue to track vertices to visit

**Applications:**
- Shortest path in unweighted graphs
- Finding connected components
- Web crawlers
- Social network analysis`,
                code: {
                    javascript: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);
    
    for (const neighbor of graph[vertex] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
                    python: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    result = []
    
    visited.add(start)
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result`
                }
            },
            {
                id: 'dfs',
                name: 'Depth First Search',
                difficulty: 'Medium',
                timeComplexity: 'O(V + E)',
                spaceComplexity: 'O(V)',
                description: 'Explore as deep as possible along each branch before backtracking.',
                longDescription: `Depth First Search (DFS) explores a graph by going as deep as possible along each branch before backtracking.

**How it works:**
1. Start at a source vertex
2. Visit an unvisited neighbor
3. Recursively explore from that neighbor
4. Backtrack when no unvisited neighbors remain
5. Uses a stack (or recursion) to track the path

**Applications:**
- Topological sorting
- Finding connected components
- Detecting cycles
- Maze solving
- Path finding`,
                code: {
                    javascript: `function dfs(graph, start, visited = new Set()) {
  const result = [];
  
  function explore(vertex) {
    if (visited.has(vertex)) return;
    
    visited.add(vertex);
    result.push(vertex);
    
    for (const neighbor of graph[vertex] || []) {
      explore(neighbor);
    }
  }
  
  explore(start);
  return result;
}`,
                    python: `def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    result = []
    
    def explore(vertex):
        if vertex in visited:
            return
        
        visited.add(vertex)
        result.append(vertex)
        
        for neighbor in graph.get(vertex, []):
            explore(neighbor)
    
    explore(start)
    return result`
                }
            },
            {
                id: 'dijkstra',
                name: "Dijkstra's Algorithm",
                difficulty: 'Hard',
                timeComplexity: 'O((V + E) log V)',
                spaceComplexity: 'O(V)',
                description: 'Find the shortest paths from a source vertex to all other vertices in a weighted graph.',
                longDescription: `Dijkstra's Algorithm finds the shortest path between nodes in a weighted graph. It's one of the most important algorithms in computer science.

**How it works:**
1. Set distance to source as 0, all others as infinity
2. Add source to priority queue
3. Extract minimum distance vertex
4. Update distances to all neighbors
5. Repeat until all vertices are processed

**Requirements:**
- No negative edge weights

**Applications:**
- GPS navigation
- Network routing
- Game pathfinding`,
                code: {
                    javascript: `function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const pq = [[0, start]]; // [distance, vertex]
  
  // Initialize distances
  for (const vertex in graph) {
    distances[vertex] = Infinity;
  }
  distances[start] = 0;
  
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [dist, current] = pq.shift();
    
    if (visited.has(current)) continue;
    visited.add(current);
    
    for (const [neighbor, weight] of graph[current] || []) {
      const newDist = dist + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.push([newDist, neighbor]);
      }
    }
  }
  
  return distances;
}`,
                    python: `import heapq

def dijkstra(graph, start):
    distances = {v: float('infinity') for v in graph}
    distances[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        dist, current = heapq.heappop(pq)
        
        if current in visited:
            continue
        visited.add(current)
        
        for neighbor, weight in graph.get(current, []):
            new_dist = dist + weight
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    
    return distances`
                }
            }
        ]
    }
];

// Get all algorithms flattened
export const getAllAlgorithms = () => {
    return algorithmCategories.flatMap(category =>
        category.algorithms.map(algo => ({
            ...algo,
            category: category.id,
            categoryName: category.name,
            categoryIcon: category.icon,
            categoryColor: category.color
        }))
    );
};

// Get algorithm by ID
export const getAlgorithmById = (id) => {
    return getAllAlgorithms().find(algo => algo.id === id);
};

// Get algorithms by category
export const getAlgorithmsByCategory = (categoryId) => {
    const category = algorithmCategories.find(c => c.id === categoryId);
    return category ? category.algorithms : [];
};

// Statistics
export const getStats = () => ({
    totalAlgorithms: getAllAlgorithms().length,
    categories: algorithmCategories.length,
    easyCount: getAllAlgorithms().filter(a => a.difficulty === 'Easy').length,
    mediumCount: getAllAlgorithms().filter(a => a.difficulty === 'Medium').length,
    hardCount: getAllAlgorithms().filter(a => a.difficulty === 'Hard').length
});
