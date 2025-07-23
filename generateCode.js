module.exports = function generateCode(node) {
    // Handle numeric literals
    if (node.type === 'NumericLiteral') {
        return node.value;
    }

    // Handle identifiers
    if (node.type === 'Identifier') {
        return node.name;
    }

    // Map Lisp function names to JS operators or array, with parentheses for nested expressions
    function mapFunction(name, args) {
        switch (name) {
            case 'add':
                return args.map(wrapIfNeeded).join(' + ');
            case 'sub':
                return args.map(wrapIfNeeded).join(' - ');
            case 'mul':
                return args.map(wrapIfNeeded).join(' * ');
            case 'div':
                return args.map(wrapIfNeeded).join(' / ');
            case 'list':
                return `[${args.join(', ')}]`;
            default:
                return `${name}(${args.join(', ')})`;
        }
    }

    // Helper to wrap nested expressions in parentheses
    function wrapIfNeeded(arg) {
        // If the argument contains an operator, wrap in parentheses
        if (/[+\-*]/.test(arg) && !/^\d+$/.test(arg) && !/^\[.*\]$/.test(arg)) {
            return `(${arg})`;
        }
        return arg;
    }

    // Handle call expressions
    if (node.type === 'CallExpression') {
        const callee = node.callee ? generateCode(node.callee) : node.name;
        const args = node.arguments ? node.arguments.map(generateCode) : node.params.map(generateCode);
        return mapFunction(callee, args);
    }

    // Handle expression statements
    if (node.type === 'ExpressionStatement') {
        return `console.log(${generateCode(node.expression)});`;
    }

    // Handle the root program node
    if (node.type === 'Program') {
        return node.body.map(generateCode).join('\n');
    }
};
