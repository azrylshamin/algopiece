import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly/core';
import * as libraryBlocks from 'blockly/blocks';
import * as En from 'blockly/msg/en';
import { javascriptGenerator } from 'blockly/javascript';
import { pythonGenerator } from 'blockly/python';
import './BlocklyWorkspace.css';

// Set locale to English to fix "Message does not reference all args" errors
Blockly.setLocale(En);

/**
 * Polyfill for deprecated Blockly v12 variable APIs.
 * Some built-in blocks or plugins might still be calling these.
 */
if (typeof Blockly.Workspace.prototype.getAllVariables !== 'function') {
    Blockly.Workspace.prototype.getAllVariables = function () {
        return this.getVariableMap().getAllVariables();
    };
}
if (typeof Blockly.Workspace.prototype.getVariableById !== 'function') {
    Blockly.Workspace.prototype.getVariableById = function (id) {
        return this.getVariableMap().getVariableById(id);
    };
}
if (typeof Blockly.Workspace.prototype.getVariable !== 'function') {
    Blockly.Workspace.prototype.getVariable = function (name) {
        return this.getVariableMap().getVariable(name);
    };
}

// Custom algorithm blocks - define array and output blocks
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
                .appendField("get item");
            this.appendValueInput("INDEX")
                .setCheck("Number")
                .appendField("at index");
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
                .appendField("in array");
            this.appendValueInput("INDEX")
                .setCheck("Number")
                .appendField("set index");
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
                .appendField("swap in");
            this.appendValueInput("INDEX1")
                .setCheck("Number")
                .appendField("pos");
            this.appendValueInput("INDEX2")
                .setCheck("Number")
                .appendField("with pos");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Swap two elements in array");
        }
    };

    // Print block
    Blockly.Blocks['print_step'] = {
        init: function () {
            this.appendValueInput("VALUE")
                .appendField("log step");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Log a step to the visualizer");
        }
    };

    // JavaScript generators for custom blocks
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

    javascriptGenerator.forBlock['print_step'] = function (block) {
        const value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_NONE) || "''";
        return `console.log(${value});\n`;
    };

    // Python generators for custom blocks
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

    pythonGenerator.forBlock['print_step'] = function (block) {
        const value = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_NONE) || "''";
        return `print(${value})\n`;
    };
};

// Define toolbox with standard built-in blocks + custom blocks
const toolboxConfig = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'Arrays (Custom)', // Renamed to distinguish
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
                { kind: 'block', type: 'logic_compare' },
                { kind: 'block', type: 'logic_operation' },
                { kind: 'block', type: 'logic_negate' },
                { kind: 'block', type: 'logic_boolean' },
                { kind: 'block', type: 'logic_null' },
                { kind: 'block', type: 'logic_ternary' },
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
                { kind: 'block', type: 'math_trig' },
                { kind: 'block', type: 'math_constant' },
                { kind: 'block', type: 'math_number_property' },
                { kind: 'block', type: 'math_round' },
                { kind: 'block', type: 'math_on_list' },
                { kind: 'block', type: 'math_modulo' },
                { kind: 'block', type: 'math_constrain' },
                { kind: 'block', type: 'math_random_int' },
                { kind: 'block', type: 'math_random_float' },
                { kind: 'block', type: 'math_atan2' },
            ]
        },
        {
            kind: 'category',
            name: 'Text',
            colour: '#06b6d4',
            contents: [
                { kind: 'block', type: 'text' },
                { kind: 'block', type: 'text_join' },
                { kind: 'block', type: 'text_append' },
                { kind: 'block', type: 'text_length' },
                { kind: 'block', type: 'text_isEmpty' },
                { kind: 'block', type: 'text_indexOf' },
                { kind: 'block', type: 'text_charAt' },
                { kind: 'block', type: 'text_getSubstring' },
                { kind: 'block', type: 'text_changeCase' },
                { kind: 'block', type: 'text_trim' },
                { kind: 'block', type: 'print_step' }, // Custom block kept here
                { kind: 'block', type: 'text_print' },
                { kind: 'block', type: 'text_prompt_ext' },
            ]
        },
        {
            kind: 'category',
            name: 'Lists',
            colour: '#7c3aed',
            contents: [
                { kind: 'block', type: 'lists_create_with' },
                { kind: 'block', type: 'lists_repeat' },
                { kind: 'block', type: 'lists_length' },
                { kind: 'block', type: 'lists_isEmpty' },
                { kind: 'block', type: 'lists_indexOf' },
                { kind: 'block', type: 'lists_getIndex' },
                { kind: 'block', type: 'lists_setIndex' },
                { kind: 'block', type: 'lists_getSublist' },
                { kind: 'block', type: 'lists_split' },
                { kind: 'block', type: 'lists_sort' },
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
        }
    ]
};

// Flag to track if blocks are defined
let blocksDefinedFlag = false;

const BlocklyWorkspace = ({ onCodeChange, initialJson }) => {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null);
    const onCodeChangeRef = useRef(onCodeChange);
    const [language, setLanguage] = useState('javascript');

    // Keep ref updated with latest callback
    useEffect(() => {
        onCodeChangeRef.current = onCodeChange;
    }, [onCodeChange]);

    // Define custom blocks once
    if (!blocksDefinedFlag) {
        // Register standard blocks
        Blockly.common.defineBlocks(libraryBlocks);
        // Register custom blocks
        defineCustomBlocks();
        blocksDefinedFlag = true;
    }

    useEffect(() => {
        if (blocklyDiv.current && !workspaceRef.current) {
            workspaceRef.current = Blockly.inject(blocklyDiv.current, {
                toolbox: toolboxConfig,
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

            // Load initial JSON if provided
            if (initialJson) {
                try {
                    Blockly.serialization.workspaces.load(initialJson, workspaceRef.current);
                } catch (e) {
                    console.warn('Failed to load initial blocks:', e);
                }
            }

            // Listen for workspace changes
            workspaceRef.current.addChangeListener((event) => {
                if (event.isUiEvent) return;

                if (onCodeChangeRef.current) {
                    try {
                        const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
                        const json = Blockly.serialization.workspaces.save(workspaceRef.current);
                        onCodeChangeRef.current({ code, json, language: 'javascript' });
                    } catch (e) {
                        console.error("Error generating code:", e);
                    }
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

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setTimeout(() => {
            if (workspaceRef.current && onCodeChangeRef.current) {
                try {
                    const code = lang === 'python'
                        ? pythonGenerator.workspaceToCode(workspaceRef.current)
                        : javascriptGenerator.workspaceToCode(workspaceRef.current);

                    const json = Blockly.serialization.workspaces.save(workspaceRef.current);
                    onCodeChangeRef.current({ code, json, language: lang });
                } catch (e) {
                    console.error("Error generating code on language switch:", e);
                }
            }
        }, 0);
    };

    // Theme Management
    useEffect(() => {
        if (!workspaceRef.current) return;

        // Define nice themes that match our variables
        const lightTheme = Blockly.Theme.defineTheme('algopiece-light', {
            'base': Blockly.Themes.Classic,
            'componentStyles': {
                'workspaceBackgroundColour': '#ffffff',
                'toolboxBackgroundColour': '#f1f5f9', // slate-100
                'toolboxForegroundColour': '#1e293b', // slate-800
                'flyoutBackgroundColour': '#ffffff',
                'flyoutForegroundColour': '#1e293b',
                'flyoutOpacity': 1,
                'scrollbarColour': '#cbd5e1',
                'insertionMarkerColour': '#000',
                'insertionMarkerOpacity': 0.3,
                'scrollbarOpacity': 0.4,
                'cursorColour': '#000'
            }
        });

        const darkTheme = Blockly.Theme.defineTheme('algopiece-dark', {
            'base': Blockly.Themes.Classic,
            'componentStyles': {
                'workspaceBackgroundColour': '#1e293b', // slate-800
                'toolboxBackgroundColour': '#1e293b', // slate-800 - match workspace or slightly lighter/darker
                'toolboxForegroundColour': '#f1f5f9', // slate-100
                'flyoutBackgroundColour': '#334155', // slate-700
                'flyoutForegroundColour': '#f1f5f9',
                'flyoutOpacity': 1,
                'scrollbarColour': '#64748b',
                'insertionMarkerColour': '#fff',
                'insertionMarkerOpacity': 0.3,
                'scrollbarOpacity': 0.4,
                'cursorColour': '#fff'
            }
        });

        // Function to update theme based on DOM attribute
        const updateTheme = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'dark' ? darkTheme : lightTheme;
            workspaceRef.current.setTheme(targetTheme);
        };

        // Initial set
        updateTheme();

        // Observe changes to data-theme attribute
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    updateTheme();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => {
            observer.disconnect();
        };
    }, []);

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
