import { useState, useEffect, useCallback, useRef } from 'react';
import './ArrayVisualizer.css';

const ArrayVisualizer = ({ algorithmId }) => {
    const [array, setArray] = useState([]);
    const [comparing, setComparing] = useState([]);
    const [sorted, setSorted] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [searchTarget, setSearchTarget] = useState(null);
    const [foundIndex, setFoundIndex] = useState(-1);
    const animationRef = useRef(null);
    const pauseRef = useRef(false);

    // Generate random array
    const generateArray = useCallback(() => {
        const newArray = Array.from({ length: 15 }, () =>
            Math.floor(Math.random() * 90) + 10
        );

        // For binary search, sort the array
        if (algorithmId === 'binary-search') {
            newArray.sort((a, b) => a - b);
        }

        setArray(newArray);
        setComparing([]);
        setSorted([]);
        setFoundIndex(-1);
        setSearchTarget(null);
        setIsRunning(false);
        setIsPaused(false);
    }, [algorithmId]);

    useEffect(() => {
        generateArray();
    }, [generateArray]);

    // Delay helper
    const delay = (ms) => new Promise(resolve => {
        animationRef.current = setTimeout(resolve, ms);
    });

    // Check if paused
    const checkPause = async () => {
        while (pauseRef.current) {
            await delay(100);
        }
    };

    // Bubble Sort
    const bubbleSort = async () => {
        const arr = [...array];
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                await checkPause();
                setComparing([j, j + 1]);
                await delay((100 - speed) * 5 + 50);

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setArray([...arr]);
                }
            }
            setSorted(prev => [...prev, n - i - 1]);
        }
        setSorted(Array.from({ length: n }, (_, i) => i));
        setComparing([]);
    };

    // Insertion Sort
    const insertionSort = async () => {
        const arr = [...array];
        const n = arr.length;

        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;

            setComparing([i]);
            await delay((100 - speed) * 5 + 50);

            while (j >= 0 && arr[j] > key) {
                await checkPause();
                setComparing([j, j + 1]);
                arr[j + 1] = arr[j];
                setArray([...arr]);
                await delay((100 - speed) * 5 + 50);
                j--;
            }
            arr[j + 1] = key;
            setArray([...arr]);
        }
        setSorted(Array.from({ length: n }, (_, i) => i));
        setComparing([]);
    };

    // Quick Sort
    const quickSort = async () => {
        const arr = [...array];

        const partition = async (low, high) => {
            const pivot = arr[high];
            let i = low - 1;

            for (let j = low; j < high; j++) {
                await checkPause();
                setComparing([j, high]);
                await delay((100 - speed) * 5 + 50);

                if (arr[j] <= pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    setArray([...arr]);
                }
            }
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            setArray([...arr]);
            return i + 1;
        };

        const sort = async (low, high) => {
            if (low < high) {
                const pi = await partition(low, high);
                setSorted(prev => [...prev, pi]);
                await sort(low, pi - 1);
                await sort(pi + 1, high);
            }
        };

        await sort(0, arr.length - 1);
        setSorted(Array.from({ length: arr.length }, (_, i) => i));
        setComparing([]);
    };

    // Merge Sort
    const mergeSort = async () => {
        const arr = [...array];

        const merge = async (left, mid, right) => {
            const leftArr = arr.slice(left, mid + 1);
            const rightArr = arr.slice(mid + 1, right + 1);
            let i = 0, j = 0, k = left;

            while (i < leftArr.length && j < rightArr.length) {
                await checkPause();
                setComparing([left + i, mid + 1 + j]);
                await delay((100 - speed) * 5 + 50);

                if (leftArr[i] <= rightArr[j]) {
                    arr[k] = leftArr[i];
                    i++;
                } else {
                    arr[k] = rightArr[j];
                    j++;
                }
                setArray([...arr]);
                k++;
            }

            while (i < leftArr.length) {
                arr[k] = leftArr[i];
                setArray([...arr]);
                i++;
                k++;
            }

            while (j < rightArr.length) {
                arr[k] = rightArr[j];
                setArray([...arr]);
                j++;
                k++;
            }
        };

        const sort = async (left, right) => {
            if (left < right) {
                const mid = Math.floor((left + right) / 2);
                await sort(left, mid);
                await sort(mid + 1, right);
                await merge(left, mid, right);
            }
        };

        await sort(0, arr.length - 1);
        setSorted(Array.from({ length: arr.length }, (_, i) => i));
        setComparing([]);
    };

    // Linear Search
    const linearSearch = async () => {
        const target = array[Math.floor(Math.random() * array.length)];
        setSearchTarget(target);

        for (let i = 0; i < array.length; i++) {
            await checkPause();
            setComparing([i]);
            await delay((100 - speed) * 5 + 100);

            if (array[i] === target) {
                setFoundIndex(i);
                setComparing([]);
                return;
            }
        }
        setComparing([]);
    };

    // Binary Search
    const binarySearch = async () => {
        const target = array[Math.floor(Math.random() * array.length)];
        setSearchTarget(target);

        let left = 0;
        let right = array.length - 1;

        while (left <= right) {
            await checkPause();
            const mid = Math.floor((left + right) / 2);
            setComparing([mid]);
            await delay((100 - speed) * 5 + 150);

            if (array[mid] === target) {
                setFoundIndex(mid);
                setComparing([]);
                return;
            }
            if (array[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        setComparing([]);
    };

    // Run algorithm
    const runAlgorithm = async () => {
        setIsRunning(true);
        setIsPaused(false);
        pauseRef.current = false;

        try {
            switch (algorithmId) {
                case 'bubble-sort':
                    await bubbleSort();
                    break;
                case 'insertion-sort':
                    await insertionSort();
                    break;
                case 'quick-sort':
                    await quickSort();
                    break;
                case 'merge-sort':
                    await mergeSort();
                    break;
                case 'linear-search':
                    await linearSearch();
                    break;
                case 'binary-search':
                    await binarySearch();
                    break;
                default:
                    await bubbleSort();
            }
        } catch (e) {
            // Animation cancelled
        }

        setIsRunning(false);
    };

    // Pause/Resume
    const togglePause = () => {
        pauseRef.current = !pauseRef.current;
        setIsPaused(!isPaused);
    };

    // Reset
    const reset = () => {
        if (animationRef.current) {
            clearTimeout(animationRef.current);
        }
        pauseRef.current = false;
        generateArray();
    };

    // Get bar style
    const getBarClass = (index) => {
        if (foundIndex === index) return 'bar found';
        if (sorted.includes(index)) return 'bar sorted';
        if (comparing.includes(index)) return 'bar comparing';
        return 'bar';
    };

    const isSearchAlgorithm = algorithmId?.includes('search');
    const maxValue = Math.max(...array, 100);

    return (
        <div className="array-visualizer">
            {/* Controls */}
            <div className="visualizer-controls">
                <div className="control-group">
                    <button
                        className="btn btn-primary"
                        onClick={isRunning && !isPaused ? togglePause : runAlgorithm}
                        disabled={isRunning && isPaused}
                    >
                        {isRunning ? (isPaused ? '⏸ Paused' : '⏸ Pause') : '▶ Play'}
                    </button>
                    {isRunning && isPaused && (
                        <button className="btn btn-secondary" onClick={togglePause}>
                            ▶ Resume
                        </button>
                    )}
                    <button className="btn btn-secondary" onClick={reset}>
                        🔄 Reset
                    </button>
                </div>

                <div className="speed-control">
                    <label>Speed:</label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                    />
                    <span>{speed}%</span>
                </div>
            </div>

            {/* Search Target */}
            {isSearchAlgorithm && searchTarget !== null && (
                <div className="search-info">
                    <span>Searching for: <strong>{searchTarget}</strong></span>
                    {foundIndex !== -1 && (
                        <span className="found-message">Found at index {foundIndex}!</span>
                    )}
                </div>
            )}

            {/* Bars */}
            <div className="bars-container">
                {array.map((value, index) => (
                    <div
                        key={index}
                        className={getBarClass(index)}
                        style={{
                            height: `${(value / maxValue) * 100}%`,
                        }}
                    >
                        <span className="bar-value">{value}</span>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="visualizer-legend">
                <span className="legend-item">
                    <span className="legend-color comparing"></span>
                    Comparing
                </span>
                {isSearchAlgorithm ? (
                    <span className="legend-item">
                        <span className="legend-color found"></span>
                        Found
                    </span>
                ) : (
                    <span className="legend-item">
                        <span className="legend-color sorted"></span>
                        Sorted
                    </span>
                )}
            </div>
        </div>
    );
};

export default ArrayVisualizer;
