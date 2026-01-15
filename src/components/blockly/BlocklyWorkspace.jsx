import { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import { pythonGenerator } from 'blockly/python';
import './BlocklyWorkspace.css';

// Custom algorithm blocks - define all blocks we need
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

    // Custom compare block
    Blockly.Blocks['compare_values'] = {
        init: function () {
            this.appendValueInput("LEFT");
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    [">", "GT"],
                    ["<", "LT"],
                    [">=", "GTE"],
                    ["<=", "LTE"],
                    ["=", "EQ"],
                    ["≠", "NEQ"]
                ]), "OP");
            this.appendValueInput("RIGHT");
            this.setInputsInline(true);
            this.setOutput(true, "Boolean");
            this.setColour(210);
            this.setTooltip("Compare two values");
        }
    };

    // Custom if block
    Blockly.Blocks['custom_if'] = {
        init: function () {
            this.appendValueInput("CONDITION")
                .setCheck("Boolean")
                .appendField("if");
            this.appendStatementInput("DO")
                .appendField("do");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(210);
            this.setTooltip("If condition is true, do something");
        }
    };

    // Custom if-else block
    Blockly.Blocks['custom_if_else'] = {
        init: function () {
            this.appendValueInput("CONDITION")
                .setCheck("Boolean")
                .appendField("if");
            this.appendStatementInput("DO")
                .appendField("do");
            this.appendStatementInput("ELSE")
                .appendField("else");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(210);
            this.setTooltip("If-else statement");
        }
    };

    // Custom for loop
    Blockly.Blocks['custom_for'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("for")
                .appendField(new Blockly.FieldVariable("i"), "VAR")
                .appendField("from");
            this.appendValueInput("FROM")
                .setCheck("Number");
            this.appendValueInput("TO")
                .setCheck("Number")
                .appendField("to");
            this.appendStatementInput("DO")
                .appendField("do");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip("For loop from start to end");
        }
    };

    // Custom while loop
    Blockly.Blocks['custom_while'] = {
        init: function () {
            this.appendValueInput("CONDITION")
                .setCheck("Boolean")
                .appendField("while");
            this.appendStatementInput("DO")
                .appendField("do");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip("While condition is true, repeat");
        }
    };

    // Custom repeat block
    Blockly.Blocks['custom_repeat'] = {
        init: function () {
            this.appendValueInput("TIMES")
                .setCheck("Number")
                .appendField("repeat");
            this.appendStatementInput("DO")
                .appendField("times do");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip("Repeat N times");
        }
    };

    // Number block
    Blockly.Blocks['custom_number'] = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldNumber(0), "NUM");
            this.setOutput(true, "Number");
            this.setColour(230);
            this.setTooltip("A number");
        }
    };

    // Math operation
    Blockly.Blocks['custom_math'] = {
        init: function () {
            this.appendValueInput("A")
                .setCheck("Number");
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    ["+", "ADD"],
                    ["-", "SUB"],
                    ["×", "MUL"],
                    ["÷", "DIV"],
                    ["%", "MOD"]
                ]), "OP");
            this.appendValueInput("B")
                .setCheck("Number");
            this.setInputsInline(true);
            this.setOutput(true, "Number");
            this.setColour(230);
            this.setTooltip("Math operation");
        }
    };

    // Print block
    Blockly.Blocks['print_value'] = {
        init: function () {
            this.appendValueInput("VALUE")
                .appendField("print");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Print a value to console");
        }
    };

    // Text block
    Blockly.Blocks['custom_text'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('"')
                .appendField(new Blockly.FieldTextInput("hello"), "TEXT")
                .appendField('"');
            this.setOutput(true, "String");
            this.setColour(160);
            this.setTooltip("A text string");
        }
    };

    // Variable get block
    Blockly.Blocks['get_variable'] = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldVariable("item"), "VAR");
            this.setOutput(true, null);
            this.setColour(330);
            this.setTooltip("Get a variable");
        }
    };

    // Variable set block
    Blockly.Blocks['set_variable'] = {
        init: function () {
            this.appendValueInput("VALUE")
                .appendField("set")
                .appendField(new Blockly.FieldVariable("item"), "VAR")
                .appendField("to");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(330);
            this.setTooltip("Set a variable");
        }
    };

    // Boolean block
    Blockly.Blocks['custom_boolean'] = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    ["true", "TRUE"],
                    ["false", "FALSE"]
                ]), "BOOL");
            this.setOutput(true, "Boolean");
            this.setColour(210);
            this.setTooltip("Boolean true/false");
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

    javascriptGenerator.forBlock['compare_values'] = function (block) {
        const left = javascriptGenerator.valueToCode(block, 'LEFT', javascriptGenerator.ORDER_RELATIONAL) || '0';
        const right = javascriptGenerator.valueToCode(block, 'RIGHT', javascriptGenerator.ORDER_RELATIONAL) || '0';
        const op = block.getFieldValue('OP');
        const operators = { GT: '>', LT: '<', GTE: '>=', LTE: '<=', EQ: '===', NEQ: '!==' };
        return [`${left} ${operators[op]} ${right}`, javascriptGenerator.ORDER_RELATIONAL];
    };

    javascriptGenerator.forBlock['custom_if'] = function (block) {
        const condition = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE) || 'false';
        const statements = javascriptGenerator.statementToCode(block, 'DO');
        return `if (${condition}) {\n${statements}}\n`;
    };

    javascriptGenerator.forBlock['custom_if_else'] = function (block) {
        const condition = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE) || 'false';
        const doStatements = javascriptGenerator.statementToCode(block, 'DO');
        const elseStatements = javascriptGenerator.statementToCode(block, 'ELSE');
        return `if (${condition}) {\n${doStatements}} else {\n${elseStatements}}\n`;
    };

    javascriptGenerator.forBlock['custom_for'] = function (block) {
        const variable = javascriptGenerator.getVariableName(block.getFieldValue('VAR'));
        const from = javascriptGenerator.valueToCode(block, 'FROM', javascriptGenerator.ORDER_ASSIGNMENT) || '0';
        const to = javascriptGenerator.valueToCode(block, 'TO', javascriptGenerator.ORDER_ASSIGNMENT) || '10';
        const statements = javascriptGenerator.statementToCode(block, 'DO');
        return `for (let ${variable} = ${from}; ${variable} < ${to}; ${variable}++) {\n${statements}}\n`;
    };

    javascriptGenerator.forBlock['custom_while'] = function (block) {
        const condition = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE) || 'false';
        const statements = javascriptGenerator.statementToCode(block, 'DO');
        return `while (${condition}) {\n${statements}}\n`;
    };

    javascriptGenerator.forBlock['custom_repeat'] = function (block) {
        const times = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ASSIGNMENT) || '10';
        const statements = javascriptGenerator.statementToCode(block, 'DO');
        return `for (let count = 0; count < ${times}; count++) {\n${statements}}\n`;
    };

    javascriptGenerator.forBlock['custom_number'] = function (block) {
        const num = block.getFieldValue('NUM');
        return [num, javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock['custom_math'] = function (block) {
        const a = javascriptGenerator.valueToCode(block, 'A', javascriptGenerator.ORDER_MULTIPLICATIVE) || '0';
        const b = javascriptGenerator.valueToCode(block, 'B', javascriptGenerator.ORDER_MULTIPLICATIVE) || '0';
        const op = block.getFieldValue('OP');
        const operators = { ADD: '+', SUB: '-', MUL: '*', DIV: '/', MOD: '%' };
        const order = ['MUL', 'DIV', 'MOD'].includes(op) ? javascriptGenerator.ORDER_MULTIPLICATIVE : javascriptGenerator.ORDER_ADDITIVE;
        return [`${a} ${operators[op]} ${b}`, order];
    };

    javascriptGenerator.forBlock['print_value'] = function (block) {
        const value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_NONE) || "''";
        return `console.log(${value});\n`;
    };

    javascriptGenerator.forBlock['custom_text'] = function (block) {
        const text = block.getFieldValue('TEXT');
        return [`"${text}"`, javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock['get_variable'] = function (block) {
        const variable = javascriptGenerator.getVariableName(block.getFieldValue('VAR'));
        return [variable, javascriptGenerator.ORDER_ATOMIC];
    };

    javascriptGenerator.forBlock['set_variable'] = function (block) {
        const variable = javascriptGenerator.getVariableName(block.getFieldValue('VAR'));
        const value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ASSIGNMENT) || '0';
        return `${variable} = ${value};\n`;
    };

    javascriptGenerator.forBlock['custom_boolean'] = function (block) {
        const bool = block.getFieldValue('BOOL');
        return [bool.toLowerCase(), javascriptGenerator.ORDER_ATOMIC];
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

    pythonGenerator.forBlock['compare_values'] = function (block) {
        const left = pythonGenerator.valueToCode(block, 'LEFT', pythonGenerator.ORDER_RELATIONAL) || '0';
        const right = pythonGenerator.valueToCode(block, 'RIGHT', pythonGenerator.ORDER_RELATIONAL) || '0';
        const op = block.getFieldValue('OP');
        const operators = { GT: '>', LT: '<', GTE: '>=', LTE: '<=', EQ: '==', NEQ: '!=' };
        return [`${left} ${operators[op]} ${right}`, pythonGenerator.ORDER_RELATIONAL];
    };

    pythonGenerator.forBlock['custom_if'] = function (block) {
        const condition = pythonGenerator.valueToCode(block, 'CONDITION', pythonGenerator.ORDER_NONE) || 'False';
        const statements = pythonGenerator.statementToCode(block, 'DO') || '    pass\n';
        return `if ${condition}:\n${statements}`;
    };

    pythonGenerator.forBlock['custom_if_else'] = function (block) {
        const condition = pythonGenerator.valueToCode(block, 'CONDITION', pythonGenerator.ORDER_NONE) || 'False';
        const doStatements = pythonGenerator.statementToCode(block, 'DO') || '    pass\n';
        const elseStatements = pythonGenerator.statementToCode(block, 'ELSE') || '    pass\n';
        return `if ${condition}:\n${doStatements}else:\n${elseStatements}`;
    };

    pythonGenerator.forBlock['custom_for'] = function (block) {
        const variable = pythonGenerator.getVariableName(block.getFieldValue('VAR'));
        const from = pythonGenerator.valueToCode(block, 'FROM', pythonGenerator.ORDER_NONE) || '0';
        const to = pythonGenerator.valueToCode(block, 'TO', pythonGenerator.ORDER_NONE) || '10';
        const statements = pythonGenerator.statementToCode(block, 'DO') || '    pass\n';
        return `for ${variable} in range(${from}, ${to}):\n${statements}`;
    };

    pythonGenerator.forBlock['custom_while'] = function (block) {
        const condition = pythonGenerator.valueToCode(block, 'CONDITION', pythonGenerator.ORDER_NONE) || 'False';
        const statements = pythonGenerator.statementToCode(block, 'DO') || '    pass\n';
        return `while ${condition}:\n${statements}`;
    };

    pythonGenerator.forBlock['custom_repeat'] = function (block) {
        const times = pythonGenerator.valueToCode(block, 'TIMES', pythonGenerator.ORDER_NONE) || '10';
        const statements = pythonGenerator.statementToCode(block, 'DO') || '    pass\n';
        return `for _ in range(${times}):\n${statements}`;
    };

    pythonGenerator.forBlock['custom_number'] = function (block) {
        const num = block.getFieldValue('NUM');
        return [num, pythonGenerator.ORDER_ATOMIC];
    };

    pythonGenerator.forBlock['custom_math'] = function (block) {
        const a = pythonGenerator.valueToCode(block, 'A', pythonGenerator.ORDER_MULTIPLICATIVE) || '0';
        const b = pythonGenerator.valueToCode(block, 'B', pythonGenerator.ORDER_MULTIPLICATIVE) || '0';
        const op = block.getFieldValue('OP');
        const operators = { ADD: '+', SUB: '-', MUL: '*', DIV: '/', MOD: '%' };
        return [`${a} ${operators[op]} ${b}`, pythonGenerator.ORDER_ADDITIVE];
    };

    pythonGenerator.forBlock['print_value'] = function (block) {
        const value = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_NONE) || "''";
        return `print(${value})\n`;
    };

    pythonGenerator.forBlock['custom_text'] = function (block) {
        const text = block.getFieldValue('TEXT');
        return [`"${text}"`, pythonGenerator.ORDER_ATOMIC];
    };

    pythonGenerator.forBlock['get_variable'] = function (block) {
        const variable = pythonGenerator.getVariableName(block.getFieldValue('VAR'));
        return [variable, pythonGenerator.ORDER_ATOMIC];
    };

    pythonGenerator.forBlock['set_variable'] = function (block) {
        const variable = pythonGenerator.getVariableName(block.getFieldValue('VAR'));
        const value = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_NONE) || '0';
        return `${variable} = ${value}\n`;
    };

    pythonGenerator.forBlock['custom_boolean'] = function (block) {
        const bool = block.getFieldValue('BOOL');
        return [bool === 'TRUE' ? 'True' : 'False', pythonGenerator.ORDER_ATOMIC];
    };
};

// Define toolbox with ONLY custom blocks (no built-in blocks that cause issues)
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
                { kind: 'block', type: 'custom_if' },
                { kind: 'block', type: 'custom_if_else' },
                { kind: 'block', type: 'compare_values' },
                { kind: 'block', type: 'custom_boolean' },
            ]
        },
        {
            kind: 'category',
            name: 'Loops',
            colour: '#22c55e',
            contents: [
                { kind: 'block', type: 'custom_repeat' },
                { kind: 'block', type: 'custom_while' },
                { kind: 'block', type: 'custom_for' },
            ]
        },
        {
            kind: 'category',
            name: 'Math',
            colour: '#f59e0b',
            contents: [
                { kind: 'block', type: 'custom_number' },
                { kind: 'block', type: 'custom_math' },
            ]
        },
        {
            kind: 'category',
            name: 'Variables',
            colour: '#ef4444',
            contents: [
                { kind: 'block', type: 'set_variable' },
                { kind: 'block', type: 'get_variable' },
            ]
        },
        {
            kind: 'category',
            name: 'Text',
            colour: '#06b6d4',
            contents: [
                { kind: 'block', type: 'custom_text' },
                { kind: 'block', type: 'print_value' },
            ]
        },
    ]
};

// Flag to track if blocks are defined
let blocksDefinedFlag = false;

const BlocklyWorkspace = ({ onCodeChange, initialXml }) => {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null);
    const onCodeChangeRef = useRef(onCodeChange);
    const [language, setLanguage] = useState('javascript');

    // Keep ref updated with latest callback
    useEffect(() => {
        onCodeChangeRef.current = onCodeChange;
    }, [onCodeChange]);

    // Define custom blocks once (outside of React lifecycle)
    if (!blocksDefinedFlag) {
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
