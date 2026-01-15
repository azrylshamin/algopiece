import { useState } from 'react';
import { Play, Search, ArrowUpDown, Network, Loader2 } from 'lucide-react';
import { getAllAlgorithms } from '../data';
import './Playground.css';

// Icon mapping for categories
const categoryIcons = {
    searching: Search,
    sorting: ArrowUpDown,
    graph: Network
};

const Playground = () => {
    const algorithms = getAllAlgorithms();
    const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]);
    const [code, setCode] = useState(algorithms[0].code.javascript);
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleAlgoChange = (algoId) => {
        const algo = algorithms.find(a => a.id === algoId);
        if (algo) {
            setSelectedAlgo(algo);
            setCode(algo.code[language]);
            setOutput('');
        }
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setCode(selectedAlgo.code[lang]);
    };

    const runCode = () => {
        setIsRunning(true);
        setOutput('Running code...\n');

        // Simulate code execution
        setTimeout(() => {
            try {
                // For demo purposes, show example output
                const exampleOutputs = {
                    'bubble-sort': 'Input: [64, 34, 25, 12, 22, 11, 90]\nOutput: [11, 12, 22, 25, 34, 64, 90]\n\n✓ Array sorted successfully!',
                    'insertion-sort': 'Input: [12, 11, 13, 5, 6]\nOutput: [5, 6, 11, 12, 13]\n\n✓ Array sorted successfully!',
                    'merge-sort': 'Input: [38, 27, 43, 3, 9, 82, 10]\nOutput: [3, 9, 10, 27, 38, 43, 82]\n\n✓ Array sorted successfully!',
                    'quick-sort': 'Input: [10, 7, 8, 9, 1, 5]\nOutput: [1, 5, 7, 8, 9, 10]\n\n✓ Array sorted successfully!',
                    'linear-search': 'Input: arr = [2, 3, 4, 10, 40], target = 10\nOutput: Element found at index 3\n\n✓ Search completed!',
                    'binary-search': 'Input: arr = [2, 3, 4, 10, 40], target = 10\nOutput: Element found at index 3\n\n✓ Search completed!',
                    'bfs': 'Graph: { A: [B, C], B: [D], C: [E], D: [], E: [] }\nStarting from: A\nBFS Order: A → B → C → D → E\n\n✓ Traversal completed!',
                    'dfs': 'Graph: { A: [B, C], B: [D], C: [E], D: [], E: [] }\nStarting from: A\nDFS Order: A → B → D → C → E\n\n✓ Traversal completed!',
                    'dijkstra': 'Graph with weights from node A\nShortest distances:\n  A: 0\n  B: 4\n  C: 2\n  D: 7\n\n✓ Algorithm completed!',
                };

                const result = exampleOutputs[selectedAlgo.id] ||
                    '✓ Code executed successfully!\n\nNote: This is a demo playground. Output is simulated.';

                setOutput(result);
            } catch (error) {
                setOutput(`✗ Error: ${error.message}`);
            }
            setIsRunning(false);
        }, 1000);
    };

    return (
        <div className="playground-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Code Playground</h1>
                    <p>Explore and experiment with algorithm implementations</p>
                </div>

                <div className="playground-layout">
                    {/* Algorithm Selector */}
                    <aside className="algo-sidebar">
                        <h3>Algorithms</h3>
                        <div className="algo-list">
                            {algorithms.map((algo) => {
                                const IconComponent = categoryIcons[algo.category] || Search;
                                return (
                                    <button
                                        key={algo.id}
                                        className={`algo-item ${selectedAlgo.id === algo.id ? 'active' : ''}`}
                                        onClick={() => handleAlgoChange(algo.id)}
                                    >
                                        <IconComponent size={16} className="algo-icon" />
                                        <span className="algo-name">{algo.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Main Editor Area */}
                    <main className="editor-area">
                        {/* Editor Header */}
                        <div className="editor-header">
                            <div className="editor-title">
                                <h2>{selectedAlgo.name}</h2>
                                <span className={`badge badge-${selectedAlgo.difficulty.toLowerCase()}`}>
                                    {selectedAlgo.difficulty}
                                </span>
                            </div>
                            <div className="editor-actions">
                                <div className="language-tabs">
                                    <button
                                        className={`lang-tab ${language === 'javascript' ? 'active' : ''}`}
                                        onClick={() => handleLanguageChange('javascript')}
                                    >
                                        JavaScript
                                    </button>
                                    <button
                                        className={`lang-tab ${language === 'python' ? 'active' : ''}`}
                                        onClick={() => handleLanguageChange('python')}
                                    >
                                        Python
                                    </button>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={runCode}
                                    disabled={isRunning}
                                >
                                    {isRunning ? (
                                        <>
                                            <Loader2 size={16} className="spin" /> Running...
                                        </>
                                    ) : (
                                        <>
                                            <Play size={16} /> Run Code
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Code Editor */}
                        <div className="code-editor-container">
                            <div className="code-editor">
                                <div className="line-numbers">
                                    {code.split('\n').map((_, i) => (
                                        <span key={i}>{i + 1}</span>
                                    ))}
                                </div>
                                <textarea
                                    className="code-textarea"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    spellCheck="false"
                                />
                            </div>
                        </div>

                        {/* Output Console */}
                        <div className="output-section">
                            <div className="output-header">
                                <h4>Output</h4>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setOutput('')}
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="output-console">
                                <pre>{output || 'Click "Run Code" to see output...'}</pre>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Playground;
