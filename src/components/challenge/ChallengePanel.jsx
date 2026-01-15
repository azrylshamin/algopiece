import { useState, useCallback } from 'react';
import {
    Play,
    CheckCircle2,
    XCircle,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Trophy,
    Code
} from 'lucide-react';
import { BlocklyWorkspace } from '../blockly';
import './ChallengePanel.css';

const ChallengePanel = ({ challenge, algorithmId, onComplete }) => {
    const [generatedCode, setGeneratedCode] = useState({ code: '', json: null, language: 'javascript' });
    const [testResults, setTestResults] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [hintsRevealed, setHintsRevealed] = useState(0);
    const [showHints, setShowHints] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleCodeChange = useCallback(({ code, json, language }) => {
        setGeneratedCode({ code, json, language });
        // Reset test results when code changes
        setTestResults(null);
    }, []);

    const revealNextHint = () => {
        if (hintsRevealed < challenge.hints.length) {
            setHintsRevealed(prev => prev + 1);
        }
    };

    const runTests = () => {
        setIsRunning(true);
        setTestResults(null);

        setTimeout(() => {
            try {
                const results = [];
                let allPassed = true;

                // Create a safe execution environment
                const safeConsole = {
                    log: () => { },
                    error: () => { }
                };

                for (const testCase of challenge.testCases) {
                    try {
                        // Execute user's code and capture result
                        let result = null;
                        let output = [];

                        // Override console.log to capture output
                        const captureConsole = {
                            log: (...args) => {
                                output.push(args.map(a =>
                                    typeof a === 'object' ? JSON.stringify(a) : String(a)
                                ).join(' '));
                            }
                        };

                        // Prepare test input
                        const inputStr = JSON.stringify(testCase.input);

                        // Create executable code
                        const execCode = `
                            const console = captureConsole;
                            const input = ${inputStr};
                            let arr = input.arr || [];
                            let target = input.target;
                            let left = input.left;
                            let right = input.right;
                            
                            ${generatedCode.code}
                            
                            // Return the final array state or the last logged value
                            arr;
                        `;

                        // eslint-disable-next-line no-new-func
                        const fn = new Function('captureConsole', execCode);
                        result = fn(captureConsole);

                        // Compare result with expected
                        const expectedStr = JSON.stringify(testCase.expected);
                        const resultStr = JSON.stringify(result);
                        const passed = resultStr === expectedStr ||
                            (output.length > 0 && output.some(o => o.includes(String(testCase.expected))));

                        if (!passed) allPassed = false;

                        results.push({
                            input: testCase.input,
                            expected: testCase.expected,
                            actual: result,
                            output: output.join('\n'),
                            passed
                        });

                    } catch (error) {
                        allPassed = false;
                        results.push({
                            input: testCase.input,
                            expected: testCase.expected,
                            actual: null,
                            error: error.message,
                            passed: false
                        });
                    }
                }

                setTestResults({
                    results,
                    allPassed,
                    passedCount: results.filter(r => r.passed).length,
                    totalCount: results.length
                });

                if (allPassed && !isCompleted) {
                    setIsCompleted(true);
                    if (onComplete) {
                        onComplete(algorithmId, challenge.xpReward);
                    }
                }

            } catch (error) {
                setTestResults({
                    results: [],
                    allPassed: false,
                    error: error.message
                });
            }

            setIsRunning(false);
        }, 500);
    };

    return (
        <div className="challenge-panel">
            {/* Challenge Header */}
            <div className="challenge-header">
                <div className="challenge-title-section">
                    <h3>{challenge.title}</h3>
                    <span className="xp-badge">
                        <Trophy size={14} />
                        {challenge.xpReward} XP
                    </span>
                </div>
                {isCompleted && (
                    <div className="challenge-completed-badge">
                        <CheckCircle2 size={18} />
                        Completed!
                    </div>
                )}
            </div>

            {/* Challenge Instructions */}
            <div className="challenge-instructions card">
                <h4>📋 Challenge</h4>
                <p className="challenge-description">{challenge.description}</p>
                <div className="challenge-objective">
                    <strong>Objective:</strong> {challenge.objective}
                </div>

                {/* Hint Section */}
                <div className="hints-section">
                    <button
                        className="hints-toggle"
                        onClick={() => setShowHints(!showHints)}
                    >
                        <Lightbulb size={16} />
                        Hints ({hintsRevealed}/{challenge.hints.length})
                        {showHints ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {showHints && (
                        <div className="hints-content">
                            {challenge.hints.slice(0, hintsRevealed).map((hint, index) => (
                                <div key={index} className="hint-item">
                                    <span className="hint-number">{index + 1}</span>
                                    <span className="hint-text">{hint}</span>
                                </div>
                            ))}

                            {hintsRevealed < challenge.hints.length && (
                                <button
                                    className="btn btn-ghost btn-sm reveal-hint-btn"
                                    onClick={revealNextHint}
                                >
                                    <Lightbulb size={14} />
                                    Reveal Next Hint
                                </button>
                            )}

                            {hintsRevealed === 0 && (
                                <p className="no-hints-text">Click "Reveal Next Hint" if you need help!</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Blockly Workspace */}
            <div className="challenge-workspace">
                <BlocklyWorkspace onCodeChange={handleCodeChange} />
            </div>

            {/* Generated Code Preview */}
            <div className="code-preview card">
                <div className="code-preview-header">
                    <h4><Code size={16} /> Generated Code</h4>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={runTests}
                        disabled={isRunning || !generatedCode.code}
                    >
                        <Play size={14} />
                        {isRunning ? 'Running...' : 'Run Tests'}
                    </button>
                </div>
                <pre className="code-preview-content">
                    {generatedCode.code || '// Build your solution using the blocks above...'}
                </pre>
            </div>

            {/* Test Results */}
            {testResults && (
                <div className={`test-results card ${testResults.allPassed ? 'success' : 'failure'}`}>
                    <div className="test-results-header">
                        {testResults.allPassed ? (
                            <>
                                <CheckCircle2 size={20} className="success-icon" />
                                <h4>All Tests Passed! 🎉</h4>
                                {!isCompleted && (
                                    <span className="xp-earned">+{challenge.xpReward} XP</span>
                                )}
                            </>
                        ) : (
                            <>
                                <XCircle size={20} className="failure-icon" />
                                <h4>Tests Failed ({testResults.passedCount}/{testResults.totalCount} passed)</h4>
                            </>
                        )}
                    </div>

                    <div className="test-cases">
                        {testResults.results.map((result, index) => (
                            <div key={index} className={`test-case ${result.passed ? 'passed' : 'failed'}`}>
                                <div className="test-case-header">
                                    {result.passed ? (
                                        <CheckCircle2 size={16} className="success-icon" />
                                    ) : (
                                        <XCircle size={16} className="failure-icon" />
                                    )}
                                    <span>Test Case {index + 1}</span>
                                </div>
                                <div className="test-case-details">
                                    <div className="test-detail">
                                        <span className="label">Input:</span>
                                        <code>{JSON.stringify(result.input)}</code>
                                    </div>
                                    <div className="test-detail">
                                        <span className="label">Expected:</span>
                                        <code>{JSON.stringify(result.expected)}</code>
                                    </div>
                                    {!result.passed && (
                                        <div className="test-detail">
                                            <span className="label">Got:</span>
                                            <code>{result.error || JSON.stringify(result.actual)}</code>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChallengePanel;
