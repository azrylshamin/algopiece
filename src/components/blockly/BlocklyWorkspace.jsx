import { useEffect, useRef, useState, useMemo } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import { pythonGenerator } from 'blockly/python';
import './BlocklyWorkspace.css';

// Custom algorithm blocks
const defineCustomBlocks = () => {
    // Array operations
    Blockly.Blocks['array_create'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("create array")
                .appendField(new Blockly.FieldTextInput("[5, 3, 8, 1, 9]"), "VALUES");
            this.setOutput(true, "Array");
            this.setColour(260);
            this.setTooltip("Create an array with values");
        }
    };

    Blockly.Blocks['array_get'] = {
        init: function () {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("get item at index");
            this.appendValueInput("INDEX")
                .setCheck("Number");
            this.appendDummyInput()
                .appendField("from");
            this.setInputsInline(true);
            this.setOutput(true, null);
            this.setColour(260);
            this.setTooltip("Get item from array at index");
        }
    };

    Blockly.Blocks['array_set'] = {
        init: function () {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("set item at index");
            this.appendValueInput("INDEX")
                .setCheck("Number");
            this.appendValueInput("VALUE")
                .appendField("to");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(260);
            this.setTooltip("Set item in array at index");
        }
    };

    Blockly.Blocks['array_length'] = {
        init: function () {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("length of");
            this.setOutput(true, "Number");
            this.setColour(260);
            this.setTooltip("Get length of array");
        }
    };

    Blockly.Blocks['array_swap'] = {
        init: function () {
            this.appendValueInput("ARRAY")
                .setCheck("Array")
                .appendField("swap in array");
            this.appendValueInput("INDEX1")
                .setCheck("Number")
                .appendField("index");
            this.appendValueInput("INDEX2")
                .setCheck("Number")
                .appendField("with index");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Swap two elements in array");
        }
    };

    // Compare block
    Blockly.Blocks['compare_elements'] = {
        init: function () {
            this.appendValueInput("LEFT")
                .appendField("compare");
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    [">", "GT"],
                    ["<", "LT"],
                    [">=", "GTE"],
                    ["<=", "LTE"],
                    ["==", "EQ"]
                ]), "OP");
            this.appendValueInput("RIGHT");
            this.setInputsInline(true);
            this.setOutput(true, "Boolean");
            this.setColour(210);
            this.setTooltip("Compare two values");
        }
    };

    // Print/Log block
    Blockly.Blocks['print_step'] = {
        init: function () {
            this.appendValueInput("MESSAGE")
                .appendField("log step:");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Log a step message");
        }
    };

    // JavaScript code generators
    javascriptGenerator.forBlock['array_create'] = function (block) {
        const values = block.getFieldValue('VALUES');
        return [`${values}`, javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock['array_get'] = function (block) {
        const array = javascriptGenerator.valueToCode(block, 'ARRAY', javascriptGenerator.ORDER_MEMBER) || '[]';
        const index = javascriptGenerator.valueToCode(block, 'INDEX', javascriptGenerator.ORDER_MEMBER) || '0';
        return [`${array}[${index}]`, javascriptGenerator.ORDER_MEMBER];
    };

    javascriptGenerator.forBlock['array_set'] = function (block) {
        const array = javascriptGenerator.valueToCode(block, 'ARRAY', javascriptGenerator.ORDER_MEMBER) || '[]';
        const index = javascriptGenerator.valueToCode(block, 'INDEX', javascriptGenerator.ORDER_MEMBER) || '0';
        const value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ASSIGNMENT) || '0';
        return `${array}[${index}] = ${value};\n`;
    };

    javascriptGenerator.forBlock['array_length'] = function (block) {
        const array = javascriptGenerator.valueToCode(block, 'ARRAY', javascriptGenerator.ORDER_MEMBER) || '[]';
        return [`${array}.length`, javascriptGenerator.ORDER_MEMBER];
    };

    javascriptGenerator.forBlock['array_swap'] = function (block) {
        const array = javascriptGenerator.valueToCode(block, 'ARRAY', javascriptGenerator.ORDER_MEMBER) || '[]';
        const i = javascriptGenerator.valueToCode(block, 'INDEX1', javascriptGenerator.ORDER_MEMBER) || '0';
        const j = javascriptGenerator.valueToCode(block, 'INDEX2', javascriptGenerator.ORDER_MEMBER) || '1';
        return `[${array}[${i}], ${array}[${j}]] = [${array}[${j}], ${array}[${i}]];\n`;
    };

    javascriptGenerator.forBlock['compare_elements'] = function (block) {
        const left = javascriptGenerator.valueToCode(block, 'LEFT', javascriptGenerator.ORDER_RELATIONAL) || '0';
        const right = javascriptGenerator.valueToCode(block, 'RIGHT', javascriptGenerator.ORDER_RELATIONAL) || '0';
        const op = block.getFieldValue('OP');
        const operators = { GT: '>', LT: '<', GTE: '>=', LTE: '<=', EQ: '==' };
        return [`${left} ${operators[op]} ${right}`, javascriptGenerator.ORDER_RELATIONAL];
    };

    javascriptGenerator.forBlock['print_step'] = function (block) {
        const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_NONE) || "''";
        return `console.log(${message});\n`;
    };

    // Python generators
    pythonGenerator.forBlock['array_create'] = function (block) {
        const values = block.getFieldValue('VALUES');
        return [`${values}`, pythonGenerator.ORDER_ATOMIC];
    };

    pythonGenerator.forBlock['array_get'] = function (block) {
        const array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_MEMBER) || '[]';
        const index = pythonGenerator.valueToCode(block, 'INDEX', pythonGenerator.ORDER_MEMBER) || '0';
        return [`${array}[${index}]`, pythonGenerator.ORDER_MEMBER];
    };

    pythonGenerator.forBlock['array_set'] = function (block) {
        const array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_MEMBER) || '[]';
        const index = pythonGenerator.valueToCode(block, 'INDEX', pythonGenerator.ORDER_MEMBER) || '0';
        const value = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_NONE) || '0';
        return `${array}[${index}] = ${value}\n`;
    };

    pythonGenerator.forBlock['array_length'] = function (block) {
        const array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_MEMBER) || '[]';
        return [`len(${array})`, pythonGenerator.ORDER_FUNCTION_CALL];
    };

    pythonGenerator.forBlock['array_swap'] = function (block) {
        const array = pythonGenerator.valueToCode(block, 'ARRAY', pythonGenerator.ORDER_MEMBER) || '[]';
        const i = pythonGenerator.valueToCode(block, 'INDEX1', pythonGenerator.ORDER_MEMBER) || '0';
        const j = pythonGenerator.valueToCode(block, 'INDEX2', pythonGenerator.ORDER_MEMBER) || '1';
        return `${array}[${i}], ${array}[${j}] = ${array}[${j}], ${array}[${i}]\n`;
    };

    pythonGenerator.forBlock['compare_elements'] = function (block) {
        const left = pythonGenerator.valueToCode(block, 'LEFT', pythonGenerator.ORDER_RELATIONAL) || '0';
        const right = pythonGenerator.valueToCode(block, 'RIGHT', pythonGenerator.ORDER_RELATIONAL) || '0';
        const op = block.getFieldValue('OP');
        const operators = { GT: '>', LT: '<', GTE: '>=', LTE: '<=', EQ: '==' };
        return [`${left} ${operators[op]} ${right}`, pythonGenerator.ORDER_RELATIONAL];
    };

    pythonGenerator.forBlock['print_step'] = function (block) {
        const message = pythonGenerator.valueToCode(block, 'MESSAGE', pythonGenerator.ORDER_NONE) || "''";
        return `print(${message})\n`;
    };
};

// Define toolbox
const toolboxConfig = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'Arrays',
            colour: '#a855f7',
            contents: [
                { kind: 'block', type: 'array_create' },
                { kind: 'block', type: 'array_get' },
                { kind: 'block', type: 'array_set' },
                { kind: 'block', type: 'array_length' },
                { kind: 'block', type: 'array_swap' },
            ]
        },
        {
            kind: 'category',
            name: 'Logic',
            colour: '#60a5fa',
            contents: [
                { kind: 'block', type: 'controls_if' },
                { kind: 'block', type: 'compare_elements' },
                { kind: 'block', type: 'logic_compare' },
                { kind: 'block', type: 'logic_operation' },
                { kind: 'block', type: 'logic_negate' },
                { kind: 'block', type: 'logic_boolean' },
            ]
        },
        {
            kind: 'category',
            name: 'Loops',
            colour: '#22c55e',
            contents: [
                { kind: 'block', type: 'controls_repeat_ext' },
                { kind: 'block', type: 'controls_whileUntil' },
                { kind: 'block', type: 'controls_for' },
                { kind: 'block', type: 'controls_forEach' },
                { kind: 'block', type: 'controls_flow_statements' },
            ]
        },
        {
            kind: 'category',
            name: 'Math',
            colour: '#f59e0b',
            contents: [
                { kind: 'block', type: 'math_number' },
                { kind: 'block', type: 'math_arithmetic' },
                { kind: 'block', type: 'math_single' },
                { kind: 'block', type: 'math_modulo' },
                { kind: 'block', type: 'math_random_int' },
            ]
        },
        {
            kind: 'category',
            name: 'Variables',
            colour: '#ef4444',
            custom: 'VARIABLE'
        },
        {
            kind: 'category',
            name: 'Functions',
            colour: '#6366f1',
            custom: 'PROCEDURE'
        },
        {
            kind: 'category',
            name: 'Output',
            colour: '#06b6d4',
            contents: [
                { kind: 'block', type: 'print_step' },
                { kind: 'block', type: 'text' },
                { kind: 'block', type: 'text_join' },
            ]
        },
    ]
};

const BlocklyWorkspace = ({ onCodeChange, initialXml }) => {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null);
    const onCodeChangeRef = useRef(onCodeChange);
    const [language, setLanguage] = useState('javascript');

    // Keep ref updated with latest callback
    useEffect(() => {
        onCodeChangeRef.current = onCodeChange;
    }, [onCodeChange]);

    // Define custom blocks once
    useMemo(() => {
        defineCustomBlocks();
    }, []);

    useEffect(() => {
        if (blocklyDiv.current && !workspaceRef.current) {
            workspaceRef.current = Blockly.inject(blocklyDiv.current, {
                toolbox: toolboxConfig,
                theme: Blockly.Theme.defineTheme('algopiece', {
                    base: Blockly.Themes.Classic,
                    fontStyle: {
                        family: 'Inter, sans-serif',
                        weight: '500',
                        size: 12
                    },
                    componentStyles: {
                        workspaceBackgroundColour: 'var(--color-bg-secondary)',
                        toolboxBackgroundColour: 'var(--color-bg-tertiary)',
                        toolboxForegroundColour: 'var(--color-text)',
                        flyoutBackgroundColour: 'var(--color-bg)',
                        flyoutForegroundColour: 'var(--color-text)',
                        flyoutOpacity: 0.9,
                        scrollbarColour: 'var(--color-border)',
                        insertionMarkerColour: 'var(--color-primary)',
                    }
                }),
                grid: {
                    spacing: 20,
                    length: 3,
                    colour: '#e2e8f0',
                    snap: true
                },
                zoom: {
                    controls: true,
                    wheel: true,
                    startScale: 1.0,
                    maxScale: 2,
                    minScale: 0.5,
                    scaleSpeed: 1.1
                },
                trashcan: true,
                move: {
                    scrollbars: true,
                    drag: true,
                    wheel: true
                }
            });

            // Load initial XML if provided
            if (initialXml) {
                try {
                    const dom = Blockly.utils.xml.textToDom(initialXml);
                    Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
                } catch (e) {
                    console.warn('Failed to load initial blocks:', e);
                }
            }

            // Listen for workspace changes
            workspaceRef.current.addChangeListener((event) => {
                // Filter out UI events to reduce unnecessary updates
                if (event.isUiEvent) return;

                if (onCodeChangeRef.current) {
                    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
                    const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
                    const xmlText = Blockly.Xml.domToText(xml);
                    onCodeChangeRef.current({ code, xml: xmlText, language: 'javascript' });
                }
            });
        }

        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
                workspaceRef.current = null;
            }
        };
    }, []);

    // Update code when language changes
    const updateCode = () => {
        if (workspaceRef.current && onCodeChangeRef.current) {
            const code = language === 'python'
                ? pythonGenerator.workspaceToCode(workspaceRef.current)
                : javascriptGenerator.workspaceToCode(workspaceRef.current);

            const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
            const xmlText = Blockly.Xml.domToText(xml);

            onCodeChangeRef.current({ code, xml: xmlText, language });
        }
    };

    // Handle language change
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setTimeout(() => {
            if (workspaceRef.current && onCodeChangeRef.current) {
                const code = lang === 'python'
                    ? pythonGenerator.workspaceToCode(workspaceRef.current)
                    : javascriptGenerator.workspaceToCode(workspaceRef.current);

                const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
                const xmlText = Blockly.Xml.domToText(xml);

                onCodeChangeRef.current({ code, xml: xmlText, language: lang });
            }
        }, 0);
    };

    return (
        <div className="blockly-workspace-wrapper">
            <div className="blockly-header">
                <div className="blockly-title">
                    <span>Drag & Drop Code Builder</span>
                </div>
                <div className="language-toggle">
                    <button
                        className={`lang-btn ${language === 'javascript' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('javascript')}
                    >
                        JavaScript
                    </button>
                    <button
                        className={`lang-btn ${language === 'python' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('python')}
                    >
                        Python
                    </button>
                </div>
            </div>
            <div ref={blocklyDiv} className="blockly-container" />
        </div>
    );
};

export default BlocklyWorkspace;
