import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import './GraphVisualizer.css';

const GraphVisualizer = ({ algorithmId }) => {
    // Standard Graph Data (Nodes & Edges) - Use weighted by default, weights ignored for BFS/DFS
    const initialNodes = [
        { id: 0, x: 250, y: 50, label: '0' },
        { id: 1, x: 150, y: 150, label: '1' },
        { id: 2, x: 350, y: 150, label: '2' },
        { id: 3, x: 100, y: 250, label: '3' },
        { id: 4, x: 200, y: 250, label: '4' },
        { id: 5, x: 300, y: 250, label: '5' },
        { id: 6, x: 400, y: 250, label: '6' },
    ];

    const initialEdges = [
        { source: 0, target: 1, weight: 4 },
        { source: 0, target: 2, weight: 2 },
        { source: 1, target: 3, weight: 5 },
        { source: 1, target: 4, weight: 1 },
        { source: 2, target: 5, weight: 3 },
        { source: 2, target: 6, weight: 8 },
    ];

    const initialAdjacencyList = {
        0: [{ node: 1, weight: 4 }, { node: 2, weight: 2 }],
        1: [{ node: 0, weight: 4 }, { node: 3, weight: 5 }, { node: 4, weight: 1 }],
        2: [{ node: 0, weight: 2 }, { node: 5, weight: 3 }, { node: 6, weight: 8 }],
        3: [{ node: 1, weight: 5 }],
        4: [{ node: 1, weight: 1 }],
        5: [{ node: 2, weight: 3 }],
        6: [{ node: 2, weight: 8 }]
    };

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [adjacencyList, setAdjacencyList] = useState(initialAdjacencyList);

    // Visualization State
    const [visited, setVisited] = useState(new Set());
    const [current, setCurrent] = useState(null);
    const [queueRank, setQueueRank] = useState([]); // For BFS queue / DFS stack / Dijkstra PQ viz
    const [distances, setDistances] = useState({}); // For Dijkstra
    const [stepInfo, setStepInfo] = useState('Click Play to start graph traversal');

    // Custom Input State
    const [customInput, setCustomInput] = useState('');
    const [inputError, setInputError] = useState('');

    // Control State
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(50);

    const animationRef = useRef(null);
    const pauseRef = useRef(false);

    // Helpers
    const delay = (ms) => new Promise(resolve => {
        animationRef.current = setTimeout(resolve, ms);
    });

    const checkPause = async () => {
        while (pauseRef.current) {
            await delay(100);
        }
    };

    const getDelay = () => (100 - speed) * 15 + 200;

    const reset = () => {
        if (animationRef.current) clearTimeout(animationRef.current);
        setVisited(new Set());
        setCurrent(null);
        setQueueRank([]);
        setDistances({});
        setStepInfo('Click Play to start graph traversal');
        setIsRunning(false);
        setIsPaused(false);
        pauseRef.current = false;
    };

    // Handle Custom Graph Input - Unified, with optional weights (default 1)
    const handleCustomGraph = () => {
        if (!customInput.trim()) {
            setInputError('Please enter edges (e.g. 0-1-5, 1-2-3)');
            return;
        }

        try {
            const edgePairs = customInput.split(',').map(pair => {
                const parts = pair.trim().split('-');
                if (parts.length < 2 || parts.length > 3) throw new Error("Invalid format");
                const source = parseInt(parts[0]);
                const target = parseInt(parts[1]);
                const weight = parts[2] ? parseInt(parts[2]) : 1; // Default weight 1
                if (isNaN(source) || isNaN(target) || isNaN(weight)) throw new Error("Nodes and weights must be numbers");
                return { source, target, weight };
            });

            // Extract unique nodes
            const uniqueNodes = new Set();
            edgePairs.forEach(e => {
                uniqueNodes.add(e.source);
                uniqueNodes.add(e.target);
            });
            const sortedNodes = Array.from(uniqueNodes).sort((a, b) => a - b);

            // Create Nodes with Circular Layout
            const centerX = 250;
            const centerY = 150;
            const radius = 100;
            const newNodes = sortedNodes.map((id, index) => {
                const angle = (index / sortedNodes.length) * 2 * Math.PI - Math.PI / 2;
                return {
                    id,
                    label: id.toString(),
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle)
                };
            });

            // Build Adjacency List (Undirected)
            const newAdjacencyList = {};
            sortedNodes.forEach(id => newAdjacencyList[id] = []);

            edgePairs.forEach(({ source, target, weight }) => {
                // Check duplicates to avoid multi-edges
                if (!newAdjacencyList[source].some(n => n.node === target)) {
                    newAdjacencyList[source].push({ node: target, weight });
                }
                if (!newAdjacencyList[target].some(n => n.node === source)) {
                    newAdjacencyList[target].push({ node: source, weight });
                }
            });

            // Sort neighbors
            for (const id in newAdjacencyList) {
                newAdjacencyList[id].sort((a, b) => a.node - b.node);
            }

            setNodes(newNodes);
            setEdges(edgePairs);
            setAdjacencyList(newAdjacencyList);
            setInputError('');
            setStepInfo('✓ Custom graph built!');
            reset();

        } catch (e) {
            setInputError('Invalid input. Format: 0-1-5, 1-2-10 (Nodes-Nodes-Weight, weight optional)');
        }
    };

    // BFS Implementation (Ignores weights)
    const runBFS = async () => {
        const startNode = 0;
        const q = [startNode];
        const seen = new Set([startNode]);

        setStepInfo(`Starting BFS from Node ${startNode}`);
        setQueueRank([...q]);
        await delay(getDelay());

        while (q.length > 0) {
            await checkPause();
            const currNode = q.shift();

            setCurrent(currNode);
            setQueueRank([...q]);
            setStepInfo(`Visiting Node ${currNode}`);

            setVisited(prev => new Set([...prev, currNode]));
            await delay(getDelay());

            const neighbors = (adjacencyList[currNode] || []).map(n => n.node);
            for (const neighbor of neighbors) {
                if (!seen.has(neighbor)) {
                    seen.add(neighbor);
                    q.push(neighbor);
                    setStepInfo(`Node ${neighbor} added to queue`);
                    setQueueRank([...q]);
                    await delay(getDelay() / 2);
                }
            }
        }

        setCurrent(null);
        setStepInfo('✓ BFS Traversal Complete!');
        setIsRunning(false);
    };

    // DFS Implementation (Ignores weights)
    const runDFS = async () => {
        const startNode = 0;
        const stack = [startNode];
        const seen = new Set();

        setStepInfo(`Starting DFS from Node ${startNode}`);
        setQueueRank([...stack]);
        await delay(getDelay());

        while (stack.length > 0) {
            await checkPause();
            const currNode = stack.pop();

            if (!seen.has(currNode)) {
                seen.add(currNode);
                setCurrent(currNode);
                setQueueRank([...stack]);
                setStepInfo(`Visiting Node ${currNode}`);

                setVisited(prev => new Set([...prev, currNode]));
                await delay(getDelay());

                const neighbors = (adjacencyList[currNode] || []).map(n => n.node).slice().reverse();

                for (const neighbor of neighbors) {
                    if (!seen.has(neighbor)) {
                        stack.push(neighbor);
                        setStepInfo(`Node ${neighbor} added to stack`);
                        setQueueRank([...stack]);
                        await delay(getDelay() / 2);
                    }
                }
            }
        }

        setCurrent(null);
        setStepInfo('✓ DFS Traversal Complete!');
        setIsRunning(false);
    };

    // Dijkstra's Implementation (Uses weights)
    const runDijkstra = async () => {
        const startNode = 0;
        const dists = {};
        nodes.forEach(n => dists[n.id] = Infinity);
        dists[startNode] = 0;
        setDistances({ ...dists });

        const pq = [{ node: startNode, dist: 0 }];
        const localVisited = new Set();

        setStepInfo(`Starting Dijkstra from Node ${startNode}. Init distances to Infinity.`);
        await delay(getDelay());

        while (pq.length > 0) {
            await checkPause();
            // Sort to simulate Priority Queue (inefficient, but fine for small graph viz)
            pq.sort((a, b) => a.dist - b.dist);
            const { node: u, dist: d } = pq.shift();

            if (localVisited.has(u)) continue;
            localVisited.add(u);

            setCurrent(u);
            setVisited(new Set([...localVisited]));
            setStepInfo(`Visiting Node ${u} (Current Dist: ${d})`);

            // Highlight queue for visualization (nodes in PQ)
            setQueueRank(pq.map(item => item.node));
            await delay(getDelay());

            const neighbors = adjacencyList[u] || [];
            for (const { node: v, weight } of neighbors) {
                if (localVisited.has(v)) continue;

                if (dists[u] + weight < dists[v]) {
                    dists[v] = dists[u] + weight;
                    setDistances({ ...dists });
                    pq.push({ node: v, dist: dists[v] });
                    setStepInfo(`Relaxing edge ${u}-${v}: New dist for ${v} is ${dists[v]}`);
                    setQueueRank(pq.map(item => item.node));
                    await delay(getDelay());
                }
            }
        }

        setCurrent(null);
        setStepInfo('✓ Dijkstra Shortest Paths Complete!');
        setIsRunning(false);
    };

    const runAlgorithm = async () => {
        setIsRunning(true);
        setIsPaused(false);
        pauseRef.current = false;

        setVisited(new Set());
        setCurrent(null);
        setQueueRank([]);
        setDistances({});

        try {
            if (algorithmId === 'bfs') await runBFS();
            else if (algorithmId === 'dfs') await runDFS();
            else if (algorithmId === 'dijkstra') await runDijkstra();
            else await runBFS(); // Default to BFS
        } catch (e) {
            console.log("Animation stopped", e);
        }
    };

    const togglePause = () => {
        pauseRef.current = !pauseRef.current;
        setIsPaused(!isPaused);
    };

    // Render Helpers
    const getNodeClass = (id) => {
        if (current === id) return 'node-current';
        if (visited.has(id)) return 'node-visited';
        if (queueRank.includes(id)) return 'node-visiting';
        return '';
    };

    const getDistanceLabel = (id) => {
        if (algorithmId !== 'dijkstra') return null;
        const d = distances[id];
        if (d === undefined) return '∞';
        return d === Infinity ? '∞' : d;
    };

    const isWeightedAlgo = algorithmId === 'dijkstra';
    const queueLabel = algorithmId === 'bfs' ? 'In Queue' : algorithmId === 'dfs' ? 'In Stack' : 'In PQ';

    return (
        <div className="graph-visualizer">
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
                </div>
            </div>

            {/* Custom Input */}
            {!isRunning && (
                <div className="custom-input-section">
                    <input
                        type="text"
                        placeholder={isWeightedAlgo ? "Edges (e.g. 0-1-5, 1-2-10)" : "Edges (e.g. 0-1, 1-2)"}
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        className="custom-input_field"
                    />
                    <button className="btn btn-secondary" onClick={handleCustomGraph}>
                        Build Graph
                    </button>
                    {inputError && <span className="input-error">{inputError}</span>}
                </div>
            )}

            {/* Step Info */}
            <div className="step-info">
                <span className="step-message">{stepInfo}</span>
            </div>

            {/* Graph Area */}
            <div className="graph-container">
                <svg className="graph-svg" viewBox="0 0 500 300">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-border)" />
                        </marker>
                    </defs>

                    {/* Edges */}
                    {edges.map((edge, idx) => {
                        const start = nodes.find(n => n.id === edge.source);
                        const end = nodes.find(n => n.id === edge.target);
                        const isVisitedEdge = visited.has(edge.source) && visited.has(edge.target);

                        // Calculate midpoint for weight label
                        const midX = (start.x + end.x) / 2;
                        const midY = (start.y + end.y) / 2;

                        return (
                            <g key={idx}>
                                <line
                                    x1={start.x} y1={start.y}
                                    x2={end.x} y2={end.y}
                                    className={`edge-line ${isVisitedEdge ? 'edge-visited' : ''}`}
                                />
                                {/* Edge Weight (only for weighted algos) */}
                                {isWeightedAlgo && (
                                    <text x={midX} y={midY - 5} className="edge-weight">
                                        {edge.weight}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => (
                        <g key={node.id} className={`node-group ${getNodeClass(node.id)}`}>
                            <circle
                                cx={node.x} cy={node.y}
                                r="20"
                                className="node-circle"
                            />
                            <text x={node.x} y={node.y} className="node-text">
                                {node.label}
                            </text>

                            {/* Distance Label for Dijkstra */}
                            {isWeightedAlgo && (
                                <text x={node.x} y={node.y - 28} className="node-distance">
                                    {getDistanceLabel(node.id)}
                                </text>
                            )}
                        </g>
                    ))}
                </svg>
            </div>

            {/* Legend */}
            <div className="visualizer-legend">
                <div className="legend-item">
                    <div className="legend-dot" style={{ borderColor: 'var(--color-primary)', background: 'var(--color-bg-secondary)' }}></div>
                    <span>Unvisited</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot" style={{ borderColor: 'var(--color-accent)', background: 'var(--color-accent)' }}></div>
                    <span>Current</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot" style={{ borderColor: 'var(--color-info)', background: '#cffafe' }}></div>
                    <span>{queueLabel}</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot" style={{ borderColor: 'var(--color-primary)', background: '#dbeafe' }}></div>
                    <span>Visited</span>
                </div>
            </div>
        </div>
    );
};

export default GraphVisualizer;