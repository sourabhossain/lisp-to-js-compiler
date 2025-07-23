#!/usr/bin/env node
const fs = require('fs');
const compiler = require('./compiler');

function printUsage() {
    console.info('Usage:');
    console.info('  node index.js <input-file>      # Compile code from a file');
    console.info('  echo "(add 2 3)" | node index.js # Compile code from stdin');
}

function compileInput(input) {
    try {
        const output = compiler(input);
        console.info(output);
    } catch (err) {
        console.error('Compilation error:', err.message);
        process.exit(1);
    }
}

if (!process.stdin.isTTY) {
    let data = '';
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => compileInput(data));
} else if (process.argv.length >= 3) {
    const filePath = process.argv[2];

    if (!fs.existsSync(filePath)) {
        console.error('Input file not found:', filePath);
        printUsage();
        process.exit(1);
    }

    const input = fs.readFileSync(filePath, 'utf-8');
    compileInput(input);
} else {
    printUsage();
    process.exit(1);
}
