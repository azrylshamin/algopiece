import { useState } from 'react';
import { Play, Code, Blocks, Copy, Check } from 'lucide-react';
import { BlocklyWorkspace } from '../components/blockly';
import './Build.css';

const Build = () => {
    const [generatedCode, setGeneratedCode] = useState({ code: '', json: null, language: 'javascript' });
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCodeChange = ({ code, json, language }) => {
        setGeneratedCode({ code, json, language });
    };

    const runCode = () => {
        setIsRunning(true);
        setOutput('Running code...\n\n');

        setTimeout(() => {
            try {
                // Create a safe execution environment
                const logs = [];
                const safeConsole = {
                    log: (...args) => logs.push(args.map(a =>
                        typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
                    ).join(' '))
                };

                // Execute JavaScript code
                if (generatedCode.language === 'javascript') {
                    const wrappedCode = `
            (function() {
              const console = safeConsole;
              ${generatedCode.code}
            })()
          `;

                    // eslint-disable-next-line no-new-func
                    const fn = new Function('safeConsole', wrappedCode);
                    fn(safeConsole);
                }

                if (logs.length > 0) {
                    setOutput(logs.join('\n') + '\n\n✓ Execution completed!');
                } else {
                    setOutput('✓ Code executed successfully!\n\nNo console output. Try adding "log step" blocks to see output.');
                }
            } catch (error) {
                setOutput(`✗ Error: ${error.message}`);
            }
            setIsRunning(false);
        }, 500);
    };

    const copyCode = async () => {
        await navigator.clipboard.writeText(generatedCode.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="build-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1><Blocks size={32} /> Build with Blocks</h1>
                    <p>Create algorithms using drag-and-drop blocks - no typing required!</p>
                </div>

                <div className="build-layout">
                    {/* Blockly Workspace */}
                    <div className="blockly-panel">
                        <BlocklyWorkspace onCodeChange={handleCodeChange} />
                    </div>

                    {/* Code & Output Panel */}
                    <div className="code-panel">
                        {/* Generated Code */}
                        <div className="code-section card">
                            <div className="code-header">
                                <h3><Code size={18} /> Generated Code</h3>
                                <button className="btn btn-ghost btn-sm" onClick={copyCode}>
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <div className="code-display">
                                <pre>{generatedCode.code || '// Your code will appear here as you build...'}</pre>
                            </div>
                        </div>

                        {/* Output */}
                        <div className="output-section card">
                            <div className="output-header">
                                <h3>Output</h3>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={runCode}
                                    disabled={isRunning || !generatedCode.code}
                                >
                                    <Play size={14} />
                                    {isRunning ? 'Running...' : 'Run Code'}
                                </button>
                            </div>
                            <div className="output-display">
                                <pre>{output || 'Click "Run Code" to execute your blocks...'}</pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="help-section card">
                    <h3>Quick Start Guide</h3>
                    <div className="help-grid">
                        <div className="help-item">
                            <span className="help-step">1</span>
                            <div>
                                <strong>Drag blocks</strong>
                                <p>Pull blocks from the toolbox on the left into the workspace</p>
                            </div>
                        </div>
                        <div className="help-item">
                            <span className="help-step">2</span>
                            <div>
                                <strong>Connect them</strong>
                                <p>Snap blocks together to build your algorithm</p>
                            </div>
                        </div>
                        <div className="help-item">
                            <span className="help-step">3</span>
                            <div>
                                <strong>Run & test</strong>
                                <p>Click "Run Code" to execute and see the results</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Build;
