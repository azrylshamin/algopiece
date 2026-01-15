import { useState, useEffect, useCallback, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
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
    const [stepInfo, setStepInfo] = useState('Click Play to start visualization');
    const animationRef = useRef(null);
    const pauseRef = useRef(false);

    // Generate random array
    const generateArray = useCallback(() => {
        const newArray = Array.from({ length: 12 }, () =>
            Math.floor(Math.random() * 80) + 20
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
        setStepInfo('Click Play to start visualization');
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

    // Get delay based on speed
    const getDelay = () => (100 - speed) * 8 + 100;

    // Bubble Sort
    const bubbleSort = async () => {
        const arr = [...array];
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                await checkPause();
                setComparing([j, j + 1]);
                setStepInfo(`Comparing ${arr[j]} with ${arr[j + 1]}`);
                await delay(getDelay());

                if (arr[j] > arr[j + 1]) {
                    setStepInfo(`Swapping ${arr[j]} and ${arr[j + 1]}`);
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setArray([...arr]);
                    await delay(getDelay());
                }
            }
            setSorted(prev => [...prev, n - i - 1]);
        }
        setSorted(Array.from({ length: n }, (_, i) => i));
        setComparing([]);
        setStepInfo('✓ Array sorted!');
    };

    // Insertion Sort
    const insertionSort = async () => {
        const arr = [...array];
        const n = arr.length;

        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;

            setComparing([i]);
            setStepInfo(`Inserting ${key} into sorted portion`);
            await delay(getDelay());

            while (j >= 0 && arr[j] > key) {
                await checkPause();
                setComparing([j, j + 1]);
                setStepInfo(`Moving ${arr[j]} to the right`);
                arr[j + 1] = arr[j];
                setArray([...arr]);
                await delay(getDelay());
                j--;
            }
            arr[j + 1] = key;
            setArray([...arr]);
        }
        setSorted(Array.from({ length: n }, (_, i) => i));
        setComparing([]);
        setStepInfo('✓ Array sorted!');
    };

    // Quick Sort
    const quickSort = async () => {
        const arr = [...array];

        const partition = async (low, high) => {
            const pivot = arr[high];
            setStepInfo(`Pivot: ${pivot}`);
            let i = low - 1;

            for (let j = low; j < high; j++) {
                await checkPause();
                setComparing([j, high]);
                await delay(getDelay());

                if (arr[j] <= pivot) {
                    i++;
                    setStepInfo(`Swapping ${arr[i]} and ${arr[j]}`);
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    setArray([...arr]);
                    await delay(getDelay());
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
        setStepInfo('✓ Array sorted!');
    };

    // Merge Sort
    const mergeSort = async () => {
        const arr = [...array];

        const merge = async (left, mid, right) => {
            const leftArr = arr.slice(left, mid + 1);
            const rightArr = arr.slice(mid + 1, right + 1);
            let i = 0, j = 0, k = left;

            setStepInfo(`Merging subarrays`);

            while (i < leftArr.length && j < rightArr.length) {
                await checkPause();
                setComparing([left + i, mid + 1 + j]);
                await delay(getDelay());

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
        setStepInfo('✓ Array sorted!');
    };

    // Linear Search
    const linearSearch = async () => {
        const target = array[Math.floor(Math.random() * array.length)];
        setSearchTarget(target);
        setStepInfo(`Searching for ${target}...`);

        for (let i = 0; i < array.length; i++) {
            await checkPause();
            setComparing([i]);
            setStepInfo(`Checking index ${i}: ${array[i]} ${array[i] === target ? '= ' : '≠ '} ${target}`);
            await delay(getDelay());

            if (array[i] === target) {
                setFoundIndex(i);
                setComparing([]);
                setStepInfo(`✓ Found ${target} at index ${i}!`);
                return;
            }
        }
        setComparing([]);
        setStepInfo(`✗ ${target} not found`);
    };

    // Binary Search
    const binarySearch = async () => {
        const target = array[Math.floor(Math.random() * array.length)];
        setSearchTarget(target);
        setStepInfo(`Binary searching for ${target}...`);

        let left = 0;
        let right = array.length - 1;

        while (left <= right) {
            await checkPause();
            const mid = Math.floor((left + right) / 2);
            setComparing([mid]);
            setStepInfo(`Checking middle (${mid}): ${array[mid]} vs ${target}`);
            await delay(getDelay() * 1.5);

            if (array[mid] === target) {
                setFoundIndex(mid);
                setComparing([]);
                setStepInfo(`✓ Found ${target} at index ${mid}!`);
                return;
            }
            if (array[mid] < target) {
                setStepInfo(`${array[mid]} < ${target}, searching right half`);
                left = mid + 1;
            } else {
                setStepInfo(`${array[mid]} > ${target}, searching left half`);
                right = mid - 1;
            }
            await delay(getDelay());
        }
        setComparing([]);
        setStepInfo(`✗ ${target} not found`);
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

    // Get bar color
    const getBarColor = (index) => {
        if (foundIndex === index) return '#10b981'; // Green - found
        if (sorted.includes(index)) return '#10b981'; // Green - sorted
        if (comparing.includes(index)) return '#f59e0b'; // Yellow - comparing
        return '#2563eb'; // Blue - default
    };

    // Prepare chart data
    const chartData = array.map((value, index) => ({
        index,
        value,
        label: value.toString(),
    }));

    const isSearchAlgorithm = algorithmId?.includes('search');

    return (
        <div className="array-visualizer">
            {/* Controls */}
            <div className="visualizer-controls">
                <div className="control-group">
                    {!isRunning ? (
                        <button className="btn btn-primary" onClick={runAlgorithm}>
                            <Play size={16} /> Play
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={togglePause}>
                            {isPaused ? <Play size={16} /> : <Pause size={16} />}
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>
                    )}
                    <button className="btn btn-secondary" onClick={reset}>
                        <RotateCcw size={16} /> Reset
                    </button>
                </div>

                <div className="speed-control">
                    <FastForward size={16} />
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

            {/* Step Info */}
            <div className="step-info">
                {searchTarget !== null && (
                    <span className="search-target">Target: <strong>{searchTarget}</strong></span>
                )}
                <span className="step-message">{stepInfo}</span>
            </div>

            {/* Chart */}
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <XAxis
                            dataKey="index"
                            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                            axisLine={{ stroke: 'var(--color-border)' }}
                            tickLine={{ stroke: 'var(--color-border)' }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                            axisLine={{ stroke: 'var(--color-border)' }}
                            tickLine={{ stroke: 'var(--color-border)' }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[4, 4, 0, 0]}
                            label={{
                                position: 'top',
                                fill: 'var(--color-text)',
                                fontSize: 12,
                                fontWeight: 600
                            }}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getBarColor(index)}
                                    style={{
                                        transition: 'fill 0.3s ease',
                                        filter: comparing.includes(index) ? 'brightness(1.2) drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' : 'none'
                                    }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="visualizer-legend">
                <span className="legend-item">
                    <span className="legend-color" style={{ background: '#2563eb' }}></span>
                    Unsorted
                </span>
                <span className="legend-item">
                    <span className="legend-color" style={{ background: '#f59e0b' }}></span>
                    Comparing
                </span>
                <span className="legend-item">
                    <span className="legend-color" style={{ background: '#10b981' }}></span>
                    {isSearchAlgorithm ? 'Found' : 'Sorted'}
                </span>
            </div>
        </div>
    );
};

export default ArrayVisualizer;
