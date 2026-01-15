/**
 * AlgoPiece MVP - Challenge Data
 * Challenge configurations for each algorithm
 */

export const challengeData = {
    'linear-search': {
        title: 'Build Linear Search',
        description: 'Create a function that searches through an array one element at a time to find a target value.',
        objective: 'Loop through the array and return the index when you find the target. Return -1 if not found.',
        xpReward: 50,
        hints: [
            'Start by creating a variable to store your array',
            'Use a "for" loop to go through each element',
            'Inside the loop, compare each element with your target',
            'If they match, log the index. Otherwise, continue to the next element'
        ],
        testCases: [
            { input: { arr: [5, 3, 8, 1, 9], target: 8 }, expected: 2 },
            { input: { arr: [5, 3, 8, 1, 9], target: 1 }, expected: 3 },
            { input: { arr: [5, 3, 8, 1, 9], target: 7 }, expected: -1 }
        ],
        starterHint: 'Create an array, then use a loop to check each element'
    },
    'binary-search': {
        title: 'Build Binary Search',
        description: 'Create a function that efficiently searches a SORTED array by repeatedly dividing the search space in half.',
        objective: 'Use left and right pointers. Find the middle, compare with target, and narrow down the search space.',
        xpReward: 100,
        hints: [
            'You need three variables: left (starts at 0), right (starts at array length - 1), and mid',
            'Use a "while" loop that continues while left <= right',
            'Calculate mid as the floor of (left + right) / 2',
            'If arr[mid] equals target, you found it! If arr[mid] < target, search right half. Otherwise, search left half.'
        ],
        testCases: [
            { input: { arr: [1, 3, 5, 7, 9, 11], target: 7 }, expected: 3 },
            { input: { arr: [1, 3, 5, 7, 9, 11], target: 1 }, expected: 0 },
            { input: { arr: [1, 3, 5, 7, 9, 11], target: 6 }, expected: -1 }
        ],
        starterHint: 'Set up left=0, right=length-1, then use a while loop'
    },
    'bubble-sort': {
        title: 'Build Bubble Sort',
        description: 'Create a function that sorts an array by repeatedly comparing adjacent elements and swapping them if they are in the wrong order.',
        objective: 'Use nested loops: outer loop for passes, inner loop to compare and swap adjacent elements.',
        xpReward: 75,
        hints: [
            'You need two nested loops',
            'The outer loop runs n-1 times (where n is array length)',
            'The inner loop compares adjacent elements',
            'Use the swap block when arr[j] > arr[j+1]'
        ],
        testCases: [
            { input: { arr: [64, 34, 25, 12, 22] }, expected: [12, 22, 25, 34, 64] },
            { input: { arr: [5, 1, 4, 2, 8] }, expected: [1, 2, 4, 5, 8] },
            { input: { arr: [3, 2, 1] }, expected: [1, 2, 3] }
        ],
        starterHint: 'Create an array, then use two nested "for" loops'
    },
    'insertion-sort': {
        title: 'Build Insertion Sort',
        description: 'Create a function that builds a sorted array one element at a time by inserting each new element in its correct position.',
        objective: 'Start from the second element, compare it with previous elements, and shift larger elements to make room.',
        xpReward: 75,
        hints: [
            'Start your loop from index 1 (second element)',
            'Store the current element in a "key" variable',
            'Use an inner loop to shift elements greater than the key',
            'Insert the key in its correct position after shifting'
        ],
        testCases: [
            { input: { arr: [12, 11, 13, 5, 6] }, expected: [5, 6, 11, 12, 13] },
            { input: { arr: [4, 3, 2, 1] }, expected: [1, 2, 3, 4] }
        ],
        starterHint: 'Loop from i=1, save arr[i] as key, shift larger elements right'
    },
    'merge-sort': {
        title: 'Understand Merge Sort',
        description: 'Merge Sort divides the array into halves, sorts them recursively, and merges them back. This challenge focuses on the merge step.',
        objective: 'Given two sorted arrays, merge them into one sorted array.',
        xpReward: 125,
        hints: [
            'Create an empty result array',
            'Use two index pointers, one for each input array',
            'Compare elements at both pointers, add the smaller one to result',
            'Don\'t forget to add remaining elements after one array is exhausted'
        ],
        testCases: [
            { input: { left: [1, 3, 5], right: [2, 4, 6] }, expected: [1, 2, 3, 4, 5, 6] },
            { input: { left: [1, 2], right: [3, 4] }, expected: [1, 2, 3, 4] }
        ],
        starterHint: 'Create result array, compare elements from both arrays'
    },
    'quick-sort': {
        title: 'Understand Quick Sort Partition',
        description: 'Quick Sort picks a pivot and partitions elements around it. This challenge focuses on the partition step.',
        objective: 'Given an array and a pivot (last element), rearrange so elements smaller than pivot are on the left.',
        xpReward: 125,
        hints: [
            'Use the last element as the pivot',
            'Keep a pointer i that tracks where smaller elements should go',
            'Loop through and swap elements smaller than pivot to position i',
            'Finally, place the pivot in its correct position'
        ],
        testCases: [
            { input: { arr: [10, 7, 8, 9, 1, 5] }, expectedPivotIndex: 1 },
            { input: { arr: [3, 2, 1, 5, 4] }, expectedPivotIndex: 3 }
        ],
        starterHint: 'Set pivot as last element, use i to track swap position'
    },
    'bfs': {
        title: 'Build BFS Traversal',
        description: 'Create a Breadth-First Search that visits nodes level by level using a queue.',
        objective: 'Start from a node, visit all neighbors before going deeper. Use a queue to track nodes to visit.',
        xpReward: 150,
        hints: [
            'Create a queue and add the starting node',
            'Create a set to track visited nodes',
            'Use a while loop that runs while queue is not empty',
            'For each node, add its unvisited neighbors to the queue'
        ],
        testCases: [
            { input: { start: 'A' }, expectedOrder: ['A', 'B', 'C', 'D', 'E'] }
        ],
        starterHint: 'Use a queue (list), add start node, loop while queue not empty'
    },
    'dfs': {
        title: 'Build DFS Traversal',
        description: 'Create a Depth-First Search that explores as deep as possible before backtracking.',
        objective: 'Start from a node, visit a neighbor, then that neighbor\'s neighbor, etc. Backtrack when stuck.',
        xpReward: 150,
        hints: [
            'You can use a stack or recursion',
            'Track visited nodes to avoid cycles',
            'For each node, visit an unvisited neighbor and go deep',
            'Backtrack when all neighbors are visited'
        ],
        testCases: [
            { input: { start: 'A' }, expectedOrder: ['A', 'B', 'D', 'C', 'E'] }
        ],
        starterHint: 'Use recursion or a stack, track visited nodes'
    },
    'dijkstra': {
        title: 'Understand Dijkstra\'s Algorithm',
        description: 'Dijkstra finds the shortest path in a weighted graph. This challenge focuses on understanding the relaxation step.',
        objective: 'Update distances when you find a shorter path through the current node.',
        xpReward: 200,
        hints: [
            'Initialize all distances to infinity except start (0)',
            'Always process the node with the smallest known distance',
            'For each neighbor, check if going through current node is shorter',
            'If shorter, update the distance'
        ],
        testCases: [
            { input: { start: 'A' }, expectedDistances: { A: 0, B: 4, C: 2, D: 7 } }
        ],
        starterHint: 'Set distances, pick minimum unvisited, update neighbor distances'
    }
};

/**
 * Get challenge data for a specific algorithm
 */
export const getChallengeById = (algorithmId) => {
    return challengeData[algorithmId] || null;
};

/**
 * Check if an algorithm has a challenge
 */
export const hasChallenge = (algorithmId) => {
    return algorithmId in challengeData;
};
